import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'storemanager',
  port: parseInt(process.env.DB_PORT || '5432')
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();
  try {
    const saleId = parseInt(id);
    if (isNaN(saleId)) {
      return NextResponse.json({ error: 'Invalid sale ID' }, { status: 400 });
    }

    // Get sale with customer details
    const saleQuery = `
      SELECT s.*, 
             COALESCE(c.customer_name, s.customer_name) as customer_name,
             c.mobile_number, 
             c.email_id, 
             '' as address, 
             '' as tax_number,
             comp.company_name
      FROM sales s 
      LEFT JOIN customers c ON (c.id::text = s.customer_name OR c.customer_name = s.customer_name)
      LEFT JOIN companies comp ON comp.id = s.company_id
      WHERE s.id = $1
    `;
    const saleResult = await client.query(saleQuery, [saleId]);

    if (saleResult.rows.length === 0) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    const sale = saleResult.rows[0];

    // Get sale items
    const itemsQuery = 'SELECT * FROM sale_items WHERE sale_id = $1';
    const itemsResult = await client.query(itemsQuery, [saleId]);

    const formattedSale = {
      id: sale.id,
      sale_number: sale.sale_number,
      customer_name: sale.customer_name || 'Unknown Customer',
      customer_phone: sale.mobile_number || '',
      customer_email: sale.email_id || '',
      customer_address: sale.address || '',
      customer_tax_no: sale.tax_number || '',
      company_name: sale.company_name || '',
      sale_date: sale.sale_date,
      payment_status: sale.payment_status,
      grand_total: parseFloat(sale.grand_total || 0),
      subtotal: parseFloat(sale.subtotal || 0),
      total_tax: parseFloat(sale.total_tax || 0),
      items: itemsResult.rows.map((item: any) => ({
        id: item.id.toString(),
        description: item.description || '',
        taxCode: item.tax_code || '',
        qty: parseFloat(item.quantity || item.qty || 0),
        price: parseFloat(item.price || 0),
        disc: parseFloat(item.discount || item.disc || 0),
        tax: parseFloat(item.tax_rate || item.tax || 0),
        taxAmt: parseFloat(item.tax_amount || item.tax_amt || 0),
        subTotal: parseFloat(item.subtotal || item.sub_total || 0),
        total: parseFloat(item.total || 0)
      }))
    };

    return NextResponse.json({ sale: formattedSale });
  } catch (error) {
    console.error('Error fetching sale:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const client = await pool.connect();
  try {
    const saleId = parseInt(id);
    if (isNaN(saleId)) {
      return NextResponse.json({ error: 'Invalid sale ID' }, { status: 400 });
    }

    // Delete sale items first
    await client.query('DELETE FROM sale_items WHERE sale_id = $1', [saleId]);
    
    // Delete sale
    const result = await client.query('DELETE FROM sales WHERE id = $1 RETURNING *', [saleId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting sale:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    client.release();
  }
}