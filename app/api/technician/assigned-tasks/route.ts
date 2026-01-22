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
    
    const technicianId = session.user.id;
    const companyId = session.company.id;

    let query = `
      SELECT t.*, 
             c.customer_name,
             e.employee_name as assignee_name
      FROM tasks t 
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN employees e ON t.assignee_id = e.id
      WHERE t.company_id = $1 AND t.assignee_id = $2
    `;
    
    const params: any[] = [companyId, technicianId];
    let paramCount = 2;

    if (status) {
      paramCount++;
      query += ` AND t.task_status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (t.task_title ILIKE $${paramCount} OR t.task_description ILIKE $${paramCount} OR t.task_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ tasks: result.rows });
  } catch (error) {
    console.error('Error fetching assigned tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assigned tasks' },
      { status: 500 }
    );
  }
}