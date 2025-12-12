// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { hashPassword, deleteAllUserSessions, deleteVerificationToken } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, otp, newPassword } = body;

//     // Validation
//     if (!email || !otp || !newPassword) {
//       return NextResponse.json(
//         { error: 'Email, OTP, and new password are required' },
//         { status: 400 }
//       );
//     }

//     // Validate OTP format (should be 6 digits)
//     if (!/^\d{6}$/.test(otp)) {
//       return NextResponse.json(
//         { error: 'Invalid OTP format. Please enter 6 digits.' },
//         { status: 400 }
//       );
//     }

//     // Validate password strength
//     if (newPassword.length < 8) {
//       return NextResponse.json(
//         { error: 'Password must be at least 8 characters long' },
//         { status: 400 }
//       );
//     }

//     // Optional: Additional password strength checks
//     const hasUpperCase = /[A-Z]/.test(newPassword);
//     const hasLowerCase = /[a-z]/.test(newPassword);
//     const hasNumbers = /\d/.test(newPassword);
//     const hasSpecialChar = /[^a-zA-Z\d]/.test(newPassword);

//     if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
//       return NextResponse.json(
//         { 
//           error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
//           code: 'WEAK_PASSWORD'
//         },
//         { status: 400 }
//       );
//     }

//     const trimmedEmail = email.trim().toLowerCase();

//     // Find user by email
//     const userResult = await pool.query(
//       'SELECT id, email, name, password FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (userResult.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'Invalid request' },
//         { status: 400 }
//       );
//     }

//     const user = userResult.rows[0];

//     // Check if new password is same as old password
//     const bcrypt = require('bcryptjs');
//     const isSamePassword = await bcrypt.compare(newPassword, user.password);
    
//     if (isSamePassword) {
//       return NextResponse.json(
//         { 
//           error: 'New password must be different from your current password',
//           code: 'SAME_PASSWORD'
//         },
//         { status: 400 }
//       );
//     }

//     // Verify OTP token
//     const tokenResult = await pool.query(
//       `SELECT id, token, expires_at, created_at FROM verification_tokens 
//        WHERE user_id = $1 AND token = $2 AND type = $3`,
//       [user.id, otp, 'password_reset']
//     );

//     if (tokenResult.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'Invalid OTP code' },
//         { status: 400 }
//       );
//     }

//     const token = tokenResult.rows[0];

//     // Check if token has expired
//     const now = new Date();
//     const expiresAt = new Date(token.expires_at);

//     if (now > expiresAt) {
//       // Delete expired token
//       await pool.query(
//         'DELETE FROM verification_tokens WHERE id = $1',
//         [token.id]
//       );

//       return NextResponse.json(
//         { 
//           error: 'OTP has expired. Please request a new password reset.',
//           code: 'OTP_EXPIRED'
//         },
//         { status: 400 }
//       );
//     }

//     // Hash the new password
//     const hashedPassword = await hashPassword(newPassword);

//     // Begin transaction for atomic operations
//     const client = await pool.connect();

//     try {
//       await client.query('BEGIN');

//       // Update user password
//       await client.query(
//         'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
//         [hashedPassword, user.id]
//       );

//       // Delete the used password reset token
//       await client.query(
//         'DELETE FROM verification_tokens WHERE user_id = $1 AND type = $2',
//         [user.id, 'password_reset']
//       );

//       // Delete all existing sessions for security
//       // User will need to login again with new password
//       await client.query(
//         'DELETE FROM sessions WHERE user_id = $1',
//         [user.id]
//       );

//       await client.query('COMMIT');
//     } catch (error) {
//       await client.query('ROLLBACK');
//       throw error;
//     } finally {
//       client.release();
//     }

//     // Log password reset (optional, for security monitoring)
//     console.log(`Password reset successful for user: ${user.email} at ${new Date().toISOString()}`);

//     return NextResponse.json(
//       {
//         message: 'Password reset successfully. Please login with your new password.',
//         success: true,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Reset password error:', error);

//     if (error instanceof Error) {
//       if (error.message.includes('connection')) {
//         return NextResponse.json(
//           { error: 'Database connection error. Please try again.' },
//           { status: 503 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: 'Password reset failed. Please try again.' },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Verify OTP without resetting password (for validation)
// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const email = searchParams.get('email');
//     const otp = searchParams.get('otp');

//     if (!email || !otp) {
//       return NextResponse.json(
//         { error: 'Email and OTP are required' },
//         { status: 400 }
//       );
//     }

//     const trimmedEmail = email.trim().toLowerCase();

//     // Find user
//     const userResult = await pool.query(
//       'SELECT id FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (userResult.rows.length === 0) {
//       return NextResponse.json(
//         { valid: false, error: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const user = userResult.rows[0];

//     // Check if OTP exists and is valid
//     const tokenResult = await pool.query(
//       `SELECT expires_at FROM verification_tokens 
//        WHERE user_id = $1 AND token = $2 AND type = $3 AND expires_at > NOW()`,
//       [user.id, otp, 'password_reset']
//     );

//     if (tokenResult.rows.length === 0) {
//       return NextResponse.json(
//         { valid: false, error: 'Invalid or expired OTP' },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { 
//         valid: true,
//         expiresAt: tokenResult.rows[0].expires_at
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Verify OTP error:', error);
//     return NextResponse.json(
//       { error: 'Failed to verify OTP' },
//       { status: 500 }
//     );
//   }
// }


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