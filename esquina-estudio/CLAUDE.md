# CLAUDE.md — Esquina Estudio

Guía operativa para agentes que trabajan sobre este repositorio.

**Regla de lectura:** este documento separa **ESTADO** (verificado contra el código en HEAD) de **PLAN** (decidido, todavía no ejecutado). No trates el PLAN como código existente, y no «corrijas» el código hacia versiones viejas de este archivo.

Última sincronización: **2026-08-24** (sprint **M4**: el ícono único del menú, el estado activo del menú y los dos footers de mobile); antes, 2026-08-23 (sprint **M3**: el preloader nuevo y las quince correcciones); antes, 2026-08-23 (sprint **M2**: las catorce correcciones de mobile y el cierre de la adaptación); antes, 2026-08-22 (sprint **B4d**: el set de banderas dibujado a mano se retira y entran SVG reales vendorizados, en gris por defecto y a color en hover); antes, 2026-08-22 (sprint **B4c**: timing del toggle, limpieza de dependencias y corrección del set de banderas); 2026-08-22 (sprint **M1**, adaptación mobile); 2026-08-22 (microsprint B4b, refinamiento del toggle de idioma); **2026-08-21** (cierre de B4, idioma EN/ES, y con él el cierre de la ronda); antes de eso, 2026-08-20 (B3.4 + B3.4b, rediseño de `/services`) y 2026-08-15 (Bloque 1) sobre la auditoría completa `docs/reportes/2026-08-13-auditoria-completa.md` (HEAD `2565d01`). Las secciones no tocadas por B3.4 ni por B4 siguen reflejando esa auditoría. Antes de ejecutar cualquier sprint: leer `docs/plan-maestro.md` y la última entrada de `docs/bitacora.md`. Ante conflicto entre este archivo y el plan maestro, **manda el plan maestro**.

## 1. Proyecto y stack — ESTADO

- Portfolio de Esquina Estudio (estudio de branding). Producción en Netlify. Se construyó **desktop-first** y **M1 (2026-08-22) hizo la adaptación mobile**: el sitio entra y se usa en teléfonos, con cero scroll horizontal medido en las ocho rutas, cinco anchos y los dos idiomas. Los puntos de corte y las decisiones están en §2b.
- Raíz git: `C:/EsquinaWeb`. Proyecto Next: `esquina-estudio/`.
- Next.js **16.2.6** (pin exacto, App Router, Turbopack) · React **19.2.4** (pin) · TypeScript estricto · Tailwind **v4** · Framer Motion 12 · **GSAP ya no está**: quedó sin consumidores en B3.4 y B4c lo desinstaló de `package.json` y del lockfile · Lenis = paquete legacy **`@studio-freight/lenis`** · next-sanity · react-hook-form + zod **v4** · resend · sharp (devDependency). **El i18n es propio** (`src/lib/i18n/`, B4): no hay ni va a haber librería de idioma.
- Scripts: `dev`, `build`, `start`, `lint`. No hay tests ni typegen.
- `netlify.toml`: solo `command = "npm run build"` + plugin de Next. Sin redirects, headers ni env.
- Variables leídas por el código: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `NEXT_PUBLIC_SITE_URL` (hoy ausente de `.env.local` → `metadataBase` cae a un placeholder; ver pendientes). `NEXT_PUBLIC_SANITY_DATASET` existe en `.env.local` pero **nadie la lee** (dataset hardcodeado). `SANITY_API_WRITE_TOKEN` queda en el entorno **sin consumidores en el código** (el seeder `/api/seed-sanity` fue eliminado en B1; tooling de escritura futuro = script local con guard, nunca ruta pública).
- **`AGENTS.md` (raíz del proyecto) es vinculante y complementa a este archivo:** Next 16 trae breaking changes respecto de versiones anteriores, y el conocimiento general del modelo suele estar desactualizado. Antes de escribir código de Next (rutas, caching, `searchParams`, APIs de servidor), consultar las docs embarcadas en `node_modules/next/dist/docs/` — son las de la versión exacta instalada. Precedente: la semántica de `force-dynamic` de la auditoría se resolvió así.

## 2. Identidad visual — ESTADO

- Colores: off-white `#F3F3F3` · off-black `#0F0F0F` · beige `#EFEEDA` · gris `#939393` (`gray-brand` en `@theme`).
- Tipografía: **Manrope variable 300–800**, local (`src/app/layout.tsx:6-10`). `--header-height: 128px`. `::selection` global invertida. Scrollbars ocultas globalmente. `--font-display` y `--font-body` apuntan **a la misma familia** (`globals.css:22-23`): la jerarquía del sitio se construye por escala y peso, no por contraste de familias.
- **`globals.css` tiene hoy 11 tokens y nada más** (verificado en B4c): cuatro colores en `:root` más `--header-height`, y cuatro colores más las dos familias tipográficas en el `@theme`. `--footer-height`, `--cursor-size(-hover)` y los 5 tokens de font-size que este archivo arrastraba de la auditoría **ya no existen en el código**: desaparecieron en algún sprint anterior y nadie sincronizó la ficha. El patrón vigente sigue siendo el valor arbitrario por componente (`text-[13px]`, `text-[40px]`, …).
- B4c borró **`--color-gray`**, duplicado exacto de `--color-gray-brand` y con una sola ocurrencia en el repo: su propia declaración. **`--color-beige` se queda**: es un color declarado de la identidad y sacarlo sería decisión de paleta, no limpieza.
- Todas las reglas de `globals.css` (salvo el `@theme`) están **fuera de `@layer`**: le ganan a cualquier utility. Para sobreescribir desde un componente: `!important` del lado layered, scopeado. Precedente correcto: `SCOPED_SELECTION` en `ContactForm.tsx:43-44`.
- Cursor custom: punto fijo de 16 px (`h-4 w-4`, `mix-blend-difference`), activado por `body[data-custom-cursor]`; excluido de `/studio` por early-return de `RootClientShell`.

## 2b. Mobile — ESTADO (M1, 2026-08-22; corregido por M2, 2026-08-23)

**Un solo corte manda: 1024 px.** De ahí para arriba el escritorio es intocable.
Debajo de 1024 mandan las soluciones de mobile, sean CSS o JavaScript. Hay un
segundo corte, `md` (768), pero es **solo tipográfico**: da un escalón intermedio
de tamaño en las rutas que lo necesitaban.

**Cómo se verifica que el escritorio no se movió, y una advertencia que costó un
sprint.** M1 declaró los 48 altos idénticos a 1920, 1366 y 1024 y **se le pasó una
regresión**: `scrollHeight` nunca baja del alto del viewport, así que un
documento de 1080 a 1920 no prueba que el contenido llegue al pie. El bloque del
hero de `/` estuvo 248 px corto durante todo M1 sin que ninguno de esos 48
números lo delatara (punto 13 de M2). **La vara buena tiene tres patas**: los
altos de documento, el **borde inferior del último elemento** —la franja muerta—
y la **geometría del cromo** medida contra el código pre-sprint recompilado. M2
cerró con 28 de 32 altos idénticos —los cuatro que cambian son los de
`/contact/success`, y ese cambio lo pidió la devolución— y **cero diferencias de
geometría del header contra el código pre-M1**.

| rango | nombre | tratamiento |
|---|---|---|
| < 768 | mobile | una columna, gutter de 24 px, escala reducida |
| 768–1023 | tablet | igual que mobile en estructura, gutter de 48 px, escala de escritorio |
| ≥ 1024 | desktop | lo aprobado en los bloques 2, 3 y 4. **Intocable** |

**Por qué el cromo corta en `lg` y no en `md`, que es lo que se esperaría:** el
menú de escritorio está centrado en absoluto y con los rótulos en castellano
pide 403 px, con el logo ocupando hasta 244 y el bloque de la derecha 217 — a
768 se montan, a 1024 entran con holgura. Y el `InfoRow` del footer pide **789
px** de ancho: con el gutter de 64 entra recién a partir de 1024. Los dos
números están medidos.

**Dos módulos nuevos, y son los únicos de su clase (§8.10):**

- **`src/lib/mobile-layout.ts`** — el gutter del cromo (`px-6 md:px-12
  lg:px-16`), el piso de área táctil y el helper `TOUCH_LINKS`, que le da 44 px
  de alto tocable al `<a>` que emite `HoverButton` **sin tocar el primitivo**
  (§4.2 lo prohíbe) y sin despegar su subrayado: el `className` de `HoverButton`
  va al `<span>` de adentro, así que engordar ese span arrastraría la línea; se
  alcanza el ancla desde afuera con una variante arbitraria. Lleva además la
  nota larga sobre `sizes` (ver más abajo). Las clases van como literales
  enteros: Tailwind v4 las busca como texto.
- **`src/lib/use-media-query.ts`** — el hook de media queries del repo.
  `usePrefersReducedMotion` pasó a colgarse de él, así que hay **una sola**
  implementación. Arranca en `false` en el servidor y en el primer render, y se
  corrige en un efecto: sirve para **apagar comportamiento** (un listener que se
  registra un cuadro y se da de baja) y **no** para decidir layout, que tiene
  que salir correcto del servidor. El layout se resuelve con variantes de
  Tailwind.

**El hover no existe en touch.** Los cinco lugares donde el sitio se apoyaba en
hover, y qué hacen debajo de 1024:

1. **Grilla de Work** — el texto del overlay va **siempre visible y debajo de la
   portada**. Sobre ella no se podía: el overlay tapa la portada entera con el
   `coverColor`, así que «siempre visible» ahí equivaldría a no mostrar nunca la
   portada. El 5:4 se conserva y lo lleva la portada, no la celda. El overlay de
   hover es `hidden lg:flex`, con lo que un tap tampoco puede dejarlo pegado.
2. **LATEST PROJECTS** — las cuatro portadas **quietas**: ni escala ni
   difuminado, y sin colgar los cuatro manejadores.
3. **Fun Gallery** — sin `whileHover` y sin seguimiento del cursor. El tap en un
   objeto con proyecto navega; de los ocho del dataset, seis no tienen proyecto
   y no tienen `role`, ni `tabindex`, ni manejador.
4. **Links del footer y del menú** — el subrayado ya era fijo; los dos links de
   LATEST PROJECTS, que lo tenían en hover, lo llevan puesto debajo de 1024.
5. **Pills e inputs de Contact** — el estado activo ya se veía sin hover;
   verificado.

**Lo que se desmontó, y cómo se verificó.** El **gatillo del intro de Services**
(`IntroScrollTrigger`) sale del efecto **antes de registrar un solo listener**
debajo de 1024. Sus tres listeners son no pasivos y cancelan desde el primer
evento mientras está armado, así que en un teléfono la pantalla no se movería
hasta juntar 60 px. Medido con eventos sintéticos cancelables despachados sobre
la ventana: a 320 y 390 `wheel`, el segundo `wheel` del mismo gesto y
`touchmove` salen con `defaultPrevented` en **false** y `scrollTo(0,400)` deja
`scrollY` en 400; a 1024 y 1920 los tres salen en **true**. `document.body` no
tiene una sola propiedad inline en ninguna ruta. El **sidebar de Services** ya
era `hidden lg:block`.

**Lo que corrigió M2 (2026-08-23), y que reemplaza a lo que M1 había dejado:**

1. **El menú.** El panel es `fixed inset-0` en off-black y lleva **solo la
   navegación**: los cuatro rótulos en la escala de display (40/48, 48/56 de
   `sm`) alineados a la izquierda contra el gutter, y `CONTACT US` debajo, a 17
   px, separado por escala y aire —sin borde ni caja—. El cromo **no se
   repite**: el logo, el toggle y la cruz son los de la fila del header, que
   queda por encima del panel (`z-[2]` contra `z-[1]`, puertas adentro del
   `<nav>`) y pintada del mismo negro mientras el menú está abierto.
2. **Por qué el menú se veía mal en siete rutas y bien en `/contact/success`.**
   Un **`backdrop-filter` convierte al elemento en bloque contenedor de sus
   descendientes `position: fixed`**. El blur vivía en el `<nav>`, así que el
   `fixed inset-0` del panel se resolvía contra la banda de 128 px del header y
   no contra el viewport: el menú salía como una franja negra con los rótulos
   desbordados. `/contact/success` es la única ruta cuyo `<nav>` va transparente
   —y por lo tanto sin blur—, y por eso era la única que se veía bien. **El blur
   bajó a la fila**, que es hermana del panel: la banda pintada es la misma y el
   panel queda fuera del bloque contenedor. Si algún día se le pone un filtro al
   `<nav>`, el defecto vuelve.
3. **El toggle `EN / ES` está en la fila del header**, al costado del ícono y
   visible sin abrir nada. Hay **dos instancias y una sola implementación**
   (bloque de escritorio `hidden lg:flex`, bloque de mobile `lg:hidden`); nunca
   se ven las dos. Con eso el disparador `measureKey` del módulo del indicador
   quedó sin consumidores y se borró.
4. **Un solo botón abre y cierra, y desde M4/F1 un solo dibujo.** El ícono son
   **tres rayas idénticas** de 24 × 2 px con 5 px de separación —medidas: caen
   en las filas 56, 63 y 70, las tres enteras—, y al abrirse **esas mismas
   rayas** se convierten en cruz: la de arriba y la de abajo viajan 7 px hasta
   el centro de la caja de 24 y giran ±45° hasta cruzarse en (12, 12), y la del
   medio se desvanece. La cruz mide 18,38 × 18,38 px de caja y el botón sigue
   siendo de 44 × 44. Hasta M3 había **dos dibujos distintos** —tres rayas de 24
   cerrado, dos reglas de 30 abierto—, así que el ícono cambiaba de identidad en
   vez de transformarse. La ventana es la del cromo y no una nueva: 200 ms con
   retardo 0 al abrir y 300 al cerrar (ver el punto 5 de M3 más abajo), así que
   el ícono acompaña al panel. Con `prefers-reduced-motion` la transición se
   apaga entera (`transition-property: none`) y el cambio es inmediato.
5. **`/` entra en una pantalla también en mobile.** El bloque del hero resta el
   alto del footer, igual que en escritorio: `HOME_BLOCK_HEIGHT_MOBILE` en
   `mobile-layout.ts`. El número es **304 px** desde M4/F3 —eran 244 en M3 y 236
   en M2— y está medido en los cinco anchos y los dos idiomas; si el footer
   cambia, el número cambia. Lo mismo `HOME_FOOTER_CLEARANCE`, que consume
   `/contact/success`.
6. **El footer de mobile son dos columnas alineadas abajo más dos filas al pie**
   (M4/F3, sobre la reordenación de M3/F2): a la izquierda los dos pares de
   lugar, a la derecha **INSTAGRAM, LINKEDIN y `© 2024`** pegados al gutter, y
   **los bordes inferiores de las dos columnas a la misma altura** —el criterio
   es ese y no la cantidad de renglones—; debajo, el crédito de develOP solo y
   centrado, y en el footer claro **el logo script cerrando abajo a la
   derecha**. La alineación sale de la grilla y no de una medida: las tres filas
   de arriba miden 44 px por el piso de área táctil, la columna derecha las
   llena en orden y el segundo par de lugar se manda a la tercera fila apoyado
   en su borde inferior (`self-end`), dejando vacía la segunda de la izquierda.
   Medido: **delta 0,00 px** y **0,00 px de gutter** en los cinco anchos y los
   dos idiomas. Se arma con **una grilla de dos columnas y `display: contents`**
   sobre los grupos de escritorio, así que el mismo árbol da los dos repartos.
   La tipografía baja a 15 px debajo de 1024. **El logo script volvió a mobile
   en M4/F3**, en fila propia y a 48 px de alto —la altura del logo del
   header—: M2 lo había sacado porque compartía línea con el crédito y los dos
   juntos pedían 305,53 px contra 272 de caja útil a 320. Con el copyright
   mudado a la columna derecha desapareció también el corte de 360: el crédito
   centra exacto en los cinco anchos.
6b. **El menú abierto marca la sección actual** (M4/F2): subrayado **solo** en el
   ítem de la ruta activa, ninguno en `/` —home no es ítem del menú, se entra
   por el logo— y por prefijo en las subrutas (`/work/[slug]` marca WORK,
   `/contact/success` marca CONTACT US). Sale del **mismo cálculo** que la
   barrita del indicador de escritorio, así que los dos repartos no pueden
   discrepar. El estado se anuncia con un sufijo `sr-only` dentro de los hijos
   del `HoverButton` y no con `aria-current`: el primitivo no expone su `<a>` y
   no se toca (§4.2).
7. **La franja del prefooter es una fila también en mobile**, con el bloque de
   contacto **alineado abajo** —a la altura de la última línea de la frase— y en
   la escala de cuerpo (17/21, la misma proporción 0,65 que el escritorio usa
   entre 26 y 40). Lleva `flex-wrap`: los dos bloques tienen ancho mínimo propio
   y la suma no entra en cualquier teléfono, así que **donde no entra el bloque
   baja solo**. Entra en fila a partir de 376 px de viewport: de los cinco
   anchos de prueba, en 390, 414 y 430.
8. **La galería se despliega en grilla en mobile**: dos columnas debajo de 768 y
   tres hasta 1024, con el objeto llenando la celda. Pasa de 15–21 % del ancho
   del viewport a **42,5–44,4 %**. La escena de entrada —montón y cartel— sigue
   entrando completa en la primera pantalla, medido a 640 y a 844 de alto. Los
   tres repartos se calculan al renderizar y viajan como **variables CSS**; el
   `@media` elige. Ver §6.
9. **`/contact/success` es una sola pantalla oscura.** El footer va
   **superpuesto** al panel negro y pintado del mismo off-black
   (`absolute inset-x-0 bottom-0 z-[95]`; en reposo es indistinguible de
   transparente, y evita que sus rótulos blancos queden sobre la página clara
   durante los ~150 ms en que el panel todavía está subiendo),
   así que la ruta mide `100svh` exactos en escritorio y en mobile, y ya no hay
   franja clara al pie. Suma un vínculo de salida (`BACK TO HOME` / `VOLVER AL
   INICIO`). **Es el único footer que no es `static`.**

**Reglas técnicas que hay que respetar al tocar cualquier cosa de mobile:**

1. **Cero scroll horizontal.** Es el criterio de aceptación. M2 lo volvió a
   levantar con la matriz ampliada: ocho rutas × **ocho anchos**
   (320/360/390/414/430/768/1366/1920) × dos idiomas = **128 combinaciones, las
   128 en cero**.
2. **Ningún input por debajo de 16 px**, o iOS hace zoom al enfocar. Los cuatro
   de Contact van a 24 y el buscador de países a 20.
3. **Áreas táctiles de 44 × 44 como piso.** Auditadas las 504 que aparecen en
   ocho rutas × tres anchos × dos idiomas: ninguna por debajo.
4. **Nada de `100vh`**: `100svh`. En desktop valen lo mismo, así que la
   sustitución es gratis.
5. **`prefers-reduced-motion` sigue mandando** donde ya mandaba.

## 3. Shell, transiciones, preloader y scroll — ESTADO

- Cadena: `html > body > RootClientShell > LocaleProvider > PreloaderProvider > CustomCursor + LoadingScreen > (site)/layout: SmoothScrollProvider > RouteTransitionProvider > Navbar + PageTransitionShell( main + Footer )`. Route group único `(site)`; `/studio` y `/api` quedan **fuera** del shell (y también fuera de `LocaleProvider`, por el early-return de `RootClientShell`).
- La transición de página **no usa `AnimatePresence` ni key**: es una interpolación de opacidad gobernada por un booleano (`isLeaving`) más un overlay off-white. El disparo es un listener de click en fase de captura a nivel documento, con `router.push` diferido 650 ms. `template.tsx` se remonta en cada navegación (ahí mueren los estados de página); Navbar, Footer y providers persisten.
- **Preloader (rehecho en M3/F1).** Es el **video del logo** que pasaron las clientas: `public/preloader-logo.mp4`, 173,0 KB, 36 cuadros a 12 fps, sin pista de audio y con el `moov` al frente. La cortina dura **3000 ms** —la del video— más el deslizamiento de salida de 1000 que ya existía; eran 2700 en total hasta M2. Sigue corriendo **solo la primera visita por pestaña** (`sessionStorage["esquina:preloaderShown"]`).

  **El mecanismo cambió, y es lo que hay que entender antes de tocarlo.** La cortina se sirve **en el HTML del servidor**, con estilos en línea, así que existe en el primer pintado; hasta M2 se montaba dentro de un `requestAnimationFrame` disparado desde un `useEffect`, o sea después de la hidratación, y por eso la página aparecía antes que ella. La regla de «una vez por pestaña» **no se resuelve en React**: la resuelve un **script bloqueante** en `layout.tsx` que lee `sessionStorage` y `prefers-reduced-motion` antes del primer pintado y marca `data-preloader="skip"` en `<html>`, y una regla de `globals.css` la esconde. Así el primer render del cliente es idéntico al del servidor y la hidratación no puede romperse. Verificado: cero errores de hidratación en las ocho rutas.

  **El lienzo también se pinta de negro, y no es redundante con la cortina** (M3/F1b). El nodo de la cortina es lo segundo que hay dentro de `<body>`, pero el navegador puede pintar **antes** de haberlo parseado, y lo que pinta entonces es el `bg-off-white` del body: medido en un arranque lento, primer pintado a los 2198 ms con la pantalla en blanco y la cortina recién a los 2337, o sea ~140 ms de destello claro. Por eso el script bloqueante marca `data-preloader="on"` cuando la cortina va a correr y una regla de `globals.css` pinta `html` y `body` de negro; lo saca `LoadingScreen` cuando la cortina **empieza** a irse. Verificado estrangulando la red: el primer cuadro pintado da `YAVG = 0` a 40 y a 12 kB/s, contra los 243 de antes.

  **El negro de la cortina es `#000000` y no el off-black de la marca**, y es una medición: el video trae su propio fondo pintado —no tiene alfa— y `ffprobe` da negro de referencia en el cuadro entero. Con `#0F0F0F` se vería el borde del rectángulo del video contra la cortina.

  **El contenido entra cuando la cortina EMPIEZA a irse**, no cuando terminó. `isPreloaderDone` gobierna la entrada de nueve componentes; con la cortina clara sobre página clara daba igual, pero con la cortina negra ese segundo de deslizamiento habría descubierto la página vacía en off-white. **Failsafe:** la salida la manda un `setTimeout` que no depende del video; verificado bloqueando el `.mp4`, la cortina se levanta igual a los 4132 ms. Con `prefers-reduced-motion` **no hay cortina ni video**: el sitio aparece directo.

  `RevealOnScroll` lee `usePreloader()` → **todo consumidor suyo queda gateado por el preloader de forma transitiva**.
- **Idioma (B4).** `LocaleProvider` arranca en `"en"` en el servidor **y en el primer render del cliente**, y resuelve el idioma real en un efecto de montaje: preferencia guardada en `localStorage["esquina:locale"]` si la hay, y si no `navigator.language`. En la primera visita de la pestaña ese montaje ocurre **detrás de la cortina del preloader**, así que el cambio a castellano no se ve; en una recarga a mitad de sesión la cortina dura 0 ms y el cambio ocurre a la vista. Las dos cosas son aceptaciones escritas del plan, igual que la metadata y el `<html lang>` servidos en inglés para todos. La detección **no** persiste: solo la elección explícita escribe.
- **Transición al cambiar de idioma (B4b).** B4b **revirtió** la regla de B4 de que el toggle no disparaba la transición. Cambiar de idioma ahora se ve como cambiar de página: **636,67 ms de acuse de recibo** (el activo se repinta y la barrita viaja **entera**), 650 ms de cortina que sube, el **swap con la cortina arriba**, 650 ms de cortina que baja. Total **1936,67 ms** contra los 1300 de una navegación. **B4c/F2 corrigió el acuse**: duraba 200 ms —la transición de color— mientras la barrita tarda `NAV_INDICATOR_DURATION` (620 ms), así que la cortina arrancaba con la barrita a mitad de camino; ahora `ACK_DELAY` se **deriva** de esa constante y le suma un cuadro, porque el viaje empieza dentro del `requestAnimationFrame` con el que `useIndicator` mide el rótulo ya pintado. El failsafe **se calcula** (`TRANSITION_MS + FAILSAFE_MARGIN_MS`) y se corrió solo a **2336,67 ms**: escribirlo a mano era la trampa, porque la secuencia nueva dura casi los 1900 en que estaba. las dos mitades son las mismas (`PAGE_EXIT_DURATION` + `PAGE_EXIT_EASE`). La cortina la pone `LocaleProvider`, es un `fixed inset-0` off-white a la altura del `<body>` —por eso tapa también el Navbar, que `PageTransitionShell` no cubre— y **el sistema de rutas no se tocó**: solo se consumen tres exportaciones que ya existían. Como nada baja de opacidad, no puede quedar ningún elemento a media opacidad: los dos estados posibles son que la cortina esté en el DOM o que no esté. Con `prefers-reduced-motion` el idioma cambia al instante, sin cortina.
- Lenis corre **solo** en `/team` y `/work*`. En el resto el scroll es nativo. **Nadie toca `history.scrollRestoration`**: B3.4 eliminó el `"manual"` global que seteaba `/services` (junto con el `ServicesPageClient.tsx` donde vivía), así que queda el default del navegador.
- No existen `loading.tsx`, `error.tsx` ni `not-found.tsx` en `src/app/`.

## 4. Mapa de secciones — ESTADO

- `/` Home: `(site)/page.tsx` + `sections/home/Hero.tsx` — estática.
- `/work`: `work/page.tsx` + `sections/work/WorkGrid.tsx` + `ProjectCard.tsx` — estática, fetch con `revalidate: 60`, fallback local.
- `/work/[slug]`: `page.tsx` + `ProjectDetailClient.tsx` + `ProjectContentRenderer.tsx` — SSG (slugs del dataset), nav prev/next.
- `/services`: **rediseñada en B3.4**. `services/page.tsx` es un **componente de servidor** —sin `<main>` anidado, como `/contact`— que compone `sections/services/{ServicesIntro,BrandingPacksHeading,ServicePackSection,ServicesSidebar,IntroScrollTrigger,LatestProjects,SpySentinel,ServicesArrow}` y trae las 4 portadas más recientes con `revalidate: 60`, así que clasifica `○ (Static)` como `/work`. **El scroll-jack ya no existe**: se fueron la máquina S0–S5, sus tres listeners con `preventDefault`, el lock de `body`, el acordeón con sus `ScrollTrigger`, los slideshows y el catálogo hardcodeado. El contenido vive en `src/lib/services-content.ts` —el inglés verbatim del PDF y, desde B4, la variante `SERVICE_PACKS_ES` / `SERVICES_COPY_ES` elegida por idioma— y las medidas compartidas en `sections/services/services-layout.ts`. `BrandingPacksHeading` y `ServicePackSection` pasaron a componentes de **cliente** en B4 (la página, que es de servidor, siempre rendiría inglés) y reciben el `id` del pack, no el pack. Cinco secciones —INTRO · CONSULTATION · 01 ESSENTIALS · 02 UNIVERSE · + ADD-ONS— con sidebar sticky y scroll-spy (§6), gatillo de un scroll en el intro (§6) y cierre LATEST PROJECTS. **El sidebar y el gatillo son de escritorio: debajo de 1024 no existen** (§2b). Con ese desmontaje **GSAP quedó sin un solo consumidor**, y B4c lo desinstaló.
- `/team`: `team/page.tsx` + `sections/team/TeamSection.tsx` — estática; el texto salió del componente al diccionario en B4. Placeholder visible `VIDEO O GIF` (contenido pendiente de las clientas; **no se traduce**, es una nota para ellas).
- `/fun-gallery`: `fun-gallery/page.tsx` + `sections/gallery/FunGallery.tsx` — **estática**, fetch con `revalidate: 60` (B3.2 retiró `force-dynamic` y el `randomUUID()` por request). Lee del schema propio `funGalleryImage`: **ya no deriva de los `project`**. El seed del mapa se deriva de los `_id` en el orden de la query, así que el mismo contenido da siempre el mismo mapa. **Sin fallback local**: si el fetch falla hay pantalla de error, y con cero imágenes, pantalla de vacío. B4 las sacó de `page.tsx` a `sections/gallery/GalleryNotice.tsx`, de cliente, para que sigan al idioma; la página conserva la decisión de cuál corresponde. Pipeline de imagen: `w=1200&fm=webp` al CDN, sin prop `quality` en `<Image>`, `object-contain`, y la capa de parallax sin recorte (`inset-0`, sin `overflow-hidden`) porque con `contain` el overscan negativo recortaba el producto. El rediseño de la pantalla es B3.3. **M2 le sumó los repartos de mobile** (§2b y abajo).
- `/contact`: `contact/page.tsx` (dinámica por `searchParams` `?service=`) + `sections/contact/{ContactForm,ContactSuccess}.tsx` + `lib/contact.ts` — scroll natural, aside en flujo normal (sin sticky, B3.2b), selección scopeada ya implementada.
- `/contact/success`: estática. `/studio/[[...tool]]`: Sanity Studio embebido. `/api/contact`: route handler de Resend.

## 5. Sanity — ESTADO y PLAN

**ESTADO:** dos schemas, `project` y `funGalleryImage` (`src/sanity/schemas/`), registrados a mano en `src/sanity/sanity.config.ts` (imports `:4-5`, `types` `:15`; sin auto-discovery, sin barrel). En `project` solo `title` y `slug` son requeridos y **ninguna imagen tiene campo `alt`**; en `funGalleryImage` son requeridos `image` y `title`, y el alt vive en un campo hermano (`altText`), no dentro de la imagen. `funGalleryImage.linkedProject` es el **primer `reference` del repo**, y su desreferencia en la query el primer `->` documento-a-documento. Sin groups; `project` sí usa **tres `fieldsets`**, uno por par EN/ES (`nameGroup`, `categoryGroup`, `servicesGroup`). Desk por defecto. Cliente de lectura **sin token**, `useCdn: true`, dataset `production` **hardcodeado**. Tipos TS **escritos a mano** en `src/types/` (sin typegen; ya divergen del schema: `alt` fantasma). `urlFor` es un wrapper con stub de fallback; el stub expone `width`/`height`/`quality`/`format`/`url` (B3.2 le sumó `format()` para el pedido de la galería), **no** `fit()`. Queries en `src/lib/sanity.queries.ts`; caché **solo per-fetch**. Desde B3.4 son cuatro: la del grid, la de la ficha, la de la galería y `LATEST_PROJECTS_QUERY` (las 4 portadas del cierre de `/services`, por `_createdAt` descendente con `_id` de desempate y filtro `defined(coverImage.asset)`). **`order` y `_createdAt` no son lo mismo:** `order` es el orden editorial de `/work`, `_createdAt` es cuándo se cargó el documento. Dataset al 2026-08-23: 4 `project` publicados y **8 `funGalleryImage`** (las clientas ya cargaron las imágenes de la galería; hasta el 2026-08-19 eran 0 y la ruta mostraba la pantalla de vacío). Los fallbacks locales (`local-projects.ts`: 8, `mock-data.ts`: 8) tienen slugs inconsistentes entre sí y con el dataset: **no** usarlos como proxy del contenido real.

**B4 cerró el consumo bilingüe:** las tres casillas ES (`titleEs`, `categoryEs`, `servicesEs`) las traen las cuatro queries —`LATEST_PROJECTS_QUERY` sumó `titleEs` en B4— y las renderiza `src/lib/project-text.ts` con **fallback cruzado**: si la casilla del idioma activo está vacía se muestra la otra, en las dos direcciones, y «vacía» incluye `null`, la clave ausente y los espacios. Nunca un hueco. Al 2026-08-21 las **doce** casillas ES del dataset están vacías, así que el sitio en castellano muestra los proyectos en inglés; las traducciones propuestas para cargarlas a mano están en `docs/sanity-piezas-es.md` (el agente **no escribe en Sanity**).

**PLAN / decisiones que siguen en pie:** el `content` de `project` **no** se traduce (duplicar el Portable Text duplicaría también los bloques de media), y `funGalleryImage` no tiene casilla ES: sus títulos se muestran como están. **La regla vieja «Fun Gallery no tiene schema propio / no crear schemas nuevos» queda derogada:** los schemas se crean cuando el plan maestro lo indica. Sigue vigente: Sanity simple para editoras no técnicas — labels en inglés con ejemplo entre paréntesis, agrupación clara, nada técnico expuesto.

## 6. Primitivos compartidos y contratos frágiles — ESTADO

- **Mobile — `src/lib/mobile-layout.ts` y `src/lib/use-media-query.ts` (M1).** Los dos son únicos de su clase y están documentados en §2b: el primero lleva el gutter del cromo, el piso de área táctil y la nota sobre `sizes`; el segundo es **el** hook de media queries, del que ya cuelga `usePrefersReducedMotion`. Cualquier cosa nueva que necesite preguntar por el ancho desde JavaScript se cuelga de ahí; el layout, en cambio, se resuelve con variantes de Tailwind. **M2 le sumó dos medidas al primero**, las dos como clases enteras: `HOME_BLOCK_HEIGHT_MOBILE` (el alto del bloque del hero de `/` en mobile, que resta el alto del footer) y `HOME_FOOTER_CLEARANCE` (el hueco que ocupa ese footer y que `/contact/success` necesita porque ahí va superpuesto). **Desde M4/F3 el número de mobile es 304**: fue 236 en M2, 244 en M3 —cada red pasó a tener su propia fila y el piso táctil de 44 px se aplicó dos veces donde antes una— y ahora 304, porque el copyright se mudó a la columna derecha (el crédito se quedó solo en su fila) y el logo script volvió al pie en fila propia. Los dos números son el alto real del `HomeFooter` en cada rango y **se verifican midiendo**, no se deducen.
- **`HoverButton`**: **11** call sites en 5 archivos (Navbar 4, Footer 4, ContactForm 1, ContactSuccess 1, ServicePackSection 1). *(M2 sumó dos: `CONTACT US` del menú de mobile y el vínculo de salida de la pantalla de éxito.)* *(Corregido en B4: este archivo decía 10 en 5 e incluía a Hero, que no lo usa.)* **B4c le sacó tres props huérfanas**: `blend`, que se quedó sin llamador cuando `/fun-gallery` dejó de tener cromo superpuesto en B3.3, y `underlineDraw` / `underlineDrawDelay`, cuyos consumidores —el CTA del Hero y el botón DISCOVER de `ServicesIntro`— desaparecieron en B2 y B3.4. Las props que quedan son `href`, `className`, `external`, `as`, `tone`, `underline`, `tightUnderline`, `balancedPadding` y `onClick`. **No define font-size**: cada consumidor porta el suyo. `FunGallery.tsx` **no** lo importa. Tocarlo es global: no modificarlo desde un sprint de sección. **Lo que no sabe hacer:** subrayado que aparezca en hover — es un booleano fijo, y atarlo a un estado no sirve porque su relleno negro sube en el mismo gesto y taparía la línea. Los dos links de LATEST PROJECTS resuelven eso con una línea propia, local a esa sección; **no es un primitivo paralelo** y no se promueve a uno sin decisión.
- **`RevealOnScroll`**: **1** consumidor (TeamSection ×4), gateado por preloader. B3.4 se llevó el otro (`ServiceItem`).
- **Indicador de carga de imágenes — `src/components/ui/ImageLoadIndicator.tsx` (M3/F5). Es el único del repo y no se duplica.** Un hook (`useImageLoad`) y un anillo monocromo de 1,5 px en `currentColor`, sin librerías: el giro lo pone `animate-spin` de Tailwind y `motion-reduce:animate-none` resuelve `prefers-reduced-motion` **en el CSS**, sin preguntarle nada a JavaScript. Lo comparten los tres lugares que lo piden: la grilla de Work, las fichas de proyecto y Team. Dos contratos: **(1)** el indicador **no se muestra hasta pasados 120 ms** —una imagen en caché resuelve en el primer o segundo cuadro y mostrarlo antes solo aporta parpadeo; medido, 0 de 152 cuadros con el anillo visible sobre caché caliente— y **(2)** el estado de «listo» lo pueden dar `onLoad`, `onError` o un tope de 15 s, las tres independientes, así que no hay rama en la que el anillo sobreviva a la imagen. El contenedor tiene que ser `position: relative`.
- Sistemas de «aparecer» conviven **4**: 2 por scroll (inline de WorkGrid, `y:40` + stagger 0.7; `RevealOnScroll`) + 2 de entrada artesanales (Hero con `staggerChildren`, variants de Contact). El `RevealLine` de `ServicesIntro` desapareció con el desmontaje de B3.4.
- **Scroll-spy continuo — `ServicesSidebar` (B3.4).** Es el **único** del repo y el único sistema de scroll que no es de un disparo; si otra sección necesita uno, se reusa este, no se escribe un segundo. La regla: **manda la última sección cuyo tope cruzó la línea de lectura** (el borde inferior del header, 128 px); si ninguna la cruzó, gana la primera. Con dos secciones a la vista gana la de arriba, y en el hueco que no pertenece a ninguna —el encabezado BRANDING PACKS— sigue activa la anterior. Tres detalles que **no se pueden tocar sin volver a medir**, porque los tres salieron de medir y no de razonar:
  1. Se observa un **centinela de 1 px** pegado al tope de cada sección (`SpySentinel`), no la sección: una sección alta sigue intersecando mientras su tope cruza y nunca genera evento.
  2. El `rootMargin` corre el borde de la raíz **2 px por debajo** de la línea: uno lo come el alto del centinela y el otro el contacto de borde, que Chrome cuenta como intersección. Sin eso, un centinela apoyado exacto en la línea —que es donde aterriza un click del sidebar— no generaba evento y la flecha se quedaba atrás.
  3. Se observan los centinelas **y también las secciones**. Un salto instantáneo más largo que la ventana (`prefers-reduced-motion`, tecla `End`) puede llevar un centinela de «abajo de la raíz» a «arriba» sin pasar por «intersecando». Las secciones no tienen ese hueco porque cubren la zona sin baches.
  El observer es el **disparador**, no la respuesta: cuando avisa se recalculan de una las cinco posiciones. Por eso el resultado no depende de la dirección de llegada.
- **Gatillo del intro — `IntroScrollTrigger` (B3.4, corregido en B3.4b).** Un solo scroll hacia abajo estando arriba de todo baja suave hasta Branding Packs. Umbral acumulado de **60 px normalizados** (`deltaMode 1` × 100/3, igual que Lenis) y reinicio de la cuenta a los 250 ms. Tres cosas que **este archivo decía mal hasta la sincronización de B4** y que hay que leer del código, no de la memoria:
  1. **Se dispara una sola vez por visita y no se re-arma.** Hay una máquina de tres fases —`armed` junta delta · `locked` desplaza · `spent` ya no escucha nada— y volver arriba **no** vuelve a armarlo: el scroll queda normal. B3.4b revirtió a propósito lo que había pedido B3.4.
  2. **El `preventDefault` no dura «solo mientras dura el desplazamiento»:** el listener es **no pasivo desde el montaje** y cancela **desde el primer evento** mientras el gatillo está armado. Es por una regla de Chrome, no por gusto: de una secuencia de `wheel` **solo el primero llega cancelable**, así que juntar delta en modo pasivo pierde el derecho a cancelar y el scroll nativo le pelea a la animación cuadro a cuadro — eso era la vibración que se arregló. Consecuencia buscada: arriba de todo la página no se mueve hasta cruzar el umbral, y una vez cruzado el desplazamiento es **inmune al gesto**, inercia de trackpad incluida.
  3. **No toca `document.body`** —ni `overflow` ni `paddingRight`—: el lock son listeners, y `release()` es la única salida, llamada al terminar la animación, en el cleanup del efecto (o sea el desmontaje) y por un techo de tiempo.
  4. **Debajo de 1024 px no se arma** (M1/F5): el efecto sale antes de registrar un solo listener, así que en un teléfono el scroll es normal desde el primer gesto. Verificado con eventos sintéticos, ver §2b.
  Si algún día se agrega un segundo gesto en Services, tiene que convivir con este, no duplicarlo.
- **Aparición del sidebar y criterio único de aterrizaje (B3.4b).** El sidebar es de escritorio: `hidden lg:block`, así que debajo de 1024 no existe y con él no existen ni el spy ni los saltos. El menú **no está durante el intro**: aparece cuando el centinela de `BRANDING PACKS` cruza la línea de lectura y se va al volver arriba, con un fundido de 0,5 s. La respuesta la da `isIntersecting` y **no una medición**, porque es la única forma de que el cruce sea exacto en las dos direcciones. `visibility` acompaña a la opacidad para que el menú apagado no sea clickeable ni enfocable, y transiciona al final del fundido de salida. `INTRO` sigue en la lista: es lo que permite volver arriba desde cualquier sección. **El salto aterriza el *contenido* de la sección, no su tope**, a `HEADER + LANDING_BREATH` (24 px) de la línea: entre uno y otro hay 161 px, así que la divisoria termina fuera de pantalla y el aterrizaje cae holgado dentro del rango en que el spy marca esa sección. `LANDING_BREATH` no puede pasar de 32 sin que la divisoria vuelva a asomar. Esta regla y la del spy son **una sola geometría** y están documentadas juntas en `services-layout`.
- **Banderas del selector de país — `CountryFlag.tsx` + `countryFlagCodes.ts` (B2, rehecho en B4d).** **Ya no son dibujos propios: son SVG reales, vendorizados.** Los archivos viven en `public/flags/`, nombrados por código ISO en minúsculas, y `COUNTRY_FLAG_CODES` lleva el nombre inglés del país a su código. **Fuente, versión y licencia están en `docs/banderas-set.md`** (`flag-icons` 7.5.0, MIT, verificada leyendo el `LICENSE` del paquete); el texto de la licencia viaja con las copias en `public/flags/LICENSE.txt`. **No es una dependencia y no va a serlo**: `package.json` no lo menciona, y actualizar el set es repetir el vendorizado a mano. **En reposo van en escala de grises y en hover a color**, que es el gesto que tenían — un filtro CSS sobre un solo archivo, no dos elementos apilados. Cinco reglas que hay que respetar al tocarlo:
  1. **El país sin código no compila.** `COUNTRY_FLAG_CODES` es un `Record<CountryOption, string>`, así que un alta en `COUNTRY_OPTIONS` sin su código es error de tipo. Lo que el tipo **no** garantiza es que el archivo exista: eso se verifica aparte, y es el chequeo barato que hay que correr en cada alta —los 196 resolviendo a un archivo, cero faltantes—. Un código mal puesto tampoco falla: se ve como la bandera de otro país.
  2. **La caja mide `h-[15px] w-[24px]` y no se toca.** El fit de Contact está medido al píxel y el truncado que se arregló en B2.7 vuelve si la fila cambia de ancho. Los archivos son 4:3 dentro de una caja de 1,6, así que entran con `object-cover` —recorta 1,5 px arriba y 1,5 abajo— y **nunca estirados**; `contain` se descartó porque deja las banderas de anchos distintos en una lista de 196 filas.
  3. **`loading="lazy"` no es optativo.** El desplegable monta las 196 filas de una: sin diferir la carga, abrirlo dispara 196 descargas. El `width`/`height` va también como atributo para reservar el lugar y que la lista no salte mientras cargan.
  4. **Quién dispara el color lo decide el consumidor, no el componente.** El gris es del componente; la variante `grayscale-0` entra por `className` como literal entero (Tailwind v4 los busca como texto). En la lista la dispara el `group` de la fila; en el valor elegido, el `group/contact-focus` del campo, con hover **y** `focus-within` para que el teclado vea lo mismo que el mouse.
  5. **La bandera es decorativa: `alt` vacío.** El país ya está en el texto de la fila y en el nombre accesible del disparador (§4.2 del formulario); anunciarla sería decirlo dos veces.
  **Lo que B4d retiró, y por qué:** `MonochromeCountryFlag.tsx` (1707 líneas) y `countryFlagColors.ts` (314). El set propio eran **44 patrones geométricos** para 196 países, y el problema era estructural, no de dibujos puntuales: ~15 % quedaba directamente mal y otro ~25 % apenas reconocible —todas las que llevan emblema—, porque **un escudo no se resuelve a 15 px de alto con geometría genérica, con ninguna técnica**. La concesión estética del cambio está declarada: antes era line-art (contornos), ahora son manchas de gris con la forma correcta.
- **Idioma — `src/lib/i18n/` (B4). Es el único sistema de idioma del repo y no se duplica.** Un tipo `Locale`, un `Dictionary` **explícito** (no `typeof EN`), las dos variantes declaradas `const EN: Dictionary` / `const ES: Dictionary`, un contexto y el hook `useLocale()`. Cinco contratos que **fallan en silencio si se rompen**, así que van acá:
  1. **Una clave que falte es error de compilación.** Es toda la gracia de la interfaz explícita. Lo mismo vale para las tablas de rótulos de `contact.ts` (tipos mapeados sobre la lista canónica: un país sin traducir no compila) y para `ServicePackList`, que fija los cuatro `id` de Services en su orden.
  2. **Los valores de opción son canónicos (inglés); lo que se traduce es el rótulo.** El formulario guarda `Package Design` y muestra «Packaging». Sin eso, cambiar de idioma a mitad de formulario vaciaría la selección, `CountryFlag` —que resuelve el archivo por el nombre inglés— dejaría de encontrar la bandera, y `?service=` dependería del idioma. Al enviar, `localizeContactValues` los pasa a los rótulos **una sola vez, en el borde**: el mail viaja como se muestra.
  3. **El esquema de zod lleva claves, no frases.** `react-hook-form` guarda el mensaje al validar, así que con la frase adentro del esquema un cambio de idioma con errores en pantalla no los actualizaría nunca.
  4. **Las composiciones con corte de diseño viajan como tuplas de largo fijo** (`ThreeLines`, `TwoLines`, los nueve labels, la frase del intro de Services). El corte se escribe en el código en los dos idiomas y **nunca se deja al ancho del navegador**.
  5. **`key` por índice, no por texto**, en toda lista cuyo contenido cambie con el idioma. Con el texto como `key`, cambiar de idioma **desmonta y vuelve a montar** los nodos: en el Hero eso reanima la frase entera. El largo fijo de las tuplas es lo que hace que el índice sea estable.
  Y una regla de ubicación: los `id` del scroll-spy salen a `SERVICES_NAV_IDS`, que **no depende del idioma**, para que el `IntersectionObserver` no se reconstruya en cada cambio.
- **Indicador del cromo — `src/components/layout/nav-indicator.tsx` (B2.2, extraído en B4b). Es el único sistema de indicador del repo y no se duplica.** Vivía dentro de `Navbar.tsx` hasta que B4b le pidió el mismo gesto a la barrita del toggle, que no vive en el Navbar. Comparten medición (`measureFillBox`: la caja del **fill del hover**, no el texto), redondeo, morfología del viaje (se contrae al punto de 5 px, viaja, se vuelve a abrir; 0,62 s), el elemento pintado y los disparadores de remedición. Cuatro cosas que no se tocan sin volver a medir: **(1)** los bordes se redondean **en coordenadas de viewport** y recién después se descuenta el origen del contenedor —lo que tiene que caer en un píxel entero es la línea pintada; para el menú da lo mismo porque su contenedor arranca en (0,0), para el toggle es la única forma de que la línea sea nítida porque el suyo arranca en 42,25—; **(2)** el ancho sale de la resta de los dos bordes ya redondeados; **(3)** el `ResizeObserver` que remide cuando cambia el rótulo **se suscribe una sola vez** y llega a la medición vigente por referencia: `observe()` entrega una notificación inicial y los `ResizeObserver` corren **después** de los `requestAnimationFrame`, así que un observador que se resuscribiera pisaría la animación recién armada con una medición sin viaje; **(4) esa referencia se sincroniza en un `useLayoutEffect`, no en un `useEffect`** — es la causa raíz del punto 14 de M2. Un efecto pasivo puede diferirse al macrotask siguiente, y entonces la notificación inicial del observador llama a un `remeasure` **del render anterior**: mide el rótulo que ya dejó de estar activo y planta la línea ahí, sin viaje y sin nada que la corrija después. Es lo que dejaba el subrayado bajo `EN` con la página ya en castellano (**4 fallas en 32 arranques** medidas antes del arreglo, **0 en 64** después). Los efectos de layout corren dentro del commit, así que la ventana se cierra. **`measureKey` ya no existe**: su único llamador era el toggle adentro del menú de mobile, que M2 sacó a la fila del header. Cualquier consumidor nuevo se cuelga de este módulo; no se escribe un segundo.
- **`LocaleToggle` (B4, revisado en B4b y en M2).** El control `EN / ES` del header. **Desde M2 hay dos instancias y una sola implementación** —el bloque de escritorio y el bloque de mobile de la fila, `hidden lg:flex` contra `lg:hidden`—, y ya **no** vive adentro del menú: se ve siempre, sin abrir nada. La instancia apagada no pinta indicador porque su caja mide cero y `measureFillBox` devuelve `null`. Y **la barrita solo viaja después de una elección explícita en ese control**: al cargar la página el idioma se resuelve en el montaje, no en un click, así que la línea se planta directamente en su lugar (punto 14 de M2). La puerta es la misma `animate` que ya usaba `prefers-reduced-motion`. Comparte geometría con el menú en vez de copiarle números: mismo relleno vertical de 6 px que `balancedPadding`, y la fila del header alineada **arriba** (`items-start`) para que la caja del toggle termine en el mismo borde inferior que la de los tabs. El `<button>` cumple el contrato de `measureFillBox` —él es el elemento posicionado, el rótulo cuelga de un `<span>` sin posición—, así que su barrita **es** el indicador del menú y no una copia; los 0,25 px de desfase entre las dos líneas que había en B4 desaparecieron (las dos en `top 80` a 1920). El **idioma activo va en el color pleno del cromo** (off-black, off-white en rutas oscuras) y el inactivo en `gray-brand`; el separador `/` no cambia. El toggle pinta y mide contra `selectedLocale` —lo elegido— y no contra `locale` —lo renderizado—: esa distancia es lo que hace que responda en el click, antes de que empiece la cortina. Siguen siendo `<button>` y no `<a>`, así que el listener de captura de `RouteTransitionProvider` no se entera; la transición que sí ocurre la gobierna `LocaleProvider` (§3), no el router: el árbol no se remonta y la ruta no cambia.
- **Los tres repartos de la Fun Gallery — `FunGallery.tsx` (M2/F3).** La misma composición se muestra de tres formas: grilla de dos columnas debajo de 768, de tres hasta 1024 y la dispersión del motor de 1024 para arriba. **Los tres se calculan al renderizar y viajan como variables CSS** en el `style` de cada objeto; el que manda lo decide el `@media` y no el cliente, así que el layout sale correcto del servidor y no hay parpadeo al hidratar (§2b prohíbe decidir layout con el hook de media queries). Las clases que consumen esas variables son literales enteros —`lg:left-[var(--d-x)]`, `md:[--pile-x:var(--b-px)]`— porque Tailwind v4 no genera nada que no esté escrito. **El viaje del montón no es CSS sino una animación de Framer**, y por eso pasa por una variable intermedia: cada capa declara `--pile-x` / `--pile-y` apuntando al juego de su rango y la animación va **hacia `var(--pile-x)`**; Framer resuelve variables CSS en sus destinos leyendo el valor ya computado del elemento (`DOMKeyframesResolver.readKeyframes`). Lo único que **no** puede salir de una variable es el retraso del despliegue, que es un número de JavaScript: ese sí se elige con `useIsBelowDesktop()`, y se puede porque es un tiempo de animación y no una medida, y porque recién importa cuando la persona toca.
- Contratos frágiles conocidos (romperlos falla en silencio):
  - `TITLE_LINE_COUNT` (Hero) **no existe en el código**: este archivo lo arrastraba de la auditoría y se verificó en B4 que ya no está (cero ocurrencias en `src/`). El conteo lo garantiza ahora el tipo: `getHeroLines(locale)` devuelve `ThreeLines`, o sea exactamente tres líneas, en compilación y en los dos idiomas. (El `TITLE_1_LINE_COUNT` de Services desapareció con B3.4, igual que el centinela `"Applications may include:"`, el `id="services-list"` y los dos `h-[200vh]` duplicados.)
  - `?service=` une `quoteService` de `src/lib/services-content.ts` con `ContactForm` (`resolveWorkTypeFromService`). Hoy son `CONSULTATION` y `BRANDING`; Add-ons manda `null` y el formulario abre sin nada marcado. **`quoteService` no se traduce**: es identidad. El match exacto se prueba contra los rótulos de **los dos idiomas** y después caen los trozos por keyword, con `brand` y `marca` al final porque están adentro de casi todos los demás. Devuelve siempre el valor **canónico**.
  - Los `id` de las secciones de Services (`intro`, `consultation`, `essentials`, `universe`, `addons`) son a la vez ancla del sidebar, objetivo del spy y destino de los `href="#…"`. **No se traducen** (viven en `SERVICES_NAV_IDS`). El destino del gatillo es otro: `branding-packs`, que **no** es sección del menú.
  - Tailwind v4 busca los nombres de clase como **literales** en el código: una clase compuesta en runtime (con `replace`, con plantillas) no llega nunca al CSS. Por eso `services-layout.ts` repite las clases enteras en vez de derivarlas.

## 7. Lecciones verificadas (junio 2026 — siguen válidas)

- `transform-gpu` puede dejar una capa de compositor stale (hairline anti-aliased persistente). Se resolvió quitándolo del span externo de `HoverButton` y empujando el idle fill a 110%.
- Los artefactos sub-pixel de transforms de centrado **dependen del DPR**: lo visible a DPR1/100% puede ser invisible en Retina. El umbral cosmético se decide con eso en mano.
- `template.tsx` debe ser **solo opacidad** (sin transform ni overflow) o mata los `position: sticky` de las páginas (fix coordinado `b634521`).
- `sticky` exige ancestros sin `overflow: hidden/clip`. El viejo `ServicesIntro` recorría los ancestros forzándoles `overflow: visible` por eso; **B3.4 lo eliminó y el sidebar sticky funciona sin ninguna de esas muletas**, así que la cadena real (`template` → `PageTransitionShell` → `main`) ya estaba limpia. No reintroducir el paseo por ancestros.
- En esta etapa, el fix de una línea (`md:top-48`, opacidad idle) suele ganarle a la solución arquitectónica.
- **Una clase de Tailwind compuesta con una plantilla no existe** (M1 → M2).
  `` `lg:h-[calc(...-(${HOME_FOOTER_HEIGHT}))]` `` viaja en el atributo `class`
  y **no pinta nada**: Tailwind v4 busca los nombres de clase como literales en
  el código y ese nombre no está escrito en ningún lado. El costo real, medido:
  el bloque del hero de `/` cayó de 788 a 540 px a 1920 y quedó una franja
  muerta de 248 px al pie durante todo M1, sin que ninguna de las 48 mediciones
  de altura lo detectara. **`scrollHeight` nunca baja del alto del viewport**,
  así que un documento de 1080 a 1920 no prueba que el contenido llegue al pie:
  para eso hay que medir el borde inferior del último elemento.
- **`backdrop-filter` crea bloque contenedor para los `position: fixed`
  descendientes** (M2). Un `fixed inset-0` adentro de un elemento con blur se
  resuelve contra ese elemento y no contra el viewport. Es lo que rompía el menú
  de mobile en siete de las ocho rutas.
- **`min-height: 100vh` en el `<body>` deja scrollear de más en un teléfono**
  (M3/F3). `100vh` no es la pantalla que se ve: es la pantalla **con la barra
  del navegador oculta**, o sea el viewport grande. Con `min-h-screen` —que es
  `100vh`— el documento quedaba más alto que lo visible aunque su contenido
  midiera exactamente `100svh`, y eso producía dos síntomas que parecían
  distintos: `/` se dejaba scrollear de más, y en `/contact/success` la franja
  sobrante mostraba **el fondo off-white del propio body** debajo del panel
  oscuro. **Ninguna medición del banco lo detecta**: en un viewport emulado
  `vh`, `svh`, `lvh` y `dvh` valen todos lo mismo, porque no hay barra que se
  retraiga. Se demostró forzando a mano el `min-height` que declara `100vh` con
  la barra oculta (+72 px): las dos rutas pasan de `docH = 844` y `scrollY = 0`
  a `docH = 916` y `scrollY = 72`.
- **El corolario: `svh` para lo que tiene que entrar, `lvh` para lo que tiene
  que cubrir** (M3/F3 y M3/F6). La regla vieja «nada de `100vh`: `100svh`»
  sigue en pie para todo lo que debe **caber** en la pantalla. Pero una sección
  cuyo trabajo es **que no se vea nada debajo de ella** necesita lo contrario:
  el máximo que el viewport puede llegar a medir, o sea `lvh`. Es lo que se
  aplicó al intro de `/services`. En escritorio las tres unidades valen lo
  mismo, así que la distinción solo se paga en mobile.
- **Chrome interpola colores en `oklab`, no en `rgb`** (M3/F4). Al muestrear
  una transición de color con `getComputedStyle`, los valores intermedios
  llegan como `oklab(L a b / alpha)` y un parser que espere `rgb(...)` los lee
  mal —da lecturas incoherentes, no un error—. La `L` de `oklab` es
  directamente la claridad perceptual y sirve para verificar la curva.
- **React 19 sí emite `muted` en el HTML del servidor** (M3/F1). Era un defecto
  conocido de versiones anteriores —el atributo se trataba como propiedad y no
  llegaba al marcado, así que un `<video autoplay muted>` servido no
  autorreproducía—. Verificado en el HTML servido de esta versión: salen
  `autoPlay=""`, `muted=""` y `playsInline=""`. Los nombres van en camelCase y
  eso no importa: HTML no distingue mayúsculas en los nombres de atributo.
- **`next/image` no puede servir nada más chico que 640 px si el `sizes` trae un
  `vw` suelto** (M1/F7). Su `deviceSizes` arranca ahí, y `getWidths` filtra el
  `srcset` con `640 × el vw más chico` del `sizes`; como el regex que lo detecta
  pide que el número venga precedido por un espacio, un `vw` escrito dentro de un
  `calc()` no lo dispara y vuelven los cortes de 96, 128, 256 y 384. Es lo que
  bajó el peso servido a 390 px un **39,6 %** sin tocar `next.config.ts`. La nota
  con la cita del código está en `src/lib/mobile-layout.ts`.

## 8. Reglas innegociables

1. Tipado estricto, sin atajos de conveniencia.
2. **No agregar librerías de terceros** sin decisión cerrada en el plan (el i18n se hace a mano por decisión).
3. Respetar el stack y las decisiones cerradas (Framer/Lenis tal como están; no migrar nada por iniciativa).
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

Ronda de devoluciones de las clientas (fuente: `Final.pdf`, 2026-08-13). **B1 Fundación** (docs y limpieza) → **B2 Devoluciones visuales** sobre lo existente (home, menú 17/0, footer nuevo global, Team, Work grid 5:4, Contact compacto) → **B3 Rediseños** (Fun Gallery con schema propio + Services con sidebar/spy; arrancó con la sonda de transparencia y cerró con B3.4b) → **B4 Idioma EN/ES** (toggle en header, diccionario, consumo bilingüe de Sanity). **La ronda está cerrada**: los cuatro bloques se ejecutaron. Detalle, decisiones cerradas y estado: `docs/plan-maestro.md`; lo que quedó abierto, en `docs/pendientes.md`.

Después de M3 se ejecutó **M4 — Ajustes de footer y menú** (2026-08-24, cuatro
ajustes en cuatro fases): el ícono del menú pasa a ser **uno solo** —tres rayas
que giran a cruz, acompañando al panel—; el menú abierto **subraya la sección
actual** y la anuncia, con `/` sin ningún ítem marcado porque home se entra por
el logo; y los **dos footers de mobile** toman la composición de dos columnas
alineadas por el borde inferior con `© 2024` como tercer ítem de la derecha, el
crédito solo y centrado, y —en el claro— el **logo script de vuelta**, abajo a la
derecha y en fila propia. El footer claro pasa de 244 a 304 px y el oscuro suma
12; el escritorio no se movió (32 de 32 altos idénticos) y el scroll horizontal
sigue en cero en las 80 combinaciones. Detalle y mediciones en la entrada de
`docs/bitacora.md`.

Antes de eso, después de M2, se ejecutó **M3 — Preloader nuevo y quince correcciones** (2026-08-23, nueve fases): el preloader pasa a ser el video del logo que pasaron las clientas y se arregla de raíz el orden de aparición (§3); los tres footers reordenan mobile; se elimina el scroll sobrante de `/` y de la pantalla de éxito, que resultó ser el `100vh` del `<body>` (§7); el menú de mobile coordina su cambio de tono con el panel y centra sus ítems; entra el indicador de carga de imágenes (§6); `/services` estrena la cuadrícula 2 × 2 del cierre; el selector de países gana búsqueda por alias, sin tildes y en los dos idiomas; y la galería agranda el objeto antes de navegar en touch. Detalle y mediciones en la entrada de `docs/bitacora.md`.

Antes de eso, después de **M1**, **B4c** y **B4d**, se ejecutó **M2 — Correcciones de mobile y cierre** (2026-08-23, cinco fases): las catorce devoluciones de la verificación humana de M1. Diez de mobile —el menú entero, el ícono, el toggle al costado, la cruz, `/` en una pantalla, el prefooter y el footer reordenados, la galería más grande y en grilla, la pantalla de éxito—, dos de escritorio —el footer transparente de `/contact/success` y el header de `/`, que era una **regresión** de M1 y no una decisión— y dos que tocan a los dos —el subrayado del idioma al cargar y la salida de la pantalla de éxito—. Detalle y mediciones en la entrada de `docs/bitacora.md`.

Antes de eso se ejecutó **M1 — Adaptación mobile** (2026-08-22, nueve fases): el sitio entra y se usa en teléfonos (§2b). Lo que sigue pendiente y necesita su propio chat de planificación: `error.tsx` / `not-found.tsx`, los `<main>` anidados y la instalación del harness ECC. Después se ejecutó **B4c** (2026-08-22, cuatro fases): el timing del toggle de idioma, la limpieza de dependencias —GSAP desinstalado, `blend` y las dos props de `underlineDraw` retiradas de `HoverButton`, `--color-gray` borrado— y la corrección del set de banderas, que resultó **no** ser un problema de emojis sino de patrones mal repartidos.
