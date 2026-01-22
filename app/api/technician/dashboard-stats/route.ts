import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'technician') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const technicianName = session.user.name;
    const companyId = session.company.id;

    // Get assigned jobs count
    const assignedJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE company_id = $1 AND assignee = $2`,
      [companyId, technicianName]
    );

    // Get assigned leads count
    const assignedLeadsResult = await pool.query(
      `SELECT COUNT(*) as count FROM leads 
       WHERE company_id = $1 AND assignee_id = $2`,
      [companyId, session.user.id]
    );

    // Get assigned tasks count
    const assignedTasksResult = await pool.query(
      `SELECT COUNT(*) as count FROM tasks 
       WHERE company_id = $1 AND assignee_id = $2`,
      [companyId, session.user.id]
    );

    // Get delayed jobs count (jobs past due date)
    const delayedJobsResult = await pool.query(
      `SELECT COUNT(*) as count FROM jobs 
       WHERE company_id = $1 AND assignee = $2 
       AND due_date < CURRENT_DATE AND status NOT IN ('Completed', 'Closed')`,
      [companyId, technicianName]
    );

    const stats = {
      assignedJobs: parseInt(assignedJobsResult.rows[0].count),
      assignedLeads: parseInt(assignedLeadsResult.rows[0].count),
      assignedTasks: parseInt(assignedTasksResult.rows[0].count),
      delayedJobs: parseInt(delayedJobsResult.rows[0].count)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching technician dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}