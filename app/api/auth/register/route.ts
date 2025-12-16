// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { hashPassword, generateOTP } from '@/lib/auth';
// import { sendVerificationEmail } from '@/lib/email';

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password, name } = await req.json();

//     // Validation
//     if (!email || !password || !name) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
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

//     // Validate password strength
//     if (password.length < 8) {
//       return NextResponse.json(
//         { error: 'Password must be at least 8 characters long' },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const existingUser = await pool.query(
//       'SELECT id, is_verified FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (existingUser.rows.length > 0) {
//       return NextResponse.json(
//         { error: 'User with this email already exists' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     const hashedPassword = await hashPassword(password);

//     // Create user with default role 'customer'
//     const result = await pool.query(
//       'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
//       [trimmedEmail, hashedPassword, name.trim(), 'customer']
//     );

//     const user = result.rows[0];

//     // Generate OTP
//     const otp = generateOTP();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Save OTP
//     await pool.query(
//       'INSERT INTO verification_tokens (user_id, token, type, expires_at) VALUES ($1, $2, $3, $4)',
//       [user.id, otp, 'email_verification', expiresAt]
//     );

//     // Send verification email
//     try {
//       await sendVerificationEmail(trimmedEmail, otp);
//     } catch (emailError) {
//       console.error('Failed to send verification email:', emailError);
//       // Don't fail registration if email sending fails
//       // User can request resend later
//     }

//     return NextResponse.json({
//       message: 'Registration successful. Please check your email for verification code.',
//       userId: user.id,
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Registration error:', error);
    
//     if (error instanceof Error) {
//       if (error.message.includes('connection')) {
//         return NextResponse.json(
//           { error: 'Database connection error. Please try again.' },
//           { status: 503 }
//         );
//       }
//       if (error.message.includes('duplicate key')) {
//         return NextResponse.json(
//           { error: 'User with this email already exists' },
//           { status: 400 }
//         );
//       }
//     }
    
//     return NextResponse.json(
//       { error: 'Registration failed. Please try again.' },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, createVerificationToken, checkCompanySubscription, createSession } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, phone, token } = await req.json();
    console.log('Registration request received:', { email, name, phone, token: token ? 'present' : 'missing' });

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    let companyId;

    // If token provided, validate company invite token
    if (token) {
      console.log('Validating invite token:', token);
      const inviteResult = await pool.query(
        `SELECT company_id, expires_at, used_at FROM company_invites 
         WHERE token = $1`,
        [token]
      );

      if (inviteResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid invitation token' },
          { status: 400 }
        );
      }

      const invite = inviteResult.rows[0];
      
      if (invite.used_at) {
        return NextResponse.json(
          { error: 'Invitation has already been used' },
          { status: 400 }
        );
      }
      
      if (new Date() > new Date(invite.expires_at)) {
        return NextResponse.json(
          { error: 'Invitation has expired' },
          { status: 400 }
        );
      }

      companyId = invite.company_id;
    } else {
      return NextResponse.json(
        { error: 'Registration requires an invitation' },
        { status: 400 }
      );
    }

    // Check if user exists in this company
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND company_id = $2',
      [email.toLowerCase().trim(), companyId]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User already exists in this company' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user as admin for company (unverified, needs OTP)
    const userResult = await pool.query(
      `INSERT INTO users (email, password, name, phone, company_id, role, is_verified, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, email, name, role, company_id`,
      [email.toLowerCase().trim(), hashedPassword, name, phone || null, companyId, 'admin', false, true]
    );

    const user = userResult.rows[0];
    console.log('Created user:', user);

    // Mark invite as used
    if (token) {
      await pool.query(
        'UPDATE company_invites SET used_at = NOW() WHERE token = $1',
        [token]
      );
      console.log('Marked invite as used');
    }

    // Generate OTP for email verification
    const otp = await createVerificationToken(user.id, companyId, 'email_verification');
    console.log('Generated OTP for user:', user.id);

    // Send verification email
    try {
      await sendVerificationEmail(email, otp);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    console.log('Registration completed, OTP sent for user:', user.id);
    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id,
      companyId: companyId,
      role: user.role,
      redirect: `/auth/verify-email?email=${encodeURIComponent(email)}&companyId=${companyId}`
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}