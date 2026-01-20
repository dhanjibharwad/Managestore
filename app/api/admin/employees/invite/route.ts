import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { sendEmployeeInviteEmail } from '@/lib/email';
import pool from '@/lib/db';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !['admin', 'technician'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { employeeId } = await req.json();

    const employeeResult = await pool.query(
      'SELECT * FROM employees WHERE id = $1 AND company_id = $2',
      [employeeId, session.company.id]
    );

    if (employeeResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    const employee = employeeResult.rows[0];

    if (!employee.email_id) {
      return NextResponse.json(
        { error: 'Employee email not found' },
        { status: 400 }
      );
    }

    const invitationToken = crypto.randomBytes(32).toString('hex');
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/register?token=${invitationToken}`;

    await pool.query(
      'UPDATE employees SET invitation_status = $1, invited_at = NOW(), invitation_token = $2 WHERE id = $3',
      ['sent', invitationToken, employeeId]
    );

    await sendEmployeeInviteEmail(
      employee.email_id,
      employee.employee_name,
      session.company.name,
      employee.employee_role,
      inviteLink
    );

    return NextResponse.json({
      message: 'Invitation sent successfully'
    });

  } catch (error) {
    console.error('Send employee invitation error:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
