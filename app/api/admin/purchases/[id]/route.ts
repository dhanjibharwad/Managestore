import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: purchaseId } = await params;
    const body = await request.json();
    const {
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

    if (!supplierName || !purchaseDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Update purchase
    const updateResult = await client.query(
      `UPDATE purchases SET 
        purchase_number = $1,
        supplier_name = $2,
        party_invoice_number = $3,
        purchase_date = $4,
        due_date = $5,
        payment_status = $6,
        payment_mode = $7,
        amount = $8,
        terms_conditions = $9,
        attachments = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11 AND company_id = $12
      RETURNING id`,
      [
        purchaseNumber,
        supplierName,
        partyInvoiceNumber || null,
        purchaseDate,
        dueDate || null,
        paymentStatus || 'unpaid',
        paymentMode || null,
        amount || null,
        termsConditions || null,
        attachments ? JSON.stringify(attachments) : null,
        purchaseId,
        session.company.id
      ]
    );

    if (updateResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    // Delete existing items
    await client.query(
      'DELETE FROM purchase_items WHERE purchase_id = $1 AND company_id = $2',
      [purchaseId, session.company.id]
    );

    // Insert updated items
    if (items && items.length > 0) {
      for (const item of items) {
        const qty = parseFloat(item.qty) || 0;
        const price = parseFloat(item.price) || 0;
        const disc = parseFloat(item.disc) || 0;
        const taxRate = parseFloat(item.tax) || 0;

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
            session.company.id,
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
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Purchase update error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update purchase' }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: purchaseId } = await params;
    
    // Delete the purchase
    const result = await pool.query(
      'DELETE FROM purchases WHERE id = $1 AND company_id = $2 RETURNING *',
      [purchaseId, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase deleted successfully' 
    });

  } catch (error) {
    console.error('Delete purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase' },
      { status: 500 }
    );
  }
}