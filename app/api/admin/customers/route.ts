// // app/api/admin/customers/route.ts
// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     // ❗ If no "id", return all customers
//     if (!id) {
//       const result = await db.query("SELECT * FROM customers ORDER BY id DESC");
//       return NextResponse.json(result.rows);
//     }

//     // Fetch specific customer
//     const result = await db.query("SELECT * FROM customers WHERE id = $1", [id]);

//     if (result.rows.length === 0) {
//       return NextResponse.json({ error: "Customer not found" }, { status: 404 });
//     }

//     return NextResponse.json(result.rows[0]);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
