
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, createSession, updateLastLogin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyId } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user (handle superadmin with NULL company_id)
    const query = companyId === null 
      ? `SELECT u.*, c.company_name, c.status as company_status
         FROM users u
         LEFT JOIN companies c ON u.company_id = c.id
         WHERE u.email = $1 AND u.role = 'superadmin'`
      : `SELECT u.*, c.company_name, c.status as company_status
         FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.email = $1 AND u.company_id = $2`;
    
    const params = companyId === null 
      ? [email.toLowerCase().trim()]
      : [email.toLowerCase().trim(), companyId];

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials or company' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check company status (skip for superadmin)
    if (user.role !== 'superadmin' && user.company_status !== 'active') {
      return NextResponse.json(
        { error: 'Company account is not active' },
        { status: 403 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated' },
        { status: 403 }
      );
    }

    // Check if email is verified
    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'Please verify your email first', code: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session with company context (NULL for superadmin)
    const sessionCompanyId = user.company_id; // Keep NULL for superadmin
    await createSession(user.id, sessionCompanyId, user.role);

    // Update last login
    await updateLastLogin(user.id);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      company: {
        id: user.company_id || 0,
        name: user.company_name || 'Super Admin',
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}