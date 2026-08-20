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
- `RESEND_API_KEY` y `CONTACT_FROM_EMAIL` — formulario de contacto (`/api/contact`).
- `NEXT_PUBLIC_SITE_URL` — base de metadata/OG; si falta, cae a un placeholder (ver `docs/pendientes.md`).
- `NEXT_PUBLIC_SANITY_DATASET` — presente históricamente pero **ignorada por el código**: el dataset está fijado a `production`.
- `SANITY_API_WRITE_TOKEN` — sin consumidores en el código; se conserva en el entorno para tooling manual futuro.

## Estructura

`src/app` (rutas; grupo único `(site)`; `/studio` y `/api` fuera del shell) · `src/components` · `src/lib` (cliente Sanity, queries, datos de Contact, fallbacks locales) · `src/sanity` (config + schemas) · `src/types` · `docs/` (plan maestro, pendientes, bitácora, reportes, instrucciones).

## CMS

Sanity Studio embebido en `/studio`. La carga de contenido se explica a las clientas por video, no por guía escrita.

## Método de trabajo

Este repo se trabaja con instrucciones de ejecución generadas en la capa de planificación (develOP). **Leé `CLAUDE.md` antes de tocar nada**; los registros del método viven en `docs/`.
