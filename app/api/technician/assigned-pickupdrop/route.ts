import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'technician') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const serviceType = searchParams.get('service_type');
    
    const technicianId = session.user.id;
    const companyId = session.company.id;

    let query = `
      SELECT pd.*, 
             e.employee_name as assignee_name
      FROM pickup_drop pd 
      LEFT JOIN employees e ON pd.assignee_id = e.id
      WHERE pd.company_id = $1 AND pd.assignee_id = $2
    `;
    
    const params: any[] = [companyId, technicianId];
    let paramCount = 2;

    if (status) {
      paramCount++;
      query += ` AND pd.status = $${paramCount}`;
      params.push(status);
    }

    if (serviceType) {
      paramCount++;
      query += ` AND pd.service_type = $${paramCount}`;
      params.push(serviceType);
    }

    if (search) {
      paramCount++;
      query += ` AND (pd.customer_search ILIKE $${paramCount} OR pd.mobile ILIKE $${paramCount} OR pd.device_type ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY pd.schedule_date DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ pickupDrops: result.rows });
  } catch (error) {
    console.error('Error fetching assigned pickup/drop services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned pickup/drop services' },
      { status: 500 }
    );
  }
}