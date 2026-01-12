import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    
    if (!session) {
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
    const leadsCheck = await pool.query(
      'SELECT COUNT(*) as count FROM leads WHERE assignee_id = $1',
      [employeeId]
    );

    if (parseInt(leadsCheck.rows[0].count) > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete employee. Employee is assigned to existing leads. Please reassign the leads first.' 
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