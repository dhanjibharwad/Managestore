import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createVerificationToken } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, companyId } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    let finalCompanyId = companyId;

    // If no companyId provided, find it by email
    if (!companyId) {
      const userCompanyResult = await pool.query(
        `SELECT u.company_id FROM users u
         JOIN companies c ON u.company_id = c.id
         WHERE u.email = $1 AND c.status = 'active'
         LIMIT 1`,
        [email.toLowerCase().trim()]
      );

      if (userCompanyResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      finalCompanyId = userCompanyResult.rows[0].company_id;
    }

    // Find user with company context
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), finalCompanyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Create new token
    const otp = await createVerificationToken(user.id, finalCompanyId, 'email_verification');

    // Send email
    await sendVerificationEmail(email, otp);

    return NextResponse.json({
      message: 'Verification code resent',
      success: true,
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend code' },
      { status: 500 }
    );
  }
}