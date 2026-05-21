import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

const CONTACT_TO_EMAIL = "valenolme@gmail.com";
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL || "ESQUINA ESTUDIO <onboarding@resend.dev>";

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : "Not specified";
  }

  if (typeof value === "string") {
    return value.trim() || "Not specified";
  }

  return "Not specified";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value: unknown) {
  return `
    <tr>
      <td style="padding: 10px 14px; border-bottom: 1px solid #ddd; font-weight: 600; text-transform: uppercase;">
        ${escapeHtml(label)}
      </td>
      <td style="padding: 10px 14px; border-bottom: 1px solid #ddd;">
        ${escapeHtml(formatValue(value))}
      </td>
    </tr>
  `;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid form data", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const resend = new Resend(process.env.RESEND_API_KEY);

    const html = `
      <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.5;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">New project questionnaire</h1>
        <p style="margin: 0 0 24px;">A new contact form was submitted from ESQUINA ESTUDIO.</p>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          ${row("Full name", data.fullName)}
          ${row("Email", data.email)}
          ${row("Work type", data.workType)}
          ${row("Business type", data.businessType)}
          ${row("Industry", data.industry)}
          ${row("Country", data.country)}
          ${row("Timeline", data.timeline)}
          ${row("Budget", data.budget)}
          ${row("Hear about", data.hearAbout)}
        </table>
      </div>
    `;

    const result = await resend.emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      subject: "New project questionnaire — ESQUINA ESTUDIO",
      html,
      replyTo: data.email,
    });

    if (result.error) {
      console.error("Resend contact error:", result.error);
      return NextResponse.json(
        { error: "Could not send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);

    return NextResponse.json(
      { error: "Unexpected contact form error" },
      { status: 500 },
    );
  }
}
