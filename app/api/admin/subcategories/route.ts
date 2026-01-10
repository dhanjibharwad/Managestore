import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const companyId = session.company.id;

    let subcategories;
    if (categoryId) {
      subcategories = await query(`
        SELECT id, subcategory_name, subcategory_description, category_id
        FROM inventory_subcategories 
        WHERE company_id = $1 AND category_id = $2 AND is_active = true
        ORDER BY subcategory_name
      `, [companyId, categoryId]);
    } else {
      subcategories = await query(`
        SELECT s.id, s.subcategory_name, s.subcategory_description, s.category_id, c.category_name
        FROM inventory_subcategories s
        JOIN inventory_categories c ON s.category_id = c.id
        WHERE s.company_id = $1 AND s.is_active = true
        ORDER BY c.category_name, s.subcategory_name
      `, [companyId]);
    }

    return NextResponse.json({
      success: true,
      subcategories
    });
  } catch (error) {
    console.error('Subcategories fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    const userId = session.user.id;
    const { categoryId, subcategoryName, subcategoryDescription } = await request.json();

    if (!categoryId || !subcategoryName?.trim()) {
      return NextResponse.json({ error: 'Category ID and subcategory name are required' }, { status: 400 });
    }

    // Verify category exists and belongs to company
    const categoryCheck = await query(`
      SELECT id FROM inventory_categories 
      WHERE id = $1 AND company_id = $2 AND is_active = true
    `, [categoryId, companyId]);

    if (categoryCheck.length === 0) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    // Check if subcategory already exists
    const existing = await query(`
      SELECT id FROM inventory_subcategories 
      WHERE category_id = $1 AND LOWER(subcategory_name) = LOWER($2)
    `, [categoryId, subcategoryName.trim()]);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Subcategory already exists' }, { status: 409 });
    }

    const result = await query(`
      INSERT INTO inventory_subcategories (company_id, category_id, subcategory_name, subcategory_description, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, subcategory_name, subcategory_description, category_id
    `, [companyId, categoryId, subcategoryName.trim(), subcategoryDescription?.trim() || null, userId]);

    return NextResponse.json({
      success: true,
      subcategory: result[0]
    });
  } catch (error) {
    console.error('Subcategory creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}