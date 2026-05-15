import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = contactSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid form data", issues: result.error.flatten() },
      { status: 400 },
    );
  }

  const data = result.data;
  const contactEmailTo = process.env.CONTACT_EMAIL_TO;

  if (!process.env.RESEND_API_KEY || !contactEmailTo) {
    return NextResponse.json(
      { error: "Contact email is not configured" },
      { status: 500 },
    );
  }

  const html = `
    <h2>New Inquiry — Esquina Estudio</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Looking to work on:</strong> ${data.workType.map(escapeHtml).join(", ")}</p>
    <p><strong>Business type:</strong> ${escapeHtml(data.businessType)}</p>
    <p><strong>Industry:</strong> ${escapeHtml(data.industry)}</p>
    <p><strong>Based in:</strong> ${escapeHtml(data.country)}</p>
    <p><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>
    <p><strong>Budget:</strong> ${escapeHtml(data.budget)}</p>
    <p><strong>How they heard:</strong> ${escapeHtml(data.hearAbout || "—")}</p>
  `;

  try {
    await resend.emails.send({
      from: "Esquina Estudio Web <noreply@yourdomain.com>",
      to: contactEmailTo,
      subject: `New inquiry from ${data.fullName}`,
      html,
      replyTo: data.email,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
