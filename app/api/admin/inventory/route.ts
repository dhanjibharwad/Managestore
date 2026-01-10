import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
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

    // Generate part_id manually if trigger doesn't work
    const partIdResult = await pool.query('SELECT COALESCE(MAX(CAST(SUBSTRING(part_id FROM 5) AS INTEGER)), 0) + 1 as next_id FROM inventory_parts WHERE part_id ~ \'PART[0-9]+\'');
    const nextId = partIdResult.rows[0]?.next_id || 1;
    const generatedPartId = `PART${String(nextId).padStart(4, '0')}`;

    const result = await pool.query(
      `INSERT INTO inventory_parts (
        part_id, part_name, category, sub_category, warranty, storage_location,
        opening_stock, current_stock, unit_type, sku, low_stock_units, barcode_number,
        rate_including_tax, manage_stock, low_stock_alert, purchase_price,
        selling_price, tax, hsn_code, part_description, images
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *`,
      [
        generatedPartId, partName, category, subCategory, warranty, storageLocation,
        parseInt(openingStock), parseInt(openingStock), unitType, sku, lowStockUnits ? parseInt(lowStockUnits) : null,
        barcodeNumber, rateIncludingTax, manageStock, lowStockAlert,
        parseFloat(purchasePrice), sellingPrice ? parseFloat(sellingPrice) : null,
        tax, hsnCode, partDescription, images
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
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock');

    let query = 'SELECT * FROM inventory_parts WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

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
    let countQuery = 'SELECT COUNT(*) FROM inventory_parts WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

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