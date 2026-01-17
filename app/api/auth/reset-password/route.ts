import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, deleteVerificationToken, deleteAllUserSessions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword, companyId } = await req.json();

    if (!email || !otp || !newPassword || !companyId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Find user
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), companyId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    const user = userResult.rows[0];

    // Verify OTP
    const tokenResult = await pool.query(
      `SELECT * FROM verification_tokens 
       WHERE user_id = $1 AND company_id = $2 AND token = $3 AND type = $4 AND expires_at > NOW()`,
      [user.id, companyId, otp, 'password_reset']
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await pool.query(
      'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
      [hashedPassword, user.id]
    );

    // Delete token
    await deleteVerificationToken(user.id, companyId, 'password_reset');

    // Delete all sessions
    await deleteAllUserSessions(user.id, companyId);

    return NextResponse.json({
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Reset failed' },
      { status: 500 }
    );
  }
}