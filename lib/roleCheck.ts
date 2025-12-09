import { getSession } from './auth';
import { NextResponse } from 'next/server';

type UserRole = 'superadmin' | 'admin' | 'technician' | 'customer';

const roleHierarchy: Record<UserRole, number> = {
  superadmin: 4,
  admin: 3,
  technician: 2,
  customer: 1,
};

export async function checkRole(requiredRole: UserRole) {
  const session = await getSession();

  if (!session) {
    return { authorized: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const userRole = session.user.role as UserRole;
  const hasAccess = roleHierarchy[userRole] >= roleHierarchy[requiredRole];

  if (!hasAccess) {
    return { authorized: false, response: NextResponse.json({ error: 'Forbidden - Insufficient permissions' }, { status: 403 }) };
  }

  return { authorized: true, user: session.user };
}

// Example usage in API route:
/*
import { checkRole } from '@/lib/roleCheck';

export async function GET() {
  const { authorized, response, user } = await checkRole('admin');
  
  if (!authorized) {
    return response;
  }
  
  // Continue with authorized logic
  return NextResponse.json({ data: 'Admin-only data', user });
}
*/