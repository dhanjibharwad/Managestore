import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT DISTINCT 
        part_name,
        price,
        tax_code,
        tax_rate,
        warranty,
        description
      FROM quotation_parts 
      WHERE company_id = $1 
      ORDER BY part_name`,
      [companyId]
    );

    return NextResponse.json({ parts: result.rows });
  } catch (error: any) {
    console.error('Fetch quotation parts error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
