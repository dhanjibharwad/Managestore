import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

const publicRoutes = [
  '/auth/login', 
  '/auth/register', 
  '/auth/company-register',
  '/auth/verify-email', 
  '/auth/forgot-password', 
  '/auth/reset-password',
  '/home',
  '/extra',
  '/',
  '/api/auth',
  '/api/contact',
  '/api/leads',
  '/unauthorized'
];

const authRoutes = ['/auth/login', '/auth/register', '/auth/company-register'];

// Role-based route mapping
const roleRoutes = {
  'admin': ['/admin'],
  'technician': ['/technician'],
  'customer': ['/customer'],
  'superadmin': ['/super-admin']
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  console.log('Middleware running for:', pathname, 'Token exists:', !!token);

  // Special handling for /auth/register - requires invite token
  if (pathname === '/auth/register') {
    const inviteToken = request.nextUrl.searchParams.get('token');
    if (!inviteToken) {
      console.log('No invite token - redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    console.log('Invite token present, allowing register access');
    return NextResponse.next();
  }

  // FORCE REDIRECT FOR ALL PROTECTED ROUTES WITHOUT TOKEN
  if (!token) {
    console.log('No token - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user is authenticated via JWT and get role
  let isAuthenticated = false;
  let userRole = null;
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('JWT payload:', payload);
    
    if (payload.userId) {
      // Get user role from API call since we can't access DB in middleware
      const response = await fetch(new URL('/api/auth/me', request.url), {
        headers: {
          'Cookie': `session=${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        userRole = userData.user.role;
        isAuthenticated = true;
        console.log('User role:', userRole);
      }
    }
  } catch (error) {
    console.log('JWT verification failed:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // FINAL CHECK - If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Final check: not authenticated - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based route protection
  if (userRole) {
    console.log('Checking access for role:', userRole, 'to path:', pathname);
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    console.log('Allowed routes for role:', allowedRoutes);
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
    console.log('Has access:', hasAccess);
    
    if (!hasAccess) {
      console.log('Access denied for role:', userRole, 'to route:', pathname);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  console.log('Access granted to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/technician/:path*',
    '/customer/:path*',
    '/super-admin/:path*',
    '/auth/register'
  ],
};

export default middleware;