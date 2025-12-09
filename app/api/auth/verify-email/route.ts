import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { deleteVerificationToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    // Validation
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (should be 6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Please enter 6 digits.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Find user by email
    const userResult = await pool.query(
      'SELECT id, email, name, role, is_verified FROM users WHERE email = $1',
      [trimmedEmail]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = userResult.rows[0];

    // Check if user is already verified
    if (user.is_verified) {
      return NextResponse.json(
        { error: 'Email is already verified' },
        { status: 400 }
      );
    }

    // Verify OTP token
    const tokenResult = await pool.query(
      `SELECT id, token, expires_at FROM verification_tokens 
       WHERE user_id = $1 AND token = $2 AND type = $3`,
      [user.id, otp, 'email_verification']
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid OTP code' },
        { status: 400 }
      );
    }

    const token = tokenResult.rows[0];

    // Check if token has expired
    const now = new Date();
    const expiresAt = new Date(token.expires_at);

    if (now > expiresAt) {
      // Delete expired token
      await pool.query(
        'DELETE FROM verification_tokens WHERE id = $1',
        [token.id]
      );

      return NextResponse.json(
        { 
          error: 'OTP has expired. Please request a new one.',
          code: 'OTP_EXPIRED'
        },
        { status: 400 }
      );
    }

    // Begin transaction for atomic operations
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Update user as verified
      await client.query(
        'UPDATE users SET is_verified = true, updated_at = NOW() WHERE id = $1',
        [user.id]
      );

      // Delete the used verification token
      await client.query(
        'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
        [user.id, 'email_verification']
      );

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return NextResponse.json(
      {
        message: 'Email verified successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isVerified: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Email verification error:', error);

    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: Handle GET for checking verification status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT is_verified FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { isVerified: result.rows[0].is_verified },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check verification status error:', error);
    return NextResponse.json(
      { error: 'Failed to check verification status' },
      { status: 500 }
    );
  }
}