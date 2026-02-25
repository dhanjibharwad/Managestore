import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || !session.company || session.user.role !== 'technician') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = parseInt(id);
    const companyId = session.company.id;
    const technicianName = session.user.name;
    const body = await req.json();

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const {
      task_title,
      task_description,
      assignee_id,
      task_status,
      priority,
      due_date,
      customer_id
    } = body;

    // Check if task exists, belongs to the company, and is assigned to this technician
    const checkResult = await pool.query(
      `SELECT t.id FROM tasks t 
       LEFT JOIN employees e ON t.assignee_id = e.id
       WHERE t.id = $1 AND t.company_id = $2 AND e.employee_name = $3`,
      [taskId, companyId, technicianName]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found or not assigned to you' }, { status: 404 });
    }

    // Update the task
    const result = await pool.query(
      `UPDATE tasks SET 
        task_title = $1, 
        task_description = $2, 
        assignee_id = $3, 
        task_status = $4, 
        priority = $5, 
        due_date = $6, 
        customer_id = $7,
        updated_at = NOW()
      WHERE id = $8 AND company_id = $9 RETURNING *`,
      [
        task_title,
        task_description,
        assignee_id,
        task_status,
        priority,
        due_date,
        customer_id,
        taskId,
        companyId
      ]
    );

    return NextResponse.json({ task: result.rows[0] });

  } catch (error) {
    console.error('Update task error:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}
