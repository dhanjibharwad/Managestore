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
    const quotationId = parseInt(id);
    
    if (isNaN(quotationId)) {
      return NextResponse.json({ error: 'Invalid quotation ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Get the quotation
    const quotationResult = await pool.query(
      'SELECT * FROM quotations WHERE id = $1 AND company_id = $2',
      [quotationId, companyId]
    );

    if (quotationResult.rows.length === 0) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
    }

    const quotation = quotationResult.rows[0];

    // Get services
    const servicesResult = await pool.query(
      'SELECT * FROM quotation_services WHERE quotation_id = $1',
      [quotationId]
    );

    // Get parts
    const partsResult = await pool.query(
      'SELECT * FROM quotation_parts WHERE quotation_id = $1',
      [quotationId]
    );

    return NextResponse.json({
      quotation,
      services: servicesResult.rows,
      parts: partsResult.rows
    });
  } catch (error) {
    console.error('Get quotation error:', error);
    return NextResponse.json({ error: 'Failed to get quotation' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const quotationId = parseInt(id);
    
    if (isNaN(quotationId)) {
      return NextResponse.json({ error: 'Invalid quotation ID' }, { status: 400 });
    }

    const companyId = session.company.id;
    const body = await request.json();
    
    const {
      customerName,
      expiredOn,
      note,
      termsConditions,
      services,
      parts
    } = body;

    // Check if quotation exists and belongs to the company
    const quotationCheck = await client.query(
      'SELECT id FROM quotations WHERE id = $1 AND company_id = $2',
      [quotationId, companyId]
    );

    if (quotationCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Quotation not found' }, { status: 404 });
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

    // Update quotation
    await client.query(
      `UPDATE quotations SET 
        customer_name = $1, 
        expired_on = $2, 
        note = $3, 
        terms_conditions = $4,
        total_amount = $5,
        updated_at = NOW()
      WHERE id = $6 AND company_id = $7`,
      [customerName, expiredOn, note, termsConditions, totalAmount, quotationId, companyId]
    );

    // Delete existing services and parts
    await client.query('DELETE FROM quotation_services WHERE quotation_id = $1', [quotationId]);
    await client.query('DELETE FROM quotation_parts WHERE quotation_id = $1', [quotationId]);

    // Insert updated services
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

    // Insert updated parts
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
    return NextResponse.json({ message: 'Quotation updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Update quotation error:', error);
    return NextResponse.json({ error: 'Failed to update quotation' }, { status: 500 });
  } finally {
    client.release();
  }
}