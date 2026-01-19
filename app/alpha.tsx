import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import pool from '@/lib/db';

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

  console.log('Middleware executing for:', pathname, 'Token exists:', !!token);

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log('Public route allowed:', pathname);
    return NextResponse.next();
  }

  // FORCE REDIRECT FOR ALL PROTECTED ROUTES WITHOUT TOKEN
  if (!token) {
    console.log('No token, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check if user is authenticated
  let userRole = null;
  let isAuthenticated = false;
  
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Get user role from database and verify session exists
    const result = await pool.query(
      `SELECT u.role, s.expires_at 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [token]
    );
    
    if (result.rows.length > 0) {
      userRole = result.rows[0].role;
      isAuthenticated = true;
      console.log('User authenticated with role:', userRole);
    } else {
      console.log('Token exists but no valid session in DB');
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  } catch (error) {
    console.log('Token verification failed:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authRoutes.includes(pathname)) {
    const defaultRoute = userRole === 'superadmin' ? '/super-admin/dashboard' : `/${userRole}/dashboard`;
    return NextResponse.redirect(new URL(defaultRoute, request.url));
  }

  // FINAL CHECK - If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Final check: Not authenticated, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Role-based route protection
  const protectedRoutes = ['/admin', '/technician', '/customer', '/super-admin'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const allowedRoutes = roleRoutes[userRole as keyof typeof roleRoutes] || [];
    const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
    
    if (!hasAccess) {
      console.log('Access denied for role:', userRole, 'to route:', pathname);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  console.log('Access granted to:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};