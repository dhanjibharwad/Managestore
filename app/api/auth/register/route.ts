import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, generateOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id, is_verified FROM users WHERE email = $1',
      [trimmedEmail]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default role 'customer'
    const result = await pool.query(
      'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
      [trimmedEmail, hashedPassword, name.trim(), 'customer']
    );

    const user = result.rows[0];

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, otp, 'email_verification', expiresAt]
    );

    // Send verification email
    try {
      await sendVerificationEmail(trimmedEmail, otp);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail registration if email sending fails
      // User can request resend later
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}