import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

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