import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyId, partName, serialNumber, description, warranty, price, taxCode } = body;

    if (!companyId || !partName || !price) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const query = `
      INSERT INTO parts (company_id, part_name, serial_number, description, warranty, price, tax_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [companyId, partName, serialNumber, description, warranty, price, taxCode];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, part: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create part' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    const query = companyId 
      ? 'SELECT * FROM parts WHERE company_id = $1 ORDER BY part_name'
      : 'SELECT * FROM parts ORDER BY part_name';
    
    const result = companyId 
      ? await pool.query(query, [companyId])
      : await pool.query(query);

    return NextResponse.json({ parts: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
