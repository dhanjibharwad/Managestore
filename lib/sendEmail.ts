// import nodemailer from "nodemailer";

// export async function sendEmail(to: string, subject: string, html: string) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to,
//     subject,
//     html,
//   });
// }
