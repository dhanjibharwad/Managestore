import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendCustomerInviteEmail } from '@/lib/email';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'technician'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { customerId } = await req.json();

    // Get customer details
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE id = $1 AND company_id = $2',
      [customerId, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];

    if (!customer.email_id) {
      return NextResponse.json(
        { error: 'Customer email not found' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${invitationToken}`;

    // Update customer with invitation details
    await pool.query(
      'UPDATE customers SET invitation_status = $1, invited_at = NOW(), invitation_token = $2 WHERE id = $3',
      ['sent', invitationToken, customerId]
    );

    // Send invitation email
    await sendCustomerInviteEmail(
      customer.email_id,
      customer.customer_name,
      session.company.name,
      inviteLink
    );

    return NextResponse.json({
      message: 'Invitation sent successfully'
    });

  } catch (error) {
    console.error('Send customer invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}