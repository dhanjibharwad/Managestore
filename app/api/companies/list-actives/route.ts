import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Fetch all active companies
    const result = await pool.query(
      `SELECT 
        id,
        company_name,
        email,
        country,
        subscription_plan
       FROM companies 
       WHERE status = 'active'
       ORDER BY company_name ASC`
    );

    return NextResponse.json(
      {
        companies: result.rows,
        total: result.rows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}