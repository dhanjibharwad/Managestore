
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, createSession, updateLastLogin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyId } = await req.json();

    if (!email || !password || !companyId) {
      return NextResponse.json(
        { error: 'Email, password, and company ID are required' },
        { status: 400 }
      );
    }

    // Find user in specific company
    const result = await pool.query(
      `SELECT u.*, c.company_name, c.status as company_status
       FROM users u
       JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1 AND u.company_id = $2`,
      [email.toLowerCase().trim(), companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials or company' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

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

    // Create session with company context
    await createSession(user.id, user.company_id, user.role);

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
        id: user.company_id,
        name: user.company_name,
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
