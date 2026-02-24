import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.company || session.user.role !== 'technician') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    const technicianName = session.user.name;
    const companyId = session.company.id;

    let query = `
      SELECT j.*, 
             dt.name as device_type_name,
             db.name as device_brand_name, 
             dm.name as device_model_name 
      FROM jobs j 
      LEFT JOIN device_types dt ON CASE WHEN j.device_type ~ '^[0-9]+$' THEN j.device_type::integer ELSE NULL END = dt.id
      LEFT JOIN device_brands db ON CASE WHEN j.device_brand ~ '^[0-9]+$' THEN j.device_brand::integer ELSE NULL END = db.id 
      LEFT JOIN device_models dm ON CASE WHEN j.device_model ~ '^[0-9]+$' THEN j.device_model::integer ELSE NULL END = dm.id
      WHERE j.company_id = $1 AND j.assignee = $2
    `;
    
    const params: any[] = [companyId, technicianName];
    let paramCount = 2;

    if (status) {
      paramCount++;
      query += ` AND j.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (j.job_number ILIKE $${paramCount} OR j.customer_name ILIKE $${paramCount} OR j.serial_number ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY j.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ jobs: result.rows });
  } catch (error) {
    console.error('Error fetching assigned jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned jobs' },
      { status: 500 }
    );
  }
}
