import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || !session.company || session.user.role !== 'customer') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      deviceType,
      brand,
      model,
      serialNumber,
      password,
      serviceType,
      deviceIssue,
      accessories,
      deviceImages,
      name,
      mobile,
      email,
      termsAccepted,
      addressLine,
      region,
      city,
      postalCode,
      pickupDateTime,
      skipPickup
    } = await req.json();

    // Validation
    if (!deviceType || !brand || !model || !name || !termsAccepted) {
      return NextResponse.json(
        { error: 'Required fields: deviceType, brand, model, name, termsAccepted' },
        { status: 400 }
      );
    }

    const companyId = session.company.id;
    const userId = session.user.id;

    // Insert self check-in request
    const result = await pool.query(
      `INSERT INTO self_checkin_requests (
        company_id, user_id, device_type, brand, model, 
        serial_number, device_password, services, device_issue, accessories, device_images,
        customer_name, mobile_number, email,
        address_line, region_state, city_town, postal_code,
        pickup_datetime, skip_pickup, terms_accepted, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, NOW())
      RETURNING *`,
      [
        companyId, userId, deviceType, brand, model,
        serialNumber, password, serviceType, deviceIssue, accessories, deviceImages,
        name, mobile, email,
        addressLine, region, city, postalCode,
        pickupDateTime ? new Date(pickupDateTime) : null, skipPickup || false, termsAccepted, 'pending'
      ]
    );

    return NextResponse.json({
      message: 'Self check-in request submitted successfully',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Self check-in error:', error);
    return NextResponse.json(
      { error: 'Failed to submit self check-in request' },
      { status: 500 }
    );
  }
}
