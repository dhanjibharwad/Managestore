// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { createVerificationToken } from '@/lib/auth';
// import { sendPasswordResetEmail } from '@/lib/email';

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

//     // Security: Don't reveal if user exists or not
//     // Always return success message to prevent email enumeration
//     if (result.rows.length === 0) {
//       // Wait a bit to prevent timing attacks
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       return NextResponse.json(
//         { 
//           message: 'If an account exists with this email, you will receive a password reset code.',
//           success: true
//         },
//         { status: 200 }
//       );
//     }

//     const user = result.rows[0];

//     // Optional: Check if user is verified (you may want to allow password reset for unverified users too)
//     if (!user.is_verified) {
//       return NextResponse.json(
//         { 
//           error: 'Please verify your email first before resetting password',
//           code: 'EMAIL_NOT_VERIFIED'
//         },
//         { status: 403 }
//       );
//     }

//     // Check for recent password reset requests to prevent spam
//     const recentTokenResult = await pool.query(
//       `SELECT created_at FROM verification_tokens 
//        WHERE user_id = $1 AND type = $2 AND created_at > NOW() - INTERVAL '2 minutes'`,
//       [user.id, 'password_reset']
//     );

//     if (recentTokenResult.rows.length > 0) {
//       return NextResponse.json(
//         { 
//           error: 'A password reset code was recently sent. Please wait before requesting another.',
//           code: 'TOO_MANY_REQUESTS'
//         },
//         { status: 429 }
//       );
//     }

//     // Delete any old password reset tokens for this user
//     await pool.query(
//       'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//       [user.id, 'password_reset']
//     );

//     // Create new verification token
//     const otp = await createVerificationToken(user.id, 'password_reset');

//     // Send password reset email
//     try {
//       await sendPasswordResetEmail(user.email, otp);
//     } catch (emailError) {
//       console.error('Failed to send password reset email:', emailError);
      
//       // Delete the token since we couldn't send the email
//       await pool.query(
//         'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//         [user.id, 'password_reset']
//       );

//       return NextResponse.json(
//         { error: 'Failed to send reset email. Please try again later.' },
//         { status: 500 }
//       );
//     }

//     // Log the password reset request (optional, for security monitoring)
//     console.log(`Password reset requested for user: ${user.email} at ${new Date().toISOString()}`);

//     return NextResponse.json(
//       { 
//         message: 'If an account exists with this email, you will receive a password reset code.',
//         success: true
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Forgot password error:', error);

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

// // Optional: Resend password reset OTP
// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email } = body;

//     if (!email) {
//       return NextResponse.json(
//         { error: 'Email is required' },
//         { status: 400 }
//       );
//     }

//     const trimmedEmail = email.trim().toLowerCase();

//     // Find user
//     const result = await pool.query(
//       'SELECT id, email FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { message: 'If an account exists, a new code has been sent.' },
//         { status: 200 }
//       );
//     }

//     const user = result.rows[0];

//     // Check if there's an existing valid token
//     const existingToken = await pool.query(
//       `SELECT expires_at FROM verification_tokens 
//        WHERE user_id = $1 AND type = $2 AND expires_at > NOW()`,
//       [user.id, 'password_reset']
//     );

//     if (existingToken.rows.length > 0) {
//       return NextResponse.json(
//         { error: 'A valid reset code already exists. Please check your email.' },
//         { status: 400 }
//       );
//     }

//     // Create new token
//     const otp = await createVerificationToken(user.id, 'password_reset');
//     await sendPasswordResetEmail(user.email, otp);

//     return NextResponse.json(
//       { message: 'A new reset code has been sent.' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Resend password reset error:', error);
//     return NextResponse.json(
//       { error: 'Failed to resend code' },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { createVerificationToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, companyId } = await req.json();

    if (!email || !companyId) {
      return NextResponse.json(
        { error: 'Email and company ID are required' },
        { status: 400 }
      );
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), companyId]
    );

    // Don't reveal if user exists
    if (result.rows.length === 0) {
      return NextResponse.json({
        message: 'If account exists, reset email will be sent',
      });
    }

    const user = result.rows[0];

    // Create reset token
    const otp = await createVerificationToken(user.id, companyId, 'password_reset');

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