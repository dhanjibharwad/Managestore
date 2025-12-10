import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
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

    const result = await pool.query(
      `INSERT INTO customers (
        customer_type, customer_name, mobile_number, email_id, phone_number,
        source, referred_by, address_line, region_state, city_town, postal_code
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        customerType, customerName, mobileNumber, emailId, phoneNumber,
        source, referredBy, addressLine, regionState, cityTown, postalCode
      ]
    );

    return NextResponse.json({
      message: 'Customer created successfully',
      customer: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create customer error:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM customers WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

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
    let countQuery = 'SELECT COUNT(*) FROM customers WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

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