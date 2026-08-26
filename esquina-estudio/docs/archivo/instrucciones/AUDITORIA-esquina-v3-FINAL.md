# AUDITORÍA COMPLETA DEL REPO — Esquina Estudio (v3, final)

> Instrucción de relevamiento. **No modifica código.** Es el paso previo a planificar la ronda de cambios del `Final.pdf`.

---

## CÓMO CORRERLA

- **Modelo:** Opus (familia más capaz). La auditoría alimenta decisiones de arquitectura, no es un barrido mecánico.
- **`/effort`:** `xhigh`. Complejidad real pero acotada: es mapeo factual, no juicio estético.
- **Modo:** `/clear` antes de empezar. Autónomo. Read-only.
- **Comandos / skills:** subagentes de exploración en paralelo para los barridos de archivos. Incluir `ultrathink` en la corrida.
- **No se invocan comandos de puerta de calidad, revisión ni seguridad.** Esta corrida no produce diff, así que no hay nada que gatear. Además no está confirmado que el harness ECC esté instalado en este repo — verificarlo es parte de la tarea (Bloque 0).
- **Duración estimada:** 25–40 min sin el Bloque 8; +10–15 min con él.

---

## 1. CONTEXTO

**Proyecto:** Esquina Estudio — sitio portfolio de un estudio de branding. Premium, minimalista, monocromo, editorial, con animación cuidada. Está en producción y funcionalmente completo.

**Ruta:** `C:/EsquinaWeb/esquina-estudio`

**Stack (verificar, no asumir):** Next.js 16.2.6 App Router · React 19 · TypeScript · Tailwind v4 · Framer Motion 12 · GSAP 3 + ScrollTrigger · Lenis · Sanity (`next-sanity`) · react-hook-form + zod · resend · Netlify.

**Por qué existe esta auditoría.** Las clientas entregaron una ronda de feedback documentada en `Final.pdf`. Lo que viene encima de este código son cuatro trabajos:

1. **Pase tipográfico global** — tamaños, interlineado e interletrado en header, footer, home, Team y Contact. *Con una salvedad: todavía no está resuelto si los tamaños cambian o no (ver Bloque 2.a).*
2. **Rediseño de Services** — se conserva el intro con scroll-jacking; el botón `DISCOVER` pasa a ser indicador de scroll; se agrega un menú lateral sticky con indicador de sección y todo el contenido de packs debajo.
3. **Rediseño de Fun Gallery** — nueva pantalla de entrada con imágenes flotando que se acomodan al click, **y cambio de fuente de datos: pasa a alimentarse de un schema propio en Sanity** (ver Bloque 4).
4. **Selector de idioma ES/EN, hecho a mano** — no existe hoy (ver Bloque 1 y Bloque 2.c).

Nada de eso está planificado todavía. Este relevamiento es el insumo para planificarlo. **La calidad del plan depende de que este reporte sea exacto, no de que sea optimista.**

**El estado del código descrito en documentos previos es "último estado conocido, verificar".** Proviene de una conversación de junio; hoy es agosto. Además, el volcado del repositorio que circula fuera del repo tiene dos snapshots superpuestos del mismo archivo (`ServicesIntro.tsx` aparece con `h-[120vh]` y con `h-[200vh]`). **La única fuente de verdad de esta corrida es el código en disco.**

---

## 2. REGLAS ABSOLUTAS

1. **READ-ONLY.** No editás, no creás, no borrás, no refactorizás, no "arreglás de paso" nada. Si encontrás un bug, lo reportás; no lo tocás.
2. **Única excepción de escritura:** el archivo de reporte en `docs/auditoria/AUDITORIA-2026-08.md` (creá el directorio si no existe). Nada más.
3. **Sin operaciones destructivas ni mutaciones de git.** Nada de `git checkout`, `git stash`, `git clean`, `git push`, `git commit`, `rm`, `sudo`, `npm publish`. Los comandos de git permitidos son de solo lectura (`status`, `log`, `diff`, `rev-parse`, `branch`, `ls-files`, `worktree list`).
4. **No instalás nada.** Ni dependencias, ni herramientas, ni actualizaciones.
5. **Toda afirmación lleva evidencia: `ruta/archivo.tsx:línea` y el fragmento real citado.** Una afirmación sin evidencia no entra en el reporte.
6. **Prohibido el condicional.** No escribís "debería", "probablemente", "parecería", "se espera que". O medís y afirmás, o escribís `DESCONOCIDO` con una línea explicando por qué no se pudo determinar y qué haría falta. **Un `DESCONOCIDO` honesto vale más que una inferencia plausible.** Es el punto que más importa de toda la instrucción.
7. **No inventás rutas de archivo.** Si un archivo mencionado acá no existe, lo reportás como inexistente. Puede haber sido movido o renombrado desde junio.
8. **Un solo objetivo: relevar.** No planificás, no proponés soluciones, no diseñás la implementación. Cada bloque tiene un apartado de riesgos donde registrás observaciones como hallazgo, no como propuesta.

### 2.b — Decisiones ya cerradas: no se discuten ni se proponen alternativas

- **Services va hardcodeado.** El schema `Service` fue eliminado y **no se recrea**.
- **Fun Gallery cambia de fuente de datos.** Deja de derivarse de los proyectos de Work y pasa a tener **schema propio en Sanity**: las clientas suben imágenes específicas y eligen, por imagen, a qué proyecto enlaza. La referencia es **opcional**: una imagen sin proyecto asociado simplemente no es clickeable.
  > ⚠️ **Esto revierte a propósito una regla escrita en `CLAUDE.md` y en el contexto del Proyecto ("Fun Gallery NO tiene schema propio", "no crear schemas nuevos"). Si te la cruzás durante el relevamiento, reportala como documentación desactualizada. No la trates como restricción vigente y no la defiendas.**
- **i18n se implementa a mano.** No se evalúan ni se proponen `next-intl`, `i18next`, `next-translate`, plugins de Sanity ni APIs de traducción. El contenido de Sanity se carga manualmente en los dos idiomas. Mecánica decidida:
  - El servidor **siempre renderiza inglés**. No hay detección del lado del servidor y no cambia la URL.
  - La detección ocurre **del lado del cliente, durante el preloader**, leyendo `navigator.language`: **español si el navegador es hispanohablante, inglés para todo lo demás.**
  - La **elección explícita del usuario se persiste y le gana a la detección** en visitas posteriores.
  - El cambio manual de idioma dispara **la misma animación de transición de página que ya existe** (desvanecer y reaparecer).

---

## 3. LA TAREA

Relevar el estado real del código en los nueve bloques siguientes y producir el reporte de la sección 4.

---

### BLOQUE 0 — Base y confianza del terreno

- `git rev-parse HEAD`, branch actual, `git status --porcelain` (¿hay cambios sin commitear?), y `git log --oneline -20 --date=short --pretty='%h %ad %s'`.
- ¿Quedan branches o worktrees de sprints anteriores sin mergear? (`git branch -a`, `git worktree list`).
- `package.json` completo: dependencias directas con versión exacta. Confirmá o desmentí cada ítem del stack del Contexto.
- **Constatación de i18n:** confirmá que **no hay** ninguna librería de internacionalización en `dependencies` ni `devDependencies` (`i18next`, `react-i18next`, `next-intl`, `next-translate`, `@formatjs`, `lingui`, `@sanity/document-internationalization`). Nota: `i18next` aparece en `package-lock.json` marcado `"peer": true`, lo que sugiere que entra transitivamente por Sanity Studio. **Verificá que sea transitivo y no directo.** Si algo de eso entra al bundle del sitio público, reportalo.
- Contenido completo de `.claude/` (agentes, comandos, settings, hooks). ¿Está instalado el harness ECC? ¿Qué comandos y subagentes hay realmente disponibles?
- **Documentación contra código.** Listá con `archivo:línea` todas las apariciones de reglas documentadas que ya no se corresponden con lo que se va a hacer — sobre todo las que afirman que Fun Gallery se deriva de los proyectos, que no tiene schema propio, o que no se crean schemas nuevos. Buscá en `CLAUDE.md`, `AGENTS.md`, `.claude/agents/*.md` y cualquier `README`. **Hay que corregirlas antes de la corrida de Fun Gallery; este listado es el insumo.**
- **¿Existen en el repo los registros del método** — bitácora, plan maestro, registro de pendientes? Buscá `docs/`, `.develop/`, `planning/`, `*.bitacora.md`, `PENDIENTES*`, `PLAN*`. Reportá rutas o la ausencia.
- `next.config.*`, `netlify.toml`, `.env.example`: configuración de build, redirects, headers, variables de entorno esperadas.

---

### BLOQUE 1 — Shell, rutas, transiciones y el terreno del toggle de idioma

**El bloque de mayor consecuencia arquitectónica de toda la auditoría.**

El diseño previsto está en la sección 2.b. Necesito saber si es posible con el sistema actual y qué se rompe.

#### 1.a — Estructura

- Árbol completo de `src/app/` con route groups, layouts, `page.tsx`, `loading`, `error`, `not-found`, y qué es server vs client component.
- `src/app/(site)/layout.tsx`: orden exacto de anidación de providers. Citá el JSX.
- `src/app/layout.tsx`: transcribí el atributo `lang` del `<html>`, el objeto `metadata` completo y `openGraph.locale`. Listá todo lo hardcodeado a inglés.

#### 1.b — El sistema de transiciones

- **`RouteTransitionProvider` y `PageTransitionShell`.** Documentá con evidencia:
  - Qué dispara la transición hoy. ¿`usePathname()`? ¿`AnimatePresence` con `key={pathname}`? ¿Un evento del router?
  - **La pregunta central:** ¿se puede disparar la transición **sin que cambie la ruta**, por un cambio de estado? Citá la línea que lo determina. Si la key de `AnimatePresence` es el pathname, reportá qué variable habría que sumarle.
  - Qué se preserva y qué se remonta durante una transición. Importa mucho: si al cambiar de idioma se remonta todo, se reinician el preloader, la máquina de estados del scroll-jack de Services y el layout de Fun Gallery.

#### 1.c — El preloader como cortina del cambio de idioma

La detección de idioma va a ocurrir mientras el preloader tapa la pantalla, para que el usuario no vea el swap.

- **`PreloaderProvider`:** cuándo se considera terminado, cómo persiste entre visitas (`sessionStorage`?), cuánto dura, y en qué punto del ciclo de vida se podría resolver el idioma antes de levantar la cortina.
- **Todos** los componentes que leen `usePreloader()` para gatear animaciones. Listalos con su ruta.
- **El caso descubierto:** en una recarga dura a mitad de sesión el preloader no vuelve a mostrarse. Confirmá que es así y reportá qué se ve en pantalla en esa recarga antes de que hidrate React.

#### 1.d — `lang`, persistencia y render estático

- `src/app/layout.tsx` es server component (esperado): confirmá que el `lang` del `<html>` no se puede cambiar desde React sin tocar el DOM directamente.
- **¿Existe ya algún componente cliente montado en el shell** que pudiera hacer `document.documentElement.lang = ...` sin agregar uno nuevo? Nombralo con su ruta.
- **Persistencia existente.** Listá todos los usos de `localStorage` y `sessionStorage` con su archivo, y si hay algún wrapper o hook reutilizable en vez de escribir uno nuevo.
- **Clasificación de render por ruta.** Corré `npm run build` y reportá qué rutas son estáticas hoy y cuáles no. Es la línea base que no se puede perder.

#### 1.e — Navbar

- Cómo mapea `pathname` → tab activo y cómo se calcula la animación del underline.
- Dónde entraría físicamente un toggle `EN / ES` al lado de `CONTACT US`, y si hay anchos fijos por tab que lo compliquen.

#### 1.f — Lenis

- Dónde se instancia `SmoothScrollProvider`, cómo se destruye, si se recrea en cada navegación, y si algún componente hace `window.scrollTo` por fuera de Lenis.

---

### BLOQUE 2 — Escala tipográfica y textos fijos

#### 2.a — La medición bloqueante

**Hacela primero y reportá los números crudos.** Ningún sprint tipográfico se planifica hasta que vuelvan.

Las clientas anotaron el mockup con "17pt" para el menú, "30pt" para Team y "40pt" para el hero de Home. No está resuelto si esos números describen lo que ya existe o piden un cambio, y el archivo original del diseño no está disponible. Esta medición es el único camino.

- Levantá el dev server y medí con `getComputedStyle` el `fontSize` real en píxeles de: **(a)** un tab del Navbar, **(b)** el hero de Home, **(c)** un párrafo de Team.
- Reportá los tres valores absolutos, los dos ratios (**hero ÷ menú** y **Team ÷ menú**), y el ancho de viewport al que mediste.
- **Contexto para interpretar después, no para condicionar la medición:** los ratios anotados por las clientas son 40/17 = 2.353 y 30/17 = 1.765. Sobre los píxeles del mockup se miden 2.22 y 1.67. **Reportá el número medido, no la conclusión.**

#### 2.b — Dónde viven los tamaños

- ¿Tokens en `globals.css` (`@theme` de Tailwind v4), configuración de tema, o valores arbitrarios por componente (`text-[13px]`)? Reportá el patrón dominante con ejemplos.
- **Inventario exacto** de `font-size`, `line-height` y `letter-spacing`, con `archivo:línea`, para:
  - Tabs del Navbar (`WORK`, `SERVICES`, `TEAM`, `FUN GALLERY`) y `CONTACT US`
  - Cada bloque del footer (`BORN IN ARGENTINA`, `WORKING WORLDWIDE`, `© 2024`, `POWERED BY develOP`, `INSTAGRAM`, `LINKEDIN`)
  - Hero de Home y su CTA
  - Texto 1 y texto 2 del intro de Services, y el botón `DISCOVER OUR SERVICES`
  - Los dos párrafos de Team
  - Título `LET'S BRING YOUR IDEAS TO LIFE` de Contact, subtítulo, y labels de las preguntas
- ¿La escala es fija o responsive? ¿Hay `clamp()`, unidades `vw`, o breakpoints que cambien tamaños? Listalos.
- Valor exacto del `letter-spacing` actual en menú y footer. Las clientas piden interletrado 0 en ambos.

#### 2.c — Censo de textos fijos y su forma

La suposición de trabajo es "no son tantos textos fijos". **Medila.** Pero lo que más importa acá no es el número: es la **forma** en que están escritos, porque define la estructura del diccionario.

- Barré todos los strings de UI visibles al usuario que estén hardcodeados en el código (no los que vienen de Sanity). Reportá **el número total**, la lista de archivos con la cantidad por archivo, y los tres archivos con más strings.
- Reportá el contenido de `metadata` de cada `page.tsx` (title y description son texto de UI también).
- **Clasificá cada string en una de estas cuatro categorías, y dame el conteo por categoría.** Es lo que decide si un diccionario plano alcanza o no:
  1. **String simple.** Texto suelto, traducible uno a uno.
  2. **Texto partido en líneas dentro de un arreglo, con los cortes decididos a mano.** Caso conocido: `Text1Lines` y `Text2Lines` en `ServicesIntro.tsx`, y probablemente el hero de Home. Transcribí esos arreglos completos. **Estos no se pueden traducir línea por línea: el español ocupa 15–25% más y el corte de tres líneas puede pasar a cuatro, lo que descoordina el stagger que está calculado para esa cantidad exacta.** Reportá para cada uno cuántas líneas tiene hoy y cómo se calcula el delay de cada una.
  3. **Texto con markup embebido** (`<strong>`, `<br>`, entidades como `&rsquo;`, spans con clase). Listalos: no son strings planos.
  4. **Texto no visible pero traducible:** `alt`, `aria-label`, `placeholder`, `title`, y los mensajes de validación de zod del formulario de Contact.

---

### BLOQUE 3 — Services

Bloque de rediseño. **El intro NO se reemplaza: se conserva.** Costó un sprint entero de scroll-jacking fino. Lo que cambia es que el botón pasa a ser indicador de scroll, y todo lo de packs es nuevo hacia abajo.

- Mapa completo: `src/app/(site)/services/page.tsx`, `ServicesPageClient.tsx`, `ServicesIntro.tsx`, `ServicesStack.tsx`, `ServiceItem.tsx`. Confirmá que existen con esos nombres y reportá archivos adicionales de la sección.
- **De dónde salen los datos.** `ServicesPageClient` recibe `services: ServiceContent[]`. Rastreá el origen exacto: ¿array hardcodeado? ¿en qué archivo? ¿queda algún resto de fetch a Sanity? Citá la definición.
- **La máquina de estados del scroll-jack en `ServicesIntro.tsx`.** Documentá citando código:
  - Todos los estados (`hasInteracted`, `isJumping`, `isStatic`, `isInitialLoadComplete`, y los que haya) y las transiciones entre ellos.
  - Los listeners de `wheel` / `touchstart` / `touchmove` y bajo qué condiciones hacen `preventDefault`.
  - **El bloqueo de scroll del body:** dónde se aplica y bajo qué condición exacta se libera.
  - **El contrato de altura.** El contenedor es `h-[200vh]` con dos bloques `h-screen` en ambos modos, para que `ServicesStack` no se desplace en el swap. Transcribí las clases de las dos ramas y verificá que coinciden. **Es lo más frágil del archivo: cualquier cambio de layout que lo rompa reintroduce el salto.**
  - `FloatingMediaLayer` y su prop `float`: por qué el float arranca solo en modo estático, y de dónde salen las imágenes (`FLOATING_MEDIA`).
  - El comportamiento actual del botón `DISCOVER`: el scroll suave programático, su duración, y el `setIsStatic(true)` diferido.
- **Enumerá explícitamente qué debe sobrevivir al rediseño**, con su ubicación: reveal por líneas estilo Hero, crossfade texto1→texto2, imágenes flotantes con repulsión al cursor, el contrato de altura, el manejo de `prefers-reduced-motion`, el gating por preloader.
- **¿Existe ya algún scroll-spy, sticky sidebar u observador de sección reutilizable** para el menú lateral nuevo? Buscá `IntersectionObserver`, `ScrollTrigger`, `position: sticky`, `useInView`. Listá cada uso con su archivo. **No queremos un cuarto sistema paralelo.**
- Con el scroll del body bloqueado durante el intro, ¿un menú lateral sticky sería operable o quedaría inerte? Reportá qué lo gobierna.

---

### BLOQUE 4 — Fun Gallery

Rediseño completo **con cambio de fuente de datos**. Es el bloque donde más código se va a borrar, así que necesito saber con precisión qué se borra, qué depende de eso, y qué sobrevive.

**Lo que viene:** la galería deja de derivarse de los proyectos. Pasa a alimentarse de un schema propio en Sanity donde las clientas suben imágenes específicas y eligen, por imagen, a qué proyecto enlaza (**referencia opcional**; sin referencia, la imagen no es clickeable). Encima va la pantalla de entrada nueva: imágenes flotando, `(click to view)`, y al hacer click se acomodan al grid.

**Los assets ya existen:** ocho PNG de 2250×2250, **con canal alpha real** (recortes de producto sin fondo), de 365 KB a 2.9 MB cada uno, ~12 MB en total. El contenido de cada uno está normalizado por altura (ocupa 75–88% del alto del cuadrado) pero varía mucho en ancho (31% a 84%). Se van a cargar a mano por el Studio. **No propongas el diseño del schema ni escribas código: relevá el terreno para que se pueda diseñar bien.**

#### 4.a — Qué se va a borrar, y qué lo sostiene

- `src/app/(site)/fun-gallery/page.tsx` y `src/components/sections/gallery/FunGallery.tsx`: transcribí la cadena de derivación completa — `FUN_GALLERY_PROJECTS_QUERY` (el GROQ entero), `getProjectImageCandidates`, `getGenericBlockImageCandidates`, `getGalleryItems`, la deduplicación por asset key, y los helpers `isMediaItem` / `isDualMedia` / `isSanityImageLike`.
- **Para cada una de esas funciones y para la query, decime si la usa alguien más además de Fun Gallery.** Grep en todo el repo. Es lo que decide qué se borra limpio y qué está acoplado a Work.
- `LOCAL_WORK_PROJECTS` y `withLocalProjectImages` (`src/lib/local-projects.ts`): qué son, cuándo se activan, y quién más los consume. ¿Es un fallback de desarrollo o hay contenido real ahí?
- El tipo `Project` y los tipos de bloque (`ProjectContentBlock`, `ProjectMediaItem`, `ProjectDualMedia`): dónde están definidos y qué otros archivos los importan.

#### 4.b — Qué tiene que sobrevivir

El motor visual no se tira; lo que se tira es de dónde saca los datos.

- **La forma exacta del objeto que consume el layout.** `GalleryItem` y `MapItem`: transcribí los tipos completos. Necesito saber qué campos mínimos tiene que producir la fuente nueva para que el layout siga funcionando sin tocarlo.
- El cálculo del layout: `createRandom`, `hashString`, `shuffle`, posiciones, rotaciones, `zIndex`, `parallaxFactor`. Cómo depende del `randomSeed` y qué pasa si el seed deja de ser aleatorio por request.
- **El hover actual, con precisión.** Las clientas piden que "se muevan como se movían antes y se agranden un poco". Transform exacto, escala, transición, duración, y el `hover:z-50`.
- Cómo se navega hoy al proyecto desde una imagen (el `href` desde `project.slug.current`). Es lo que la referencia opcional tiene que reemplazar, **incluyendo el caso sin referencia: reportá si el layout asume hoy que todo ítem es un link.**

#### 4.c — Dimensionar el cambio

- **¿Cuántos proyectos publicados hay hoy y cuántas imágenes produce el pool derivado en total?** Un número, desglosado en portadas vs. galerías internas. **Es lo que la galería deja de mostrar el día que cambie la fuente** — y hay que compararlo contra los ocho assets nuevos.

#### 4.d — El pipeline de imágenes con transparencia

Los assets nuevos son PNG con alpha. **Si algo en la cadena aplana el canal alpha o convierte a JPEG, cada recorte aparece dentro de una caja blanca y se muere el efecto.** Y son pesados: 12 MB de origen es una amenaza directa al Performance 100.

- Transcribí la implementación de `urlFor` y cómo se arman las URLs de imagen hoy (`width`, `quality`, `format`, `auto`, `fit`, `bg`). **¿Se fuerza algún formato? ¿Se aplica algún color de fondo?**
- `next.config`: configuración de `images` — `formats` (¿webp? ¿avif?), `remotePatterns` para el CDN de Sanity, `deviceSizes`, `imageSizes`, `qualities`.
- Cómo se cargan las imágenes en `FunGallery.tsx`: `fill`, `sizes`, `priority`, `loading`, `placeholder`. **Cuántas se montan de una en el primer render.**
- ¿Hay algún otro lugar del sitio que ya sirva imágenes con transparencia? Si lo hay, cómo lo resuelve.

#### 4.e — Terreno para el schema nuevo

- **Convenciones de schema del repo:** cómo está declarado `project` (estructura de archivos, exports, `defineType`/`defineField`), cómo se registran los schemas, y qué haría falta para agregar uno nuevo. Citá el archivo de registro.
- ¿Hay una `structure` / desk personalizada en el Studio o está en default? Si hay, cómo está armada.
- **Cómo se declaran los campos de referencia en el repo, si existe alguno**, y **cómo se resuelve una referencia en las queries GROQ actuales** (`->`, proyecciones). Si no hay ningún precedente de referencia en el proyecto, decilo explícitamente.
- Convención de tipos de TypeScript para los documentos de Sanity: dónde viven (`src/types/`), si están escritos a mano o generados.
- ¿Qué validaciones y previews usa `project` en el Studio? Sirven de modelo para que el schema nuevo se sienta igual para las clientas.

#### 4.f — Rendimiento de la ruta

- **`export const dynamic = "force-dynamic"` combinado con `randomUUID()` por request.** Confirmá que sigue así. Reportá qué clasificación de build produce hoy `/fun-gallery` y si esa combinación desactiva el caché por completo. **Conviene resolverlo en la misma corrida que el rediseño en vez de arrastrarlo.**

---

### BLOQUE 5 — Work grid, Work single, Contact, Team

- **Work grid** (`WorkGrid.tsx`, `ProjectCard.tsx`): proporción actual de las tarjetas (¿`aspect-square`?), configuración de grilla y breakpoints, **el valor exacto del stagger y de la duración del reveal** (documentos previos dicen 0.7s — verificar), y el padding/posicionamiento del texto en el overlay de hover.
- **Work single** (`ProjectDetailClient.tsx`, `ProjectContentRenderer.tsx`): las clientas lo aprobaron sin cambios. Solo confirmá que el aside sticky usa `md:top-48` y que no hay deuda pendiente visible. No profundices.
- **Contact** (`contact/page.tsx`, `ContactForm.tsx`): qué crea el scroll interno hoy — alturas y overflow del `<main>` y del contenedor del formulario, citando clases. Alineación actual del título y del subtítulo, alineación y cantidad de líneas de los labels, y el estilo actual de los pills de "what are you looking to work on?" (color activo vs. inactivo).
  - **Medición:** con el dev server en `/contact`, reportá la altura total del contenido del formulario en píxeles y a qué altura de viewport entraría completo sin scroll. Las clientas piden que entre todo en pantalla; necesito el número real para saber si es viable y desde qué altura.
  - Los mensajes de error de zod son texto de UI y entran al censo del Bloque 2.c.
- **Team:** localizá los archivos de la página (no figuran en la documentación previa). Estructura actual, de dónde sale el texto, y cómo se monta el medio visual — importa porque falta un gif que las clientas todavía no entregaron.

---

### BLOQUE 6 — Primitivos compartidos y zonas de colisión

- **`HoverButton.tsx`:** listá TODOS sus consumidores con `archivo:línea` y las props que cada uno le pasa. Es compartido entre Navbar, Footer, Home, Services, Contact y Fun Gallery.
- **`RevealOnScroll.tsx`:** todos sus consumidores.
- **¿Cuántos sistemas de reveal conviven hoy?** Documentación de junio registraba tres (inline en `WorkGrid`, `RevealOnScroll`, GSAP en Services). Verificá si se consolidaron. Listá cada uno con ubicación y técnica.
- **`globals.css`:** transcribí las reglas *unlayered* (fuera de `@layer`) — sobre todo `::selection` — y los custom properties (`--color-*`, `--header-height`, `--footer-height`, `--cursor-*`). **Este archivo es compartido y no se toca.** Necesito saber qué reglas ganan por especificidad de capa para poder sobreescribirlas desde el lado correcto.
- Cursor custom: dónde vive y cómo se excluye de Sanity Studio.

---

### BLOQUE 7 — Sanity

Alimenta dos decisiones: el modelo de campos bilingües y el schema nuevo de Fun Gallery.

- Schemas presentes en `src/sanity/schemas/`. Confirmá que solo existe `project` y que no quedan restos de `Service` ni de `Fun Gallery Image` (en schemas, queries, tipos, ni en el desk structure). **Si quedaran restos del schema viejo de Fun Gallery, reportalos con detalle: podrían ser reaprovechables.**
- **Estructura completa del schema `project`, campo por campo:** nombre, tipo, si es requerido, y si es texto visible para el usuario final. Incluí los tipos de bloque anidados.
- **El costo real de la carga manual bilingüe.** Con "campos de texto traducibles por proyecto" × "proyectos publicados hoy", dame **el número de campos que las clientas tendrían que volver a cargar** para poner al día el contenido existente. Un número, no una estimación cualitativa.
- Cómo se ve hoy el Studio para las clientas: `structure`/desk configurada o default, agrupación en pestañas, previews, validaciones. **Importa porque duplicar cada campo de texto puede volver el formulario inmanejable para usuarias no técnicas, y eso es riesgo de producto, no de código.**
- `src/lib/sanity.ts` y `src/lib/sanity.queries.ts`: cliente, configuración de CDN, todas las queries GROQ, y las políticas de `revalidate` por ruta. **Listá cada query que tendría que cambiar si los campos de texto pasan a tener variante ES y EN.**
- Variables de entorno de Sanity y qué permisos tiene el token configurado, si hay alguno. (Solo constatación: la carga de los assets va a ser manual por el Studio, no por script.)

---

### BLOQUE 8 — Baseline de rendimiento *(opcional — cortá este bloque si querés la auditoría más rápida)*

El objetivo declarado es Lighthouse 100 en las cuatro métricas. Sin línea base medida hoy, después no se puede probar que los rediseños no la degradaron.

- `npm run build`: salida completa. Tamaño de bundle por ruta y clasificación estática / SSR / dinámica de cada una.
- Lighthouse en modo desktop sobre el build de producción, en `/`, `/services`, `/fun-gallery`, `/contact`. Las cuatro métricas por ruta.
- **En `/fun-gallery`, reportá específicamente el peso total de imágenes transferido y el LCP.** Es la línea base contra la que se va a comparar cuando entren los PNG con transparencia.
- Cualquier warning o deprecation del build, especialmente de Next 16.

---

## 4. EL CIERRE

**Escribí el reporte en `docs/auditoria/AUDITORIA-2026-08.md`**, con esta estructura:

1. **Encabezado:** commit HEAD, branch, fecha, estado limpio o sucio del working tree.
2. **`NÚMEROS CLAVE`, al principio del documento** — los siete valores que gobiernan la planificación:
   - fontSize de menú / hero / Team y los dos ratios (Bloque 2.a)
   - cantidad total de strings de UI hardcodeados, **desglosada por las cuatro categorías** (Bloque 2.c)
   - imágenes del pool derivado de Fun Gallery que se pierden al cambiar la fuente, portadas vs. internas (Bloque 4.c)
   - campos de texto traducibles × proyectos publicados (Bloque 7)
   - rutas estáticas vs. dinámicas en el build actual (Bloque 1.d)
   - clasificación de build de `/fun-gallery` (Bloque 4.f)
   - formatos de imagen configurados en `next.config` y si preservan alpha (Bloque 4.d)
3. **Un apartado por bloque**, en orden, con evidencia `archivo:línea` de cada afirmación.
4. **Al final de cada bloque, tres listas separadas:**
   - `HECHOS VERIFICADOS` — medido o leído directamente del código.
   - `DESCONOCIDO` — no se pudo determinar, con el motivo y qué haría falta.
   - `RIESGOS PARA LO QUE VIENE` — lo que complica los cuatro trabajos del Contexto. Como hallazgo, no como propuesta.
5. **Sección final `LO QUE NO PUEDO VERIFICAR YO`:** todo lo perceptual, estético o comercial. Explícitamente: si el sitio "se ve bien", si un tamaño tipográfico "queda proporcionado", si una animación "se siente premium", si ocho imágenes alcanzan para que la pantalla de entrada no se vea vacía. **Eso lo decide una persona mirando la pantalla, y este reporte no debe darlo por resuelto.**

**En el chat, devolvé un resumen condensado de no más de 40 líneas** con: `NÚMEROS CLAVE` completo, los tres o cuatro hallazgos que más cambian la planificación, y la lista completa de `DESCONOCIDO`. El reporte largo queda en el archivo.

**No cierres con una valoración del estado del código.** No hace falta que digas si está bien o mal. Hacen falta los hechos.

---

## 5. NOTA SOBRE EL AUTOREPORTE

El aprendizaje más caro de los sprints anteriores de este proyecto: **los agentes midieron, declararon el bug resuelto, y la persona lo seguía viendo en pantalla.**

Acá no hay nada que arreglar, así que el riesgo no es declarar un falso éxito: es **rellenar un hueco con una inferencia razonable en vez de escribir `DESCONOCIDO`.** Un reporte con quince `DESCONOCIDO` honestos es útil. Un reporte completo con tres inferencias disfrazadas de hecho hace que se planifique en la dirección equivocada, y eso cuesta días.

Si dudás entre afirmar y admitir que no sabés, admitís.
