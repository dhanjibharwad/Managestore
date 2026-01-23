import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = parseInt(id);
    
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Get the lead
    const result = await pool.query(
      'SELECT * FROM leads WHERE id = $1 AND company_id = $2',
      [leadId, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Get lead error:', error);
    return NextResponse.json({ error: 'Failed to get lead' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = parseInt(id);
    
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
    }

    const companyId = session.company.id;
    const body = await request.json();
    const { lead_name, mobile_number, assignee_id, lead_source, next_follow_up, comment } = body;

    // Check if lead exists and belongs to the company
    const leadCheck = await pool.query(
      'SELECT id FROM leads WHERE id = $1 AND company_id = $2',
      [leadId, companyId]
    );

    if (leadCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Update the lead
    const result = await pool.query(
      'UPDATE leads SET lead_name = $1, mobile_number = $2, assignee_id = $3, lead_source = $4, next_follow_up = $5, comment = $6, updated_at = NOW() WHERE id = $7 AND company_id = $8 RETURNING *',
      [lead_name, mobile_number, assignee_id, lead_source, next_follow_up, comment, leadId, companyId]
    );

    return NextResponse.json({ lead: result.rows[0] });
  } catch (error) {
    console.error('Update lead error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const leadId = parseInt(id);
    
    if (isNaN(leadId)) {
      return NextResponse.json({ error: 'Invalid lead ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Check if lead exists and belongs to the company
    const leadCheck = await pool.query(
      'SELECT id FROM leads WHERE id = $1 AND company_id = $2',
      [leadId, companyId]
    );

    if (leadCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Delete the lead
    await pool.query(
      'DELETE FROM leads WHERE id = $1 AND company_id = $2',
      [leadId, companyId]
    );

    return NextResponse.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 });
  }
}