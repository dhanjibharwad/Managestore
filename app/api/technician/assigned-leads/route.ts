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
    
    const technicianName = session.user.name;
    const companyId = session.company.id;
    console.log('Technician Name:', technicianName, 'Company ID:', companyId);

    let query = `
      SELECT l.*, 
             dt.name as device_type_name,
             db.name as device_brand_name, 
             dm.name as device_model_name,
             e.employee_name as assignee_name
      FROM leads l 
      LEFT JOIN device_types dt ON l.device_type_id = dt.id
      LEFT JOIN device_brands db ON l.device_brand_id = db.id 
      LEFT JOIN device_models dm ON l.device_model_id = dm.id
      LEFT JOIN employees e ON l.assignee_id = e.id
      WHERE l.company_id = $1 AND e.employee_name = $2
    `;
    
    const params: any[] = [companyId, technicianName];
    let paramCount = 2;

    if (search) {
      paramCount++;
      query += ` AND (l.lead_name ILIKE $${paramCount} OR l.mobile_number ILIKE $${paramCount} OR l.email_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY l.created_at DESC';
    console.log('Query:', query);
    console.log('Params:', params);

    const result = await pool.query(query, params);
    console.log('Query result rows:', result.rows.length);
    console.log('Sample lead:', result.rows[0]);

    return NextResponse.json({ leads: result.rows });
  } catch (error) {
    console.error('Error fetching assigned leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned leads' },
      { status: 500 }
    );
  }
}