import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      serviceType,
      customerSearch,
      mobile,
      deviceType,
      scheduleDate,
      assignee,
      address,
      savedResponse,
      description,
      sendAlert = { mail: false, sms: false }
    } = body;

    // Validation
    if (!serviceType || !mobile || !deviceType || !scheduleDate || !address) {
      return NextResponse.json(
        { error: 'Required fields: serviceType, mobile, deviceType, scheduleDate, address' },
        { status: 400 }
      );
    }

    // Parse schedule date
    let parsedScheduleDate = null;
    if (scheduleDate) {
      parsedScheduleDate = new Date(scheduleDate);
      if (isNaN(parsedScheduleDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid schedule date format' },
          { status: 400 }
        );
      }
    }

    // Convert assignee to integer or null
    const assigneeId = assignee ? parseInt(assignee) || null : null;

    const result = await pool.query(
      `INSERT INTO pickup_drop (
        service_type, customer_search, mobile, device_type, schedule_date,
        assignee_id, address, saved_response, description, send_alert
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        serviceType, customerSearch, mobile, deviceType, parsedScheduleDate,
        assigneeId, address, savedResponse, description, JSON.stringify(sendAlert)
      ]
    );

    return NextResponse.json({
      message: 'Pickup/Drop scheduled successfully',
      pickupDrop: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create pickup/drop error:', error);
    return NextResponse.json(
      { error: 'Failed to schedule pickup/drop' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const serviceType = searchParams.get('serviceType');
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

    let query = 'SELECT * FROM pickup_drop WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (serviceType) {
      paramCount++;
      query += ` AND service_type = $${paramCount}`;
      params.push(serviceType);
    }

    if (status) {
      paramCount++;
      query += ` AND status = $${paramCount}`;
      params.push(status);
    }

    if (assignee) {
      paramCount++;
      query += ` AND assignee_id = $${paramCount}`;
      params.push(assignee);
    }

    if (search) {
      paramCount++;
      query += ` AND (customer_search ILIKE $${paramCount} OR mobile ILIKE $${paramCount} OR pickup_drop_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
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
    let countQuery = 'SELECT COUNT(*) FROM pickup_drop WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (serviceType) {
      countParamCount++;
      countQuery += ` AND service_type = $${countParamCount}`;
      countParams.push(serviceType);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND status = $${countParamCount}`;
      countParams.push(status);
    }

    if (assignee) {
      countParamCount++;
      countQuery += ` AND assignee_id = $${countParamCount}`;
      countParams.push(assignee);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (customer_search ILIKE $${countParamCount} OR mobile ILIKE $${countParamCount} OR pickup_drop_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      pickupDrops: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get pickup/drop error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pickup/drop records' },
      { status: 500 }
    );
  }
}