import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const result = await pool.query(
      'SELECT * FROM jobs WHERE id = $1 AND company_id = $2',
      [id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ job: result.rows[0] });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get session to extract company_id for security
    const session = await getSession();
    if (!session || !session.company) {
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
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const updates = [];
    const values = [];
    let paramCount = 0;
    
    const fields = ['customer_name', 'source', 'referred_by', 'service_type', 'job_type', 'device_type', 'device_brand', 'device_model', 'serial_number', 'accessories', 'storage_location', 'device_color', 'device_password', 'services', 'tags', 'hardware_config', 'service_assessment', 'priority', 'assignee', 'initial_quotation', 'due_date', 'dealer_job_id', 'terms_conditions', 'images'];
    
    fields.forEach(field => {
      if (body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    });
    
    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }
    
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    
    paramCount++;
    values.push(id);
    paramCount++;
    values.push(session.company.id);
    
    const query = `UPDATE jobs SET ${updates.join(', ')} WHERE id = $${paramCount - 1} AND company_id = $${paramCount} RETURNING *`;
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Job updated successfully', job: result.rows[0] });
  } catch (error) {
    console.error('Error updating job:', error);
    return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
  }
}