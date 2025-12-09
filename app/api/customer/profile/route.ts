// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { getCustomerFromRequest } from "@/lib/auth";

// // GET profile
// export async function GET(req: Request) {
//   const user = getCustomerFromRequest(req);

//   if (!user || user.role !== "customer") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const result = await db.query(
//       `SELECT id, name, email, phone, address, created_at
//        FROM users
//        WHERE id = $1`,
//       [user.id]
//     );

//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error loading profile:", error);
//     return NextResponse.json(
//       { error: "Failed to load profile" },
//       { status: 500 }
//     );
//   }
// }

// // UPDATE profile
// export async function PUT(req: Request) {
//   const user = getCustomerFromRequest(req);

//   if (!user || user.role !== "customer") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const body = await req.json();
//     const { name, phone, address } = body;

//     const result = await db.query(
//       `UPDATE users 
//        SET name = $1, phone = $2, address = $3
//        WHERE id = $4
//        RETURNING id, name, email, phone, address`,
//       [name, phone, address, user.id]
//     );

//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return NextResponse.json(
//       { error: "Failed to update profile" },
//       { status: 500 }
//     );
//   }
// }
