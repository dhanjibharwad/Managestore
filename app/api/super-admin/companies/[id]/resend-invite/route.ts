import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const companyId = parseInt(resolvedParams.id);

    // Get company details
    const companyResult = await pool.query(
      'SELECT * FROM companies WHERE id = $1 AND status = $2',
      [companyId, 'active']
    );

    if (companyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Active company not found' },
        { status: 404 }
      );
    }

    const company = companyResult.rows[0];

    // Generate new invitation token
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Update or create invitation record
    await pool.query(
      `INSERT INTO company_invites (company_id, email, token, expires_at) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET 
       token = $3, expires_at = $4, created_at = NOW()`,
      [companyId, company.email, inviteToken, expiresAt]
    );

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${inviteToken}`;
    
    // Send invitation email
    try {
      const { sendInviteEmail } = require('@/lib/email');
      await sendInviteEmail(company.email, company.company_name, company.owner_name, inviteLink);
      console.log(`Invitation resent successfully to ${company.email}`);
    } catch (emailError) {
      console.error('Failed to resend invitation email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Invitation resent successfully'
    });
  } catch (error) {
    console.error('Failed to resend invitation:', error);
    return NextResponse.json(
      { error: 'Failed to resend invitation' },
      { status: 500 }
    );
  }
}