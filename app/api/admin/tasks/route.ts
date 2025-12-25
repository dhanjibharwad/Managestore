import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const {
      taskTitle,
      taskDescription,
      assignee,
      dueDate,
      taskStatus = 'Not Started Yet',
      priority = 'Medium',
      customer,
      companyId,
      attachments = [],
      sendAlert = { mail: false, whatsApp: false }
    } = body;

    // Validation
    if (!taskTitle || !assignee || !companyId) {
      return NextResponse.json(
        { error: 'Required fields: taskTitle, assignee, companyId' },
        { status: 400 }
      );
    }

    // Parse due date from format: "25-Jan-2025 02:30 PM"
    let parsedDueDate = null;
    if (dueDate) {
      const dateRegex = /(\d+)-(\w+)-(\d{4})\s+(\d{1,2}):(\d{2})\s+(AM|PM)/;
      const match = dueDate.match(dateRegex);
      if (match) {
        const [, day, month, year, hour, minute, period] = match;
        const months: { [key: string]: number } = {
          Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
          Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        let hour24 = parseInt(hour);
        if (period === 'PM' && hour24 !== 12) hour24 += 12;
        if (period === 'AM' && hour24 === 12) hour24 = 0;
        parsedDueDate = new Date(parseInt(year), months[month], parseInt(day), hour24, parseInt(minute));
      }
    }

    // Convert assignee and customer to integers or null
    const assigneeId = assignee ? parseInt(assignee) || null : null;
    const customerId = customer ? parseInt(customer) || null : null;

    const result = await pool.query(
      `INSERT INTO tasks (
        task_title, task_description, assignee_id, due_date,
        task_status, priority, customer_id, company_id, attachments, send_alert
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *`,
      [
        taskTitle, taskDescription, assigneeId, parsedDueDate,
        taskStatus, priority, customerId, companyId, JSON.stringify(attachments),
        JSON.stringify(sendAlert)
      ]
    );

    return NextResponse.json({
      message: 'Task created successfully',
      task: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Create task error:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const assignee = searchParams.get('assignee');
    const search = searchParams.get('search');

    let query = `SELECT t.*, u.name as assignee_name 
                 FROM tasks t 
                 LEFT JOIN users u ON t.assignee_id = u.id 
                 WHERE 1=1`;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND t.task_status = $${paramCount}`;
      params.push(status);
    }

    if (priority) {
      paramCount++;
      query += ` AND t.priority = $${paramCount}`;
      params.push(priority);
    }

    if (assignee) {
      paramCount++;
      query += ` AND t.assignee_id = $${paramCount}`;
      params.push(assignee);
    }

    if (search) {
      paramCount++;
      query += ` AND (t.task_title ILIKE $${paramCount} OR t.task_id ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    query += ' ORDER BY t.created_at DESC';
    
    const offset = (page - 1) * limit;
    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);
    
    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM tasks WHERE 1=1';
    const countParams: any[] = [];
    let countParamCount = 0;

    if (status) {
      countParamCount++;
      countQuery += ` AND task_status = $${countParamCount}`;
      countParams.push(status);
    }

    if (priority) {
      countParamCount++;
      countQuery += ` AND priority = $${countParamCount}`;
      countParams.push(priority);
    }

    if (assignee) {
      countParamCount++;
      countQuery += ` AND assignee_id = $${countParamCount}`;
      countParams.push(assignee);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (task_title ILIKE $${countParamCount} OR task_id ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      tasks: result.rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get tasks error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}