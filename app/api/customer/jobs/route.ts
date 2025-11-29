import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCustomerFromRequest } from "@/lib/auth";

// GET all customer jobs
export async function GET(req: Request) {
  const user = getCustomerFromRequest(req);

  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await db.query(
      "SELECT * FROM jobs WHERE customer_id = $1 ORDER BY created_at DESC",
      [user.id]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to load jobs" },
      { status: 500 }
    );
  }
}

// POST create a new job request
export async function POST(req: Request) {
  const user = getCustomerFromRequest(req);

  if (!user || user.role !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { jobType, description, scheduledDate, amount } = body;

    const result = await db.query(
      `INSERT INTO jobs 
        (job_type, description, scheduled_date, amount, customer_id, status)
       VALUES ($1, $2, $3, $4, $5, 'Pending')
       RETURNING *`,
      [jobType, description, scheduledDate, amount, user.id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
