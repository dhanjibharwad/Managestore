import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT id FROM customers WHERE email_id = $1 AND company_id = $2',
      [email, session.company.id]
    );

    return NextResponse.json({ exists: result.rows.length > 0 });

  } catch (error) {
    console.error('Check email error:', error);
    return NextResponse.json({ error: 'Failed to check email' }, { status: 500 });
  }
}