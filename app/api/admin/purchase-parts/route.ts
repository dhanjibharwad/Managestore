import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const supplierName = searchParams.get('supplierName');

    if (!companyId || !supplierName) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const result = await query(
      `SELECT DISTINCT 
        part_name, 
        description, 
        warranty, 
        tax_code, 
        price, 
        tax_rate
      FROM purchase_items pi
      JOIN purchases p ON pi.purchase_id = p.id
      WHERE pi.company_id = $1 AND p.supplier_name = $2
      ORDER BY part_name`,
      [companyId, supplierName]
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching purchase parts:', error);
    return NextResponse.json({ error: 'Failed to fetch parts' }, { status: 500 });
  }
}
