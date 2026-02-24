import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    console.log('Session:', session);
    
    if (!session || !session.company || session.user.role !== 'technician') {
      console.log('Unauthorized access attempt:', session?.user?.role);
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const serviceType = searchParams.get('service_type');
    
    const technicianName = session.user.name;
    const companyId = session.company.id;
    console.log('Technician Name:', technicianName, 'Company ID:', companyId);

    let query = `
      SELECT pd.*, 
             e.employee_name as assignee_name,
             COALESCE(c.customer_name, u2.name) as customer_name,
             dt.name as device_type_name
      FROM pickup_drop pd 
      LEFT JOIN employees e ON pd.assignee_id = e.id
      LEFT JOIN users u2 ON pd.customer_search = u2.id::text
      LEFT JOIN customers c ON pd.customer_search = c.id::text
      LEFT JOIN device_types dt ON pd.device_type = dt.id::text
      WHERE pd.company_id = $1 AND e.employee_name = $2
    `;
    
    const params: any[] = [companyId, technicianName];
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
    console.log('Query:', query);
    console.log('Params:', params);

    const result = await pool.query(query, params);
    console.log('Query result rows:', result.rows.length);
    console.log('Sample pickup:', result.rows[0]);

    return NextResponse.json({ pickupDrops: result.rows });
  } catch (error) {
    console.error('Error fetching assigned pickup/drop services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned pickup/drop services' },
      { status: 500 }
    );
  }
}