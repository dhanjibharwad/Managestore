// app/api/super-admin/admins/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const admins = [
    {
      id: "1",
      company: "TechFix Solutions",
      name: "Rahul Mehta",
      email: "rahul@techfix.com",
    },
    {
      id: "2",
      company: "HomeCare Plus",
      name: "Ananya Sharma",
      email: "ananya@homecare.com",
    },
  ];

  return NextResponse.json(admins);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, companyId } = body;

  if (!name || !email || !companyId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Add admin to DB

  return NextResponse.json(
    {
      message: "Admin created successfully",
      admin: { id: Date.now(), name, email, companyId },
    },
    { status: 201 }
  );
}
