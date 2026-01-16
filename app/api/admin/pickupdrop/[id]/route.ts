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

    const companyId = session.company.id;
    const { id } = await params;
    const pickupDropId = parseInt(id);
    
    if (isNaN(pickupDropId)) {
      return NextResponse.json({ error: 'Invalid pickup/drop ID' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT pd.*, c.customer_name, u.name as assignee_name, dt.name as device_type_name
       FROM pickup_drop pd
       LEFT JOIN customers c ON pd.customer_search = c.id::text
       LEFT JOIN users u ON pd.assignee_id = u.id
       LEFT JOIN device_types dt ON pd.device_type = dt.id::text
       WHERE pd.id = $1 AND pd.company_id = $2`,
      [pickupDropId, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pickup/Drop not found' }, { status: 404 });
    }

    return NextResponse.json({ pickupDrop: result.rows[0] });
  } catch (error) {
    console.error('Get pickup/drop error:', error);
    return NextResponse.json({ error: 'Failed to get pickup/drop' }, { status: 500 });
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

    const companyId = session.company.id;
    const { id } = await params;
    const pickupDropId = parseInt(id);
    
    if (isNaN(pickupDropId)) {
      return NextResponse.json({ error: 'Invalid pickup/drop ID' }, { status: 400 });
    }

    const body = await request.json();
    const { service_type, customer_search, mobile, device_type, address, assignee_id, schedule_date, status } = body;

    const pickupDropCheck = await pool.query(
      'SELECT id FROM pickup_drop WHERE id = $1 AND company_id = $2',
      [pickupDropId, companyId]
    );

    if (pickupDropCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Pickup/Drop not found' }, { status: 404 });
    }

    const result = await pool.query(
      'UPDATE pickup_drop SET service_type = $1, customer_search = $2, mobile = $3, device_type = $4, address = $5, assignee_id = $6, schedule_date = $7, status = $8, updated_at = NOW() WHERE id = $9 AND company_id = $10 RETURNING *',
      [service_type, customer_search, mobile, device_type, address, assignee_id, schedule_date, status, pickupDropId, companyId]
    );

    return NextResponse.json({ pickupDrop: result.rows[0] });
  } catch (error) {
    console.error('Update pickup/drop error:', error);
    return NextResponse.json({ error: 'Failed to update pickup/drop' }, { status: 500 });
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

    const companyId = session.company.id;
    const { id } = await params;
    const pickupDropId = parseInt(id);
    
    if (isNaN(pickupDropId)) {
      return NextResponse.json({ error: 'Invalid pickup/drop ID' }, { status: 400 });
    }

    const pickupDropCheck = await pool.query(
      'SELECT id FROM pickup_drop WHERE id = $1 AND company_id = $2',
      [pickupDropId, companyId]
    );

    if (pickupDropCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Pickup/Drop not found' }, { status: 404 });
    }

    await pool.query(
      'DELETE FROM pickup_drop WHERE id = $1 AND company_id = $2',
      [pickupDropId, companyId]
    );

    return NextResponse.json({ message: 'Pickup/Drop deleted successfully' });
  } catch (error) {
    console.error('Delete pickup/drop error:', error);
    return NextResponse.json({ error: 'Failed to delete pickup/drop' }, { status: 500 });
  }
}
