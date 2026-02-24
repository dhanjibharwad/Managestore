import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    console.log('Session data:', session); // Debug log
    
    if (!session || !session.company) {
      console.log('No session found'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    console.log('Company ID:', companyId); // Debug log

    const categories = await query(`
      SELECT id, category_name, category_description, is_active
      FROM inventory_categories 
      WHERE company_id = $1 AND is_active = true
      ORDER BY category_name
    `, [companyId]);

    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    console.log('POST Session data:', session); // Debug log
    
    if (!session || !session.company) {
      console.log('POST No session found'); // Debug log
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    const userId = session.user.id;
    const { categoryName, categoryDescription } = await request.json();
    
    console.log('POST Data:', { companyId, userId, categoryName }); // Debug log

    if (!categoryName?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Check if category already exists
    const existing = await query(`
      SELECT id FROM inventory_categories 
      WHERE company_id = $1 AND LOWER(category_name) = LOWER($2)
    `, [companyId, categoryName.trim()]);

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const result = await query(`
      INSERT INTO inventory_categories (company_id, category_name, category_description, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, category_name, category_description
    `, [companyId, categoryName.trim(), categoryDescription?.trim() || null, userId]);

    return NextResponse.json({
      success: true,
      category: result[0]
    });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}