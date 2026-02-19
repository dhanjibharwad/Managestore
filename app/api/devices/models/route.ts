import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceBrandId = searchParams.get('device_brand_id');
    const companyId = session.company.id;
    
    let query = 'SELECT * FROM device_models WHERE company_id = $1';
    const params: any[] = [companyId];
    
    if (deviceBrandId) {
      query += ' AND device_brand_id = $2';
      params.push(deviceBrandId);
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch models error:', error);
    return NextResponse.json({ error: 'Failed to fetch models' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, device_brand_id } = await request.json();
    const companyId = session.company.id;
    
    const result = await pool.query(
      'INSERT INTO device_models (name, device_brand_id, company_id) VALUES ($1, $2, $3) RETURNING *',
      [name, device_brand_id, companyId]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create model error:', error);
    return NextResponse.json({ error: 'Failed to create model' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, device_brand_id } = await request.json();
    const companyId = session.company.id;
    
    const result = await pool.query(
      'UPDATE device_models SET name = $1, device_brand_id = $2, updated_at = NOW() WHERE id = $3 AND company_id = $4 RETURNING *',
      [name, device_brand_id, id, companyId]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update model error:', error);
    return NextResponse.json({ error: 'Failed to update model' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const companyId = session.company.id;
    
    await pool.query(
      'DELETE FROM device_models WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete model error:', error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
