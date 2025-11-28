// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { hashPassword } from "@/lib/hash";

// export async function POST(req: Request) {
//   const { name, email, password, role } = await req.json();

//   const hashed = await hashPassword(password);

//   await db.query(
//     `INSERT INTO users(name, email, password, role, email_verified)
//      VALUES($1,$2,$3,$4,false)`,
//     [name, email, hashed, role]
//   );

//   return NextResponse.json({ success: true });
// }
