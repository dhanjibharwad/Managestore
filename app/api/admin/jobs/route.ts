import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      customerName,
      source = 'Google',
      referredBy,
      serviceType = 'Carried By User',
      jobType = 'No Warranty',
      deviceType,
      deviceBrand,
      deviceModel,
      serialNumber,
      accessories,
      storageLocation,
      deviceColor,
      devicePassword,
      services,
      tags,
      hardwareConfig,
      serviceAssessment,
      priority = 'Regular',
      assignee,
      initialQuotation,
      dueDate,
      dealerJobId,
      termsConditions,
      images = []
    } = body;

    // Validation
    if (!customerName || !deviceType || !deviceBrand || !services || !assignee) {
      return NextResponse.json(
        { error: 'Required fields: customerName, deviceType, deviceBrand, services, assignee' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO jobs (
        customer_name, source, referred_by, service_type, job_type,
        device_type, device_brand, device_model, serial_number, accessories,
        storage_location, device_color, device_password, services, tags,
        hardware_config, service_assessment, priority, assignee,
        initial_quotation, due_date, dealer_job_id, terms_conditions, images
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        $11, $12, $13, $14, $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24
      ) RETURNING *`,
      [
        customerName, source, referredBy, serviceType, jobType,
        deviceType, deviceBrand, deviceModel, serialNumber, accessories,
        storageLocation, deviceColor, devicePassword, services, tags,
        hardwareConfig, serviceAssessment, priority, assignee,
        initialQuotation, dueDate || null, dealerJobId, termsConditions, images
      ]
    );

    return NextResponse.json({
      message: 'Job created successfully',
      job: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (assignee) {
      paramCount++;
      query += ` AND assignee = $${paramCount}`;
      params.push(assignee);
    }

    if (search) {
      paramCount++;
      query += ` AND (customer_name ILIKE $${paramCount} OR job_number ILIKE $${paramCount} OR device_brand ILIKE $${paramCount})`;
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
    let countQuery = 'SELECT COUNT(*) FROM jobs WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (assignee) {
      countParamCount++;
      countQuery += ` AND assignee = $${countParamCount}`;
      countParams.push(assignee);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (customer_name ILIKE $${countParamCount} OR job_number ILIKE $${countParamCount} OR device_brand ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      jobs: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}