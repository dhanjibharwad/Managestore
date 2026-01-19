import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      role: session.user.role,
      userId: session.user.id
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Session validation failed' },
      { status: 401 }
    );
  }
}