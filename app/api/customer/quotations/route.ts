import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get customer details linked to this user
    const customerResult = await pool.query(
      'SELECT id, customer_name FROM customers WHERE user_id = $1 AND company_id = $2',
      [session.user.id, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];

    // Get quotations for this customer
    const result = await pool.query(
      `SELECT 
        q.id,
        q.quotation_number,
        q.customer_name,
        q.expired_on,
        q.total_amount,
        q.note,
        q.created_at,
        q.created_by,
        COALESCE(q.status, 'pending') as status,
        COALESCE(q.approved_rejected_by, '') as approved_rejected_by,
        c.customer_name as customer_display_name,
        COALESCE(
          (SELECT SUM(qs.tax_amount) FROM quotation_services qs WHERE qs.quotation_id = q.id), 0
        ) + COALESCE(
          (SELECT SUM(qp.tax_amount) FROM quotation_parts qp WHERE qp.quotation_id = q.id), 0
        ) as tax_amount
      FROM quotations q
      LEFT JOIN customers c ON q.customer_name = c.id::text
      WHERE q.company_id = $1 AND (q.customer_name = $2 OR q.customer_name = $3)
      ORDER BY q.created_at DESC`,
      [session.company.id, customer.id.toString(), customer.customer_name]
    );

    return NextResponse.json({ quotations: result.rows });
  } catch (error) {
    console.error('Error fetching customer quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'customer') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { quotationId, action } = body;

    if (!quotationId || !action || !['approved', 'rejected'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid quotation ID or action' },
        { status: 400 }
      );
    }

    // Get customer details
    const customerResult = await pool.query(
      'SELECT id, customer_name FROM customers WHERE user_id = $1 AND company_id = $2',
      [session.user.id, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];

    // Update quotation status
    const result = await pool.query(
      `UPDATE quotations 
       SET status = $1, approved_rejected_by = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND company_id = $4 AND (customer_name = $5 OR customer_name = $6)
       RETURNING id`,
      [action, customer.customer_name, quotationId, session.company.id, customer.id.toString(), customer.customer_name]
    ).catch(async (error) => {
      // If columns don't exist, try to add them first
      if (error.code === '42703') {
        await pool.query(`
          ALTER TABLE quotations 
          ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending',
          ADD COLUMN IF NOT EXISTS approved_rejected_by VARCHAR(255)
        `);
        // Retry the update
        return pool.query(
          `UPDATE quotations 
           SET status = $1, approved_rejected_by = $2, updated_at = CURRENT_TIMESTAMP
           WHERE id = $3 AND company_id = $4 AND (customer_name = $5 OR customer_name = $6)
           RETURNING id`,
          [action, customer.customer_name, quotationId, session.company.id, customer.id.toString(), customer.customer_name]
        );
      }
      throw error;
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Quotation not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 }
    );
  }
}