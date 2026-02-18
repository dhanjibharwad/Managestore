import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, name, is_default, created_at, updated_at FROM device_types WHERE company_id = $1 ORDER BY name',
      [session.company.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch device types error:', error);
    return NextResponse.json({ error: 'Failed to fetch device types' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO device_types (name, company_id, is_default) VALUES ($1, $2, false) RETURNING *',
      [name, session.company.id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Create device type error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Device type already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create device type' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name } = await request.json();
    
    if (!id || !name) {
      return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE device_types SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND company_id = $3 RETURNING *',
      [name, id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Device type not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Update device type error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Device type name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update device type' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if device type has associated brands
    const brandsCheck = await pool.query(
      'SELECT COUNT(*) FROM device_brands WHERE device_type_id = $1 AND company_id = $2',
      [id, session.company.id]
    );
    
    if (parseInt(brandsCheck.rows[0].count) > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete device type with associated brands' 
      }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM device_types WHERE id = $1 AND company_id = $2 RETURNING *',
      [id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Device type not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Device type deleted successfully' });
  } catch (error) {
    console.error('Delete device type error:', error);
    return NextResponse.json({ error: 'Failed to delete device type' }, { status: 500 });
  }
}
