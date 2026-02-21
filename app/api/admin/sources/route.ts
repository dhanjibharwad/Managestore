import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT id, name, created_at, updated_at FROM sources WHERE company_id = $1 ORDER BY name ASC',
      [session.company.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Source name is required' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO sources (company_id, name) VALUES ($1, $2) RETURNING id, name',
      [session.company.id, name.trim()]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error: any) {
    console.error('Error creating source:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Source already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name } = await req.json();

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: 'Source ID and name are required' }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE sources SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND company_id = $3 RETURNING id, name',
      [name.trim(), id, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error updating source:', error);
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Source already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to update source' }, { status: 500 });
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
      return NextResponse.json({ error: 'Source ID is required' }, { status: 400 });
    }

    const result = await pool.query(
      'DELETE FROM sources WHERE id = $1 AND company_id = $2 RETURNING id',
      [id, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Source not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting source:', error);
    return NextResponse.json({ error: 'Failed to delete source' }, { status: 500 });
  }
}
