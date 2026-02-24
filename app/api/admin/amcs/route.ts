import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const {
      contractNumber,
      customerName,
      assignee,
      amcType,
      contractStartDate,
      contractEndDate,
      devicesCovered,
      responseTimeValue,
      responseTimeUnit,
      numberOfServices,
      serviceOptions,
      autoRenew,
      paymentFrequency,
      amount,
      contractRemark,
      termsConditions,
      images
    } = body;

    // Validation
    if (!contractNumber || !customerName || !assignee || !amcType || !contractStartDate || !contractEndDate) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const query = `
      INSERT INTO amc_contracts (
        company_id, contract_number, customer_name, assignee, amc_type, contract_start_date, contract_end_date,
        devices_covered, response_time_value, response_time_unit, number_of_services,
        service_options, auto_renew, payment_frequency, amount, contract_remark,
        terms_conditions, images
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *
    `;

    const values = [
      session.company.id,
      contractNumber,
      customerName,
      assignee,
      amcType,
      contractStartDate,
      contractEndDate,
      devicesCovered || null,
      responseTimeValue || null,
      responseTimeUnit || null,
      numberOfServices || null,
      serviceOptions || null,
      autoRenew || false,
      paymentFrequency || null,
      amount || null,
      contractRemark || null,
      termsConditions || null,
      images || []
    ];

    const result = await pool.query(query, values);
    
    return NextResponse.json({ 
      success: true, 
      contract: result.rows[0] 
    }, { status: 201 });

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create contract' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const query = `
      SELECT 
        ac.*,
        c.customer_name as customer_display_name,
        e.employee_name as assignee_display_name
      FROM amc_contracts ac
      LEFT JOIN customers c ON ac.customer_name = c.id::varchar AND c.company_id = $1
      LEFT JOIN employees e ON ac.assignee = e.id::varchar AND e.company_id = $1
      WHERE ac.company_id = $1
      ORDER BY ac.created_at DESC
    `;
    const result = await pool.query(query, [session.company.id]);
    
    return NextResponse.json({ 
      contracts: result.rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const contractId = searchParams.get('id');

    if (!contractId) {
      return NextResponse.json({ error: 'Contract ID is required' }, { status: 400 });
    }

    const query = 'DELETE FROM amc_contracts WHERE id = $1 AND company_id = $2';
    const result = await pool.query(query, [contractId, session.company.id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to delete contract' }, { status: 500 });
  }
}
