import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';
import { sendCustomerInviteEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { customerId } = await req.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Get customer and company details
    const customerResult = await pool.query(
      `SELECT c.*, comp.company_name 
       FROM customers c 
       JOIN companies comp ON c.company_id = comp.id 
       WHERE c.id = $1`,
      [customerId]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];

    // Generate invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store invitation token
    await pool.query(
      `INSERT INTO customer_invites (customer_id, company_id, email, token, expires_at) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET 
       token = $4, expires_at = $5, created_at = NOW()`,
      [customerId, customer.company_id, customer.email_id, inviteToken, expiresAt]
    );

    // Create invitation link
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${inviteToken}&type=customer&company=${customer.company_id}`;

    // Send invitation email
    try {
      await sendCustomerInviteEmail(
        customer.email_id,
        customer.customer_name,
        customer.company_name,
        inviteLink
      );
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      return NextResponse.json(
        { error: 'Invitation created but email failed to send. Please check email configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Invitation sent successfully',
      success: true
    });

  } catch (error) {
    console.error('Failed to send customer invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}