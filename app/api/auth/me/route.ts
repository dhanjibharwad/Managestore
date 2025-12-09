import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Return user data from session
    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role,
          isVerified: session.user.isVerified,
          createdAt: session.user.createdAt,
        },
        session: {
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);

    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(req: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, email } = body;

    // Validation
    if (!name && !email) {
      return NextResponse.json(
        { error: 'At least one field (name or email) must be provided' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Build dynamic update query
    if (name && name.trim()) {
      updates.push(`name = $${paramCounter}`);
      values.push(name.trim());
      paramCounter++;
    }

    if (email && email.trim()) {
      const trimmedEmail = email.trim().toLowerCase();
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }

      // Check if email is already taken by another user
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [trimmedEmail, userId]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }

      updates.push(`email = $${paramCounter}`);
      values.push(trimmedEmail);
      paramCounter++;

      // If email is changed, set is_verified to false
      updates.push(`is_verified = false`);
    }

    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    values.push(userId);

    // Execute update
    const query = `
      UPDATE users 
      SET ${updates.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING id, email, name, role, is_verified, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedUser = result.rows[0];

    // If email was changed, send verification email
    if (email && email.trim()) {
      // Import and send verification email
      const { createVerificationToken } = await import('@/lib/auth');
      const { sendVerificationEmail } = await import('@/lib/email');

      const otp = await createVerificationToken(userId, 'email_verification');
      await sendVerificationEmail(updatedUser.email, otp);

      return NextResponse.json(
        {
          message: 'Profile updated. Please verify your new email address.',
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            isVerified: updatedUser.is_verified,
            createdAt: updatedUser.created_at,
            updatedAt: updatedUser.updated_at,
          },
          emailChanged: true,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          isVerified: updatedUser.is_verified,
          createdAt: updatedUser.created_at,
          updatedAt: updatedUser.updated_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);

    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// Delete user account
export async function DELETE(req: NextRequest) {
  try {
    // Get current session
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Verify password before deletion (get from request body)
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required to delete account' },
        { status: 400 }
      );
    }

    // Get user with password
    const userResult = await pool.query(
      'SELECT password FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const { verifyPassword } = await import('@/lib/auth');
    const isValidPassword = await verifyPassword(password, userResult.rows[0].password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Begin transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete user sessions
      await client.query('DELETE FROM sessions WHERE user_id = $1', [userId]);

      // Delete user verification tokens
      await client.query('DELETE FROM verification_tokens WHERE user_id = $1', [userId]);

      // Delete user account
      await client.query('DELETE FROM users WHERE id = $1', [userId]);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    // Clear session cookie
    const { deleteSession } = await import('@/lib/auth');
    await deleteSession();

    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete account error:', error);

    if (error instanceof Error) {
      if (error.message.includes('connection')) {
        return NextResponse.json(
          { error: 'Database connection error. Please try again.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}