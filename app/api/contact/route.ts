import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Create email transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_APP_PASSWORD,
    }
  });
};

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{1,15}$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Sanitize inputs to prevent XSS
    const sanitizedData = {
      name: escapeHtml(name.trim()),
      email: email.trim().toLowerCase(),
      phone: escapeHtml(phone.trim()),
      subject: escapeHtml(subject.trim()),
      message: escapeHtml(message.trim())
    };

    // Store contact message in database
    try {
      await pool.query(
        `INSERT INTO contact_messages (name, email, phone, subject, message, created_at) 
         VALUES ($1, $2, $3, $4, $5, NOW())`,
        [sanitizedData.name, sanitizedData.email, sanitizedData.phone, sanitizedData.subject, sanitizedData.message]
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database fails - we can still send email
    }

    // Try to send email notification
    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
      try {
        // Send notification email to admin
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: 'service@unionenterprize.com', // Admin email
          subject: `New Contact Form Submission: ${sanitizedData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #333; border-bottom: 2px solid #4A70A9; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #4A70A9; margin-top: 0;">Contact Details</h3>
                <p><strong>Name:</strong> ${sanitizedData.name}</p>
                <p><strong>Email:</strong> ${sanitizedData.email}</p>
                <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
                <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
              </div>
              
              <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="color: #333; margin-top: 0;">Message</h3>
                <p style="line-height: 1.6; color: #555;">${sanitizedData.message}</p>
              </div>
              
              <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-radius: 8px;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>Submitted:</strong> ${new Date().toLocaleString()}
                </p>
              </div>
            </div>
          `,
        });

        // Send confirmation email to user
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: sanitizedData.email,
          subject: 'Thank you for contacting us - Store Manager',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #4A70A9; margin: 0;">Store Manager</h1>
                <p style="color: #666; margin: 5px 0;">Thank you for reaching out!</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #333; margin-top: 0;">Hi ${sanitizedData.name},</h2>
                <p style="color: #555; line-height: 1.6;">
                  Thank you for contacting us. We have received your message and will get back to you as soon as possible.
                </p>
                <p style="color: #555; line-height: 1.6;">
                  Our team typically responds within 24-48 hours during business days.
                </p>
              </div>
              
              <div style="background-color: #fff; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h3 style="color: #4A70A9; margin-top: 0;">Your Message Summary</h3>
                <p><strong>Subject:</strong> ${sanitizedData.subject}</p>
                <p><strong>Message:</strong> ${sanitizedData.message}</p>
              </div>
              
              <div style="margin-top: 30px; text-align: center; color: #666; font-size: 14px;">
                <p>Best regards,<br>The Store Manager Team</p>
                <p>
                  <a href="mailto:service@unionenterprize.com" style="color: #4A70A9;">service@unionenterprize.com</a> | 
                  <a href="tel:+912345678900" style="color: #4A70A9;">+91 234 567 8900</a>
                </p>
              </div>
            </div>
          `,
        });

        emailSent = true;
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Return success response
    if (emailSent) {
      return NextResponse.json({
        message: 'Message sent successfully! We will get back to you soon.',
        success: true
      });
    } else {
      return NextResponse.json({
        message: 'Message received but email not sent (development mode)',
        success: true,
        emailSent: false
      });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}