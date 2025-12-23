import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await req.json();
    const {
      companyId,
      saleNumber,
      customerName,
      saleDate,
      referredBy,
      paymentStatus,
      termsConditions,
      sendMail,
      sendSms,
      items
    } = body;

    if (!companyId || !saleNumber || !customerName || !saleDate || !items || items.length === 0) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => sum + parseFloat(item.subTotal), 0);
    const totalDiscount = items.reduce((sum: number, item: any) => sum + parseFloat(item.disc), 0);
    const totalTax = items.reduce((sum: number, item: any) => sum + parseFloat(item.taxAmt), 0);
    const grandTotal = items.reduce((sum: number, item: any) => sum + parseFloat(item.total), 0);

    // Insert sale
    const saleQuery = `
      INSERT INTO sales (
        company_id, sale_number, customer_name, sale_date, referred_by,
        payment_status, terms_conditions, send_mail, send_sms,
        subtotal, total_discount, total_tax, grand_total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const saleValues = [
      companyId, saleNumber, customerName, saleDate, referredBy,
      paymentStatus, termsConditions, sendMail, sendSms,
      subtotal, totalDiscount, totalTax, grandTotal
    ];

    const saleResult = await client.query(saleQuery, saleValues);
    const saleId = saleResult.rows[0].id;

    // Insert sale items
    for (const item of items) {
      const itemQuery = `
        INSERT INTO sale_items (
          sale_id, part_id, description, tax_code, quantity, price,
          discount, tax_rate, tax_amount, subtotal, total
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `;

      const itemValues = [
        saleId,
        item.partId || null,
        item.description,
        item.taxCode,
        item.qty,
        item.price,
        item.disc,
        item.tax,
        item.taxAmt,
        item.subTotal,
        item.total
      ];

      await client.query(itemQuery, itemValues);
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      sale: saleResult.rows[0]
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    const query = companyId
      ? 'SELECT * FROM sales WHERE company_id = $1 ORDER BY created_at DESC'
      : 'SELECT * FROM sales ORDER BY created_at DESC';

    const result = companyId
      ? await pool.query(query, [companyId])
      : await pool.query(query);

    return NextResponse.json({ sales: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
