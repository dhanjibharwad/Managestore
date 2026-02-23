import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const session = await getSession();
    if (!session || !session.company || session.user.role !== 'technician') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { status, assignee } = body;
    const technicianName = session.user.name;
    const companyId = session.company.id;
    
    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }
    
    const updates = [];
    const values = [];
    let paramCount = 0;
    
    if (status) {
      paramCount++;
      updates.push(`status = $${paramCount}`);
      values.push(status);
    }
    
    if (assignee) {
      paramCount++;
      updates.push(`assignee = $${paramCount}`);
      values.push(assignee);
    }
    
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    
    paramCount++;
    values.push(id);
    paramCount++;
    values.push(companyId);
    paramCount++;
    values.push(technicianName);
    
    const query = `
      UPDATE jobs 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount - 2} AND company_id = $${paramCount - 1} AND assignee = $${paramCount}
      RETURNING *
    `;
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found or unauthorized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Job updated successfully',
      job: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}
