// app/api/super-admin/usage/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const usage = [
    { company: "TechFix Solutions", jobs: 120, storage: "1.2GB" },
    { company: "HomeCare Plus", jobs: 55, storage: "890MB" },
    { company: "CoolTech Repairs", jobs: 210, storage: "2.5GB" },
  ];

  return NextResponse.json(usage);
}
