import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    const purchaseId = searchParams.get('purchaseId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    // If purchaseId is provided, return single purchase with items
    if (purchaseId) {
      const purchaseResult = await pool.query(
        `SELECT p.*, comp.company_name 
         FROM purchases p
         LEFT JOIN companies comp ON comp.id = p.company_id
         WHERE p.id = $1 AND p.company_id = $2`,
        [purchaseId, companyId]
      );

      if (purchaseResult.rows.length === 0) {
        return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
      }

      const itemsResult = await pool.query(
        'SELECT * FROM purchase_items WHERE purchase_id = $1 AND company_id = $2',
        [purchaseId, companyId]
      );

      return NextResponse.json({
        purchase: purchaseResult.rows[0],
        items: itemsResult.rows
      });
    }

    // Otherwise return all purchases
    const result = await pool.query(
      `SELECT 
        p.id,
        p.purchase_number,
        p.supplier_name,
        p.party_invoice_number,
        p.purchase_date,
        p.due_date,
        p.payment_status,
        p.amount,
        p.attachments,
        COALESCE(SUM(pi.total), 0) as total_amount
      FROM purchases p
      LEFT JOIN purchase_items pi ON p.id = pi.purchase_id
      WHERE p.company_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC`,
      [companyId]
    );

    return NextResponse.json({ purchases: result.rows });
  } catch (error: any) {
    console.error('Fetch purchases error:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await req.json();
    const {
      companyId,
      purchaseNumber,
      supplierName,
      partyInvoiceNumber,
      purchaseDate,
      dueDate,
      paymentStatus,
      paymentMode,
      amount,
      termsConditions,
      attachments,
      items
    } = body;

    // Validation
    if (!companyId || !supplierName || !purchaseDate || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Insert purchase
    const purchaseResult = await client.query(
      `INSERT INTO purchases (
        company_id, purchase_number, supplier_name, party_invoice_number,
        purchase_date, due_date, payment_status, payment_mode, amount,
        terms_conditions, attachments
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id`,
      [
        companyId,
        purchaseNumber,
        supplierName,
        partyInvoiceNumber || null,
        purchaseDate,
        dueDate || null,
        paymentStatus || 'unpaid',
        paymentMode || null,
        amount || null,
        termsConditions || null,
        attachments ? JSON.stringify(attachments) : null
      ]
    );

    const purchaseId = purchaseResult.rows[0].id;

    // Insert purchase items with backend recalculation
    for (const item of items) {
      const qty = parseFloat(item.qty) || 0;
      const price = parseFloat(item.price) || 0;
      const disc = parseFloat(item.disc) || 0;
      const taxRate = parseFloat(item.tax) || 0;

      // Backend recalculation
      const subtotal = (price * qty) - disc;
      const taxAmount = (subtotal * taxRate) / 100;
      const total = subtotal + taxAmount;

      await client.query(
        `INSERT INTO purchase_items (
          company_id, purchase_id, part_name, description, warranty, tax_code,
          quantity, price, discount, tax_rate, tax_amount, subtotal, total,
          rate_including_tax
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          companyId,
          purchaseId,
          item.description,
          item.description,
          item.warranty || null,
          item.taxCode || null,
          qty,
          price,
          disc,
          taxRate,
          taxAmount,
          subtotal,
          total,
          item.rateIncludingTax || false
        ]
      );
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true, purchaseId });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Purchase creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create purchase' }, { status: 500 });
  } finally {
    client.release();
  }
}
