import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    const result = await pool.query(
      `SELECT 
        q.id,
        q.quotation_number,
        q.customer_name,
        q.expired_on,
        q.total_amount,
        q.created_at
      FROM quotations q
      WHERE q.company_id = $1
      ORDER BY q.created_at DESC`,
      [companyId]
    );

    return NextResponse.json({ quotations: result.rows });
  } catch (error: any) {
    console.error('Fetch quotations error:', error);
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  
  try {
    const body = await req.json();
    const {
      companyId,
      quotationNumber,
      customerName,
      expiredOn,
      note,
      termsConditions,
      services,
      parts
    } = body;

    // Validation
    if (!companyId || !customerName || !quotationNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Calculate total amount
    let totalAmount = 0;
    
    if (services) {
      services.forEach((s: any) => totalAmount += parseFloat(s.total) || 0);
    }
    if (parts) {
      parts.forEach((p: any) => totalAmount += parseFloat(p.total) || 0);
    }

    // Insert quotation
    const quotationResult = await client.query(
      `INSERT INTO quotations (
        company_id, quotation_number, customer_name, expired_on,
        note, terms_conditions, total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id`,
      [
        companyId,
        quotationNumber,
        customerName,
        expiredOn || null,
        note || null,
        termsConditions || null,
        totalAmount
      ]
    );

    const quotationId = quotationResult.rows[0].id;

    // Insert services
    if (services && services.length > 0) {
      for (const service of services) {
        const price = parseFloat(service.price) || 0;
        const disc = parseFloat(service.disc) || 0;
        const taxRate = parseFloat(service.tax) || 0;

        const subtotal = price - disc;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;

        await client.query(
          `INSERT INTO quotation_services (
            company_id, quotation_id, service_name, description,
            price, discount, subtotal, tax_code, tax_rate, tax_amount, total,
            rate_including_tax
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            companyId,
            quotationId,
            service.serviceName,
            service.description || null,
            price,
            disc,
            subtotal,
            service.taxCode || null,
            taxRate,
            taxAmount,
            total,
            service.rateIncludingTax || false
          ]
        );
      }
    }

    // Insert parts
    if (parts && parts.length > 0) {
      for (const part of parts) {
        const price = parseFloat(part.price) || 0;
        const qty = parseFloat(part.qty) || 0;
        const disc = parseFloat(part.disc) || 0;
        const taxRate = parseFloat(part.tax) || 0;

        const subtotal = (price * qty) - disc;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;

        await client.query(
          `INSERT INTO quotation_parts (
            company_id, quotation_id, part_name, serial_number, description, warranty,
            quantity, price, discount, subtotal, tax_code, tax_rate, tax_amount, total,
            rate_including_tax
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
          [
            companyId,
            quotationId,
            part.description,
            part.serialNumber || null,
            part.description || null,
            part.warranty || null,
            qty,
            price,
            disc,
            subtotal,
            part.taxCode || null,
            taxRate,
            taxAmount,
            total,
            part.rateIncludingTax || false
          ]
        );
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({ success: true, quotationId });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Quotation creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create quotation' }, { status: 500 });
  } finally {
    client.release();
  }
}
