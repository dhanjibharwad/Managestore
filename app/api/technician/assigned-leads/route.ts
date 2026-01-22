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
    
    const technicianId = session.user.id;
    const companyId = session.company.id;

    let query = `
      SELECT l.*, 
             dt.name as device_type_name,
             db.name as device_brand_name, 
             dm.name as device_model_name 
      FROM leads l 
      LEFT JOIN device_types dt ON l.device_type_id = dt.id
      LEFT JOIN device_brands db ON l.device_brand_id = db.id 
      LEFT JOIN device_models dm ON l.device_model_id = dm.id
      WHERE l.company_id = $1 AND l.assignee_id = $2
    `;
    
    const params: any[] = [companyId, technicianId];
    let paramCount = 2;

    if (search) {
      paramCount++;
      query += ` AND (l.lead_name ILIKE $${paramCount} OR l.mobile_number ILIKE $${paramCount} OR l.email_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY l.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ leads: result.rows });
  } catch (error) {
    console.error('Error fetching assigned leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned leads' },
      { status: 500 }
    );
  }
}