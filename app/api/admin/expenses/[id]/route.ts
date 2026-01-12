import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const expenseId = parseInt(id);
    
    if (isNaN(expenseId)) {
      return NextResponse.json({ error: 'Invalid expense ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Get the expense
    const result = await pool.query(
      'SELECT * FROM expenses WHERE id = $1 AND company_id = $2',
      [expenseId, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    return NextResponse.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Get expense error:', error);
    return NextResponse.json({ error: 'Failed to get expense' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const expenseId = parseInt(id);
    
    if (isNaN(expenseId)) {
      return NextResponse.json({ error: 'Invalid expense ID' }, { status: 400 });
    }

    const companyId = session.company.id;
    const body = await request.json();
    const { expense_name, category, description, amount, payment_mode, expense_date } = body;

    // Check if expense exists and belongs to the company
    const expenseCheck = await pool.query(
      'SELECT id FROM expenses WHERE id = $1 AND company_id = $2',
      [expenseId, companyId]
    );

    if (expenseCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Update the expense
    const result = await pool.query(
      'UPDATE expenses SET expense_name = $1, category = $2, description = $3, amount = $4, payment_mode = $5, expense_date = $6, updated_at = NOW() WHERE id = $7 AND company_id = $8 RETURNING *',
      [expense_name, category, description, amount, payment_mode, expense_date, expenseId, companyId]
    );

    return NextResponse.json({ expense: result.rows[0] });
  } catch (error) {
    console.error('Update expense error:', error);
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const expenseId = parseInt(id);
    
    if (isNaN(expenseId)) {
      return NextResponse.json({ error: 'Invalid expense ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Check if expense exists and belongs to the company
    const expenseCheck = await pool.query(
      'SELECT id FROM expenses WHERE id = $1 AND company_id = $2',
      [expenseId, companyId]
    );

    if (expenseCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    // Delete the expense
    await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND company_id = $2',
      [expenseId, companyId]
    );

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Delete expense error:', error);
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}