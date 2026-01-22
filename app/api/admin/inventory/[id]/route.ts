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
    const companyId = session.company.id;

    const result = await pool.query(
      'SELECT * FROM inventory_parts WHERE part_id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    return NextResponse.json({ part: result.rows[0] });
  } catch (error) {
    console.error('Get part error:', error);
    return NextResponse.json({ error: 'Failed to get part' }, { status: 500 });
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
    const companyId = session.company.id;
    const body = await request.json();
    
    const {
      part_name,
      purchase_price,
      selling_price,
      tax,
      warranty,
      current_stock,
      low_stock_units,
      hsn_code,
      part_description,
      rate_including_tax,
      manage_stock,
      low_stock_alert
    } = body;

    const partCheck = await pool.query(
      'SELECT part_id FROM inventory_parts WHERE part_id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (partCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    const result = await pool.query(
      `UPDATE inventory_parts SET 
        part_name = $1, 
        purchase_price = $2, 
        selling_price = $3, 
        tax = $4, 
        warranty = $5, 
        current_stock = $6, 
        low_stock_units = $7, 
        hsn_code = $8, 
        part_description = $9, 
        rate_including_tax = $10, 
        manage_stock = $11, 
        low_stock_alert = $12,
        updated_at = NOW() 
      WHERE part_id = $13 AND company_id = $14 RETURNING *`,
      [
        part_name, purchase_price, selling_price, tax, warranty,
        current_stock, low_stock_units, hsn_code, part_description,
        rate_including_tax, manage_stock, low_stock_alert, id, companyId
      ]
    );

    return NextResponse.json({ part: result.rows[0] });
  } catch (error) {
    console.error('Update part error:', error);
    return NextResponse.json({ error: 'Failed to update part' }, { status: 500 });
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
    const companyId = session.company.id;

    const partCheck = await pool.query(
      'SELECT part_id FROM inventory_parts WHERE part_id = $1 AND company_id = $2',
      [id, companyId]
    );

    if (partCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Part not found' }, { status: 404 });
    }

    await pool.query(
      'DELETE FROM inventory_parts WHERE part_id = $1 AND company_id = $2',
      [id, companyId]
    );

    return NextResponse.json({ message: 'Part deleted successfully' });
  } catch (error) {
    console.error('Delete part error:', error);
    return NextResponse.json({ error: 'Failed to delete part' }, { status: 500 });
  }
}