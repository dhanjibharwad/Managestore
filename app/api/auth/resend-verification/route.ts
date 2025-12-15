// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { createVerificationToken } from '@/lib/auth';
// import { sendVerificationEmail } from '@/lib/email';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email } = body;

//     // Validation
//     if (!email) {
//       return NextResponse.json(
//         { error: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     const trimmedEmail = email.trim().toLowerCase();

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(trimmedEmail)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Find user by email
//     const result = await pool.query(
//       'SELECT id, email, name, is_verified FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const user = result.rows[0];

//     // Check if user is already verified
//     if (user.is_verified) {
//       return NextResponse.json(
//         { error: 'Email is already verified' },
//         { status: 400 }
//       );
//     }

//     // Check for recent verification requests to prevent spam (within last 1 minute)
//     const recentTokenResult = await pool.query(
//       `SELECT created_at FROM verification_tokens 
//        WHERE user_id = $1 AND type = $2 AND created_at > NOW() - INTERVAL '1 minute'`,
//       [user.id, 'email_verification']
//     );

//     if (recentTokenResult.rows.length > 0) {
//       return NextResponse.json(
//         { 
//           error: 'A verification code was recently sent. Please wait before requesting another.',
//           code: 'TOO_MANY_REQUESTS'
//         },
//         { status: 429 }
//       );
//     }

//     // Delete any old email verification tokens for this user
//     await pool.query(
//       'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//       [user.id, 'email_verification']
//     );

//     // Create new verification token
//     const otp = await createVerificationToken(user.id, 'email_verification');

//     // Send verification email
//     try {
//       await sendVerificationEmail(user.email, otp);
//     } catch (emailError) {
//       console.error('Failed to send verification email:', emailError);
      
//       // Delete the token since we couldn't send the email
//       await pool.query(
//         'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//         [user.id, 'email_verification']
//       );

//       return NextResponse.json(
//         { error: 'Failed to send verification email. Please try again later.' },
//         { status: 500 }
//       );
//     }

//     // Log the resend request (optional, for monitoring)
//     console.log(`Verification code resent for user: ${user.email} at ${new Date().toISOString()}`);

//     return NextResponse.json(
//       { 
//         message: 'Verification code has been resent to your email.',
//         success: true
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Resend verification error:', error);

//     if (error instanceof Error) {
//       if (error.message.includes('connection')) {
//         return NextResponse.json(
//           { error: 'Database connection error. Please try again.' },
//           { status: 503 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: 'An error occurred. Please try again.' },
//       { status: 500 }
//     );
//   }
// }

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