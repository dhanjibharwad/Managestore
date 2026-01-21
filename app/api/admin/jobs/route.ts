import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { randomBytes } from 'crypto';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Get session to extract company_id
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

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

    // Get customer_id if customer exists
    let customerId = null;
    const customerResult = await pool.query(
      'SELECT id FROM customers WHERE customer_name = $1 AND company_id = $2',
      [customerName, session.company.id]
    );
    if (customerResult.rows.length > 0) {
      customerId = customerResult.rows[0].id;
    }

    // Generate unique job_id
    const generateJobId = () => {
      return 'JOB_' + randomBytes(4).toString('hex').toUpperCase();
    };

    let jobId = generateJobId();
    let isUnique = false;
    
    // Ensure job_id is unique
    while (!isUnique) {
      const existingJob = await pool.query('SELECT id FROM jobs WHERE job_id = $1', [jobId]);
      if (existingJob.rows.length === 0) {
        isUnique = true;
      } else {
        jobId = generateJobId();
      }
    }

    // Generate sequential job number
    const jobNumberResult = await pool.query(
      "SELECT COALESCE(MAX(CAST(SUBSTRING(job_number FROM 4) AS INTEGER)), 0) + 1 as next_number FROM jobs WHERE job_number ~ 'JOB[0-9]+'"
    );
    const jobNumber = `JOB${jobNumberResult.rows[0].next_number.toString().padStart(4, '0')}`;

    const result = await pool.query(
      `INSERT INTO jobs (
        job_id, job_number, company_id, customer_id, customer_name, source, referred_by, service_type, job_type,
        device_type, device_brand, device_model, serial_number, accessories,
        storage_location, device_color, device_password, services, tags,
        hardware_config, service_assessment, priority, assignee,
        initial_quotation, due_date, dealer_job_id, terms_conditions, images
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28
      ) RETURNING *`,
      [
        jobId, jobNumber, session.company.id, customerId, customerName, source, referredBy, serviceType, jobType,
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
      { error: 'Failed to create job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get session to extract company_id
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM jobs WHERE company_id = $1';
    const params: any[] = [session.company.id];
    let paramCount = 1;

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
      query += ` AND (customer_name ILIKE $${paramCount} OR job_number ILIKE $${paramCount} OR job_id ILIKE $${paramCount} OR device_brand ILIKE $${paramCount})`;
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
    let countQuery = 'SELECT COUNT(*) FROM jobs WHERE company_id = $1';
    const countParams: any[] = [session.company.id];
    let countParamCount = 1;

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
      countQuery += ` AND (customer_name ILIKE $${countParamCount} OR job_number ILIKE $${countParamCount} OR job_id ILIKE $${countParamCount} OR device_brand ILIKE $${countParamCount})`;
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