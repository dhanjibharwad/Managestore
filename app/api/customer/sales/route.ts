import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.company || session.user.role !== 'customer') {
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

    // Fetch sales for this customer
    const query = `
      SELECT s.*, 
             COALESCE(c.customer_name, s.customer_name) as actual_customer_name,
             STRING_AGG(DISTINCT COALESCE(p.part_name, si.description), ', ') as parts
      FROM sales s 
      LEFT JOIN customers c ON (c.id::text = s.customer_name OR c.customer_name = s.customer_name) AND c.company_id = $1
      LEFT JOIN sale_items si ON si.sale_id = s.id
      LEFT JOIN parts p ON p.id = si.part_id AND p.company_id = $1
      WHERE s.company_id = $1 
      AND (s.customer_name = $2 OR s.customer_name = $3)
      GROUP BY s.id, c.customer_name
      ORDER BY s.created_at DESC
    `;

    const result = await pool.query(query, [
      session.company.id, 
      customer.customer_name, 
      customer.id.toString()
    ]);

    // Format the data for frontend
    const sales = result.rows.map(sale => {
      const totalAmount = parseFloat(sale.grand_total || 0);
      // For now, assume payment_received is 0 since we don't have payments table
      // This can be updated when payments functionality is added
      const paymentReceived = 0;
      const paymentRemaining = totalAmount - paymentReceived;
      
      return {
        id: sale.id,
        saleNumber: sale.sale_number,
        customerName: sale.actual_customer_name,
        parts: sale.parts || 'No parts',
        totalAmount: totalAmount,
        paymentReceived: paymentReceived,
        paymentRemaining: paymentRemaining,
        paymentStatus: sale.payment_status,
        saleDate: sale.sale_date,
        createdAt: sale.created_at
      };
    });

    return NextResponse.json({ sales });

  } catch (error) {
    console.error('Get customer sales error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales' },
      { status: 500 }
    );
  }
}