import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, company } = session;

    const body = await req.json();
    
    const {
      employeeRole,
      employeeName,
      displayName,
      emailId,
      mobileNumber,
      phoneNumber,
      aadhaarNumber,
      gender,
      panCard,
      dateOfBirth,
      addressLine,
      regionState,
      cityTown,
      postalCode,
      accountName,
      bankName,
      branch,
      accountNumber,
      ifscCode
    } = body;

    // Validation
    if (!employeeRole || !employeeName || !emailId || !mobileNumber) {
      return NextResponse.json(
        { error: 'Required fields: employeeRole, employeeName, emailId, mobileNumber' },
        { status: 400 }
      );
    }

    // Use transaction to prevent race conditions
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Check if email already exists in this company within transaction
      const existingEmployee = await client.query(
        'SELECT id FROM employees WHERE email_id = $1 AND company_id = $2',
        [emailId, company.id]
      );

      if (existingEmployee.rows.length > 0) {
        await client.query('ROLLBACK');
        client.release();
        return NextResponse.json(
          { error: 'Employee with this email already exists' },
          { status: 400 }
        );
      }
      
      // Generate employee ID per company with table-level locking
      await client.query('LOCK TABLE employees IN EXCLUSIVE MODE');
      const employeeIdResult = await client.query(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(employee_id FROM 4) AS INTEGER)), 0) + 1 as next_number FROM employees WHERE employee_id ~ 'EMP[0-9]+' AND company_id = $1",
        [company.id]
      );
      const employeeId = `EMP${employeeIdResult.rows[0].next_number.toString().padStart(4, '0')}`;

      const result = await client.query(
        `INSERT INTO employees (
          employee_id, employee_role, employee_name, display_name, email_id, mobile_number,
          phone_number, aadhaar_number, gender, pan_card, date_of_birth,
          address_line, region_state, city_town, postal_code,
          account_name, bank_name, branch, account_number, ifsc_code,
          company_id, created_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
          $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
        ) RETURNING *`,
        [
          employeeId, employeeRole, employeeName, displayName, emailId, mobileNumber,
          phoneNumber, aadhaarNumber, gender, panCard, dateOfBirth || null,
          addressLine, regionState, cityTown, postalCode,
          accountName, bankName, branch, accountNumber, ifscCode,
          company.id, user.id
        ]
      );
      
      await client.query('COMMIT');
      
      return NextResponse.json({
        message: 'Employee created successfully',
        employee: result.rows[0]
      }, { status: 201 });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Create employee error:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { company } = session;

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM employees WHERE company_id = $1';
    const params: any[] = [company.id];
    let paramCount = 1;

    if (role) {
      paramCount++;
      query += ` AND employee_role = $${paramCount}`;
      params.push(role);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (employee_name ILIKE $${paramCount} OR email_id ILIKE $${paramCount} OR employee_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY created_at DESC';
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM employees WHERE company_id = $1';
    const countParams: any[] = [company.id];
    let countParamCount = 1;

    if (role) {
      countParamCount++;
      countQuery += ` AND employee_role = $${countParamCount}`;
      countParams.push(role);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (employee_name ILIKE $${countParamCount} OR email_id ILIKE $${countParamCount} OR employee_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      employees: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get employees error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}