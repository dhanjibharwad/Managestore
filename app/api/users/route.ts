import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    
    const result = await pool.query(
      `SELECT id, employee_name as name, email_id as email, employee_role as role 
       FROM employees 
       WHERE company_id = $1 AND status = 'Active' AND employee_role IN ('admin', 'technician')
       ORDER BY employee_name`,
      [companyId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
