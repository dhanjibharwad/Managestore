import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getSession } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      supplierName,
      mobileNumber,
      phoneNumber,
      taxNumber,
      emailId,
      addressLine,
      regionState,
      cityTown,
      postalCode
    } = body;

    if (!supplierName?.trim()) {
      return NextResponse.json({ error: 'Supplier name is required' }, { status: 400 });
    }
    
    if (!mobileNumber?.trim() || !/^[6-9]\d{9}$/.test(mobileNumber)) {
      return NextResponse.json({ error: 'Valid mobile number is required' }, { status: 400 });
    }

    if (emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `INSERT INTO part_suppliers 
         (company_id, supplier_name, mobile_number, phone_number, tax_number, email_id, 
          address_line, region_state, city_town, postal_code) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
         RETURNING *`,
        [session.company.id, supplierName, mobileNumber, phoneNumber, taxNumber, emailId, 
         addressLine, regionState, cityTown, postalCode]
      );

      return NextResponse.json(result.rows[0], { status: 201 });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const client = await pool.connect();
    
    try {
      const result = await client.query(
        'SELECT * FROM part_suppliers WHERE company_id = $1 ORDER BY created_at DESC',
        [session.company.id]
      );
      return NextResponse.json(result.rows);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}