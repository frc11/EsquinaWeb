# CLAUDE.md — Esquina Estudio

Guía operativa para agentes que trabajan sobre este repositorio.

**Regla de lectura:** este documento separa **ESTADO** (verificado contra el código en HEAD) de **PLAN** (decidido, todavía no ejecutado). No trates el PLAN como código existente, y no «corrijas» el código hacia versiones viejas de este archivo.

Última sincronización: **2026-08-20** (cierre de B3.4, rediseño de `/services`); antes de eso, 2026-08-15 (Bloque 1) sobre la auditoría completa `docs/reportes/2026-08-13-auditoria-completa.md` (HEAD `2565d01`). Las secciones no tocadas por B3.4 siguen reflejando esa auditoría. Antes de ejecutar cualquier sprint: leer `docs/plan-maestro.md` y la última entrada de `docs/bitacora.md`. Ante conflicto entre este archivo y el plan maestro, **manda el plan maestro**.

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
- Lenis corre **solo** en `/team` y `/work*`. En el resto el scroll es nativo. **Nadie toca `history.scrollRestoration`**: B3.4 eliminó el `"manual"` global que seteaba `/services` (junto con el `ServicesPageClient.tsx` donde vivía), así que queda el default del navegador.
- No existen `loading.tsx`, `error.tsx` ni `not-found.tsx` en `src/app/`.

## 4. Mapa de secciones — ESTADO

- `/` Home: `(site)/page.tsx` + `sections/home/Hero.tsx` — estática.
- `/work`: `work/page.tsx` + `sections/work/WorkGrid.tsx` + `ProjectCard.tsx` — estática, fetch con `revalidate: 60`, fallback local.
- `/work/[slug]`: `page.tsx` + `ProjectDetailClient.tsx` + `ProjectContentRenderer.tsx` — SSG (slugs del dataset), nav prev/next.
- `/services`: **rediseñada en B3.4**. `services/page.tsx` es un **componente de servidor** —sin `<main>` anidado, como `/contact`— que compone `sections/services/{ServicesIntro,BrandingPacksHeading,ServicePackSection,ServicesSidebar,IntroScrollTrigger,LatestProjects,SpySentinel,ServicesArrow}` y trae las 4 portadas más recientes con `revalidate: 60`, así que clasifica `○ (Static)` como `/work`. **El scroll-jack ya no existe**: se fueron la máquina S0–S5, sus tres listeners con `preventDefault`, el lock de `body`, el acordeón con sus `ScrollTrigger`, los slideshows y el catálogo hardcodeado. El contenido vive en `src/lib/services-content.ts` (verbatim del PDF, listo para la variante ES de B4) y las medidas compartidas en `sections/services/services-layout.ts`. Cinco secciones —INTRO · CONSULTATION · 01 ESSENTIALS · 02 UNIVERSE · + ADD-ONS— con sidebar sticky y scroll-spy (§6), gatillo de un scroll en el intro (§6) y cierre LATEST PROJECTS. **GSAP quedó sin ningún consumidor en el repo** (sigue instalado; ver pendientes).
- `/team`: `team/page.tsx` + `sections/team/TeamSection.tsx` — estática, texto hardcodeado; placeholder visible `VIDEO O GIF` (contenido pendiente de las clientas).
- `/fun-gallery`: `fun-gallery/page.tsx` + `sections/gallery/FunGallery.tsx` — **estática**, fetch con `revalidate: 60` (B3.2 retiró `force-dynamic` y el `randomUUID()` por request). Lee del schema propio `funGalleryImage`: **ya no deriva de los `project`**. El seed del mapa se deriva de los `_id` en el orden de la query, así que el mismo contenido da siempre el mismo mapa. **Sin fallback local**: si el fetch falla hay pantalla de error, y con cero imágenes, pantalla de vacío (las dos en `page.tsx`). Pipeline de imagen: `w=1200&fm=webp` al CDN, sin prop `quality` en `<Image>`, `object-contain`, y la capa de parallax sin recorte (`inset-0`, sin `overflow-hidden`) porque con `contain` el overscan negativo recortaba el producto. El rediseño de la pantalla es B3.3.
- `/contact`: `contact/page.tsx` (dinámica por `searchParams` `?service=`) + `sections/contact/{ContactForm,ContactSuccess}.tsx` + `lib/contact.ts` — scroll natural, aside en flujo normal (sin sticky, B3.2b), selección scopeada ya implementada.
- `/contact/success`: estática. `/studio/[[...tool]]`: Sanity Studio embebido. `/api/contact`: route handler de Resend.

## 5. Sanity — ESTADO y PLAN

**ESTADO:** dos schemas, `project` y `funGalleryImage` (`src/sanity/schemas/`), registrados a mano en `src/sanity/sanity.config.ts` (imports `:4-5`, `types` `:15`; sin auto-discovery, sin barrel). En `project` solo `title` y `slug` son requeridos y **ninguna imagen tiene campo `alt`**; en `funGalleryImage` son requeridos `image` y `title`, y el alt vive en un campo hermano (`altText`), no dentro de la imagen. `funGalleryImage.linkedProject` es el **primer `reference` del repo**, y su desreferencia en la query el primer `->` documento-a-documento. Sin groups; `project` sí usa **tres `fieldsets`**, uno por par EN/ES (`nameGroup`, `categoryGroup`, `servicesGroup`). Desk por defecto. Cliente de lectura **sin token**, `useCdn: true`, dataset `production` **hardcodeado**. Tipos TS **escritos a mano** en `src/types/` (sin typegen; ya divergen del schema: `alt` fantasma). `urlFor` es un wrapper con stub de fallback; el stub expone `width`/`height`/`quality`/`format`/`url` (B3.2 le sumó `format()` para el pedido de la galería), **no** `fit()`. Queries en `src/lib/sanity.queries.ts`; caché **solo per-fetch**. Desde B3.4 son cuatro: la del grid, la de la ficha, la de la galería y `LATEST_PROJECTS_QUERY` (las 4 portadas del cierre de `/services`, por `_createdAt` descendente con `_id` de desempate y filtro `defined(coverImage.asset)`). **`order` y `_createdAt` no son lo mismo:** `order` es el orden editorial de `/work`, `_createdAt` es cuándo se cargó el documento. Dataset al 2026-08-19: 4 `project` publicados y **0 `funGalleryImage`** (el schema existe; el contenido lo cargan las clientas). Los fallbacks locales (`local-projects.ts`: 8, `mock-data.ts`: 8) tienen slugs inconsistentes entre sí y con el dataset: **no** usarlos como proxy del contenido real.

**PLAN (no implementar sin sprint que lo indique):** las casillas ES (`titleEs`, `categoryEs`, `servicesEs`) ya existen y **las queries ya las traen**, pero **nadie las renderiza**: el consumo bilingüe con fallback cruzado es de B4. El `content` de `project` **no** se traduce (decisión cerrada: duplicar el Portable Text duplicaría también los bloques de media). **La regla vieja «Fun Gallery no tiene schema propio / no crear schemas nuevos» queda derogada:** los schemas se crean cuando el plan maestro lo indica. Sigue vigente: Sanity simple para editoras no técnicas — labels en inglés con ejemplo entre paréntesis, agrupación clara, nada técnico expuesto.

## 6. Primitivos compartidos y contratos frágiles — ESTADO

- **`HoverButton`**: **10** call sites en 5 archivos (Navbar, Footer, Hero, ContactForm, ServicePackSection). **No define font-size**: cada consumidor porta el suyo. `FunGallery.tsx` **no** lo importa; el riesgo con la galería es indirecto (Navbar/Footer con `blend` renderizados encima). Tocarlo es global: no modificarlo desde un sprint de sección. **Lo que no sabe hacer:** subrayado que aparezca en hover — es un booleano fijo, y atarlo a un estado no sirve porque su relleno negro sube en el mismo gesto y taparía la línea. Los dos links de LATEST PROJECTS resuelven eso con una línea propia, local a esa sección; **no es un primitivo paralelo** y no se promueve a uno sin decisión.
- **`RevealOnScroll`**: **1** consumidor (TeamSection ×4), gateado por preloader. B3.4 se llevó el otro (`ServiceItem`).
- Sistemas de «aparecer» conviven **4**: 2 por scroll (inline de WorkGrid, `y:40` + stagger 0.7; `RevealOnScroll`) + 2 de entrada artesanales (Hero con `staggerChildren`, variants de Contact). El `RevealLine` de `ServicesIntro` desapareció con el desmontaje de B3.4.
- **Scroll-spy continuo — `ServicesSidebar` (B3.4).** Es el **único** del repo y el único sistema de scroll que no es de un disparo; si otra sección necesita uno, se reusa este, no se escribe un segundo. La regla: **manda la última sección cuyo tope cruzó la línea de lectura** (el borde inferior del header, 128 px); si ninguna la cruzó, gana la primera. Con dos secciones a la vista gana la de arriba, y en el hueco que no pertenece a ninguna —el encabezado BRANDING PACKS— sigue activa la anterior. Tres detalles que **no se pueden tocar sin volver a medir**, porque los tres salieron de medir y no de razonar:
  1. Se observa un **centinela de 1 px** pegado al tope de cada sección (`SpySentinel`), no la sección: una sección alta sigue intersecando mientras su tope cruza y nunca genera evento.
  2. El `rootMargin` corre el borde de la raíz **2 px por debajo** de la línea: uno lo come el alto del centinela y el otro el contacto de borde, que Chrome cuenta como intersección. Sin eso, un centinela apoyado exacto en la línea —que es donde aterriza un click del sidebar— no generaba evento y la flecha se quedaba atrás.
  3. Se observan los centinelas **y también las secciones**. Un salto instantáneo más largo que la ventana (`prefers-reduced-motion`, tecla `End`) puede llevar un centinela de «abajo de la raíz» a «arriba» sin pasar por «intersecando». Las secciones no tienen ese hueco porque cubren la zona sin baches.
  El observer es el **disparador**, no la respuesta: cuando avisa se recalculan de una las cinco posiciones. Por eso el resultado no depende de la dirección de llegada.
- **Gatillo del intro — `IntroScrollTrigger` (B3.4).** Un solo scroll hacia abajo estando arriba de todo baja suave hasta Branding Packs. Umbral acumulado de **60 px normalizados** (`deltaMode 1` × 100/3, igual que Lenis), reinicio de la cuenta a los 250 ms, y **estar arriba de todo es la única condición** —no hay booleano «armado» aparte—. **Es el único `preventDefault` de la ruta**, y solo mientras dura el desplazamiento: se registra al disparar y se da de baja al terminar, con un techo de tiempo. **No toca `document.body`.** Si algún día se agrega un segundo gesto en Services, tiene que convivir con este, no duplicarlo.
- Contratos frágiles conocidos (romperlos falla en silencio):
  - `TITLE_LINE_COUNT` (Hero) es un **literal desacoplado** de su arreglo de líneas; convertir a `lines.length` cuando se toque ese archivo. (El `TITLE_1_LINE_COUNT` de Services desapareció con B3.4, igual que el centinela `"Applications may include:"`, el `id="services-list"` y los dos `h-[200vh]` duplicados.)
  - `?service=` une `quoteService` de `src/lib/services-content.ts` con `ContactForm` (`resolveWorkTypeFromService`). Hoy son `CONSULTATION` y `BRANDING`, que resuelven por **match exacto** contra `WORK_TYPE_OPTIONS`; Add-ons manda `null` y el formulario abre sin nada marcado. **No se traduce en B4.**
  - Los `id` de las secciones de Services (`intro`, `consultation`, `essentials`, `universe`, `addons`) son a la vez ancla del sidebar, objetivo del spy y destino de los `href="#…"`. **No se traducen.** El destino del gatillo es otro: `branding-packs`, que **no** es sección del menú.
  - Tailwind v4 busca los nombres de clase como **literales** en el código: una clase compuesta en runtime (con `replace`, con plantillas) no llega nunca al CSS. Por eso `services-layout.ts` repite las clases enteras en vez de derivarlas.

## 7. Lecciones verificadas (junio 2026 — siguen válidas)

- `transform-gpu` puede dejar una capa de compositor stale (hairline anti-aliased persistente). Se resolvió quitándolo del span externo de `HoverButton` y empujando el idle fill a 110%.
- Los artefactos sub-pixel de transforms de centrado **dependen del DPR**: lo visible a DPR1/100% puede ser invisible en Retina. El umbral cosmético se decide con eso en mano.
- `template.tsx` debe ser **solo opacidad** (sin transform ni overflow) o mata los `position: sticky` de las páginas (fix coordinado `b634521`).
- `sticky` exige ancestros sin `overflow: hidden/clip`. El viejo `ServicesIntro` recorría los ancestros forzándoles `overflow: visible` por eso; **B3.4 lo eliminó y el sidebar sticky funciona sin ninguna de esas muletas**, así que la cadena real (`template` → `PageTransitionShell` → `main`) ya estaba limpia. No reintroducir el paseo por ancestros.
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
10. **No duplicar sistemas.** Si ya existe un primitivo, un hook o un patrón que resuelve el problema, se reusa; no se crea uno paralelo. Este repo arrastra cuatro implementaciones de «aparecer» (§6): no agregar la quinta. Cuando un sprint pide capacidad genuinamente nueva se construye **una** y se documenta en §6 — así se hizo con el **scroll-spy continuo** y con el **gatillo del intro** en B3.4, que ya existen y se reusan, no se reescriben.
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

Ronda de devoluciones de las clientas (fuente: `Final.pdf`, 2026-08-13). **B1 Fundación** (docs y limpieza) → **B2 Devoluciones visuales** sobre lo existente (home, menú 17/0, footer nuevo global, Team, Work grid 5:4, Contact compacto) → **B3 Rediseños** (Fun Gallery con schema propio + Services con sidebar/spy; arrancó con la sonda de transparencia y **cerró con B3.4**) → **B4 Idioma EN/ES** (toggle en header, diccionario, consumo bilingüe de Sanity). Detalle, decisiones cerradas y estado: `docs/plan-maestro.md`.
