import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { comparePassword } from "@/lib/hash";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const result = await db.query(
    `SELECT id,name,email,password,role FROM users WHERE email=$1`, 
    [email]
  );

  if (!result.rows.length)
    return NextResponse.json({ error: "User not found" }, { status: 400 });

  const user = result.rows[0];

  const match = await comparePassword(password, user.password);

  if (!match)
    return NextResponse.json({ error: "Invalid password" }, { status: 400 });

  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const res = NextResponse.json({ success: true, role: user.role });
  res.cookies.set("token", token, { httpOnly: true });

  return res;
}
