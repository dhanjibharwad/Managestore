import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'technician') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { status, assignee } = await req.json();
    const companyId = session.company.id;

    const result = await pool.query(
      `UPDATE self_checkin_requests 
       SET status = $1, assignee = $2, updated_at = NOW()
       WHERE id = $3 AND company_id = $4
       RETURNING *`,
      [status, assignee, id, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: result.rows[0] });

  } catch (error) {
    console.error('Update self check-in error:', error);
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 });
  }
}
