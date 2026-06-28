import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingConfirmation({ to, name, service, date, time }) {
  await transporter.sendMail({
    from:    `"Serenova" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Confirmed — ${service}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:auto;background:#0f0f0f;color:#fff;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;letter-spacing:4px;font-size:24px;">SERENOVA</h1>
        <p style="color:#9a9a9a;font-size:13px;">Luxury Salon & Spa, Banjara Hills, Hyderabad</p>
        <hr style="border-color:#222;margin:24px 0"/>
        <h2 style="font-size:20px;">You're booked, ${name}.</h2>
        <p style="color:#9a9a9a;">Your appointment has been confirmed.</p>
        <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin:24px 0;">
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
        </div>
        <p style="color:#9a9a9a;font-size:12px;">We look forward to seeing you. Please arrive 10 minutes early.</p>
        <p style="color:#C9A84C;font-size:12px;margin-top:32px;">SERENOVA · Banjara Hills · Hyderabad</p>
      </div>
    `,
  });
}

export async function sendCancellationEmail({ to, name, service, date }) {
  await transporter.sendMail({
    from:    `"Serenova" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Booking Cancelled — ${service}`,
    html: `
      <div style="font-family:Georgia,serif;max-width:520px;margin:auto;background:#0f0f0f;color:#fff;padding:40px;border-radius:12px;">
        <h1 style="color:#C9A84C;letter-spacing:4px;">SERENOVA</h1>
        <hr style="border-color:#222;margin:24px 0"/>
        <h2>Booking Cancelled</h2>
        <p style="color:#9a9a9a;">Hi ${name}, your booking has been cancelled.</p>
        <div style="background:#1a1a1a;border-radius:8px;padding:20px;margin:24px 0;">
          <p><strong>Service:</strong> ${service}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>
        <p style="color:#9a9a9a;font-size:12px;">Book again anytime at serenova.vercel.app</p>
      </div>
    `,
  });
}