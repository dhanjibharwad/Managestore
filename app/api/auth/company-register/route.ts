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
      subscriptionPlan = 'free',
      token
    } = body;

    // Validation
    if (!companyName || !companyOwnerName || !email || !phone || !country) {
      return NextResponse.json(
        { error: 'Required fields: companyName, companyOwnerName, email, phone, country' },
        { status: 400 }
      );
    }

    // If token is provided, verify it and update existing company
    if (token) {
      const companyResult = await pool.query(
        'SELECT id FROM companies WHERE invitation_token = $1',
        [token]
      );

      if (companyResult.rows.length === 0) {
        return NextResponse.json(
          { error: 'Invalid invitation token' },
          { status: 404 }
        );
      }

      const companyId = companyResult.rows[0].id;

      // Update company with registration details
      const result = await pool.query(
        `UPDATE companies 
         SET company_owner_name = $1, status = $2, invitation_token = NULL, invited_at = NULL
         WHERE id = $3 
         RETURNING *`,
        [companyOwnerName, 'active', companyId]
      );

      return NextResponse.json({
        message: 'Company registration completed successfully',
        company: result.rows[0]
      }, { status: 200 });
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
        subscription_plan, subscription_end_date, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *`,
      [
        companyName, companyOwnerName, email, phone, country,
        subscriptionPlan, subscriptionEndDate, 'inactive'
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
