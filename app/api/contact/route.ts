import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// This route talks to an SMTP server, so it must run on the Node.js runtime.
export const runtime = "nodejs";

/** Where contact messages are delivered (kept separate from the public email). */
const TO_ADDRESS = "prashant983869@gmail.com";

/**
 * Contact form endpoint — validates the payload and emails it to Prashant.
 *
 * Email delivery uses Gmail SMTP via Nodemailer. Set these in `.env.local`:
 *   GMAIL_USER            = your-gmail-address@gmail.com
 *   GMAIL_APP_PASSWORD    = a 16-char Google "App Password" (NOT your login)
 *
 * Create an App Password at https://myaccount.google.com/apppasswords
 * (requires 2-Step Verification enabled on the account).
 *
 * If the env vars are missing the route still validates and responds 200, but
 * logs a warning instead of sending — so local dev never hard-fails.
 */
export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const message = body.message?.trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  // Graceful fallback when email isn't configured yet.
  if (!user || !pass) {
    console.warn(
      "[contact] GMAIL_USER / GMAIL_APP_PASSWORD not set — message received but not emailed:",
      { name, email },
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: TO_ADDRESS,
      replyTo: `"${name}" <${email}>`, // Reply goes straight to the sender.
      subject: `New portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family:sans-serif;line-height:1.6">
          <h2 style="margin:0 0 12px">New portfolio message</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to send email:", err);
    return NextResponse.json(
      { error: "Couldn't send your message right now. Please email me directly." },
      { status: 502 },
    );
  }
}

/** Minimal HTML escaping so user input can't break the email markup. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
