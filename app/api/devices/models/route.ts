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
    
    if (!session || !session.company) {
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
    
    if (!session || !session.company) {
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
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const companyId = session.company.id;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Check if model is referenced in jobs
    const jobsCheck = await pool.query(
      "SELECT COUNT(*) FROM jobs WHERE device_model = $1::text AND company_id = $2",
      [id, companyId]
    );
    
    if (parseInt(jobsCheck.rows[0].count) > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete model with associated jobs' 
      }, { status: 400 });
    }
    
    const result = await pool.query(
      'DELETE FROM device_models WHERE id = $1 AND company_id = $2 RETURNING *',
      [id, companyId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Model not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete model error:', error);
    return NextResponse.json({ error: 'Failed to delete model' }, { status: 500 });
  }
}
