import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const {
      customerType,
      customerName,
      mobileNumber,
      emailId,
      phoneNumber,
      source,
      referredBy,
      addressLine,
      regionState,
      cityTown,
      postalCode
    } = body;

    // Validation
    if (!customerType || !customerName) {
      return NextResponse.json(
        { error: 'Required fields: customerType, customerName' },
        { status: 400 }
      );
    }

    // Generate customer ID per company with company prefix
    const client = await pool.connect();
    let customerId = '';
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE customers IN EXCLUSIVE MODE');
      
      const customerIdResult = await client.query(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(customer_id FROM LENGTH($1) + 1) AS INTEGER)), 0) + 1 as next_number FROM customers WHERE customer_id ~ $2 AND company_id = $3",
        [`C${session.company.id}CUST`, `^C${session.company.id}CUST[0-9]+$`, session.company.id]
      );
      customerId = `C${session.company.id}CUST${customerIdResult.rows[0].next_number.toString().padStart(4, '0')}`;
      
      await client.query('COMMIT');

    } catch (transactionError) {
      await client.query('ROLLBACK');
      throw transactionError;
    } finally {
      client.release();
    }

    const result = await pool.query(
      `INSERT INTO customers (
        customer_id, company_id, customer_type, customer_name, mobile_number, email_id, phone_number,
        source, referred_by, address_line, region_state, city_town, postal_code, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *`,
      [
        customerId, session.company.id, customerType, customerName, mobileNumber, emailId, phoneNumber,
        source, referredBy, addressLine, regionState, cityTown, postalCode, session.user.id
      ]
    );

    return NextResponse.json({
      message: 'Customer created successfully',
      customer: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM customers WHERE company_id = $1';
    const params: any[] = [session.company.id];
    let paramCount = 1;

    if (type) {
      paramCount++;
      query += ` AND customer_type = $${paramCount}`;
      params.push(type);
    }

    if (search) {
      paramCount++;
      query += ` AND (customer_name ILIKE $${paramCount} OR mobile_number ILIKE $${paramCount} OR email_id ILIKE $${paramCount} OR customer_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM customers WHERE company_id = $1';
    const countParams: any[] = [session.company.id];
    let countParamCount = 1;

    if (type) {
      countParamCount++;
      countQuery += ` AND customer_type = $${countParamCount}`;
      countParams.push(type);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (customer_name ILIKE $${countParamCount} OR mobile_number ILIKE $${countParamCount} OR email_id ILIKE $${countParamCount} OR customer_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      customers: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get customers error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}