import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get customer info from session
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE user_id = $1 AND company_id = $2',
      [session.user.id, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build query to get jobs for this customer
    let query = `
      SELECT j.*,
             dt.name as device_type_name,
             db.name as device_brand_name, 
             dm.name as device_model_name
      FROM jobs j
      LEFT JOIN device_types dt ON CASE WHEN j.device_type ~ '^[0-9]+$' THEN j.device_type::integer ELSE NULL END = dt.id
      LEFT JOIN device_brands db ON CASE WHEN j.device_brand ~ '^[0-9]+$' THEN j.device_brand::integer ELSE NULL END = db.id 
      LEFT JOIN device_models dm ON CASE WHEN j.device_model ~ '^[0-9]+$' THEN j.device_model::integer ELSE NULL END = dm.id
      WHERE j.company_id = $1 AND (j.customer_id = $2 OR j.customer_name = $3)
    `;
    
    const params: any[] = [session.company.id, customer.id, customer.customer_name];
    let paramCount = 3;

    if (status && status !== '') {
      paramCount++;
      query += ` AND j.status = $${paramCount}`;
      params.push(status);
    }

    if (search && search !== '') {
      paramCount++;
      query += ` AND (j.job_number ILIKE $${paramCount} OR j.services ILIKE $${paramCount} OR j.serial_number ILIKE $${paramCount} OR j.customer_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);

    // Transform the data to match the expected format
    const jobs = result.rows.map(job => ({
      id: job.id,
      jobSheet: job.job_number,
      customer: job.customer_name,
      paymentReceived: 0, // TODO: Add payment tracking
      paymentRemaining: 0, // TODO: Add payment tracking  
      paymentStatus: 'Pending', // TODO: Add payment status
      deviceBrand: job.device_brand_name || job.device_brand || '-',
      deviceModel: job.device_model_name || job.device_model || '-',
      dueDate: job.due_date ? new Date(job.due_date).toLocaleDateString() : '-',
      status: job.status,
      services: job.services,
      priority: job.priority,
      assignee: job.assignee,
      createdAt: job.created_at
    }));

    return NextResponse.json({
      jobs,
      customer: {
        name: customer.customer_name,
        id: customer.customer_id
      }
    });

  } catch (error) {
    console.error('Get customer jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}