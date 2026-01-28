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

    const inviteToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      `INSERT INTO company_invites (company_id, email, token, expires_at) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET 
       token = $3, expires_at = $4, created_at = NOW()`,
      [companyId, company.email, inviteToken, expiresAt]
    );

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/company-register?token=${inviteToken}`;

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
