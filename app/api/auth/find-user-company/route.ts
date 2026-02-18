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

    // Find user by email (handle superadmin with NULL company_id)
    const result = await pool.query(
      `SELECT u.company_id, u.role, c.company_name, c.status as company_status
       FROM users u
       LEFT JOIN companies c ON u.company_id = c.id
       WHERE u.email = $1
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

    // For superadmin, company_id is NULL
    if (user.role === 'superadmin') {
      return NextResponse.json({
        companyId: null,
        companyName: 'Super Admin',
      });
    }

    // For other users, check company status
    if (user.company_status !== 'active') {
      return NextResponse.json(
        { error: 'Company account is not active' },
        { status: 403 }
      );
    }

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