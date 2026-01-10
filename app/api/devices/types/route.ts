import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, name FROM device_types ORDER BY name'
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Fetch device types error:', error);
    return NextResponse.json({ error: 'Failed to fetch device types' }, { status: 500 });
  }
}
