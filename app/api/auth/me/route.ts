import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let customerName = null;
    
    // If user is a customer, fetch their customer name
    if (session.user.role === 'customer' && session.company?.id) {
      const customerResult = await pool.query(
        'SELECT customer_name FROM customers WHERE user_id = $1 AND company_id = $2',
        [session.user.id, session.company.id]
      );
      
      if (customerResult.rows.length > 0) {
        customerName = customerResult.rows[0].customer_name;
      }
    }

    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
        companyId: session.company?.id || null,
        company: session.company?.name || 'System Admin',
        customerName: customerName,
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
}