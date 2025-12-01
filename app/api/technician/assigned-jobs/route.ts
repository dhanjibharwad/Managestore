// app/api/technician/assigned-jobs/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch technician-specific jobs from DB
  const jobs = [
    { id: 1, job: "AC Repair", customer: "Ritu", status: "In Progress" },
    { id: 2, job: "Fridge Repair", customer: "Mohan", status: "Pending" },
  ];

  return NextResponse.json(jobs);
}
