import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Get subscription statistics
    const statsResult = await pool.query(`
      SELECT 
        subscription_plan as plan,
        COUNT(*) as companies,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage,
        CASE 
          WHEN subscription_plan = 'free' THEN 0
          WHEN subscription_plan = 'basic' THEN COUNT(*) * 29
          WHEN subscription_plan = 'pro' THEN COUNT(*) * 79
          WHEN subscription_plan = 'enterprise' THEN COUNT(*) * 199
          ELSE 0
        END as revenue
      FROM companies 
      WHERE status = 'active'
      GROUP BY subscription_plan
      ORDER BY companies DESC
    `);

    // Get detailed company subscription data
    const companiesResult = await pool.query(`
      SELECT 
        id,
        company_name,
        subscription_plan,
        status,
        subscription_start_date,
        subscription_end_date,
        created_at
      FROM companies 
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return NextResponse.json({
      stats: statsResult.rows,
      companies: companiesResult.rows,
      totalCompanies: companiesResult.rows.length
    });
  } catch (error) {
    console.error('Failed to fetch subscription data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription data' },
      { status: 500 }
    );
  }
}