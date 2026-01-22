import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get customer info from session
    const customerResult = await pool.query(
      'SELECT * FROM customers WHERE user_id = $1 AND company_id = $2',
      [session.user.id, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    // Build query to get AMC contracts for this customer
    let query = `
      SELECT 
        ac.*,
        c.customer_name as customer_display_name,
        e.employee_name as assignee_display_name
      FROM amc_contracts ac
      LEFT JOIN customers c ON ac.customer_name = c.id::varchar AND c.company_id = $1
      LEFT JOIN employees e ON ac.assignee = e.id::varchar AND e.company_id = $1
      WHERE ac.company_id = $1 AND (ac.customer_name = $2 OR c.customer_name = $3)
    `;
    
    const params: any[] = [session.company.id, customer.id.toString(), customer.customer_name];
    let paramCount = 3;

    if (search && search !== '') {
      paramCount++;
      query += ` AND (ac.contract_number ILIKE $${paramCount} OR c.customer_name ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY ac.created_at DESC';

    const result = await pool.query(query, params);

    return NextResponse.json({ 
      contracts: result.rows 
    });

  } catch (error) {
    console.error('Get customer AMCs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}