import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.leadName || !body.assignee) {
      return NextResponse.json(
        { error: 'Lead Name and Assignee are required fields' },
        { status: 400 }
      );
    }

    const companyId = session.company.id;

    // Parse and validate assignee_id
    const assigneeId = parseInt(body.assignee);
    if (isNaN(assigneeId)) {
      return NextResponse.json(
        { error: 'Invalid assignee ID' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO leads (
        lead_type, lead_name, lead_source, referred_by, mobile_number,
        email_id, phone_number, contact_person, next_follow_up, assignee_id,
        device_type_id, device_brand_id, device_model_id, comment,
        address_line, region, city, postal_code, company_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *`,
      [
        body.leadType || null,
        body.leadName,
        body.leadSource || null,
        body.referredBy || null,
        body.mobileNumber || null,
        body.emailId || null,
        body.phoneNumber || null,
        body.contactPerson || null,
        body.nextFollowUp || null,
        assigneeId,
        body.deviceType ? parseInt(body.deviceType) : null,
        body.deviceBrand ? parseInt(body.deviceBrand) : null,
        body.deviceModel ? parseInt(body.deviceModel) : null,
        body.comment || null,
        body.addressLine || null,
        body.region || null,
        body.city || null,
        body.postalCode || null,
        companyId
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Lead created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.company) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = session.company.id;
    const userEmail = session.user.email;
    const userRole = session.user.role;
    
    let query = `SELECT l.*, e.employee_name as assignee_name 
                 FROM leads l 
                 LEFT JOIN employees e ON l.assignee_id = e.id 
                 WHERE l.company_id = $1`;
    const params: any[] = [companyId];
    
    // If user is technician, only show leads assigned to them
    if (userRole === 'technician') {
      query += ` AND l.assignee_id = (SELECT id FROM employees WHERE email_id = $2 AND company_id = $1 LIMIT 1)`;
      params.push(userEmail);
    }
    
    query += ` ORDER BY l.created_at DESC`;
    
    const result = await pool.query(query, params);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
