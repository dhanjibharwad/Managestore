import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const client = await pool.connect();
  
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { id: saleId } = await params;

    if (!saleId) {
      return NextResponse.json({ error: 'Sale ID required' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Delete sale items first
    await client.query(
      'DELETE FROM sale_items WHERE sale_id = $1',
      [saleId]
    );

    // Delete sale
    const result = await client.query(
      'DELETE FROM sales WHERE id = $1 AND company_id = $2 RETURNING id',
      [saleId, session.company.id]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Sale not found' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Delete sale error:', error);
    return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
  } finally {
    client.release();
  }
}