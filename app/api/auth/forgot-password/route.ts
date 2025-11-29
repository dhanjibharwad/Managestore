// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { generateOTP } from "@/lib/otp";
// import { sendEmail } from "@/lib/sendEmail";

// export async function POST(req: Request) {
//   try {
//     const { email } = await req.json();

//     if (!email)
//       return NextResponse.json({ error: "Email required" }, { status: 400 });

//     // check if user exists
//     const res = await db.query(
//       "SELECT id FROM users WHERE email = $1 LIMIT 1",
//       [email]
//     );

//     if (res.rows.length === 0) {
//       return NextResponse.json({ message: "If the email exists, OTP will be sent" });
//     }

//     const otp = generateOTP(6);
//     const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min

//     // save otp in db
//     await db.query(
//       `UPDATE users 
//        SET reset_password_token = $1, reset_password_expires = $2
//        WHERE email = $3`,
//       [otp, expiry, email]
//     );

//     // send otp email
//     await sendEmail(
//       email,
//       "Your Password Reset OTP",
//       `
//       <h2>Your OTP Code</h2>
//       <p><b>${otp}</b></p>
//       <p>This OTP will expire in 10 minutes.</p>
//     `
//     );

//     return NextResponse.json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
