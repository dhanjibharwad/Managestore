import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Check company invites first (for approved companies)
    const companyInviteResult = await pool.query(
      `SELECT ci.id, ci.email, c.company_name, c.owner_name 
       FROM company_invites ci
       JOIN companies c ON ci.company_id = c.id
       WHERE ci.token = $1 AND ci.expires_at > NOW()`,
      [token]
    );

    if (companyInviteResult.rows.length > 0) {
      const invite = companyInviteResult.rows[0];
      return NextResponse.json({
        customer: {
          customer_name: invite.owner_name,
          email_id: invite.email,
          mobile_number: ''
        },
        type: 'company'
      });
    }

    // Check customer invites
    const customerResult = await pool.query(
      `SELECT id, customer_name, email_id, mobile_number, company_id 
       FROM customers 
       WHERE invitation_token = $1`,
      [token]
    );

    if (customerResult.rows.length > 0) {
      const customer = customerResult.rows[0];
      return NextResponse.json({
        customer: {
          customer_name: customer.customer_name,
          email_id: customer.email_id,
          mobile_number: customer.mobile_number
        },
        type: 'customer'
      });
    }

    // Check employee invites
    const employeeResult = await pool.query(
      `SELECT id, employee_name, email_id, mobile_number, company_id 
       FROM employees 
       WHERE invitation_token = $1`,
      [token]
    );

    if (employeeResult.rows.length > 0) {
      const employee = employeeResult.rows[0];
      return NextResponse.json({
        customer: {
          customer_name: employee.employee_name,
          email_id: employee.email_id,
          mobile_number: employee.mobile_number
        },
        type: 'employee'
      });
    }

    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 404 }
    );

  } catch (error) {
    console.error('Invite data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invite data' },
      { status: 500 }
    );
  }
}