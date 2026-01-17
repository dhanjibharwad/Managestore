import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, createVerificationToken, createSession } from '@/lib/auth';
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
    let userRole = 'admin';
    let customerId = null;

    if (token) {
      console.log('Validating invite token:', token);
      
      // First check company invites
      const companyInviteResult = await pool.query(
        `SELECT company_id, expires_at, used_at FROM company_invites 
         WHERE token = $1`,
        [token]
      );

      if (companyInviteResult.rows.length > 0) {
        const invite = companyInviteResult.rows[0];
        
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
        userRole = 'admin';
      } else {
        // Check customer invites
        const customerInviteResult = await pool.query(
          `SELECT id, company_id, invitation_status, invited_at FROM customers 
           WHERE invitation_token = $1 AND email_id = $2`,
          [token, email.toLowerCase().trim()]
        );

        if (customerInviteResult.rows.length > 0) {
          const customerInvite = customerInviteResult.rows[0];
          
          if (customerInvite.invitation_status === 'accepted') {
            return NextResponse.json(
              { error: 'Invitation has already been used' },
              { status: 400 }
            );
          }
          
          const inviteDate = new Date(customerInvite.invited_at);
          const expiryDate = new Date(inviteDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (new Date() > expiryDate) {
            return NextResponse.json(
              { error: 'Invitation has expired' },
              { status: 400 }
            );
          }

          companyId = customerInvite.company_id;
          customerId = customerInvite.id;
          userRole = 'customer';
        } else {
          // Check employee invites
          const employeeInviteResult = await pool.query(
            `SELECT id, company_id, invitation_status, invited_at, employee_role FROM employees 
             WHERE invitation_token = $1 AND email_id = $2`,
            [token, email.toLowerCase().trim()]
          );

          if (employeeInviteResult.rows.length === 0) {
            return NextResponse.json(
              { error: 'Invalid invitation token' },
              { status: 400 }
            );
          }

          const employeeInvite = employeeInviteResult.rows[0];
          
          if (employeeInvite.invitation_status === 'accepted') {
            return NextResponse.json(
              { error: 'Invitation has already been used' },
              { status: 400 }
            );
          }
          
          const inviteDate = new Date(employeeInvite.invited_at);
          const expiryDate = new Date(inviteDate.getTime() + 7 * 24 * 60 * 60 * 1000);
          if (new Date() > expiryDate) {
            return NextResponse.json(
              { error: 'Invitation has expired' },
              { status: 400 }
            );
          }

          companyId = employeeInvite.company_id;
          customerId = employeeInvite.id;
          userRole = employeeInvite.employee_role;
        }
      }
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

    // Create user - all users start unverified and need email verification
    const userResult = await pool.query(
      `INSERT INTO users (email, password, name, phone, company_id, role, is_verified, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING id, email, name, role, company_id, is_verified`,
      [email.toLowerCase().trim(), hashedPassword, name, phone || null, companyId, userRole, false, true]
    );

    const user = userResult.rows[0];
    console.log('Created user:', user);

    // Mark invite as used and link user to customer if it's a customer invite
    if (token) {
      if (customerId) {
        if (userRole === 'customer') {
          await pool.query(
            'UPDATE customers SET invitation_status = $1, user_id = $2 WHERE id = $3',
            ['accepted', user.id, customerId]
          );
          console.log('Marked customer invite as accepted and linked user');
        } else {
          await pool.query(
            'UPDATE employees SET invitation_status = $1, user_id = $2 WHERE id = $3',
            ['accepted', user.id, customerId]
          );
          console.log('Marked employee invite as accepted and linked user');
        }
      } else {
        await pool.query(
          'UPDATE company_invites SET used_at = NOW() WHERE token = $1',
          [token]
        );
        console.log('Marked company invite as used');
      }
    }

    // Generate OTP for all users - everyone needs email verification
    const otp = await createVerificationToken(user.id, companyId, 'email_verification');
    console.log('Generated OTP for user:', user.id);

    // Send verification email
    try {
      await sendVerificationEmail(email, otp);
      console.log('Verification email sent to:', email);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    console.log('Registration completed for user:', user.id, 'Role:', user.role);
    
    // All users need email verification
    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification code.',
      userId: user.id,
      companyId: companyId,
      role: user.role,
      verified: false,
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