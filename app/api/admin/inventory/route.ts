import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    // Get session to ensure user is authenticated and get company_id
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    const {
      partName,
      category,
      subCategory,
      warranty,
      storageLocation,
      openingStock,
      unitType,
      sku,
      lowStockUnits,
      barcodeNumber,
      rateIncludingTax = false,
      manageStock = true,
      lowStockAlert = true,
      purchasePrice = 0,
      sellingPrice,
      tax = 'GST 18%',
      hsnCode,
      partDescription,
      images = []
    } = body;

    // Validation
    if (!partName || !openingStock || !purchasePrice) {
      return NextResponse.json(
        { error: 'Required fields: partName, openingStock, purchasePrice' },
        { status: 400 }
      );
    }

    // Generate part ID per company with company prefix
    const client = await pool.connect();
    let generatedPartId = '';
    try {
      await client.query('BEGIN');
      await client.query('LOCK TABLE inventory_parts IN EXCLUSIVE MODE');
      
      const partIdResult = await client.query(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(part_id FROM LENGTH($1) + 1) AS INTEGER)), 0) + 1 as next_number FROM inventory_parts WHERE part_id ~ $2 AND company_id = $3",
        [`C${session.company.id}PART`, `^C${session.company.id}PART[0-9]+$`, session.company.id]
      );
      generatedPartId = `C${session.company.id}PART${partIdResult.rows[0].next_number.toString().padStart(4, '0')}`;
      
      await client.query('COMMIT');

    } catch (transactionError) {
      await client.query('ROLLBACK');
      throw transactionError;
    } finally {
      client.release();
    }

    const result = await pool.query(
      `INSERT INTO inventory_parts (
        part_id, part_name, category, sub_category, warranty, storage_location,
        opening_stock, current_stock, unit_type, sku, low_stock_units, barcode_number,
        rate_including_tax, manage_stock, low_stock_alert, purchase_price,
        selling_price, tax, hsn_code, part_description, images, company_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21, $22
      ) RETURNING *`,
      [
        generatedPartId, partName, category, subCategory, warranty, storageLocation,
        parseInt(openingStock), parseInt(openingStock), unitType, sku, lowStockUnits ? parseInt(lowStockUnits) : null,
        barcodeNumber, rateIncludingTax, manageStock, lowStockAlert,
        parseFloat(purchasePrice), sellingPrice ? parseFloat(sellingPrice) : null,
        tax, hsnCode, partDescription, images, session.company.id
      ]
    );

    return NextResponse.json({
      message: 'Inventory part created successfully',
      part: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create inventory part error:', error);
    return NextResponse.json(
      { error: 'Failed to create inventory part' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get session to ensure user is authenticated and get company_id
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock');

    let query = 'SELECT * FROM inventory_parts WHERE company_id = $1';
    const params: any[] = [session.company.id];
    let paramCount = 1;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (part_name ILIKE $${paramCount} OR sku ILIKE $${paramCount} OR part_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (lowStock === 'true') {
      query += ` AND current_stock <= low_stock_units`;
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
    let countQuery = 'SELECT COUNT(*) FROM inventory_parts WHERE company_id = $1';
    const countParams: any[] = [session.company.id];
    let countParamCount = 1;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (part_name ILIKE $${countParamCount} OR sku ILIKE $${countParamCount} OR part_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    if (lowStock === 'true') {
      countQuery += ` AND current_stock <= low_stock_units`;
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      parts: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get inventory parts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory parts' },
      { status: 500 }
    );
  }
}