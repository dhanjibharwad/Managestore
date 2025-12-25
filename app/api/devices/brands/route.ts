import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    
    const result = await pool.query(
      'SELECT * FROM device_brands WHERE company_id = $1 ORDER BY name',
      [companyId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch brands error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, device_type_id } = await request.json();
    const companyId = session.company.id;
    
    const result = await pool.query(
      'INSERT INTO device_brands (name, device_type_id, company_id) VALUES ($1, $2, $3) RETURNING *',
      [name, device_type_id, companyId]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}
