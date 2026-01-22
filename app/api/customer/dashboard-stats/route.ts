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

    // Get active jobs count (Pending and In Progress)
    const activeJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE company_id = $1 AND (customer_id = $2 OR customer_name = $3) 
       AND status IN ('Pending', 'In Progress')`,
      [session.company.id, customer.id, customer.customer_name]
    );

    // Get completed jobs count
    const completedJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE company_id = $1 AND (customer_id = $2 OR customer_name = $3) 
       AND status = 'Completed'`,
      [session.company.id, customer.id, customer.customer_name]
    );

    // Get pending payments count from sales
    const pendingPaymentsResult = await pool.query(
      `SELECT COUNT(*) as count FROM sales 
       WHERE company_id = $1 AND (customer_name = $2 OR customer_name = $3) 
       AND payment_status = 'unpaid'`,
      [session.company.id, customer.customer_name, customer.id.toString()]
    );

    // Get total spent amount from sales
    const totalSpentResult = await pool.query(
      `SELECT COALESCE(SUM(grand_total), 0) as total FROM sales 
       WHERE company_id = $1 AND (customer_name = $2 OR customer_name = $3)`,
      [session.company.id, customer.customer_name, customer.id.toString()]
    );

    const stats = {
      activeJobs: parseInt(activeJobsResult.rows[0].count),
      completedJobs: parseInt(completedJobsResult.rows[0].count),
      pendingPayments: parseInt(pendingPaymentsResult.rows[0].count),
      totalSpent: `₹${Math.round(parseFloat(totalSpentResult.rows[0].total)).toLocaleString('en-IN')}`
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching customer dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}