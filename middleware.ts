import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

type UserRole = 'superadmin' | 'admin' | 'technician' | 'customer';

// Role-based access control: which roles can access which dashboard prefixes
const roleAccessMap: Record<string, UserRole[]> = {
  '/admin': ['admin', 'superadmin'],
  '/technician': ['technician', 'superadmin'],
  '/customer': ['customer', 'superadmin'],
  '/super-admin': ['superadmin'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('session')?.value;

  console.log('Middleware running for:', pathname, 'Token exists:', !!token);

  // 1. Check if user has a token
  if (!token) {
    console.log('No token - redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 2. Verify JWT and extract payload
  let payload: any;
  try {
    const result = await jwtVerify(token, JWT_SECRET);
    payload = result.payload;
    console.log('JWT payload:', payload);
  } catch (error) {
    console.log('JWT verification failed:', error);
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // 3. Validate required JWT fields (companyId can be NULL for superadmin)
  if (!payload.userId) {
    console.log('Invalid JWT payload - missing userId');
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // 4. Extract user role from JWT
  const userRole = payload.role as UserRole | undefined;
  if (!userRole) {
    console.log('JWT payload missing role - redirecting to login');
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // 5. Determine which dashboard prefix is being accessed
  const matchedPrefix = Object.keys(roleAccessMap).find((prefix) =>
    pathname.startsWith(prefix)
  );

  // If not a dashboard path, allow access (other routes handle their own auth)
  if (!matchedPrefix) {
    console.log('Not a dashboard route - allowing access');
    return NextResponse.next();
  }

  // 6. Check if user's role has access to this dashboard
  const allowedRoles = roleAccessMap[matchedPrefix];
  
  if (!allowedRoles.includes(userRole)) {
    console.log(`Access denied: ${userRole} cannot access ${matchedPrefix}`);
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 7. User has correct role - allow access
  console.log(`Access granted: ${userRole} accessing ${pathname}`);
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