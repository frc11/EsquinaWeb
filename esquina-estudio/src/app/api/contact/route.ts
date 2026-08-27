import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact";

/*
  EL DESTINATARIO ES CONFIGURACION, NO CODIGO
  ───────────────────────────────────────────
  `CONTACT_TO_EMAIL` decide a que casilla llega el cuestionario. Estuvo
  hardcodeada y cambiarla exigia un commit y un deploy; ahora se cambia desde
  el panel del hosting. El valor por defecto es la casilla del estudio, asi
  que si la variable falta el formulario sigue apuntando a donde corresponde.

  Ojo con Resend: mientras no haya un **dominio propio verificado**, la cuenta
  solo acepta como destinatario la direccion de la duena de la cuenta y
  responde 403 con cualquier otra. Eso no se arregla desde aca — se arregla
  verificando el dominio en resend.com/domains y poniendo el `from` en ese
  dominio. Hasta entonces, `CONTACT_TO_EMAIL` es la palanca para apuntar a una
  casilla que la cuenta si acepte, sin tocar el codigo. Ver el README.
*/
const DEFAULT_CONTACT_TO_EMAIL = "esquina.est@gmail.com";
const CONTACT_TO_EMAIL =
  process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_CONTACT_TO_EMAIL;
const CONTACT_FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL?.trim() ||
  "ESQUINA ESTUDIO <onboarding@resend.dev>";

/*
  EL ERROR DEL PROVEEDOR TIENE QUE QUEDAR ESCRITO
  ──────────────────────────────────────────────
  La pantalla le dice a la clienta un mensaje generico —no filtramos
  infraestructura a la vista—, pero del lado del servidor queda el codigo y el
  motivo exactos que devolvio Resend. Sin esto, un 500 es indistinguible de
  otro y hay que reproducirlo a mano para saber que paso.

  Se registran **el remitente y el destinatario** (son configuracion, y son
  justo lo que Resend rechaza) y **nada del formulario**: ni el nombre, ni el
  mail de quien escribe, ni el presupuesto. La clave de API nunca se toca.
*/
type ProviderErrorShape = {
  name?: unknown;
  message?: unknown;
  statusCode?: unknown;
};

function logProviderError(stage: string, error: unknown) {
  const shape = (error ?? {}) as ProviderErrorShape;
  const detail =
    error instanceof Error
      ? { name: error.name, message: error.message }
      : {
          name: typeof shape.name === "string" ? shape.name : "unknown_error",
          message:
            typeof shape.message === "string"
              ? shape.message
              : "Sin mensaje del proveedor",
          statusCode:
            typeof shape.statusCode === "number" ? shape.statusCode : undefined,
        };

  console.error(
    `[contact] ${stage} | from=${CONTACT_FROM_EMAIL} to=${CONTACT_TO_EMAIL} |`,
    JSON.stringify(detail),
  );
}

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
  if (!process.env.RESEND_API_KEY?.trim()) {
    console.error(
      "[contact] falta_config | RESEND_API_KEY no esta definida en el entorno",
    );

    return NextResponse.json(
      { error: "Could not send email" },
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
      logProviderError("resend_rechazo_el_envio", result.error);

      return NextResponse.json(
        { error: "Could not send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logProviderError("error_inesperado_de_la_ruta", error);

    return NextResponse.json(
      { error: "Could not send email" },
      { status: 500 },
    );
  }
}
