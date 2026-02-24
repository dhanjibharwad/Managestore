import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contractId = parseInt(id);
    
    if (isNaN(contractId)) {
      return NextResponse.json({ error: 'Invalid contract ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Get the contract
    const contractResult = await pool.query(
      'SELECT * FROM amc_contracts WHERE id = $1 AND company_id = $2',
      [contractId, companyId]
    );

    if (contractResult.rows.length === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    const contract = contractResult.rows[0];

    return NextResponse.json({
      contract
    });
  } catch (error) {
    console.error('Get contract error:', error);
    return NextResponse.json({ error: 'Failed to get contract' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const contractId = parseInt(id);
    
    if (isNaN(contractId)) {
      return NextResponse.json({ error: 'Invalid contract ID' }, { status: 400 });
    }

    const companyId = session.company.id;
    const body = await request.json();
    
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

    // Check if contract exists and belongs to the company
    const contractCheck = await pool.query(
      'SELECT id FROM amc_contracts WHERE id = $1 AND company_id = $2',
      [contractId, companyId]
    );

    if (contractCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
    }

    // Update contract
    const query = `
      UPDATE amc_contracts SET 
        contract_number = $1,
        customer_name = $2,
        assignee = $3,
        amc_type = $4,
        contract_start_date = $5,
        contract_end_date = $6,
        devices_covered = $7,
        response_time_value = $8,
        response_time_unit = $9,
        number_of_services = $10,
        service_options = $11,
        auto_renew = $12,
        payment_frequency = $13,
        amount = $14,
        contract_remark = $15,
        terms_conditions = $16,
        images = $17,
        updated_at = NOW()
      WHERE id = $18 AND company_id = $19
      RETURNING *
    `;

    const values = [
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
      images || [],
      contractId,
      companyId
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ 
      success: true,
      contract: result.rows[0]
    });
  } catch (error) {
    console.error('Update contract error:', error);
    return NextResponse.json({ error: 'Failed to update contract' }, { status: 500 });
  }
}