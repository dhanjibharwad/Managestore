import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { deleteVerificationToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, companyId } = await req.json();

    if (!email || !otp || !companyId) {
      return NextResponse.json(
        { error: 'Email, OTP, and company ID are required' },
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
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    if (user.is_verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Verify OTP
    const tokenResult = await pool.query(
      `SELECT * FROM verification_tokens 
       WHERE user_id = $1 AND company_id = $2 AND token = $3 AND type = $4 AND expires_at > NOW()`,
      [user.id, companyId, otp, 'email_verification']
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Update user as verified
    await pool.query(
      'UPDATE users SET is_verified = true WHERE id = $1',
      [user.id]
    );

    // Delete token
    await deleteVerificationToken(user.id, companyId, 'email_verification');

    return NextResponse.json({
      message: 'Email verified successfully',
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    );
  }
}