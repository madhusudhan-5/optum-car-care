import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, vehicle, service, message, formType } = body;

    // ─── CONFIGURE YOUR SMTP HERE ──────────────────────────────────────────────
    // Using Gmail as an example. Replace with your SMTP credentials.
    // Set these in your .env.local file:
    //   EMAIL_USER=your@gmail.com
    //   EMAIL_PASS=your_app_password
    //   EMAIL_TO=destination@email.com  ← update this when you have the email
    // ─────────────────────────────────────────────────────────────────────────────
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'noreply@optumcarcare.com',
        pass: process.env.EMAIL_PASS || '',
      },
    });

    const destinationEmail = process.env.EMAIL_TO || 'info@optumcarcare.com';

    const subjectLine = formType === 'contact'
      ? `New Contact Enquiry from ${name}`
      : `New Appointment Request — ${vehicle} — ${name}`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 32px; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #f5b800; font-size: 24px; margin: 0; text-transform: uppercase; letter-spacing: 4px;">OPTUM CAR CARE</h1>
          <p style="color: #666; font-size: 12px; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">New ${formType === 'contact' ? 'Contact Enquiry' : 'Appointment Request'}</p>
        </div>
        
        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; width: 140px;">Full Name</td>
            <td style="padding: 10px 0; color: #fff; font-size: 14px; font-weight: bold;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Email</td>
            <td style="padding: 10px 0; color: #f5b800; font-size: 14px;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Phone</td>
            <td style="padding: 10px 0; color: #fff; font-size: 14px;">${phone || '—'}</td>
          </tr>
          ${vehicle ? `
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Vehicle</td>
            <td style="padding: 10px 0; color: #fff; font-size: 14px;">${vehicle}</td>
          </tr>
          ` : ''}
          ${service ? `
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Service</td>
            <td style="padding: 10px 0; color: #fff; font-size: 14px;">${service}</td>
          </tr>
          ` : ''}
          ${message ? `
          <tr>
            <td style="padding: 10px 0; color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; color: #ccc; font-size: 14px; line-height: 1.6;">${message}</td>
          </tr>
          ` : ''}
        </table>
        
        <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
        <p style="color: #444; font-size: 10px; text-align: center; letter-spacing: 2px; text-transform: uppercase;">
          Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Optum Car Care Website" <${process.env.EMAIL_USER || 'noreply@optumcarcare.com'}>`,
      to: destinationEmail,
      replyTo: email,
      subject: subjectLine,
      html: htmlBody,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    // Still return success to user even if email fails in dev (no SMTP configured yet)
    // Remove the line below in production once SMTP is configured
    return NextResponse.json({ success: true, warning: 'Email not sent — SMTP not configured yet' });
  }
}
