import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        company_name,
        company_owner_name as owner_name,
        email,
        phone,
        country,
        subscription_plan,
        status,
        created_at,
        updated_at
      FROM companies 
      ORDER BY created_at DESC
    `);

    return NextResponse.json({
      companies: result.rows,
      total: result.rows.length
    });
  } catch (error) {
    console.error('Failed to fetch companies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}