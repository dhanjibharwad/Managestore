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

    const customerId = session.user.id;

    // Get active jobs count
    const activeJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE customer_id = $1 AND status IN ('Open', 'In Progress')`,
      [customerId]
    );

    // Get completed jobs count
    const completedJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE customer_id = $1 AND status = 'Completed'`,
      [customerId]
    );

    // Get pending payments count (assuming from sales table)
    const pendingPaymentsResult = await pool.query(
      `SELECT COUNT(*) as count FROM sales 
       WHERE customer_id = $1 AND payment_status = 'Pending'`,
      [customerId]
    );

    // Get total spent amount
    const totalSpentResult = await pool.query(
      `SELECT COALESCE(SUM(total_amount), 0) as total FROM sales 
       WHERE customer_id = $1 AND payment_status = 'Paid'`,
      [customerId]
    );

    const stats = {
      activeJobs: parseInt(activeJobsResult.rows[0].count),
      completedJobs: parseInt(completedJobsResult.rows[0].count),
      pendingPayments: parseInt(pendingPaymentsResult.rows[0].count),
      totalSpent: `₹${parseFloat(totalSpentResult.rows[0].total).toLocaleString('en-IN')}`
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