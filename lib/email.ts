import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A70A9;">Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="color: #4A70A9; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendPasswordResetEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A70A9;">Password Reset</h2>
        <p>Your password reset code is:</p>
        <h1 style="color: #4A70A9; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendInviteEmail(
  email: string,
  companyName: string,
  ownerName: string,
  inviteLink: string
) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `Welcome to StoreManager - Complete Your Registration`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to StoreManager</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4A70A9 0%, #3d5d8f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to StoreManager!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
          <p style="font-size: 18px; margin-bottom: 20px;">Dear ${ownerName},</p>
          
          <p style="margin-bottom: 20px;">🎉 <strong>Congratulations!</strong> Your company "<strong>${companyName}</strong>" has been approved to join our platform.</p>
          
          <p style="margin-bottom: 25px;">You are welcome to join our portal as an admin. Click the button below to complete your registration and start managing your store:</p>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${inviteLink}" 
               style="background-color: #4A70A9; 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 6px rgba(74, 112, 169, 0.3);">
              Complete Registration
            </a>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>⏰ Important:</strong> This invitation link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <p style="margin-bottom: 15px;">Once registered, you'll be able to:</p>
          <ul style="margin-bottom: 25px; padding-left: 20px;">
            <li>Manage your store inventory</li>
            <li>Track jobs and tasks</li>
            <li>Handle customer relationships</li>
            <li>Generate reports and analytics</li>
          </ul>
          
          <p style="margin-bottom: 20px;">If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="margin-bottom: 5px; color: #666; font-size: 14px;">Best regards,</p>
          <p style="margin: 0; color: #4A70A9; font-weight: bold;">The StoreManager Team</p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>If you're unable to click the button above, copy and paste this link into your browser:</p>
          <p style="word-break: break-all;">${inviteLink}</p>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
}