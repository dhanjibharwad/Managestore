import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceTypeId = searchParams.get('device_type_id');
    const companyId = session.company.id;
    
    let query = 'SELECT * FROM device_brands WHERE company_id = $1';
    const params: any[] = [companyId];
    
    if (deviceTypeId) {
      query += ' AND device_type_id = $2';
      params.push(deviceTypeId);
    }
    
    query += ' ORDER BY name';
    
    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch brands error:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, device_type_id } = await request.json();
    const companyId = session.company.id;
    
    const result = await pool.query(
      'INSERT INTO device_brands (name, device_type_id, company_id) VALUES ($1, $2, $3) RETURNING *',
      [name, device_type_id, companyId]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Create brand error:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, name, device_type_id } = await request.json();
    const companyId = session.company.id;
    
    const result = await pool.query(
      'UPDATE device_brands SET name = $1, device_type_id = $2, updated_at = NOW() WHERE id = $3 AND company_id = $4 RETURNING *',
      [name, device_type_id, id, companyId]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Update brand error:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
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
    const companyId = session.company.id;
    
    // Check if brand has associated models
    const modelsCheck = await pool.query(
      'SELECT COUNT(*) FROM device_models WHERE device_brand_id = $1 AND company_id = $2',
      [id, companyId]
    );
    
    if (parseInt(modelsCheck.rows[0].count) > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete brand with associated models' 
      }, { status: 400 });
    }
    
    await pool.query(
      'DELETE FROM device_brands WHERE id = $1 AND company_id = $2',
      [id, companyId]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete brand error:', error);
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
}
