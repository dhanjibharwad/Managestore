import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      companyId,
      deviceType,
      brand,
      model,
      serialNumber,
      password,
      accessories = [],
      deviceImage,
      deviceIssue,
      name,
      mobile,
      email,
      termsAccepted,
      addressLine,
      region,
      city,
      postalCode,
      pickupDateTime,
      verificationMethod
    } = body;

    // Validation
    if (!companyId || !deviceType || !brand || !model || !name || !termsAccepted) {
      return NextResponse.json(
        { error: 'Required fields: companyId, deviceType, brand, model, name, termsAccepted' },
        { status: 400 }
      );
    }

    if (!mobile && !email) {
      return NextResponse.json(
        { error: 'Either mobile or email is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO guest_repair_requests (
        company_id, device_type, brand, model, serial_number, device_password, 
        accessories, device_image_url, device_issue,
        name, mobile, email, terms_accepted,
        address_line, region, city, postal_code, pickup_datetime,
        verification_method, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *`,
      [
        companyId, deviceType, brand, model, serialNumber, password,
        accessories, deviceImage, deviceIssue,
        name, mobile, email, termsAccepted,
        addressLine, region, city, postalCode, pickupDateTime,
        verificationMethod, 'pending'
      ]
    );

    return NextResponse.json({
      message: 'Repair request submitted successfully',
      request: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create guest repair request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit repair request' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const companyId = searchParams.get('companyId');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM guest_repair_requests WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (companyId) {
      paramCount++;
      query += ` AND company_id = $${paramCount}`;
      params.push(companyId);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR mobile ILIKE $${paramCount} OR brand ILIKE $${paramCount})`;
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
    let countQuery = 'SELECT COUNT(*) FROM guest_repair_requests WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (companyId) {
      countParamCount++;
      countQuery += ` AND company_id = $${countParamCount}`;
      countParams.push(companyId);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (name ILIKE $${countParamCount} OR email ILIKE $${countParamCount} OR mobile ILIKE $${countParamCount} OR brand ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      requests: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get guest repair requests error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repair requests' },
      { status: 500 }
    );
  }
}
