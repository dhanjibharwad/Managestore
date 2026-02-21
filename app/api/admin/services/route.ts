import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const deviceTypeId = searchParams.get('device_type_id');

    if (!deviceTypeId) {
      return NextResponse.json({ error: 'device_type_id is required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT s.id, s.name, s.description, s.price, s.tax, s.tax_code, s.rate_includes_tax, 
              s.device_type_id, dt.name as device_type_name, s.created_at, s.updated_at
       FROM services s
       JOIN device_types dt ON s.device_type_id = dt.id
       WHERE s.company_id = $1 AND s.device_type_id = $2 
       ORDER BY s.name ASC`,
      [session.company.id, deviceTypeId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { device_type_id, name, description, price, tax, tax_code, rate_includes_tax } = await req.json();

    if (!device_type_id || !name) {
      return NextResponse.json({ error: 'device_type_id and name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO services (company_id, device_type_id, name, description, price, tax, tax_code, rate_includes_tax) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, description, price',
      [session.company.id, device_type_id, name, description, price, tax, tax_code, rate_includes_tax]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating service:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Service already exists for this device type' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, device_type_id, name, description, price, tax, tax_code, rate_includes_tax } = await req.json();

    if (!id || !device_type_id || !name) {
      return NextResponse.json({ error: 'id, device_type_id and name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE services SET device_type_id = $1, name = $2, description = $3, price = $4, tax = $5, tax_code = $6, rate_includes_tax = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8 AND company_id = $9 RETURNING id, name',
      [device_type_id, name, description, price, tax, tax_code, rate_includes_tax, id, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating service:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Service already exists for this device type' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Service ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
