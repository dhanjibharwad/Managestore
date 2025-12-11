import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      companyName,
      companyOwnerName,
      email,
      phone,
      country,
      subscriptionPlan = 'free'
    } = body;

    // Validation
    if (!companyName || !companyOwnerName || !email || !phone || !country) {
      return NextResponse.json(
        { error: 'Required fields: companyName, companyOwnerName, email, phone, country' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingCompany = await pool.query(
      'SELECT id FROM companies WHERE email = $1',
      [email]
    );

    if (existingCompany.rows.length > 0) {
      return NextResponse.json(
        { error: 'Company with this email already exists' },
        { status: 409 }
      );
    }

    // Set subscription end date based on plan
    let subscriptionEndDate = null;
    if (subscriptionPlan !== 'free') {
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1); // 1 year from now
      subscriptionEndDate = endDate;
    }

    const result = await pool.query(
      `INSERT INTO companies (
        company_name, company_owner_name, email, phone, country,
        subscription_plan, subscription_end_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [
        companyName, companyOwnerName, email, phone, country,
        subscriptionPlan, subscriptionEndDate
      ]
    );

    return NextResponse.json({
      message: 'Company registered successfully',
      company: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Company registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register company' },
      { status: 500 }
    );
  }
}