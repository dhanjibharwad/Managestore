import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/hash";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const exists = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashed = await hashPassword(password);

    await db.query(
      `INSERT INTO users (name, email, password, role, email_verified)
       VALUES ($1, $2, $3, $4, false)`,
      [name, email, hashed, role]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
