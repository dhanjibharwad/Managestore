import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'technician') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    
    const technicianName = session.user.name;
    const companyId = session.company.id;

    let query = `
      SELECT * FROM self_checkin_requests 
      WHERE company_id = $1 AND assignee = $2
    `;
    const params: any[] = [companyId, technicianName];
    let paramCount = 2;

    if (search) {
      paramCount++;
      query += ` AND (customer_name ILIKE $${paramCount} OR mobile_number ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ requests: result.rows });

  } catch (error) {
    console.error('Fetch assigned self check-in error:', error);
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
  }
}
