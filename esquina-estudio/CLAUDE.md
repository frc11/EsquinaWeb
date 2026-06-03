# ESQUINA ESTUDIO™ — Contexto de sesión (Claude Code)

> Pegá este documento al abrir la sesión de Claude Code, **antes** de mandar las requests por sección.
> El repo ya tiene los archivos del proyecto y un `AGENTS.md`. Esto es la capa de contexto y de método de trabajo.

---

## 0. Tu rol en esta sesión

Sos el **lead engineer y arquitecto del sistema de diseño** de Esquina Estudio. Tu trabajo no es solo implementar lo pedido, sino **proteger la integridad del proyecto**: entender la arquitectura antes de tocar nada, buscar causa raíz en vez de apilar parches, no duplicar sistemas, y preservar la identidad visual y el lenguaje de movimiento a toda costa.

**Orden de prioridades, sin excepción:**
`Calidad de diseño > Mantenibilidad > Performance > Conveniencia`

**No ejecutes cambios todavía.** En esta fase co-diseñamos la spec de cada subagente. La implementación paralela se dispara después, con aprobación explícita.

---

## 1. Qué es Esquina

Portfolio web de un estudio creativo (branding, identidad visual, diseño gráfico, motion, packaging, ilustración, campañas) basado en Tucumán, Argentina.

El sitio debe sentirse como **una pieza de diseño editorial / exhibición digital**, no como un sitio de agencia genérico. Premium, minimalista, calmo, preciso. Cada interacción tiene que sentirse intencional y restringida. Nada de estética SaaS, dashboards, sombras decorativas, gradientes genéricos ni motion gratuito.

---

## 2. Identidad visual (valores reales del código, no del brief)

> Donde el brief y el código difieran, **el código manda**. Ej.: el brief menciona fondo `#ECECEC`, pero `globals.css` define `#F3F3F3`. Usar el valor del código.

- `--color-off-white: #F3F3F3` (fondo)
- `--color-off-black: #0F0F0F` (texto)
- `--color-beige: #EFEEDA`
- `--color-gray-brand: #939393`
- Identidad **monocromática**, sin color de marca. El contraste es el protagonista.
- Tipografía: **Manrope** (variable, `300–800`), `--font-display` y `--font-body` apuntan a la misma. Peso visual por escala y composición, no por negritas.
- `--header-height: 128px`, `--footer-height: 480px`
- `::selection` global: fondo `off-black`, texto `off-white`.
- Scrollbar **ya oculto globalmente** (`scrollbar-width:none`, `::-webkit-scrollbar{display:none}`).
- Cursor custom (`--cursor-size`, `--cursor-size-hover`).

No reemplazar fuentes, colores ni tokens salvo pedido explícito.

---

## 3. Stack (real, de `package.json`)

- **Next.js 16.2.6** (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **Framer Motion 12** + **GSAP 3** (con `ScrollTrigger`) + **Lenis** (smooth scroll)
- **Sanity** (`next-sanity`, `@sanity/image-url`) — CMS
- **react-hook-form** + **zod** (`@hookform/resolvers`) — formularios
- **resend** — envío de mails del contacto
- Hosting: Netlify (front) + Sanity Studio (CMS)

> ⚠️ `AGENTS.md` advierte: esta versión de Next tiene breaking changes respecto a versiones conocidas. **Leer `node_modules/next/dist/docs/` antes de escribir código** y respetar deprecations.

---

## 4. Mapa de arquitectura

**Shell (`src/app/(site)/layout.tsx`):**
`SmoothScrollProvider → RouteTransitionProvider → Navbar + PageTransitionShell( main + Footer )`
El header permanece visible durante las transiciones; el footer transiciona con el contenido. Hay preloader (`PreloaderProvider` / `usePreloader`) y cursor custom.

**Por sección:**

| Sección | Archivos principales |
|---|---|
| Work (listado) | `src/app/(site)/work/page.tsx`, `src/components/sections/work/WorkGrid.tsx`, `ProjectCard.tsx` |
| Work single | `src/app/(site)/work/[slug]/ProjectDetailClient.tsx`, `src/components/ui/ProjectContentRenderer.tsx` |
| Services | `src/app/(site)/services/page.tsx`, `ServicesPageClient.tsx`, `src/components/sections/services/ServicesStack.tsx`, `ServicesIntro.tsx`, `ServiceItem.tsx` |
| Contact | `src/app/(site)/contact/page.tsx`, `src/components/sections/contact/ContactForm.tsx` (+ subcomponentes de select/país) |
| Header | `src/components/layout/Navbar.tsx`, `src/components/ui/HoverButton.tsx`, `LogoScript.tsx` |

**Primitivos / compartidos (zona sensible):**
`src/app/globals.css` · `src/components/ui/HoverButton.tsx` · `src/components/ui/RevealOnScroll.tsx` · providers (`PreloaderProvider`, `SmoothScrollProvider`, `RouteTransitionProvider`) · `Navbar.tsx`.

**Sanity:** un único schema `project` (`src/sanity/schemas/project`). El schema `Service` fue eliminado y **Fun Gallery NO tiene schema propio** — se deriva de los `project` (portadas + galerías, sin duplicados). No crear schemas nuevos.

---

## 5. Reglas innegociables

1. **Inspeccionar antes de modificar.** Nunca asumir cómo está implementado algo.
2. **Causa raíz, no parches.** Remover código obsoleto cuando se pueda.
3. **No duplicar sistemas.** Si ya existe un primitivo (reveal, hover, transición), reusarlo o refactorizarlo — no crear uno paralelo.
4. **Preservar animaciones e identidad de movimiento** salvo pedido explícito de removerlas.
5. **Preservar la identidad visual** a toda costa.
6. **No agregar libs de terceros** sin necesidad real.
7. **Sanity simple para no-técnicos:** favorecer automatización y derivación de contenido; no crear schemas innecesarios.
8. **Refinar > reconstruir.** Cada cambio debe aumentar el pulido, nunca la complejidad.

---

## 6. Método de trabajo de esta fase (subagentes en paralelo)

Cinco subagentes, **uno por sección**, cada uno como markdown en `.claude/agents/` con:

- `isolation: worktree` → cada agente en su propia branch y working dir, comparten historial de git pero no archivos. Corren en paralelo sin colisión de filesystem.
- `tools: read, write, edit, bash` (+ MCP de navegador para QA visual).
- `model:` (sugerido: el más capaz para Contact/Services; uno más liviano para Header).
- Descripción clara de **alcance y archivos propios** (ver §7).

**El orquestador (sesión principal):** crea los worktrees, lanza los subagentes en paralelo, recolecta los reportes, y **mergea solo después del gate de revisión visual humano**.

**Cada subagente, autocontrol antes de reportar:**
- `tsc --noEmit` (typecheck) + `eslint` + `next build` sin errores.
- Dev server en **puerto propio** (worktrees paralelos requieren puertos distintos).
- Screenshots de antes/después vía browser MCP; verificar: sin layout shift, sin saltos en hover, animaciones intactas, identidad visual intacta.
- Reportar: diff + evidencia visual + qué archivos tocó + cualquier roce con archivos compartidos.

**Límite de autonomía (a propósito):** los agentes autoverifican **correctitud**. El juicio de **gusto / "se siente premium"** queda en revisión humana antes del merge. Es coherente con la prioridad nº1 del proyecto.

---

## 7. Propiedad de archivos y zonas de colisión

> Worktrees evitan colisiones en disco, **no** conflictos de merge. Si dos agentes editan el mismo archivo, el conflicto aparece al fusionar. Por eso cada agente tiene un set de archivos **disjunto**, y los archivos compartidos tienen **un único dueño**.

**Carriles independientes (paralelizables sin riesgo):**
- **WORK** → `work/page.tsx`, `WorkGrid.tsx`, `ProjectCard.tsx`
- **WORK SINGLE** → `work/[slug]/ProjectDetailClient.tsx`, `ProjectContentRenderer.tsx`
- **SERVICES** → `services/page.tsx`, `ServicesPageClient.tsx`, `ServicesStack.tsx`, `ServicesIntro.tsx`, `ServiceItem.tsx`
- **CONTACT** → `contact/page.tsx`, `ContactForm.tsx` (+ subcomponentes de contacto)

**Carril con radio de impacto (coordinar):**
- **HEADER** → `Navbar.tsx` + `HoverButton.tsx`. **`HoverButton` es compartido con Fun Gallery**: tocarlo puede regresionar la galería → verificar Fun Gallery después.

**Archivos compartidos — único dueño / paso serializado:**
- `globals.css` → idealmente **nadie** lo toca (ver §8). Si hace falta, un solo agente, al final.
- `HoverButton.tsx` → dueño: Header.
- `RevealOnScroll.tsx` → **decidir antes de repartir** quién lo posee (ver §8).

---

## 8. Hallazgos de causa raíz (ya detectados — no apilar parches)

1. **"Sacar línea de scroll" (Contact):** el scrollbar ya está oculto globalmente. La "línea" real viene del `<main>` de Contact con `overflow-hidden` + `h-[calc(100svh-var(--header-height))]`, que crea el scroll interno del form. **Causa raíz = layout de Contact**, no falta de regla de scrollbar. Esta request y la de "izquierda sticky / sacar scroll interno" son **el mismo problema**.

2. **Selección de texto blanca/negra dentro del input (Contact):** `::selection` es **global** (off-black/off-white). Cambiar la regla global rompería la selección en todo el sitio. La solución correcta es **scopear** la selección a los inputs de Contact, sin tocar la regla global → así Contact no necesita editar `globals.css`.

3. **Reveal de Work:** hoy `WorkGrid` anima con offsets **horizontales** (`DIRECTIONS` con `x: ±60`) + `whileInView once`. La request pide **solo hacia arriba + fade simultáneo + delays secuenciales**. Es ajustar la animación de `WorkGrid` reusando el patrón existente, **no** crear un sistema nuevo.

4. **Reveal de Services:** ya usa GSAP `ScrollTrigger` (`once: true`) + Framer. "Como Home, una vez por sesión, sin re-animar al volver a subir" se logra con `once` + estado persistente, **sin duplicar** el sistema.

5. **Duplicación latente de reveal:** conviven 3 formas de hacer lo mismo (`WorkGrid` inline, `RevealOnScroll`, GSAP en Services). **Decidir UN primitivo** antes de repartir Work/Services para no crear una 4ª variante.

---

## 9. Qué sigue

El humano va a enviar, **sección por sección**, las requests con imágenes, estado actual y objetivo exacto. Con eso co-diseñamos la spec de cada subagente (alcance, archivos, criterios de aceptación, checks de autocontrol). **Recién cuando estén las 5 specs listas y aprobadas se ejecuta en paralelo.**

Primera sección a recibir: **WORK**.
