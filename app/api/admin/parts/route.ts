import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { companyId, partName, serialNumber, description, warranty, price, taxCode } = body;

    if (!companyId || !partName || !price) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Verify user belongs to the company they're trying to add a part for
    if (session.company.id !== companyId) {
      return NextResponse.json({ error: 'Forbidden - Company mismatch' }, { status: 403 });
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
    // Verify user is authenticated
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const requestedCompanyId = searchParams.get('companyId');

    // Use session company ID if not provided, or verify requested company matches session
    const companyId = requestedCompanyId 
      ? (requestedCompanyId === session.company.id.toString() ? requestedCompanyId : null)
      : session.company.id.toString();

    if (!companyId) {
      return NextResponse.json({ error: 'Forbidden - Company mismatch' }, { status: 403 });
    }

    const query = 'SELECT * FROM parts WHERE company_id = $1 ORDER BY part_name';
    const result = await pool.query(query, [companyId]);

    return NextResponse.json({ parts: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
