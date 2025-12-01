// app/api/technician/job-report/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { jobId, description, amount } = body;

  // Save report to DB here…

  return NextResponse.json(
    { message: "Report submitted", jobId, description, amount },
    { status: 201 }
  );
}
