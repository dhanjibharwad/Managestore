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

    const companyResult = await pool.query(
      'SELECT * FROM companies WHERE id = $1',
      [companyId]
    );

    if (companyResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    const company = companyResult.rows[0];

    if (!company.email) {
      return NextResponse.json(
        { error: 'Company email not found' },
        { status: 400 }
      );
    }

    const invitationToken = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/company-register?token=${invitationToken}`;

    await pool.query(
      'UPDATE companies SET invitation_token = $1, invited_at = NOW() WHERE id = $2',
      [invitationToken, companyId]
    );

    return NextResponse.json({
      message: 'Invitation sent successfully',
      inviteLink
    });

  } catch (error) {
    console.error('Send company invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
