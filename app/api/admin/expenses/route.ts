import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      expenseName,
      category,
      expenseDate,
      description,
      paymentMode,
      amount,
      attachments = []
    } = body;

    // Validation
    if (!expenseName || !category || !expenseDate || !paymentMode || !amount) {
      return NextResponse.json(
        { error: 'Required fields: expenseName, category, expenseDate, paymentMode, amount' },
        { status: 400 }
      );
    }

    // Parse expense date
    let parsedExpenseDate = null;
    if (expenseDate) {
      parsedExpenseDate = new Date(expenseDate);
      if (isNaN(parsedExpenseDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid expense date format' },
          { status: 400 }
        );
      }
    }

    // Validate amount
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a valid positive number' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO expenses (
        expense_name, category, expense_date, description,
        payment_mode, amount, attachments
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *`,
      [
        expenseName, category, parsedExpenseDate, description,
        paymentMode, numericAmount, JSON.stringify(attachments)
      ]
    );

    return NextResponse.json({
      message: 'Expense created successfully',
      expense: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create expense error:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const paymentMode = searchParams.get('paymentMode');
    const search = searchParams.get('search');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = 'SELECT * FROM expenses WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (paymentMode) {
      paramCount++;
      query += ` AND payment_mode = $${paramCount}`;
      params.push(paymentMode);
    }

    if (search) {
      paramCount++;
      query += ` AND (expense_name ILIKE $${paramCount} OR expense_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (startDate) {
      paramCount++;
      query += ` AND expense_date >= $${paramCount}`;
      params.push(startDate);
    }

    if (endDate) {
      paramCount++;
      query += ` AND expense_date <= $${paramCount}`;
      params.push(endDate);
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
    let countQuery = 'SELECT COUNT(*) FROM expenses WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (paymentMode) {
      countParamCount++;
      countQuery += ` AND payment_mode = $${countParamCount}`;
      countParams.push(paymentMode);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (expense_name ILIKE $${countParamCount} OR expense_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (startDate) {
      countParamCount++;
      countQuery += ` AND expense_date >= $${countParamCount}`;
      countParams.push(startDate);
    }

    if (endDate) {
      countParamCount++;
      countQuery += ` AND expense_date <= $${countParamCount}`;
      countParams.push(endDate);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      expenses: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}