import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    const userId = session.user.id;
    const body = await req.json();
    
    const {
      serviceType,
      mobile,
      deviceType,
      scheduleDate,
      address,
      savedResponse,
      description,
      sendAlert = { mail: false }
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

    const result = await pool.query(
      `INSERT INTO pickup_drop (
        company_id, service_type, mobile, device_type, schedule_date,
        address, saved_response, description, send_alert, customer_search
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        companyId, serviceType, mobile, deviceType, parsedScheduleDate,
        address, savedResponse, description, JSON.stringify(sendAlert), userId.toString()
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
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const companyId = session.company.id;

    const query = `
      SELECT 
        pd.*,
        COALESCE(c.customer_name, u2.name) as customer_name,
        e.employee_name as assignee_name,
        dt.name as device_type_name
      FROM pickup_drop pd
      LEFT JOIN users u2 ON pd.customer_search = u2.id::text
      LEFT JOIN customers c ON pd.customer_search = c.id::text
      LEFT JOIN employees e ON pd.assignee_id = e.id
      LEFT JOIN device_types dt ON pd.device_type = dt.id::text
      WHERE pd.company_id = $1
      ORDER BY pd.created_at DESC
    `;

    const result = await pool.query(query, [companyId]);

    return NextResponse.json({
      pickupDrops: result.rows
    });

  } catch (error) {
    console.error('Get customer pickup/drop error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pickup/drop records' },
      { status: 500 }
    );
  }
}
