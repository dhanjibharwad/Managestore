import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = parseInt(id);
    const companyId = session.company.id;

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND company_id = $2',
      [taskId, companyId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ task: result.rows[0] });

  } catch (error) {
    console.error('Get task error:', error);
    return NextResponse.json(
      { error: 'Failed to get task' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = parseInt(id);
    const companyId = session.company.id;
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

    // Check if task exists and belongs to the company
    const checkResult = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND company_id = $2',
      [taskId, companyId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = parseInt(id);
    const companyId = session.company.id;

    if (isNaN(taskId)) {
      return NextResponse.json({ error: 'Invalid task ID' }, { status: 400 });
    }

    // Check if task exists and belongs to the company
    const checkResult = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND company_id = $2',
      [taskId, companyId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Delete the task
    await pool.query('DELETE FROM tasks WHERE id = $1 AND company_id = $2', [taskId, companyId]);

    return NextResponse.json({ message: 'Task deleted successfully' });

  } catch (error) {
    console.error('Delete task error:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}