import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT s.id, s.name, s.description, s.price, s.tax, s.tax_code, s.rate_includes_tax, 
              s.device_type_id, dt.name as device_type_name, s.created_at, s.updated_at
       FROM services s
       LEFT JOIN device_types dt ON s.device_type_id = dt.id
       WHERE s.company_id = $1 
       ORDER BY s.name ASC`,
      [session.company.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching all services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}
