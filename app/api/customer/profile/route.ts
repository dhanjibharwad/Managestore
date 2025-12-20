import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest) {
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
      'SELECT * FROM customers WHERE user_id = $1 AND company_id = $2',
      [session.user.id, session.company.id]
    );

    if (customerResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Customer profile not found' },
        { status: 404 }
      );
    }

    const customer = customerResult.rows[0];

    return NextResponse.json({
      customer: {
        customer_name: customer.customer_name,
        mobile_number: customer.mobile_number,
        phone_number: customer.phone_number,
        address_line: customer.address_line,
        region_state: customer.region_state,
        city_town: customer.city_town,
        postal_code: customer.postal_code
      }
    });

  } catch (error) {
    console.error('Get customer profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer profile' },
      { status: 500 }
    );
  }
}