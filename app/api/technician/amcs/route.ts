import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company || session.user.role !== 'technician') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const technicianName = session.user.name;
    const companyId = session.company.id;
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    let query = `
      SELECT 
        ac.*,
        c.customer_name as customer_display_name,
        e.employee_name as assignee_display_name
      FROM amc_contracts ac
      LEFT JOIN customers c ON ac.customer_name = c.id::varchar AND c.company_id = $1
      LEFT JOIN employees e ON ac.assignee = e.id::varchar AND e.company_id = $1
      WHERE ac.company_id = $1 AND e.employee_name = $2
    `;
    
    const params: any[] = [companyId, technicianName];
    let paramCount = 2;

    if (search && search !== '') {
      paramCount++;
      query += ` AND (ac.contract_number ILIKE $${paramCount} OR c.customer_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY ac.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ 
      contracts: result.rows 
    });

  } catch (error) {
    console.error('Get technician AMCs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}
