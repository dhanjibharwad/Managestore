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
      'SELECT id, name, is_default, created_at, updated_at FROM storage_locations WHERE company_id = $1 ORDER BY name',
      [session.company.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch storage locations error:', error);
    return NextResponse.json({ error: 'Failed to fetch storage locations' }, { status: 500 });
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
      'INSERT INTO storage_locations (name, company_id, is_default) VALUES ($1, $2, false) RETURNING *',
      [name, session.company.id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Create storage location error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Storage location already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create storage location' }, { status: 500 });
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
      'UPDATE storage_locations SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND company_id = $3 RETURNING *',
      [name, id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Storage location not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Update storage location error:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Storage location name already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update storage location' }, { status: 500 });
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
      'DELETE FROM storage_locations WHERE id = $1 AND company_id = $2 RETURNING *',
      [id, session.company.id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Storage location not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Storage location deleted successfully' });
  } catch (error) {
    console.error('Delete storage location error:', error);
    return NextResponse.json({ error: 'Failed to delete storage location' }, { status: 500 });
  }
}
