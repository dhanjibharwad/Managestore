import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Find user's company by email
    const result = await pool.query(
      `SELECT u.company_id, c.company_name, c.status as company_status
       FROM users u
       JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1 AND c.status = 'active'
       LIMIT 1`,
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    return NextResponse.json({
      companyId: user.company_id,
      companyName: user.company_name,
    });
  } catch (error) {
    console.error('Find user company error:', error);
    return NextResponse.json(
      { error: 'Failed to find user company' },
      { status: 500 }
    );
  }
}