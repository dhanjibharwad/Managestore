import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

// GET - Get current user with company information
export async function GET() {
  try {
    // Get current session with company data
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login.' },
        { status: 401 }
      );
    }

    // Return user and company data from session
    return NextResponse.json(
      {
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          phone: session.user.phone,
          role: session.user.role,
          isVerified: session.user.isVerified,
          isActive: session.user.isActive,
          lastLoginAt: session.user.lastLoginAt,
          createdAt: session.user.createdAt,
        },
        company: {
          id: session.company.id,
          name: session.company.name,
          ownerName: session.company.ownerName,
          email: session.company.email,
          phone: session.company.phone,
          country: session.company.country,
          subscriptionPlan: session.company.subscriptionPlan,
          status: session.company.status,
          subscriptionStartDate: session.company.subscriptionStartDate,
          subscriptionEndDate: session.company.subscriptionEndDate,
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

// PUT - Update user profile
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
    const { name, email, phone } = body;

    // Validation
    if (!name && !email && !phone) {
      return NextResponse.json(
        { error: 'At least one field (name, email, or phone) must be provided' },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const companyId = session.company.id;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    // Build dynamic update query
    if (name && name.trim()) {
      updates.push(`name = $${paramCounter}`);
      values.push(name.trim());
      paramCounter++;
    }

    if (phone && phone.trim()) {
      updates.push(`phone = $${paramCounter}`);
      values.push(phone.trim());
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

      // Check if email is already taken by another user IN THE SAME COMPANY
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND company_id = $2 AND id != $3',
        [trimmedEmail, companyId, userId]
      );

      if (existingUser.rows.length > 0) {
        return NextResponse.json(
          { error: 'Email is already taken by another user in your company' },
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
      RETURNING id, email, name, phone, role, is_verified, is_active, last_login_at, created_at, updated_at
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
      try {
        const { createVerificationToken } = await import('@/lib/auth');
        const { sendVerificationEmail } = await import('@/lib/email');

        const otp = await createVerificationToken(userId, companyId, 'email_verification');
        await sendVerificationEmail(updatedUser.email, otp);

        return NextResponse.json(
          {
            message: 'Profile updated. Please verify your new email address.',
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              phone: updatedUser.phone,
              role: updatedUser.role,
              isVerified: updatedUser.is_verified,
              isActive: updatedUser.is_active,
              lastLoginAt: updatedUser.last_login_at,
              createdAt: updatedUser.created_at,
              updatedAt: updatedUser.updated_at,
            },
            emailChanged: true,
          },
          { status: 200 }
        );
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Still return success, but note email sending failed
        return NextResponse.json(
          {
            message: 'Profile updated, but failed to send verification email. Please contact support.',
            user: {
              id: updatedUser.id,
              email: updatedUser.email,
              name: updatedUser.name,
              phone: updatedUser.phone,
              role: updatedUser.role,
              isVerified: updatedUser.is_verified,
              isActive: updatedUser.is_active,
              lastLoginAt: updatedUser.last_login_at,
              createdAt: updatedUser.created_at,
              updatedAt: updatedUser.updated_at,
            },
            emailChanged: true,
            emailSendFailed: true,
          },
          { status: 200 }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          isVerified: updatedUser.is_verified,
          isActive: updatedUser.is_active,
          lastLoginAt: updatedUser.last_login_at,
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

// DELETE - Delete user account
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
    const companyId = session.company.id;

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
      'SELECT password FROM users WHERE id = $1 AND company_id = $2',
      [userId, companyId]
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

    // Check if user is the last admin in the company
    if (session.user.role === 'admin') {
      const adminCountResult = await pool.query(
        'SELECT COUNT(*) as admin_count FROM users WHERE company_id = $1 AND role = $2 AND is_active = true',
        [companyId, 'admin']
      );

      const adminCount = parseInt(adminCountResult.rows[0].admin_count);

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: 'Cannot delete account. You are the last admin in your company. Please assign another admin first.' },
          { status: 400 }
        );
      }
    }

    // Begin transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Delete user sessions
      await client.query('DELETE FROM sessions WHERE user_id = $1 AND company_id = $2', [userId, companyId]);

      // Delete user verification tokens
      await client.query('DELETE FROM verification_tokens WHERE user_id = $1 AND company_id = $2', [userId, companyId]);

      // Delete user account
      await client.query('DELETE FROM users WHERE id = $1 AND company_id = $2', [userId, companyId]);

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