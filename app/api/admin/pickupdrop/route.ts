import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
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

    if (!serviceType || !mobile || !deviceType || !scheduleDate || !address) {
      return NextResponse.json(
        { error: 'Required fields: serviceType, mobile, deviceType, scheduleDate, address' },
        { status: 400 }
      );
    }

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

    const assigneeId = assignee ? parseInt(assignee) || null : null;

    // Validate assignee_id exists in employees table if provided
    if (assigneeId) {
      const employeeCheck = await pool.query(
        'SELECT id FROM employees WHERE id = $1 AND company_id = $2',
        [assigneeId, companyId]
      );
      
      if (employeeCheck.rows.length === 0) {
        return NextResponse.json({ error: 'Selected assignee does not exist' }, { status: 400 });
      }
    }

    const result = await pool.query(
      `INSERT INTO pickup_drop (
        company_id, service_type, customer_search, mobile, device_type, schedule_date,
        assignee_id, address, saved_response, description, send_alert
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
      ) RETURNING *`,
      [
        companyId, serviceType, customerSearch, mobile, deviceType, parsedScheduleDate,
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const serviceType = searchParams.get('serviceType');
    const status = searchParams.get('status');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

    let query = `
      SELECT 
        pd.*,
        c.customer_name,
        e.employee_name as assignee_name,
        dt.name as device_type_name
      FROM pickup_drop pd
      LEFT JOIN customers c ON pd.customer_search = c.id::text
      LEFT JOIN employees e ON pd.assignee_id = e.id
      LEFT JOIN device_types dt ON pd.device_type = dt.id::text
      WHERE pd.company_id = $1
    `;
    const params: any[] = [companyId];
    let paramCount = 1;

    if (serviceType) {
      paramCount++;
      query += ` AND pd.service_type = $${paramCount}`;
      params.push(serviceType);
    }

    if (status) {
      paramCount++;
      query += ` AND pd.status = $${paramCount}`;
      params.push(status);
    }

    if (assignee) {
      paramCount++;
      query += ` AND pd.assignee_id = $${paramCount}`;
      params.push(assignee);
    }

    if (search) {
      paramCount++;
      query += ` AND (c.customer_name ILIKE $${paramCount} OR pd.mobile ILIKE $${paramCount} OR pd.pickup_drop_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY pd.created_at DESC';
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    let countQuery = `
      SELECT COUNT(*) 
      FROM pickup_drop pd
      LEFT JOIN customers c ON pd.customer_search = c.id::text
      WHERE pd.company_id = $1
    `;
    const countParams: any[] = [companyId];
    let countParamCount = 1;

    if (serviceType) {
      countParamCount++;
      countQuery += ` AND pd.service_type = $${countParamCount}`;
      countParams.push(serviceType);
    }

    if (status) {
      countParamCount++;
      countQuery += ` AND pd.status = $${countParamCount}`;
      countParams.push(status);
    }

    if (assignee) {
      countParamCount++;
      countQuery += ` AND pd.assignee_id = $${countParamCount}`;
      countParams.push(assignee);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (c.customer_name ILIKE $${countParamCount} OR pd.mobile ILIKE $${countParamCount} OR pd.pickup_drop_id ILIKE $${countParamCount})`;
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