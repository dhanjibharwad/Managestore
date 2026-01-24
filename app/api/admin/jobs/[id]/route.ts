import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get session to extract company_id for security
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Delete job from database
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 AND company_id = $2 RETURNING *',
      [id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Job not found or unauthorized' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Job deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Get session to extract company_id for security
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { status, assignee } = body;
    
    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }
    
    // Build update query dynamically
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
    
    // Add updated_at
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    
    // Add WHERE conditions
    paramCount++;
    values.push(id);
    paramCount++;
    values.push(session.company.id);
    
    const query = `
      UPDATE jobs 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount - 1} AND company_id = $${paramCount}
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