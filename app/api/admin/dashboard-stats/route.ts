import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const companyId = session.company.id;

    // Get payment received (from sales with paid status)
    const paymentReceivedResult = await pool.query(
      `SELECT COALESCE(SUM(grand_total), 0) as total FROM sales 
       WHERE company_id = $1 AND payment_status = 'paid'`,
      [companyId]
    );

    // Get total expenses
    const totalExpenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total FROM expenses 
       WHERE company_id = $1`,
      [companyId]
    );

    // Get total business (all sales)
    const totalBusinessResult = await pool.query(
      `SELECT COALESCE(SUM(grand_total), 0) as total FROM sales 
       WHERE company_id = $1`,
      [companyId]
    );

    // Get total due amount (unpaid sales)
    const totalDueResult = await pool.query(
      `SELECT COALESCE(SUM(grand_total), 0) as total FROM sales 
       WHERE company_id = $1 AND payment_status = 'unpaid'`,
      [companyId]
    );

    const paymentReceived = parseFloat(paymentReceivedResult.rows[0].total);
    const totalExpense = parseFloat(totalExpenseResult.rows[0].total);
    const totalBusiness = parseFloat(totalBusinessResult.rows[0].total);
    const totalDue = parseFloat(totalDueResult.rows[0].total);
    const netProfit = paymentReceived - totalExpense;

    const stats = {
      paymentReceived: `₹${Math.round(paymentReceived).toLocaleString('en-IN')}`,
      totalExpense: `₹${Math.round(totalExpense).toLocaleString('en-IN')}`,
      totalBusiness: `₹${Math.round(totalBusiness).toLocaleString('en-IN')}`,
      totalDue: `₹${Math.round(totalDue).toLocaleString('en-IN')}`,
      netProfit: `₹${Math.round(netProfit).toLocaleString('en-IN')}`
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}