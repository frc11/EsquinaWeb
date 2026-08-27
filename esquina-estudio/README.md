# Esquina Estudio — sitio web

Portfolio editorial monocromo de **Esquina Estudio** (estudio de branding, Tucumán, Argentina). Next.js App Router + Sanity CMS. Deploy en Netlify.

## Stack

Next.js 16.2.6 · React 19.2.4 · TypeScript · Tailwind v4 · Framer Motion 12 · GSAP 3 (ScrollTrigger) · `@studio-freight/lenis` · next-sanity · react-hook-form + zod v4 · Resend.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run start
npm run lint
```

## Variables de entorno (`.env.local`; no hay plantilla versionada)

- `NEXT_PUBLIC_SANITY_PROJECT_ID` — requerida; sin ella el sitio cae a los datos locales de fallback.
- `RESEND_API_KEY` y `CONTACT_FROM_EMAIL` — formulario de contacto (`/api/contact`). `CONTACT_FROM_EMAIL` es el remitente; si falta cae a `ESQUINA ESTUDIO <onboarding@resend.dev>`, el dominio de prueba de Resend.
- `CONTACT_TO_EMAIL` — casilla a la que llega el cuestionario de contacto. Si falta, `esquina.est@gmail.com`. Se cambia desde el panel del hosting: no hace falta tocar el código ni desplegar.

  > **Resend, dominio de prueba.** Mientras el remitente sea `@resend.dev` y la cuenta no tenga un dominio propio verificado, Resend **solo acepta como destinatario la dirección de la dueña de la cuenta** y responde `403 validation_error` con cualquier otra — el formulario devuelve 500 y la clienta ve «No pudimos enviar tu mail». Para que el correo llegue a `esquina.est@gmail.com` hay que verificar un dominio propio en [resend.com/domains](https://resend.com/domains) y poner `CONTACT_FROM_EMAIL` en una dirección de ese dominio. Hasta entonces, `CONTACT_TO_EMAIL` sirve de puente: apuntándola a la dirección dueña de la cuenta, el formulario funciona.
- `NEXT_PUBLIC_SITE_URL` — base de metadata/OG; si falta, cae a un placeholder (ver `docs/pendientes.md`).
- `NEXT_PUBLIC_SANITY_DATASET` — presente históricamente pero **ignorada por el código**: el dataset está fijado a `production`.
- `SANITY_API_WRITE_TOKEN` — sin consumidores en el código; se conserva en el entorno para tooling manual futuro.

## Estructura

`src/app` (rutas; grupo único `(site)`; `/studio` y `/api` fuera del shell) · `src/components` · `src/lib` (cliente Sanity, queries, datos de Contact, fallbacks locales) · `src/sanity` (config + schemas) · `src/types` · `docs/` (plan maestro, pendientes, bitácora, `reportes/`; el material histórico de la ronda —mockups, instrucciones y demás— está en `docs/archivo/`, con su propio `README.md`).

## CMS

Sanity Studio embebido en `/studio`. La carga de contenido se explica a las clientas por video, no por guía escrita.

## Método de trabajo

Este repo se trabaja con instrucciones de ejecución generadas en la capa de planificación (develOP). **Leé `CLAUDE.md` antes de tocar nada**; los registros del método viven en `docs/`.
