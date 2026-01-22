import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: purchaseId } = await params;
    
    // Delete the purchase
    const result = await pool.query(
      'DELETE FROM purchases WHERE id = $1 AND company_id = $2 RETURNING *',
      [purchaseId, session.company.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Purchase not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Purchase deleted successfully' 
    });

  } catch (error) {
    console.error('Delete purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to delete purchase' },
      { status: 500 }
    );
  }
}