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

  // FORCE REDIRECT FOR ALL PROTECTED ROUTES WITHOUT TOKEN
  if (!token) {
    console.log('No token - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user is authenticated via JWT
  let isAuthenticated = false;
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('JWT payload:', payload);
    
    if (payload.userId && payload.companyId) {
      isAuthenticated = true;
      console.log('User authenticated');
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

  console.log('Access granted to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/technician/:path*',
    '/customer/:path*',
    '/super-admin/:path*'
  ],
};

export default middleware;