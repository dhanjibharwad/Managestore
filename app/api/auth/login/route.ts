// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import { verifyPassword, createSession } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { email, password } = body;

//     // Validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // Trim and validate email format
//     const trimmedEmail = email.trim().toLowerCase();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
//     if (!emailRegex.test(trimmedEmail)) {
//       return NextResponse.json(
//         { error: 'Invalid email format' },
//         { status: 400 }
//       );
//     }

//     // Find user by email
//     const result = await pool.query(
//       'SELECT id, email, password, name, role, is_verified, created_at FROM users WHERE email = $1',
//       [trimmedEmail]
//     );

//     if (result.rows.length === 0) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     const user = result.rows[0];

//     // Check if email is verified
//     if (!user.is_verified) {
//       return NextResponse.json(
//         { 
//           error: 'Please verify your email first',
//           code: 'EMAIL_NOT_VERIFIED',
//           email: user.email
//         },
//         { status: 403 }
//       );
//     }

//     // Verify password
//     const isValidPassword = await verifyPassword(password, user.password);

//     if (!isValidPassword) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     // Create session and set cookie
//     const sessionToken = await createSession(user.id);

//     // Update last login timestamp (optional)
//     await pool.query(
//       'UPDATE users SET updated_at = NOW() WHERE id = $1',
//       [user.id]
//     );

//     // Return success response with user data (excluding password)
//     return NextResponse.json(
//       {
//         message: 'Login successful',
//         user: {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           role: user.role,
//           isVerified: user.is_verified,
//           createdAt: user.created_at,
//         },
//         sessionToken, // Optional: include if needed on frontend
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Login error:', error);
    
//     // Check for specific database errors
//     if (error instanceof Error) {
//       if (error.message.includes('connection')) {
//         return NextResponse.json(
//           { error: 'Database connection error. Please try again.' },
//           { status: 503 }
//         );
//       }
//     }

//     return NextResponse.json(
//       { error: 'An error occurred during login. Please try again.' },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Handle other HTTP methods
// export async function GET() {
//   return NextResponse.json(
//     { error: 'Method not allowed' },
//     { status: 405 }
//   );
// }


import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyPassword, createSession, updateLastLogin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password, companyId } = await req.json();

    if (!email || !password || !companyId) {
      return NextResponse.json(
        { error: 'Email, password, and company ID are required' },
        { status: 400 }
      );
    }

    // Find user in specific company
    const result = await pool.query(
      `SELECT u.*, c.company_name, c.status as company_status
       FROM users u
       JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1 AND u.company_id = $2`,
      [email.toLowerCase().trim(), companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials or company' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // Check company status
    if (user.company_status !== 'active') {
      return NextResponse.json(
        { error: 'Company account is not active' },
        { status: 403 }
      );
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated' },
        { status: 403 }
      );
    }

    // Check if email is verified
    if (!user.is_verified) {
      return NextResponse.json(
        { error: 'Please verify your email first', code: 'EMAIL_NOT_VERIFIED' },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create session with company context
    await createSession(user.id, user.company_id);

    // Update last login
    await updateLastLogin(user.id);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      company: {
        id: user.company_id,
        name: user.company_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}