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
      'SELECT id, name, color_code, created_at, updated_at FROM device_colors WHERE company_id = $1 ORDER BY name',
      [session.company.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch device colors error:', error);
    return NextResponse.json({ error: 'Failed to fetch device colors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, color_code } = await request.json();
    
    if (!name || !color_code) {
      return NextResponse.json({ error: 'Name and color code are required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO device_colors (name, color_code, company_id) VALUES ($1, $2, $3) RETURNING *',
      [name, color_code, session.company.id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Create device color error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Device color already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create device color' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, color_code } = await request.json();
    
    if (!id || !name || !color_code) {
      return NextResponse.json({ error: 'ID, name and color code are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE device_colors SET name = $1, color_code = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND company_id = $4 RETURNING *',
      [name, color_code, id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Update device color error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Device color already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update device color' }, { status: 500 });
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

    const result = await pool.query(
      'DELETE FROM device_colors WHERE id = $1 AND company_id = $2 RETURNING *',
      [id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Color not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error('Delete device color error:', error);
    return NextResponse.json({ error: 'Failed to delete device color' }, { status: 500 });
  }
}
