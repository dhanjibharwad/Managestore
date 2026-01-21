import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
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

    if (!saleNumber || !customerName || !saleDate || !items || items.length === 0) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

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
      session.company.id, saleNumber, customerName, saleDate, referredBy,
      paymentStatus, termsConditions, sendMail, sendSms,
      subtotal, totalDiscount, totalTax, grandTotal
    ];

    const saleResult = await pool.query(saleQuery, saleValues);
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

      await pool.query(itemQuery, itemValues);
    }

    return NextResponse.json({
      success: true,
      sale: saleResult.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const query = `SELECT s.*, 
               COALESCE(c.customer_name, s.customer_name) as customer_name,
               STRING_AGG(DISTINCT COALESCE(p.part_name, si.description), ', ') as parts
         FROM sales s 
         LEFT JOIN customers c ON (c.customer_id = s.customer_name OR c.id::text = s.customer_name) AND c.company_id = $1
         LEFT JOIN sale_items si ON si.sale_id = s.id
         LEFT JOIN parts p ON p.id = si.part_id AND p.company_id = $1
         WHERE s.company_id = $1 
         GROUP BY s.id, c.customer_name
         ORDER BY s.created_at DESC`;

    const result = await pool.query(query, [session.company.id]);

    return NextResponse.json({ sales: result.rows });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}
