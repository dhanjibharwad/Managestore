import { NextResponse } from 'next/server';
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
        c.customer_name as customer_display_name,
        COALESCE(
          (SELECT SUM(qs.tax_amount) FROM quotation_services qs WHERE qs.quotation_id = q.id), 0
        ) + COALESCE(
          (SELECT SUM(qp.tax_amount) FROM quotation_parts qp WHERE qp.quotation_id = q.id), 0
        ) as tax_amount,
        'pending' as status,
        q.created_by as created_by,
        '' as approved_rejected_by
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