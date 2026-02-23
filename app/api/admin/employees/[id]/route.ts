import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const employeeId = parseInt(id);
    
    if (isNaN(employeeId)) {
      return NextResponse.json({ error: 'Invalid employee ID' }, { status: 400 });
    }

    const companyId = session.company.id;

    // Check if employee exists and belongs to the company
    const employeeCheck = await pool.query(
      'SELECT id FROM employees WHERE id = $1 AND company_id = $2',
      [employeeId, companyId]
    );

    if (employeeCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    // Check if employee is referenced in other tables
    const checks = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM leads WHERE assignee_id = $1', [employeeId]),
      pool.query('SELECT COUNT(*) as count FROM jobs WHERE assigned_technician_id = $1', [employeeId]),
      pool.query('SELECT COUNT(*) as count FROM tasks WHERE assignee_id = $1', [employeeId]),
      pool.query('SELECT COUNT(*) as count FROM amcs WHERE assigned_technician_id = $1', [employeeId]),
      pool.query('SELECT COUNT(*) as count FROM pickup_drop WHERE assigned_to = $1', [employeeId]),
      pool.query('SELECT COUNT(*) as count FROM self_checkin WHERE assigned_technician_id = $1', [employeeId])
    ]);

    const [leads, jobs, tasks, amcs, pickupDrop, selfCheckin] = checks.map(r => parseInt(r.rows[0].count));

    if (leads > 0 || jobs > 0 || tasks > 0 || amcs > 0 || pickupDrop > 0 || selfCheckin > 0) {
      const references = [];
      if (leads > 0) references.push(`${leads} lead(s)`);
      if (jobs > 0) references.push(`${jobs} job(s)`);
      if (tasks > 0) references.push(`${tasks} task(s)`);
      if (amcs > 0) references.push(`${amcs} AMC(s)`);
      if (pickupDrop > 0) references.push(`${pickupDrop} pickup/drop(s)`);
      if (selfCheckin > 0) references.push(`${selfCheckin} self check-in(s)`);
      
      return NextResponse.json({ 
        error: `Cannot delete employee. Employee is assigned to: ${references.join(', ')}. Please reassign first.` 
      }, { status: 400 });
    }

    // Delete the employee
    await pool.query(
      'DELETE FROM employees WHERE id = $1 AND company_id = $2',
      [employeeId, companyId]
    );

    return NextResponse.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}