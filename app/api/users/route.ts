import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    
    const result = await pool.query(
      `SELECT id, name, email, role 
       FROM users 
       WHERE company_id = $1 AND is_active = true 
       ORDER BY name`,
      [companyId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
