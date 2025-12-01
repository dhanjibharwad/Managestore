// app/api/super-admin/subscriptions/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const plans = [
    { name: "Basic", price: 499, companies: 12 },
    { name: "Pro", price: 999, companies: 25 },
    { name: "Enterprise", price: 1999, companies: 5 },
  ];

  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { name, price } = body;

  if (!name || !price) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Save subscription to DB

  return NextResponse.json(
    {
      message: "Subscription plan created",
      plan: { id: Date.now(), name, price },
    },
    { status: 201 }
  );
}
