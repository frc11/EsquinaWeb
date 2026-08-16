# CLAUDE.md — Esquina Estudio

Guía operativa para agentes que trabajan sobre este repositorio.

**Regla de lectura:** este documento separa **ESTADO** (verificado contra el código en HEAD) de **PLAN** (decidido, todavía no ejecutado). No trates el PLAN como código existente, y no «corrijas» el código hacia versiones viejas de este archivo.

Última sincronización: **2026-08-15** (Bloque 1), sobre la auditoría completa `docs/reportes/2026-08-13-auditoria-completa.md` (HEAD `2565d01`). Antes de ejecutar cualquier sprint: leer `docs/plan-maestro.md` y la última entrada de `docs/bitacora.md`. Ante conflicto entre este archivo y el plan maestro, **manda el plan maestro**.

## 1. Proyecto y stack — ESTADO

- Portfolio de Esquina Estudio (estudio de branding). Producción en Netlify. **Desktop-first**; la adaptación mobile es una ronda futura separada.
- Raíz git: `C:/EsquinaWeb`. Proyecto Next: `esquina-estudio/`.
- Next.js **16.2.6** (pin exacto, App Router, Turbopack) · React **19.2.4** (pin) · TypeScript estricto · Tailwind **v4** · Framer Motion 12 · GSAP 3 (`ScrollTrigger` se importa de `gsap/ScrollTrigger`) · Lenis = paquete legacy **`@studio-freight/lenis`** · next-sanity · react-hook-form + zod **v4** · resend · sharp (devDependency).
- Scripts: `dev`, `build`, `start`, `lint`. No hay tests ni typegen.
- `netlify.toml`: solo `command = "npm run build"` + plugin de Next. Sin redirects, headers ni env.
- Variables leídas por el código: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL` (hoy ausente de `.env.local` → `metadataBase` cae a un placeholder; ver pendientes). `NEXT_PUBLIC_SANITY_DATASET` existe en `.env.local` pero **nadie la lee** (dataset hardcodeado). `SANITY_API_WRITE_TOKEN` queda en el entorno **sin consumidores en el código** (el seeder `/api/seed-sanity` fue eliminado en B1; tooling de escritura futuro = script local con guard, nunca ruta pública).
- **`AGENTS.md` (raíz del proyecto) es vinculante y complementa a este archivo:** Next 16 trae breaking changes respecto de versiones anteriores, y el conocimiento general del modelo suele estar desactualizado. Antes de escribir código de Next (rutas, caching, `searchParams`, APIs de servidor), consultar las docs embarcadas en `node_modules/next/dist/docs/` — son las de la versión exacta instalada. Precedente: la semántica de `force-dynamic` de la auditoría se resolvió así.

## 2. Identidad visual — ESTADO

- Colores: off-white `#F3F3F3` · off-black `#0F0F0F` · beige `#EFEEDA` · gris `#939393` (`gray-brand` en `@theme`).
- Tipografía: **Manrope variable 300–800**, local (`src/app/layout.tsx:6-10`). `--header-height: 128px`. `::selection` global invertida. Scrollbars ocultas globalmente. `--font-display` y `--font-body` apuntan **a la misma familia** (`globals.css:22-23`): la jerarquía del sitio se construye por escala y peso, no por contraste de familias.
- `--footer-height: 480px` y `--cursor-size(-hover)` existen en `globals.css` pero **no los consume nadie** (el footer real en flujo mide 166 px). Los 5 tokens de font-size del `@theme` están **huérfanos**: el patrón vigente es el valor arbitrario por componente (`text-[13px]`, `text-[40px]`, …). Adoptarlos o borrarlos es decisión del ritual de B2 — no lo resuelvas por tu cuenta.
- Todas las reglas de `globals.css` (salvo el `@theme`) están **fuera de `@layer`**: le ganan a cualquier utility. Para sobreescribir desde un componente: `!important` del lado layered, scopeado. Precedente correcto: `SCOPED_SELECTION` en `ContactForm.tsx:43-44`.
- Cursor custom: punto fijo de 16 px (`h-4 w-4`, `mix-blend-difference`), activado por `body[data-custom-cursor]`; excluido de `/studio` por early-return de `RootClientShell`.

## 3. Shell, transiciones, preloader y scroll — ESTADO

- Cadena: `html > body > RootClientShell > PreloaderProvider > CustomCursor + LoadingScreen > (site)/layout: SmoothScrollProvider > RouteTransitionProvider > Navbar + PageTransitionShell( main + Footer )`. Route group único `(site)`; `/studio` y `/api` quedan **fuera** del shell.
- La transición de página **no usa `AnimatePresence` ni key**: es una interpolación de opacidad gobernada por un booleano (`isLeaving`) más un overlay off-white. El disparo es un listener de click en fase de captura a nivel documento, con `router.push` diferido 650 ms. `template.tsx` se remonta en cada navegación (ahí mueren los estados de página); Navbar, Footer y providers persisten.
- Preloader: cortina de 2700 ms **solo la primera visita por pestaña** (`sessionStorage["esquina:preloaderShown"]`). En recarga a mitad de sesión la ventana es **0 ms** y el contenido llega servido a opacidad 0 con fade de 0,5 s. `RevealOnScroll` lee `usePreloader()` → **todo consumidor suyo queda gateado por el preloader de forma transitiva**.
- Lenis corre **solo** en `/team` y `/work*`. En el resto el scroll es nativo. `/services` setea `history.scrollRestoration = "manual"` de forma global y **no lo restaura al salir**.
- No existen `loading.tsx`, `error.tsx` ni `not-found.tsx` en `src/app/`.

## 4. Mapa de secciones — ESTADO

- `/` Home: `(site)/page.tsx` + `sections/home/Hero.tsx` — estática.
- `/work`: `work/page.tsx` + `sections/work/WorkGrid.tsx` + `ProjectCard.tsx` — estática, fetch con `revalidate: 60`, fallback local.
- `/work/[slug]`: `page.tsx` + `ProjectDetailClient.tsx` + `ProjectContentRenderer.tsx` — SSG (slugs del dataset), nav prev/next.
- `/services`: `services/page.tsx` (catálogo **hardcodeado** en el archivo) + `ServicesPageClient.tsx` + `sections/services/{ServicesIntro,ServicesStack,ServiceItem}.tsx` — estática; el intro es un scroll-jack con máquina de estados propia (S0–S5, latch `isStatic` sin retorno).
- `/team`: `team/page.tsx` + `sections/team/TeamSection.tsx` — estática, texto hardcodeado; placeholder visible `VIDEO O GIF` (contenido pendiente de las clientas).
- `/fun-gallery`: `fun-gallery/page.tsx` (**`force-dynamic`** + `randomUUID()` por request) + `sections/gallery/FunGallery.tsx` — ESTADO: deriva su pool de los `project` (7 imágenes hoy). Ver PLAN en §5.
- `/contact`: `contact/page.tsx` (dinámica por `searchParams` `?service=`) + `sections/contact/{ContactForm,ContactSuccess}.tsx` + `lib/contact.ts` — scroll natural, aside sticky, selección scopeada ya implementada.
- `/contact/success`: estática. `/studio/[[...tool]]`: Sanity Studio embebido. `/api/contact`: route handler de Resend.

## 5. Sanity — ESTADO y PLAN

**ESTADO:** un solo schema, `project` (`src/sanity/schemas/project.ts`), registrado en `src/sanity/sanity.config.ts:4` y `:14` (sin auto-discovery). Solo `title` y `slug` son requeridos; **ninguna imagen tiene campo `alt`**; sin groups/fieldsets; desk por defecto. Cliente de lectura **sin token**, `useCdn: true`, dataset `production` **hardcodeado**. Tipos TS **escritos a mano** en `src/types/` (sin typegen; ya divergen del schema: `alt` fantasma). `urlFor` es un wrapper con stub de fallback (el stub no expone `format()`/`fit()`). Queries en `src/lib/sanity.queries.ts`; caché **solo per-fetch**. Dataset al 2026-08-14: 4 `project` publicados. Los fallbacks locales (`local-projects.ts`: 8, `mock-data.ts`: 8) tienen slugs inconsistentes entre sí y con el dataset: **no** usarlos como proxy del contenido real.

**PLAN (no implementar sin sprint que lo indique):** B3 crea el schema `funGalleryImage` (imagen + alt + order + referencia opcional a `project` — sería el **primer uso de referencias** del repo) y suma casillas ES a `project` (los campos actuales quedan como EN; fallback cruzado; pares agrupados con fieldsets). **La regla vieja «Fun Gallery no tiene schema propio / no crear schemas nuevos» queda derogada:** los schemas se crean cuando el plan maestro lo indica. Sigue vigente: Sanity simple para editoras no técnicas — labels en inglés con ejemplo entre paréntesis, agrupación clara, nada técnico expuesto.

## 6. Primitivos compartidos y contratos frágiles — ESTADO

- **`HoverButton`**: 11 call sites en 6 archivos (Navbar, Footer, Hero, ContactForm, ServiceItem, ServicesIntro). **No define font-size**: cada consumidor porta el suyo. `FunGallery.tsx` **no** lo importa; el riesgo con la galería es indirecto (Navbar/Footer con `blend` renderizados encima). Tocarlo es global: no modificarlo desde un sprint de sección.
- **`RevealOnScroll`**: 2 consumidores (TeamSection ×4, ServiceItem ×1), gateado por preloader.
- Sistemas de «aparecer» conviven **5**: 2 por scroll (inline de WorkGrid, `y:40` + stagger 0.7; `RevealOnScroll`) + 3 de entrada artesanales (Hero con `staggerChildren`, `RevealLine` de ServicesIntro, variants de Contact). GSAP en Services **no** es reveal: es estado de scroll (colapso de ítems + `hasReachedEnd`).
- Contratos frágiles conocidos (romperlos falla en silencio):
  - `TITLE_1_LINE_COUNT` (ServicesIntro) y `TITLE_LINE_COUNT` (Hero) son **literales desacoplados** de sus arreglos de líneas; convertir a `lines.length` cuando se toquen esos archivos.
  - Centinela `"Applications may include:"` entre `services/page.tsx` y `ServiceItem.tsx:73-80` (split por `.includes()`).
  - `?service=` une los `name` del catálogo de Services con `ContactForm` (`resolveWorkTypeFromService`).
  - `id="services-list"` es el destino del salto del intro (guard silencioso si falta).
  - El contrato de altura del intro son **dos literales duplicados** `h-[200vh]` (`ServicesIntro.tsx:545` y `:569`): editar una sola rama rompe el swap sin error de build.

## 7. Lecciones verificadas (junio 2026 — siguen válidas)

- `transform-gpu` puede dejar una capa de compositor stale (hairline anti-aliased persistente). Se resolvió quitándolo del span externo de `HoverButton` y empujando el idle fill a 110%.
- Los artefactos sub-pixel de transforms de centrado **dependen del DPR**: lo visible a DPR1/100% puede ser invisible en Retina. El umbral cosmético se decide con eso en mano.
- `template.tsx` debe ser **solo opacidad** (sin transform ni overflow) o mata los `position: sticky` de las páginas (fix coordinado `b634521`).
- `sticky` exige ancestros sin `overflow: hidden/clip`; `ServicesIntro.tsx:444-482` fuerza `overflow: visible` en ancestros exactamente por eso.
- En esta etapa, el fix de una línea (`md:top-48`, opacidad idle) suele ganarle a la solución arquitectónica.

## 8. Reglas innegociables

1. Tipado estricto, sin atajos de conveniencia.
2. **No agregar librerías de terceros** sin decisión cerrada en el plan (el i18n se hace a mano por decisión).
3. Respetar el stack y las decisiones cerradas (Framer/GSAP/Lenis tal como están; no migrar nada por iniciativa).
4. **Preservar animaciones e identidad visual** salvo instrucción explícita del sprint.
5. Un objetivo por sprint; scope explícito; **no ampliar alcance por iniciativa propia**. Bifurcación real → frenar y reportar.
6. Nada destructivo: sin `rm` de shell (usar `git rm`), sin `git push`, sin tocar producción, Netlify ni el dataset de Sanity salvo instrucción.
7. Sanity simple para las editoras: labels con ejemplo, agrupación, nada técnico expuesto.
8. **Causa raíz, no parches.** Antes de tocar, inspeccionar y entender lo que ya existe. Si un síntoma se puede tapar o resolver de fondo, se resuelve de fondo. No apilar arreglos sobre arreglos.
9. **Refinar antes que reconstruir.** Ante código que funciona, la opción por defecto es ajustarlo, no reemplazarlo. Reescribir un módulo entero requiere que el sprint lo pida de forma explícita.
10. **No duplicar sistemas.** Si ya existe un primitivo, un hook o un patrón que resuelve el problema, se reusa; no se crea uno paralelo. Este repo ya arrastra cinco implementaciones de «aparecer» (§6): no agregar la sexta. Cuando un sprint pida capacidad genuinamente nueva (por ejemplo un scroll-spy continuo, que hoy no existe), se construye **una** y se documenta acá.
11. **Eliminar lo obsoleto.** Cuando un cambio deja código sin consumidores, se borra en el mismo sprint — no se deja «por si acaso». (Verificar con grep antes de borrar.)
12. **Jerarquía de prioridades, en este orden:** calidad de diseño > mantenibilidad > puntaje de rendimiento > conveniencia de implementación. Ante un conflicto, gana la de más arriba; si la de arriba obliga a sacrificar mucho de la de abajo, es una bifurcación: frenar y reportar.

### Directiva estética (aplica a todo trabajo visual)

- **Identidad monocromática.** Off-white / off-black / gris, más el beige como acento puntual. Los colores fuertes que aparecen en pantalla son **contenido** (portadas de proyectos, `coverColor` de Sanity), nunca cromo de interfaz.
- **Nada de estética SaaS:** sin tarjetas con sombra decorativa, sin gradientes genéricos, sin bordes redondeados de dashboard, sin iconografía de librería, sin patrones de componente de producto.
- **Peso visual por escala y composición, no por negritas.** La jerarquía se construye con tamaño, espacio y posición; el énfasis por peso tipográfico es la excepción deliberada (p. ej. una palabra en `font-semibold`), no la herramienta por defecto.
- **Nada de motion gratuito.** Toda animación tiene una razón; las existentes tienen timings afinados a mano. No agregar transiciones «para que se sienta vivo» ni cambiar duraciones/easings sin que el sprint lo pida.
- **Sin navegación hamburguesa en desktop** ni patrones de componente que rompan el lenguaje editorial del sitio.
- Ante duda estética real: **frenar y reportar**. La decisión visual es humana (§9).

## 9. Método de trabajo — VIGENTE

- La capa de planificación (chat) produce instrucciones `.md`; este agente ejecuta **exactamente** lo instruido.
- Ejecución **secuencial en `main`, sesión única**. **No existen subagentes por carril ni `.claude/agents/`**: el método de junio fue reemplazado; no intentes reproducirlo.
- Registros: al cerrar cada sprint, **apendear** la entrada en `docs/bitacora.md` (nunca sobrescribir). El plan maestro y los pendientes los mantiene la capa de planificación.
- Puertas de calidad: `npm run lint` y `npm run build` dentro de `esquina-estudio/` (**ECC no está instalado** en este repo). La verificación visual/comercial es humana y se declara pendiente por escrito en cada reporte.
- Antes de escribir código de Next: leer `AGENTS.md` y las docs embarcadas de la versión instalada (§1). No asumir APIs de memoria.

## 10. Plan de la ronda — resumen

Ronda de devoluciones de las clientas (fuente: `Final.pdf`, 2026-08-13). **B1 Fundación** (docs y limpieza) → **B2 Devoluciones visuales** sobre lo existente (home, menú 17/0, footer nuevo global, Team, Work grid 5:4, Contact compacto) → **B3 Rediseños** (Fun Gallery con schema propio + Services con sidebar/spy; arranca con la sonda de transparencia) → **B4 Idioma EN/ES** (toggle en header, diccionario, consumo bilingüe de Sanity). Detalle, decisiones cerradas y estado: `docs/plan-maestro.md`.
