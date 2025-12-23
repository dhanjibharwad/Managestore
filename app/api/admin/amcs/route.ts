import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      companyId,
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
    if (!companyId || !contractNumber || !customerName || !assignee || !amcType || !contractStartDate || !contractEndDate) {
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
      companyId,
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
    const query = 'SELECT * FROM amc_contracts ORDER BY created_at DESC';
    const result = await pool.query(query);
    
    return NextResponse.json({ 
      contracts: result.rows 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}
