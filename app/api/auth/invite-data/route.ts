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

    // Check company invites
    const companyInviteResult = await pool.query(
      `SELECT c.id, c.company_name, c.email, c.phone, c.country, c.company_owner_name
       FROM company_invites ci
       JOIN companies c ON ci.company_id = c.id
       WHERE ci.token = $1`,
      [token]
    );

    if (companyInviteResult.rows.length > 0) {
      const company = companyInviteResult.rows[0];
      return NextResponse.json({
        customer: {
          customer_name: company.company_owner_name || company.company_name,
          email_id: company.email,
          mobile_number: company.phone || ''
        }
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
        }
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
        }
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
