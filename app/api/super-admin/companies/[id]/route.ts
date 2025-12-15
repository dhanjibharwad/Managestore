import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const resolvedParams = await params;
    const companyId = parseInt(resolvedParams.id);

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE companies 
       SET status = $1, updated_at = NOW()
       WHERE id = $2 
       RETURNING *`,
      [status, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Company status updated successfully',
      company: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to update company status:', error);
    return NextResponse.json(
      { error: 'Failed to update company status' },
      { status: 500 }
    );
  }
}