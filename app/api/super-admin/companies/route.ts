// app/api/super-admin/companies/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Fetch all companies (dummy data)
  const companies = [
    {
      id: "1",
      name: "TechFix Solutions",
      owner: "Rahul Mehta",
      users: 28,
      plan: "Pro",
    },
    {
      id: "2",
      name: "HomeCare Plus",
      owner: "Ananya Sharma",
      users: 14,
      plan: "Basic",
    },
  ];

  return NextResponse.json(companies);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, owner, plan } = body;

  if (!name || !owner || !plan) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Insert into DB here…

  return NextResponse.json(
    {
      message: "Company created successfully",
      company: { id: Date.now(), name, owner, plan },
    },
    { status: 201 }
  );
}
