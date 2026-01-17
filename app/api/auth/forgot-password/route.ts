import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createVerificationToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

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
        return NextResponse.json({
          message: 'If account exists, reset email will be sent',
        });
      }

      finalCompanyId = userCompanyResult.rows[0].company_id;
    }

    // Find user with company context
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), finalCompanyId]
    );

    // Don't reveal if user exists
    if (result.rows.length === 0) {
      return NextResponse.json({
        message: 'If account exists, reset email will be sent',
      });
    }

    const user = result.rows[0];

    // Create reset token
    const otp = await createVerificationToken(user.id, finalCompanyId, 'password_reset');

    // Send email
    await sendPasswordResetEmail(email, otp);

    return NextResponse.json({
      message: 'If account exists, reset email will be sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Request failed' },
      { status: 500 }
    );
  }
}