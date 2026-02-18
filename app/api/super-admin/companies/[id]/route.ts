import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status, sendInvite } = await req.json();
    const resolvedParams = await params;
    const companyId = parseInt(resolvedParams.id);

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE companies 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [status, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const company = result.rows[0];

    // Send invite email if approving
    if (status === 'active' && sendInvite) {
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await pool.query(
        `INSERT INTO company_invites (company_id, email, token, expires_at) 
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO UPDATE SET 
         token = $3, expires_at = $4, created_at = NOW()`,
        [companyId, company.email, inviteToken, expiresAt]
      );

      const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${inviteToken}`;
      
      try {
        const { sendInviteEmail } = require('@/lib/email');
        await sendInviteEmail(company.email, company.company_name, company.company_owner_name, inviteLink);
        console.log(`Invite email sent successfully to ${company.email}`);
      } catch (emailError) {
        console.error('Failed to send invite email:', emailError);
      }
    }

    return NextResponse.json({
      message: status === 'active' && sendInvite ? 
        'Company approved and invite email sent successfully' : 
        'Company status updated successfully',
      company
    });
  } catch (error) {
    console.error('Failed to update company status:', error);
    return NextResponse.json(
      { error: 'Failed to update company status' },
      { status: 500 }
    );
  }
}

