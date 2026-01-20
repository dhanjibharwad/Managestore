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

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to login if no token
  if (!token) {
    console.log('No token - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Verify JWT and check role
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    console.log('JWT payload:', payload);
    
    if (!payload.userId || !payload.companyId) {
      throw new Error('Invalid token payload');
    }

    const userRole = payload.role as string;
    console.log('User role:', userRole);

    // Check role-based access - deny access if trying to access wrong role dashboard
    const requestedRole = Object.keys(roleRoutes).find(role => 
      roleRoutes[role as keyof typeof roleRoutes].some(route => pathname.startsWith(route))
    );
    
    if (requestedRole && userRole !== requestedRole) {
      console.log(`Access denied: ${userRole} trying to access ${requestedRole} route`);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    console.log('Access granted to:', pathname);
    return NextResponse.next();
  } catch (error) {
    console.log('JWT verification failed:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default middleware;