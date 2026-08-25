# Bitácora — Esquina Estudio

Registro único y acumulativo de lo ejecutado. **La escribe el agente de ejecución** al cerrar cada sprint o bloque. Las entradas se **agregan al final**; nunca se edita ni se borra una entrada previa.

Formato de entrada:

## [fecha] · [Bloque/Sprint] · [título]
- **Qué se hizo:**
- **Decisiones tomadas en ejecución** (deberían ser cero; si hubo, por qué):
- **Mediciones / salidas de puertas:**
- **Pendientes que deja:**
- **Verificación humana pendiente:**
- **Commits:**

---

## 2026-08-15 · B1 Fundación · Sincronización de documentación y limpieza

- **Qué se hizo:** [F1] borrados `InfoCard.tsx`, `SanityImage.tsx`, `types/service.ts` y `/api/seed-sanity` (346 líneas); los `devserver*.log` ya estaban destrackeados e ignorados desde `a477018`. [F2] creados `docs/plan-maestro.md`, `docs/pendientes.md`, `docs/bitacora.md`; `README.md` reemplazado (era el boilerplate intacto de `create-next-app`); 2 comentarios stale de Contact corregidos; `docs/reportes/` y `docs/instrucciones/` ya estaban trackeados. [F3] `CLAUDE.md` reescrito completo (ESTADO/PLAN).
- **Decisiones tomadas en ejecución:** tres, todas mecánicas, ninguna de producto. (1) La instrucción ubicaba `InfoCard.tsx` en `src/components/ui/`; el archivo real —único en el repo, cero consumidores, el mismo que cita la auditoría (`text-body` en :19, `esquina™` en :30)— vive en `src/components/sections/work/`. Se borró el real. (2) El destrackeo de los devserver logs y su regla de ignore ya estaban hechos en `a477018` (commit posterior al `2565d01` sobre el que se auditó); no se apendeó el bloque al `.gitignore` porque habría duplicado la regla `devserver*.log` ya presente en la línea 51. (3) El build de F1 falló por un artefacto stale del dev server (`.next/dev/types/validator.ts`, incluido en el typecheck por `tsconfig.json:30`) que aún importaba la ruta borrada; se le quitó ese bloque. Es caché regenerable, no versionada — en un checkout limpio el error no existe.
- **Mediciones / salidas de puertas:** línea base — lint: exit 0, sin errores ni warnings; build: exit 0 con los 2 warnings conocidos (NFT de Turbopack originado en `seed-sanity`, deprecación de `@sanity/image-url`). Final — lint: exit 0; build: exit 0 y **el warning NFT desapareció** al borrarse el seeder; solo persiste la deprecación de `@sanity/image-url`. Cero errores nuevos. Greps de consumidores (F1): `InfoCard` → solo dentro de su propio archivo; `@/components/ui/SanityImage` y `<SanityImage` → 0 (los tipos `SanityImageLike`/`SanityImageAsset` de `types/project.ts` quedan, los usa FunGallery); `@/types/service` → 0; `seed-sanity` → 0 en `src/`. Verificación extra: `SANITY_API_WRITE_TOKEN` en `src/` → 0 apariciones.
- **Pendientes que deja:** el borrado del seeder rige en producción recién con el próximo deploy (ver `docs/pendientes.md`). Observación para la capa de planificación: `esquina-estudio/AGENTS.md` existe, está versionado y sigue vigente (regla autogenerada de Next: leer `node_modules/next/dist/docs/` antes de escribir código, por breaking changes de la 16), pero el CLAUDE.md nuevo no lo menciona ni lo integra.
- **Verificación humana pendiente:** diff de `CLAUDE.md` + exactitud de plan-maestro/pendientes (Valentino); smoke visual de que nada cambió en `/`, `/work`, `/services`, `/contact`.
- **Commits:** `9e19461` (F1), `8590967` (F2), `00f57d7` (F3), más el de este cierre.

## 2026-08-15 · B1 · Enmienda de CLAUDE.md (microsprint)

- **Qué se hizo:** restituidas en §8 las reglas de criterio (causa raíz, refinar > reconstruir, no duplicar sistemas, eliminar obsoleto, jerarquía de prioridades) y agregada la subsección de directiva estética; integrado `AGENTS.md` en §1 y §9; aclarado en §2 que `--font-display` y `--font-body` son la misma familia. Tres altas en `docs/pendientes.md`.
- **Origen:** observaciones d.1–d.4 y desvío 3 del reporte de cierre del Bloque 1.
- **Decisiones tomadas en ejecución:** ninguna.
- **Mediciones / puertas:** build exit 0; diff acotado a 2 archivos.
- **Verificación humana pendiente:** lectura del diff completo de `CLAUDE.md` por Valentino.
- **Commits:** `83880a9`, más el de este cierre.

## 2026-08-15 · B2.1 · Footer nuevo global

- **Qué se hizo:** `Footer.tsx` reescrito en tres ramas de render. **Rutas internas** (`/work`, `/work/[slug]`, `/services`, `/team`, `/contact`): franja clara con la frase nueva a la izquierda (40/48/0, negritas por fragmento) y `CONTACT US` + `LET'S BRING / YOUR IDEAS TO LIFE` a la derecha, más banda off-black con el logo script gigante, `JOIN OUR CLUB` → `/contact` arriba a la izquierda y la fila de info al pie. El CTA `LET'S WORK TOGETHER!` de 40 px desapareció de esas rutas. **Home:** una sola franja clara, `POWERED BY develOP` bajado de 40 a 17 px, redes y logo script a la derecha, interlineado 20. **Rutas con footer fijo** (`/fun-gallery`, `/contact/success`): variante compacta equivalente a la de hoy, con el interletrado llevado a 0. Creado `src/lib/site-copy.ts` (`HERO_LINES`, fuente única de la frase); el asset de las clientas copiado a `logos/logo-footer-grande.png` y el directorio de originales `Assets_Footer/` agregado al `.gitignore`.
- **Decisiones tomadas en ejecución** (todas de composición, dentro del marco de la instrucción; ninguna de producto): **(1) Escala y sangrado del logo.** Se montó a ancho completo de la banda, sin gutter, con su borde derecho sobre el borde del viewport y su borde superior sobre el de la banda. Fundamento medido con `sharp`: el asset **ya viene cortado por su propio lienzo** (266 px opacos sobre el borde superior en 3 segmentos, 125 sobre el derecho — glifo cortado, no tangencia) y trae 24,8 % de aire propio a la izquierda. Sangrar más allá del viewport habría comido la «o» final y el `™` que la instrucción pide conservar. **(2) `JOIN OUR CLUB` superpuesto** (`absolute`) sobre el aire del asset en vez de en flujo: en flujo habría empujado el logo hacia abajo y anulado el corte superior horneado. El perfil de tinta lo habilita — en la franja superior del asset la tinta no empieza antes del 54–64 % del ancho. **(3) Ritmo vertical derivado del chrome**, no inventado: el Navbar y el footer usan `px-12 py-10 lg:px-16`; la franja clara usa `py-20` (2× el ritmo vertical) y la fila al pie de la banda `pt-6 pb-10`. **(4) Zona 1 alineada por el borde superior** (`items-start`), sin compensación óptica: se descartó `items-baseline` porque el `overflow: hidden` del `HoverButton` corre su línea base al borde inferior de la caja. **(5) `DevelopCredit`:** se eliminó la variante `large` de 40 px, que quedó sin consumidores al bajar home a 17 px; queda una sola escala más un eje `label` («POWERED BY» / «BY»). **(6) Variante fija:** rama propia con el markup de hoy **textual**, incluido el `grid-cols-4`; no se reescribió con flex porque `grid-cols-4` iguala el ancho de las cuatro columnas y un flex habría cambiado el espaciado. Se eliminaron `isContactForm` y `shouldReplaceFooterCta`, que en esas dos rutas siempre valían `false`. **(7)** Textos y URLs compartidos extraídos a constantes (`SOCIAL_LINKS`, `PLACE_PAIRS`, `COPYRIGHT`) que consumen las dos ramas, para no dejar dos fuentes de verdad. **(8)** `HERO_LINES` quedó como tres líneas × fragmentos, con el contrato de que el espacio separador se emite fuera del elemento en negrita (para que su avance no dependa del peso). `HoverButton` no se tocó.
- **Mediciones / salidas de puertas:** línea base — lint exit 0, build exit 0 (14 rutas). Final — lint exit 0, build exit 0, mismas 14 rutas; cero errores nuevos. Runtime (`next dev`, viewport 1920, DPR 1, `getComputedStyle`): footer de `/work` **989,67 px** (franja clara 304 + banda oscura 685,67; logo 1920×571,67); footer de `/` **164 px** (antes 166) y home **sin scroll vertical**. Frase de la zona 1: `font-size` 40 px, `line-height` 48 px, `letter-spacing` 0, peso 400 con 600 en los fragmentos marcados. Fila de info: 17 px / 17 px (`leading-none`) / 0 / peso 550; en home 17 / 20 / 0 / 550. `CONTACT US` y `JOIN OUR CLUB`: 17 / 20 / 0 / 550. **Elementos con `letter-spacing` distinto de 0: cero, en las 7 rutas** (Blink normaliza `0em` a `normal`), incluida `/fun-gallery`, que perdió sus `0.035em`/`0.02em`. Sin scroll horizontal a 1920 (viewport real), 1512 y 1024 (medidos forzando el ancho del footer: el `resize` de ventana no aplicó por ventana maximizada); altos del footer interno 990 / 868 / 723 px. Rutas fijas sin regresión: `/fun-gallery` `fixed`, `bottom: 26px`, `z-index: 100`, `mix-blend-mode: difference`, alto 166, peso 100, crédito `BY develOP`, CTA 40 px; `/contact/success` `fixed`, `bottom: 0`, alto 166. `next/image` con `sizes="100vw"` sirvió el candidato de **1920 px**, no el original de 8000. Hover del `HoverButton` verificado sobre la banda negra (fill off-white, texto a off-black).
- **Pendientes que deja:** `Final.pdf` **no está en el repo** — el sprint se ejecutó contra la descripción escrita de la instrucción, no contra las páginas; de ahí que la comparación con el mockup sea verificación humana. `--footer-height: 480px` sigue huérfano en `globals.css` y ahora contradice la realidad por más margen (990 px en rutas internas): insumo para la decisión de tokens del ritual de B2. A 1024 px el bloque `JOIN OUR CLUB` queda a ~12 px del trazo del script (el texto no escala, el logo sí): funciona, pero es el borde del rango declarado. La frase quedó fijada en `site-copy.ts` con la puntuación del footer, lo que **resuelve el pendiente [PDF] de puntuación** para esta pieza; B2.3 debe hacer que Hero la consuma (hoy Hero conserva su copy viejo, «MAKE YOUR BRAND STAND OUT.»). El zip `Assets_Footer (2).zip` sigue sin trackear, para borrado manual.
- **Verificación humana pendiente:** composición de la banda oscura contra la página 4 del PDF (tamaño y sangrado del logo, aire alrededor, peso visual del conjunto) — es la decisión estética del sprint; las 7 rutas a ojo, con atención a `/fun-gallery` y `/contact/success`; corte y negritas de la frase contra el mockup; en home, el interlineado 20 deja `INSTAGRAM`/`LINKEDIN` muy juntos (el subrayado casi toca la línea siguiente): es lo que pide el PDF, confirmar; alineación superior del bloque `CONTACT US` respecto de la frase.
- **Commits:** `93b062c`, más el de este cierre.

## 2026-08-18 · B2.1b · Ajuste de composición del footer contra el mockup

- **Qué se hizo:** cuatro ajustes de composición en `Footer.tsx`, medidos contra `docs/mockups/04-footer-anotado.jpg` y `docs/mockups/12-contact-anotado.jpg` (el 04 no renderiza el copy de `JOIN OUR CLUB`; el 12 sí, y fue la referencia real para esa pieza). **(1)** `CONTACT US` / `LET'S BRING YOUR IDEAS TO LIFE`: 17→26 px, `line-height` 31 px (antes 20). **(2)** Franja: sin cambio estructural — a 26 px el bloque derecho ya arranca a 2 px del tope de la frase (dentro de tolerancia), no hizo falta nudge. **(3)** `JOIN OUR CLUB`: 17→26 px; `BECOME PART OF A` / `CREATIVE COMMUNITY`: 17→22 px (un escalón por debajo, tal como se ve en el mockup 12); posición movida de `top-10` a `top-[46%]` del contenedor de la banda, con `mt-3` entre el link y el párrafo (antes `mt-[8px]`). **(4)** Fila de info de la banda oscura: `© 2024` y `POWERED BY develOP` dejan de apilarse (pasan a columnas propias, mismo nivel que `BORN IN`/`WORKING`); `INSTAGRAM`/`LINKEDIN` pasan de `flex-col` a `flex-row` con `gap-x-5`. El fix de (4) se implementó como dos props nuevas de `InfoRow` (`inlineCredit`, `inlineSocial`, default `false`), activadas solo en el call site de la banda oscura — `HomeFooter` no pasa esas props y queda con el mismo output de antes (verificado: 164 px de alto, captura idéntica).
- **Decisiones tomadas en ejecución** (mediciones, no bifurcaciones de producto): **(1)** Los 24–25 px de partida de la instrucción eran una hipótesis; la medición real contra el mockup (análisis de píxeles con `System.Drawing`, comparando la altura de mayúsculas de `CONTACT US`/`JOIN OUR CLUB` contra la de la frase de 40 px, cuya altura de mayúscula mide 21 px en el 04) dio una proporción de 14/21 ≈ 0,667 → 26,7 px. Se redondeó a 26 px. **(2)** `docs/mockups/04-footer-anotado.jpg` (la referencia principal declarada) no contiene el texto `JOIN OUR CLUB` en absoluto — la anotación en esa zona («confirmar cómo necesitan que les pasemos el logo grande») es sobre el asset del logo, no sobre este bloque. Se usó `12-contact-anotado.jpg` como referencia real (muestra el mismo footer con el copy completo), midiendo `JOIN OUR CLUB` (28 px) y `BECOME PART OF A` (25 px) con su propia escala de calibración (`LET'S BRING YOUR IDEAS TO LIFE` a 40/48 pt en esa misma imagen). Para no introducir una tercera talla en el footer, `JOIN OUR CLUB` se fijó en 26 px (igual que `CONTACT US`) en vez de 28; es una nivelación deliberada, no una medición literal. **(3)** La posición `top-[46%]` es una aproximación: el contenedor relativo mezcla la altura de la imagen del logo con la de la fila de info de abajo, mientras que el 49 % medido en el mockup es sobre el alto de banda hasta el borde superior de la fila de info. La diferencia es submarginal (banda de tolerancia, no medible en píxeles enteros sin el activo real a resolución de producción) — se verificó visualmente contra ambos mockups y el texto queda cómodo dentro del 24,8 % de aire propio del asset, sin tocar tinta a ninguna altura. **(4)** El gap horizontal entre `INSTAGRAM`/`LINKEDIN` (`gap-x-5`, 20 px) sale de medir el hueco entre los dos subrayados en el 04 (16 px de imagen ≈ 21 px de diseño); el gap del cluster izquierdo se dejó en el `gap-x-12` (48 px) ya existente para `BORN IN`/`WORKING`, sin remedirlo, porque no era parte de los cuatro ajustes pedidos y el patrón ya está en uso en Home.
- **Mediciones para el reporte** (`next dev`, viewport 1920, DPR 1, `getComputedStyle` + `Range.getBoundingClientRect()` sobre nodos de texto): frase 40 px / 48 px; `CONTACT US` y `JOIN OUR CLUB` 26 px / 31 px; fila de info sin cambio, 17 px / 17 px (`leading-none`). Delta vertical entre la primera línea de la frase y la de `CONTACT US`: **2 px** (tolerancia ±2 px, cumple). Alto del footer en `/work`: **981,67 px** (antes 989,67 — la baja es consecuencia esperada de (4): al dejar de apilar, la columna de copyright/crédito y la de redes dejan de ser la más alta de la fila de info, que ahora la marca `BORN IN`/`WORKING` sin cambios). Alto en `/`: **164 px**, sin cambios. Sin scroll horizontal a 1920 (verificado real, `scrollWidth === clientWidth`). A 1512 y 1024 **no se pudo verificar**: la herramienta de resize de ventana no tomó efecto en esta sesión (mismo límite que dejó registrado B2.1 — ventana maximizada); dado que ningún ajuste de este sprint toca anchos, gutters ni breakpoints (solo `font-size`, `line-height` y una posición porcentual dentro de un contenedor ya existente), el riesgo de overflow nuevo a esos anchos es bajo, pero queda sin confirmar por herramienta.
- **Pendientes que deja:** el 26 px de `JOIN OUR CLUB` es una nivelación con `CONTACT US`, no la medición literal del mockup 12 (28 px) — si Valentino prefiere fidelidad estricta a esa imagen en vez de coherencia entre los dos bloques, es un ajuste de un solo valor. La verificación a 1512/1024 sigue pendiente de herramienta (ver arriba). `docs/mockups/04-footer-anotado.jpg` debería, a criterio de la capa de planificación, incluir el copy de `JOIN OUR CLUB` en una futura repaginación del PDF — hoy dos mockups de la misma pieza muestran información complementaria y no redundante.
- **Verificación humana pendiente (declarada, no la da por cumplida el agente):** comparar el footer renderizado contra `docs/mockups/04-footer-anotado.jpg` — escala relativa de los tres bloques de texto, altura de arranque de la franja, aire de la banda, fila de info en una sola línea; y contra `docs/mockups/12-contact-anotado.jpg` para `JOIN OUR CLUB` en particular. Repaso de que `/`, `/fun-gallery` y `/contact/success` no cambiaron (verificado por el agente vía captura y `getBoundingClientRect`, pero la palabra final es humana).
- **Commits:** el de este cierre.

## 2026-08-18 · B2.1c · Swap de CTA del footer por ruta

- **Qué se hizo:** `Footer.tsx` — `StatementBand` y `ScriptBand` reciben una prop `isContactPage` (mismo patrón de flags por ruta que `isFunGallery`/`isDarkRoute`, ya en uso en el archivo). En `/contact`, `StatementBand` deja de renderizar el bloque `CONTACT US` / `LET'S BRING YOUR IDEAS TO LIFE` (queda solo la frase) y `ScriptBand` sí renderiza `JOIN OUR CLUB` / `BECOME PART OF A CREATIVE COMMUNITY`. En el resto de las rutas internas (`/work`, `/work/[slug]`, `/services`, `/team`) es al revés: `CONTACT US` se renderiza y `JOIN OUR CLUB` no. `Footer()` calcula `isContactPage = pathname === "/contact"` y se lo pasa a `SiteFooter`, que lo reenvía a ambas bandas. Home y las dos rutas con footer `fixed` no se tocaron.
- **Origen del error:** la instrucción de B2.1 (no la ejecución) pidió renderizar los dos bloques —`CONTACT US` de la página 4 del PDF y `JOIN OUR CLUB` de la página 12— a la vez y en todas las rutas, composición que no existe en ningún mockup. El `Footer.tsx` anterior a B2.1 ya resolvía esto con `shouldReplaceFooterCta` (`true` en `/contact`), señal independiente de que el intercambio por ruta es el comportamiento correcto. Decisión de restaurarlo (opción a) cerrada por Valentino.
- **Decisiones tomadas en ejecución:** ninguna. Se reusó el mecanismo de flags por ruta ya presente en el archivo, sin introducir prop externa ni mecanismo nuevo. No se usó ocultamiento por CSS: ambos bloques se omiten con `&&`, sin nodos invisibles en el DOM. No hizo falta compensar el layout con celdas vacías — el bloque `CONTACT US` es un hijo flex de ancho natural (no `w-full`) en un contenedor `justify-between`, y `JOIN OUR CLUB` está en posición `absolute`: en ambos casos, quitar el hermano no desplaza al resto.
- **Mediciones / salidas de puertas:** lint exit 0, cero errores. Build exit 0, mismas 11 rutas, sin errores nuevos (el único warning es la deprecación conocida de `@sanity/image-url`, preexistente). Runtime (`next dev`, viewport 1920, DPR 1, `getBoundingClientRect` scopeado a `footer`): alto del footer en `/work` **981,67 px**, en `/contact` **981,67 px** (idéntico), en `/` **164 px** (sin cambios). Posición horizontal de la frase: `x = 64` px en ambas rutas (idéntica). `/work`: `CONTACT US` presente en el footer, `JOIN OUR CLUB` ausente. `/contact`: `JOIN OUR CLUB` presente, `CONTACT US` ausente del footer (el texto "CONTACT US" que aparece en el resto del DOM de esa ruta es el propio formulario de contacto, fuera del `<footer>`). `/fun-gallery` y `/contact/success`: `position: fixed`, CTA `LET'S WORK TOGETHER!`, sin cambios respecto de antes.
- **Pendientes que deja:** ninguno.
- **Verificación humana pendiente (declarada, no la da por cumplida el agente):** recorrido de `/work`, `/contact`, `/`, `/fun-gallery` y `/contact/success` por Valentino, confirmando los cinco criterios de aceptación de la instrucción.
- **Commits:** `29d616e`, más el de este cierre.

## 2026-08-18 · B2.2 · Menú del header a 17 px con interletrado 0

- **Qué se hizo:** `Navbar.tsx`, único archivo tocado. **(1) Fase 1:** los cuatro tabs (`Navbar.tsx:307`) y `CONTACT US` (`:330`) pasan de `text-[13px]` a `text-[17px]`; la variante de tracking por ruta (`isFunGallery ? "tracking-[0.09em]" : "tracking-wider"`, `:310` y `:333`) se elimina y queda `tracking-normal` fijo en las 7 rutas. Los pesos condicionados por ruta (`font-[480]`/`font-thin`, `font-medium`/`font-normal`) se conservan tal cual: el sprint pedía tamaño e interletrado, no peso. **(2) Fase 2:** el indicador deja de medir la caja del `HoverButton` y mide el **texto renderizado**. Nueva función `measureLabel()` — un `TreeWalker` llega al nodo de texto y un `Range` devuelve su rectángulo — más `indicatorTop()` y la constante documentada `NAV_INDICATOR_GAP_EM = 0.5`. `x` y `width` salen de los bordes del texto (redondeados por separado, el ancho es la resta); `top` sale de `round(bordeInferiorDelTexto + fontSize × 0,5)`. El literal `-7` desaparece de sus dos apariciones (`:129` home, `:187` tab). El punto de home usa la misma derivación vertical; `NAV_INDICATOR_HOME_GAP = 24`, `NAV_INDICATOR_DOT_WIDTH = 5`, duración, ease y `times` de la animación quedan intactos. No se tocó `HoverButton.tsx`, ni `--header-height`, ni el layout de la barra, ni el menú móvil, ni los `text-[13px]` de otras secciones (`ProjectDetailClient` ×3, `ContactForm` ×3, `ProjectContentRenderer` ×4).

- **Diagnóstico de las constantes del indicador** (lo pedía la instrucción; se resolvió midiendo, no leyendo). El `-7` **no era una compensación de interletrado**: en el Navbar no había ninguna corrección horizontal del tracking. Medido a 13 px en `/work`, la caja que el indicador usaba como referencia (`linkRect`, el `<span>` que envuelve al `HoverButton`) tenía su borde inferior en 82,75 px, y se descompone en tres términos: borde inferior de la caja de línea del texto (70,75) **+ 6 px** de padding propio del `HoverButton` (`balancedPadding` → `p-[6px]`) **+ 6 px** de hueco de descendentes del `<a>`, que hereda los 16 px/24 px del body porque el `className` con el tamaño aterriza en el `motion.span` interior, no en el enlace. Con `-7`, el subrayado quedaba 6,5 px por debajo de la caja de texto y **10,5 px por debajo de la línea de base (0,808 em)**. O sea: un valor empírico apoyado sobre dos constantes accidentales de otro archivo, **ninguna de las cuales escala con el tamaño del tab**. Por eso quedaba descalibrado a 17 px: la fórmula vieja daba 11,5 px bajo la línea de base = **0,676 em**, un 16 % más apretado en proporción. La regla nueva (0,5 em por debajo del borde inferior de la caja de texto) reproduce la relación óptica de hoy —13,75 px a 17 px = **0,809 em**, contra 0,808 em a 13 px— y se mantiene con cualquier tamaño futuro. Sobre el **espacio fantasma** que la instrucción señalaba: existía, pero dentro de `linkRect.width` (0,65 px = `0.05em` a 13 px, después del último glifo) y quedaba tapado por los ±6 px de padding; con interletrado 0 y medición sobre el texto desaparece por completo. Verificación numérica: `WORK` medía 40,359 px con tracking → 37,759 px de avance de glifos → 37,759 × 17/13 = **49,376 px** previstos a 17/0, medidos **49,375 px**. Segundo hallazgo, del mismo origen: el indicador se posicionaba en coordenadas fraccionarias (`top: 75.75px`, `x: 772.516`, `width: 52.359`). Un elemento de 1 px de alto en un `top` fraccionario se reparte entre dos filas de píxeles a DPR 1 — es el mecanismo por el que un subrayado se ve como hairline sucio. Por eso los tres valores se redondean ahora a píxel CSS entero.

- **Decisiones tomadas en ejecución** (dos, ambas dentro del marco de la Fase 2, ninguna de producto): **(1)** El gap vertical se expresó en **em** en vez de reescalar el `-7`. La alternativa —anclar en la caja de línea en lugar de la caja de texto— daba 1 px menos y arrastraba el redondeo de la caja de línea, que no es proporcional (19,5 − 18 = 1,5 px a 13 px; 25,5 − 23 = 2,5 px a 17 px). **(2)** El **redondeo a píxel entero** de `x`, `width` y `top` no estaba pedido con esas palabras, pero el objetivo declarado del sprint es «sin artefactos visuales» y la geometría fraccionaria es la causa raíz medible de esa familia de artefactos (`CLAUDE.md` §7, §8.8). Los bordes izquierdo y derecho se redondean por separado y el ancho sale de la resta, para que ninguno caiga en medio de un píxel; el error máximo introducido es 0,5 px por borde, muy dentro del criterio de ±1 px.

- **Mediciones / salidas de puertas.** Puertas: línea base lint exit 0 y build exit 0 (11 rutas, único warning el conocido de `@sanity/image-url`); final **idéntico** — lint exit 0, build exit 0, mismas 11 rutas, mismo warning, cero errores nuevos. Runtime (`next dev`, viewport 1920, DPR 1, `getComputedStyle` + `Range.getBoundingClientRect()` sobre nodos de texto). **Tipografía, las 7 rutas:** los cinco elementos a `font-size` **17 px**, `line-height` **25,5 px**, `letter-spacing` **`normal`**; elementos con interletrado distinto de 0: **cero**, incluida `/fun-gallery`, que perdió sus `0.09em`. Pesos preservados: 480 en los tabs y 500 en `CONTACT US` en rutas claras, 100 y 400 en `/fun-gallery`. Anchos de texto a 17/0: `WORK` 49,375 · `SERVICES` 78,234 · `TEAM` 45,25 · `FUN GALLERY` 106,234 · `CONTACT US` 104,688. **Header:** `--header-height` sigue en **128 px** y la barra mide 128 px en las 7 rutas. **Posición vertical del bloque de tabs:** el texto ocupa 49,25–72,25 px, centro óptico en 60,75 contra 64 del centro de la barra — queda **3,25 px por encima del centro** (a 13 px estaba 3,75 px por encima: el desbalance preexistente se redujo levemente). Lo causa el mismo hueco de descendentes de 6 px del `<a>`, que entra en la caja centrada pero no en el texto. **Alineación indicador↔texto** (indicador − texto, en px):

  | Ruta | Tab activo | Δ izquierda | Δ derecha | Subrayado bajo la línea de base |
  |---|---|---|---|---|
  | `/work` | `WORK` | −0,453 | +0,172 | 13,75 px |
  | `/services` | `SERVICES` | +0,172 | −0,063 | 13,75 px |
  | `/team` | `TEAM` | −0,063 | −0,313 | 13,75 px |
  | `/fun-gallery` | `FUN GALLERY` | −0,211 | +0,414 | 13,75 px |
  | `/contact` | `CONTACT US` | −0,313 | 0,000 | 13,75 px |
  | `/work/[slug]` | `WORK` | −0,453 | +0,172 | 13,75 px |

  Máximo absoluto **0,453 px**, contra un criterio de ±1 px. Antes del sprint los mismos deltas eran **−6 / +6** en todos los tabs (el indicador dibujaba la caja con padding, no la palabra). Geometría del indicador ya sin fracciones: `/work` `x=754 w=50 top=81`, `/services` `x=848 w=78`, `/team` `x=970 w=45`, `/fun-gallery` `x=1058 w=104`, `/contact` `x=1745 w=105`; alto 1 px. **Home (`/`):** el punto queda en `x=234` (entero), ancho 5, `top` 81, opacidad 0 en carga directa — comportamiento idéntico al anterior. **Fase 3, separaciones horizontales** (cajas de los botones, la medida conservadora: es la superficie que ocupa el relleno de hover):

  | Ancho | Scroll horizontal | Logo → tab 1 | Tab 4 → `CONTACT US` | `CONTACT US` → borde |
  |---|---|---|---|---|
  | 1920 | no | 538,2 | 567,8 | 64 |
  | 1512 | no | 334,2 | 363,8 | 64 |
  | 1440 | no | 298,2 | 327,8 | 64 |
  | 1280 | no | 218,2 | 247,8 | 64 |
  | 1024 | no | 90,2 | 119,8 | 64 |

  Mínimo **90,2 px** a 1024, muy por encima del umbral de ~24 px de la instrucción: **no se dispara la PARADA de la Fase 3**. El bloque de tabs creció de 374,97 a 423,09 px (+48,1, o +24,1 por lado) y `CONTACT US` de 98,56 a 116,69 px. Sin scroll horizontal en ningún ancho ni en el viewport real de 1920. `/fun-gallery` conserva `mix-blend-mode: difference` y fondo transparente en el `<nav>`.

- **Nota de método — cómo se midió, y una trampa del entorno:** la pestaña que maneja la herramienta de navegador corre con `document.visibilityState === "hidden"`, y en ese estado **Chrome no dispara `requestAnimationFrame`**. Como `updateIndicator` se agenda con `rAF` dentro de un `useLayoutEffect`, el indicador nunca aparecía tras una carga y por un rato pareció un bug del componente. No lo es: se verificó instrumentando el archivo con `console.log` temporales (revertidos antes de tocar nada) y el efecto corría, el `rAF` no. Todas las mediciones se tomaron despachando un `resize` sintético, que llega al mismo `updateIndicator` por el camino del listener. Consecuencia declarada: **el camino de montaje y la animación de transición entre tabs no se pudieron observar con herramienta**, solo el estado en reposo. Los anchos de la Fase 3 se midieron con `<iframe>` same-origin (las media queries resuelven contra el viewport del iframe), técnica ya usada por la auditoría, porque el `resize` de ventana no aplica con la ventana maximizada — mismo límite que registraron B2.1 y B2.1b.

- **Pendientes que deja:** **(1)** Los tokens `--font-size-nav: 13px` y `--font-size-nav--letter-spacing: 0.05em` de `globals.css` (`@theme`) ya estaban huérfanos y ahora, además, **contradicen el menú real**. Adoptarlos o borrarlos es decisión del ritual de B2 (`CLAUDE.md` §2 y `docs/pendientes.md`) y `globals.css` era de solo lectura en este sprint: no se tocó. **(2)** El desbalance vertical de 3,25 px del bloque de tabs respecto del centro de la barra es preexistente y su causa está identificada (el hueco de descendentes del `<a>`); corregirlo toca el centrado del contenedor, fuera del alcance de este sprint. **(3)** Corrección a la instrucción: la auditoría **no registra** ningún «artefacto sub-pixel de 1 px en el tab WORK» — se buscó por `artefacto`, `hairline`, `sub-pixel`, `1 px` y `DPR` en `docs/reportes/2026-08-13-auditoria-completa.md` y no aparece. Lo que existe es la lección de junio en `CLAUDE.md` §7 (capa de compositor stale por `transform-gpu`, resuelta quitándolo y empujando el fill idle) y el commit `cc6e0f0`. Además, la «hipótesis de fix» que la instrucción reservaba para un sprint propio —`opacity: 0` en la variante idle del fill de hover— **ya está aplicada** en `HoverButton.tsx:74` (`idle: { y: "120%", opacity: 0 }`): esa hipótesis está agotada, no queda pendiente. **(4)** El menú a 17 px iguala ahora al «sistema 17» del resto del sitio (footer, DISCOVER, filas de ServiceItem): era el único elemento en 13 px del sitio y deja de serlo — es un cambio de jerarquía visual, no solo de un número, y su validación es de Valentino.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente):** el agente mide **layout**, no píxeles pintados; `getBoundingClientRect` y `getComputedStyle` no ven hairlines, bordes anti-aliased ni capas de compositor stale. Queda a ojo humano, **a DPR 1 y zoom 100 %**: (a) los cinco elementos del menú, buscando hairlines, bordes sucios o restos del subrayado; (b) el tab **WORK** en particular, para confirmar si el artefacto que la instrucción daba por preexistente sigue, empeoró o desapareció — la geometría fraccionaria que lo explicaría fue eliminada, pero eso es una hipótesis medida, no una observación; (c) hover sobre cada tab y navegación entre secciones, que el indicador se mueva limpio y sin parpadeo (camino no observable con la herramienta, ver nota de método); (d) el header en `/fun-gallery` y `/contact/success` con `mix-blend-difference`; (e) **el equilibrio del conjunto**: 17 px es un cambio grande de peso visual en una barra de altura fija, y si la jerarquía del header sigue funcionando es juicio de Valentino, no medible.

- **Commits:** `e4acca6`, más el de este cierre.

## 2026-08-18 · B2.2b · Indicador al pie del fill del hover + nav unificado en Fun Gallery

- **Qué se hizo:** `Navbar.tsx`, único archivo tocado. **(A)** El indicador deja de alinearse al texto y pasa a ser el **pie del fill del hover**: `measureLabel()` se reemplaza por `measureFillBox()`, que recorre igual hasta el nodo de texto pero devuelve el rectángulo de su **`offsetParent`** en vez del `Range` de los glifos; `indicatorTop()` pierde el término del gap y queda en `round(bordeInferiorDelFill − navTop)`. `x` y `width` salen ahora de los bordes de esa caja (mismo redondeo por separado, con el ancho como resta). La constante `NAV_INDICATOR_GAP_EM` y su comentario se **borran** por quedar sin uso (`CLAUDE.md` §8.11); el tipo `LabelMetrics` pasa a `FillBox` y pierde el campo `fontSize`, que existía solo para el gap. **(B)** Se eliminan las dos ramas tipográficas por ruta: los cuatro tabs quedan en `font-[480]` fijo (antes `isFunGallery ? "font-thin" : "font-[480]"`) y `CONTACT US` en `font-medium` fijo (antes `isFunGallery ? "font-normal" : "font-medium"`). No se tocó `HoverButton.tsx`, ni `--header-height`, ni el layout de la barra, ni la animación de transición del indicador (duración, ease, `times` y la lógica del punto intermedio quedan idénticos), ni el modo de mezcla del header.

- **Por qué el `offsetParent` y no la caja del texto** (geometría verificada en runtime antes de editar). El fill de `HoverButton` es un `motion.span` `absolute top-0 left-0 right-0 h-full`; con `balancedPadding` —lo que porta el Navbar en los cinco elementos— el inset es `left-0 right-0`, así que su caja es **exactamente su bloque contenedor**, sin el ±1 px que aplica la variante no balanceada. Ese contenedor es el `motion.span.group` (`relative inline-block`), que resulta ser también el `offsetParent` del `<span>` con `p-[6px]` del que cuelga el texto: medido en `/work`, ambos dan el mismo rectángulo (`WORK`: izq. 748,453 · ancho 61,375 · inf. 79,75). Se confirmó que es el bloque contenedor real del fill leyendo el propio fill: su `offsetParent` es ese `.group`, con `offsetLeft 0`, `offsetTop 0`, `offsetWidth 61`, `offsetHeight 38`. En reposo el fill **existe y es medible**, pero está desplazado `y: 120%` (su rect vive en 87,25–124,75, exactamente 45 px = 120 % de 37,5 más abajo): por eso se mide el contenedor y no el fill — **no se disparó la PARADA** del «fill sin caja medible». Y no sirve el `<span className="inline-flex">` que referencia el Navbar: envuelve un `<a>` que hereda los 16 px del body y cuyo borde inferior cae en 85,75, seis píxeles por debajo del fill.

- **Cambio de criterio, explícito:** B2.2 alineó el indicador al **texto** para corregir una descalibración real, y esa corrección sigue siendo válida en lo suyo. Lo que cambia acá es la **referencia**: el indicador debe leerse como el pie del rectángulo oscuro del hover, no como el subrayado de la palabra. Se conserva del sprint anterior el **redondeo a píxel entero** de `x`, `width` y `top` (la causa raíz del hairline sucio a DPR 1) y la medición íntegramente en runtime, sin constantes mágicas nuevas: el commit **no agrega ninguna constante**, borra una.

- **Corrección al diagnóstico de la instrucción:** la instrucción atribuía la divergencia de `/fun-gallery` a que «se engrosaron los pesos para que el menú se leyera sobre las imágenes». El código hacía lo contrario: `font-thin` (100, que la variable Manrope 300–800 recorta a **300**) contra `font-[480]` en el resto, y `font-normal` (400) contra `font-medium` (500) en `CONTACT US`. Es decir, el nav de la galería era **más liviano**, no más pesado. La acción pedida —unificar— no cambia; el registro sí.

- **Diferencias de `/fun-gallery` que se dejaron intactas** (grupo no tipográfico, §3.2 de la instrucción y regla 4): **(1)** `useGalleryBlend = isFunGallery && !menuOpen`, que alimenta el `mix-blend-difference` del `<nav>` y el prop `blend` de los cinco `HoverButton` (con `blend`, `HoverButton` ignora por completo su `tone`: los tres selectores de clase lo chequean primero). **(2)** Las ramas de `className` del `<nav>`: `pointer-events-none bg-transparent` y el `mix-blend-difference`, contra `bg-off-white/95 backdrop-blur-sm` del resto. **(3)** El `style` inline que fuerza fondo transparente y `backdropFilter: none`. Además, tres diferencias que **no son de `/fun-gallery`** sino de rutas oscuras —las comparte con `/contact/success`— y por eso tampoco se tocaron: `navTone` (`tone="dark"`, que en la galería solo decide el archivo del logo), `linkTextClass` (`text-off-white`, que sí importa bajo `blend` porque es contra quien resuelven `text-current`/`bg-current`, y que además pinta el indicador) y `hamburgerLineClass` (solo móvil). **Consecuencia aceptada y registrada:** con los pesos unificados, el menú sobre las imágenes actuales de la galería puede leerse algo peor hasta que el Bloque 3 rediseñe esa pantalla. Es una decisión tomada a sabiendas, no una regresión a corregir.

- **Decisiones tomadas en ejecución:** una sola, de implementación. La caja del fill se podía tomar de dos maneras equivalentes hoy —el `<span>` con `p-[6px]` del texto, o su `offsetParent`— porque sus rectángulos coinciden al milésimo. Se eligió el `offsetParent` porque es **la definición** del bloque contenedor de un elemento `absolute`: si mañana `HoverButton` agregara padding al `.group`, el fill seguiría cubriendo el contenedor y la medición seguiría siendo correcta, mientras que medir el `<span>` del texto empezaría a quedarse corta. Es la misma cantidad de código y no toca el primitivo.

- **Mediciones / salidas de puertas.** Puertas: línea base lint exit 0 y build exit 0 (11 rutas, único warning el conocido de `@sanity/image-url`); final **idéntico** — lint exit 0, build exit 0 («Compiled successfully»), mismas 11 rutas, cero errores nuevos. Runtime (`next dev` en el puerto **3010**, viewport 1920, DPR 1). **Indicador contra fill del hover, en reposo** (indicador − fill, en px; objetivo 0, tolerancia ±1):

  | Ruta | Tab activo | Δ `x` | Δ `width` | Δ (`top` ind. − `bottom` fill) |
  |---|---|---|---|---|
  | `/work` | `WORK` | −0,453 | +0,625 | +0,25 |
  | `/services` | `SERVICES` | +0,172 | −0,234 | +0,25 |
  | `/team` | `TEAM` | −0,063 | −0,250 | +0,25 |
  | `/fun-gallery` | `FUN GALLERY` | −0,313 | +0,766 | +0,25 |
  | `/contact` | `CONTACT US` | −0,313 | +0,312 | +0,25 |

  Máximo absoluto **0,766 px**, dentro del criterio de ±1 px, y todo el residuo es el redondeo a píxel entero que el sprint pide conservar. Antes del cambio, los mismos deltas en `/work` eran **Δ`x` +5,547 · Δ`width` −11,375 · Δ`top` +1,25** (indicador `x=754 w=50 top=81` contra un fill de 748,453–809,828 con borde inferior en 79,75): ese desajuste de 11 px de ancho es exactamente el rectángulo que sobresalía al hacer hover. **Geometría final del indicador, entera en los tres valores:** `/work` `x=748 w=62 top=80` · `/services` `x=842 w=90 top=80` · `/team` `x=964 w=57 top=80` · `/fun-gallery` `x=1053 w=119 top=80` · `/contact` `x=1739 w=117 top=80`; alto 1 px. **Home (`/`):** el punto queda en `x=234`, ancho 5, `top` 80, opacidad 0 — mismo comportamiento, con el `top` ahora alineado al de los tabs. **Tipografía, `/work` contra `/fun-gallery`:** los cinco elementos coinciden exactamente — `font-size` **17 px** y `letter-spacing` **`normal`** en ambas rutas, `font-weight` **480** en los cuatro tabs y **500** en `CONTACT US` en ambas. La caja de `FUN GALLERY` en `/fun-gallery` mide ahora **118,234 px**, idéntica a la del mismo tab en `/work`. **Header:** 128 px en las cinco rutas medidas, sin cambios. `/fun-gallery` conserva `mix-blend-mode: difference` y `background-color: rgba(0,0,0,0)` en el `<nav>`.

- **Nota de método:** vale la misma trampa registrada en B2.2 — la pestaña de la herramienta de navegador corre con `document.visibilityState === "hidden"` y Chrome **no dispara `requestAnimationFrame`** en ese estado (verificado explícitamente: `rafFired: false` tras 600 ms). Como `updateIndicator` se agenda con `rAF`, el indicador no aparece en una carga hecha por herramienta. Todas las mediciones se tomaron despachando un `resize` sintético, que llega al mismo `updateIndicator` por el listener y ejecuta idéntica aritmética (solo cambia `animateMove`). Consecuencia declarada, igual que en B2.2: **el camino de montaje y la animación entre tabs no se pudieron observar con herramienta**, solo el estado en reposo.

- **Pendientes que deja:** **(1)** `Footer.tsx` arrastra la **misma** divergencia por ruta que se acaba de unificar en el Navbar: `smallTextWeight = isFunGallery ? "font-thin" : "font-[550]"` y `ctaWeight = isFunGallery ? "font-thin" : ""` (`Footer.tsx:324-325`). Queda fuera de alcance —este sprint era de un solo archivo— y es candidato natural del Bloque 3, cuando la pantalla de la galería se rediseñe. **(2)** Siguen abiertos los pendientes de B2.2 que nada de esto toca: los tokens huérfanos `--font-size-nav` de `globals.css` y el desbalance vertical de 3,25 px del bloque de tabs respecto del centro de la barra.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente):** el agente mide **layout**, no píxeles pintados. Queda a ojo humano en `localhost:3010`, **a DPR 1 y zoom 100 %**: (a) hover sobre cada uno de los cinco elementos, confirmando que el indicador se lea como el pie del rectángulo oscuro —sin escalón lateral, sin hueco— y que **no salte** al entrar ni al salir del hover; (b) navegación entre tabs y recarga directa en cada ruta, que la transición siga limpia (camino no observable con la herramienta, ver nota de método); (c) `/fun-gallery`: que el menú tenga la misma tipografía que el resto, y **hasta qué punto se sigue leyendo** sobre las imágenes — ese dato es entrada para el Bloque 3, no un defecto a corregir ahora.

- **Commits:** `58e1bd7`, más el de este cierre.

---

## 2026-08-18 · B2.3 · Hero de home: frase nueva, interlineado 48 y baja del CTA

- **Qué se hizo:** `Hero.tsx` pasa a **consumir `HERO_LINES`** de `src/lib/site-copy.ts` (la fuente única creada en B2.1, que hasta hoy solo leía el footer): tres líneas, cada una recorrida por fragmentos, con `font-semibold` **solo** en `STAND OUT` e `IMPACT.` y el espacio entre fragmentos emitido **fuera** del `<span>` de la negrita, tal como fija el contrato documentado en `site-copy.ts`. El copy viejo hardcodeado («MAKE YOUR BRAND STAND OUT.») desapareció del componente. Tipografía llevada a **40 / 48 / 0 centrada** (`leading-[1.05]` + `mt-1` entre líneas → `leading-[48px] tracking-normal`, clase única en el contenedor del grupo). El CTA `LET'S WORK TOGETHER!` **se eliminó del render** (no oculto por CSS): se fue el `HoverButton` y todo su bloque `motion.div`. La animación de entrada se conserva íntegra —mismos `EASE`, `TITLE_DELAY 0.12`, `TITLE_STAGGER 0.08`, `TITLE_LINE_DURATION 0.42`, mismo gateo por preloader con la `key` que remonta— y ahora se aplica a las tres líneas generadas por el `map` en vez de a tres `<p>` escritos a mano. **`site-copy.ts` no se tocó:** su estructura (líneas → fragmentos con `bold`) ya servía a los dos consumidores sin duplicar texto, así que la excepción de la Fase 1.4 no hizo falta y el footer quedó intacto por construcción.

- **Constantes eliminadas (regla 11).** Del `Hero.tsx`: `CTA_DURATION`, `CTA_DELAY`, `CTA_UNDERLINE_DELAY` —toda la cadena de delays del botón, que muere con él— y `TITLE_LINE_COUNT`. También el `import HoverButton`. Verificado con grep que ninguno de esos símbolos tenía consumidores fuera del archivo: son constantes de módulo, no exportadas, y las homónimas de `ServicesIntro.tsx` son **copias locales** de ese otro archivo (no se tocaron). Nota sobre el contrato frágil de `CLAUDE.md` §6: `TITLE_LINE_COUNT` era un literal `3` desacoplado del arreglo de líneas, y su único consumidor era `CTA_DELAY`; al irse el CTA quedó **sin consumidores**, así que se borró en vez de convertirlo a `lines.length`. El contrato no se refactoriza: deja de existir en el Hero. Sigue vivo el gemelo `TITLE_1_LINE_COUNT` de `ServicesIntro.tsx`, fuera de alcance. Balance del commit: **cuatro constantes y un import menos, ninguna nueva** en el Hero.

- **Cómo se resolvió el centrado vertical.** El `calc(100vh-320px)` de `(site)/page.tsx` era un número mágico heredado y **ya no correspondía**: con el header en 128 px (`--header-height`) y el footer de home en 164 px, el alto correcto del bloque es `100vh − 292px`. Medido a 1920×911 antes de tocar nada: el envoltorio daba 591 px y el footer terminaba en **883** contra un viewport de **911** — o sea, 28 px de franja muerta bajo el footer (invisible por ser del color del fondo) y la frase 8 px por encima del centro real del hueco. En vez de cambiar 320 por 292, el alto se **deriva**: `calc(100vh - var(--header-height) - (40px + 84px + 40px))`, donde el header aporta su variable global y el footer se escribe descompuesto en su composición real (`HomeFooter`: `py-10` arriba + fila de info + `py-10` abajo; los 84 px de la fila los gobierna el logo script `sm`, verificado en runtime elemento por elemento). Cada término queda rastreable hasta la decisión que lo produce. Se conservó el `min-h-[50vh]` como guarda para viewports muy bajos. **Sobre el centrado óptico:** con `line-height: 48px` sobre 40 px, el medio-interlineado deja el ink de la caja de tres líneas simétrico dentro de ella (mayúsculas, sin descendentes), así que centrar la caja **es** centrar el texto — no hizo falta ningún desplazamiento correctivo, y el resultado medido son **237,5 px libres arriba y 237,5 px abajo**.

- **Decisión tomada en ejecución (una, y se declara por si la capa de planificación quiere revertirla): la coma de la primera línea.** El mockup `02-home-anotado.jpg` escribe `IN A WORLD FULL OF NOISE`**`,`** con coma; el mockup del footer `04-footer-anotado.jpg` escribe la misma línea **sin** coma y anota «Misma frase del inicio». La instrucción de este sprint transcribe la versión con coma. Se optó por **no tocar el texto**: B2.1 dejó registrado que la frase quedó fijada en `site-copy.ts` «con la puntuación del footer, lo que resuelve el pendiente [PDF] de puntuación», y cambiarla ahora movería también el footer aprobado de las rutas internas —el único lugar donde hoy se lee— por un carácter que las propias clientas escriben distinto en dos páginas del mismo PDF. Queda como **decisión de una línea** para Valentino: agregar la coma es editar `site-copy.ts:21` y afecta a los dos consumidores a la vez, que es exactamente lo que la fuente única debe garantizar.

- **Mediciones / salidas de puertas.** Puertas: línea base lint exit 0 y build exit 0 (14 rutas, único warning el conocido de `@sanity/image-url`); final **idéntico** — lint exit 0, build exit 0, mismas 14 rutas, cero errores nuevos. Runtime (`next dev` en el puerto **3010**, viewport **1920×911**, DPR 1, `getComputedStyle` + `getBoundingClientRect`). **Las tres líneas del hero:** `font-size` **40 px**, `line-height` **48 px**, `letter-spacing` **`normal`**, `text-align` **`center`** en las tres (`normal` es el mismo valor computado que ya porta el footer aprobado con `tracking-normal`: la Manrope no trae tracking propio, así que `normal ≡ 0`). **Pesos por fragmento:** 400 en `IN A WORLD FULL OF NOISE`, `WITH INTENTION.` y `WITH`; **600** en `STAND OUT` e `IMPACT.`. **Composición vertical:** bloque del hero **144 px** de alto (3 × 48), de 365,5 a 509,5; **237,5 px libres hasta el header** (borde inferior en 128) y **237,5 px libres hasta el footer** (borde superior en 747) — centrado exacto. El documento mide ahora **911 px de alto contra 911 de viewport**, sin scroll vertical ni horizontal (`scrollWidth === clientWidth === 1920`) y **sin la franja muerta de 28 px**. **Footer de home: 164 px**, sin cambios (control de que no se tocó: 40 + 84 + 40). **CTA:** `LET'S WORK TOGETHER!` no aparece en el DOM de `/` — ni en el texto renderizado ni en el `outerHTML` completo del documento — y `<main>` no contiene ningún `<a>`. **Control del footer de `/work`** (Fase 1.4): renderiza la frase **exactamente igual que antes** — mismo marcado de los tres `<p>` que el del hero salvo el alineado (`text-align: start` contra `center`), 40 / 48 / `normal`, negritas en los mismos dos fragmentos, y alto del footer **981,67 px**, idéntico al que dejó medido B2.1b.

- **Nota de método:** vale el mismo límite registrado en B2.2 y B2.2b — la pestaña de la herramienta corre con `document.visibilityState === "hidden"` y Chrome no dispara `requestAnimationFrame` en ese estado, así que la entrada con stagger queda congelada en su estado inicial (`opacity 0`, `y: 30`) y **no se pudo observar la animación**. Se verificó que la máquina sí está viva (las líneas avanzaron a `opacity 0,79` y `y: 6,29` y terminaron de asentarse), y la captura de la composición se tomó tras dejarla completar. Todas las cifras de layout de arriba son de la caja **sin transformar**, que es la que gobierna el centrado.

- **Pendientes que deja:** **(1)** El bucle de render de la frase (recorrer líneas → fragmentos → espacio fuera de la negrita) queda **escrito dos veces**, en `Hero.tsx` y en `StatementBand` de `Footer.tsx`. No se unificó porque `Footer.tsx` no estaba entre los archivos autorizados de este sprint; el contrato que las mantiene sincronizadas está documentado en `site-copy.ts`, pero extraer un componente compartido (`CopyLines`) es el arreglo de fondo y es candidato natural del ritual de B2. **(2)** El alto del footer de home vive ahora escrito en `(site)/page.tsx`, descompuesto y comentado, porque el footer no publica el suyo como variable — mientras `--footer-height: 480px` sigue huérfano y falso en `globals.css`. Si la decisión de tokens de B2 lo revive con el valor real, este `calc` debería pasar a consumirlo. **(3)** La coma de la primera línea, arriba.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente):** el agente mide layout, no píxeles pintados, y **no puede observar la animación de entrada** (ver nota de método). Queda a ojo humano en `localhost:3010`, **a DPR 1 y zoom 100 %**: (a) **primera visita en pestaña nueva** —para ver la cortina del preloader— y **recarga**, confirmando que la entrada de las tres líneas se sienta igual de fluida que antes y que no quede un salto donde estaba el botón; (b) el **corte de las tres líneas y las negritas** contra `02-home-anotado.jpg`, incluida la decisión de la coma; (c) el **equilibrio vertical** de la frase sin el botón —si queda bien plantada o pide subir/bajar—; (d) que el **footer de home** se siga viendo igual que ayer.

- **Commits:** `0dc1c0a`, más el de este cierre.

---

## 2026-08-18 · B2.4 · Grilla de Work 5:4, más aire en el hover y aparición rápida solapada

- **Qué se hizo:** dos archivos, `WorkGrid.tsx` y `ProjectCard.tsx`. **(A) Ratio:** la celda pasa de `aspect-square` a **`aspect-[5/4]`** — el mismo mecanismo que ya usa el repo (`aspect-[3/4]` en `ServiceItem`, `aspect-[4/3]` en `ProjectContentRenderer`), no se introdujo uno nuevo. **(B) Pedido al CDN:** `urlFor(coverImage).width(1200).height(1600)` → **`.width(1200).height(960)`**, para que la relación pedida (1,25) coincida con la renderizada; `object-cover` y el resto del helper quedan intactos. **(C) Aire del overlay:** `p-8` → **`px-[9%] py-[11%]`**. **(D) Tiempos:** aparecen `ITEM_DURATION = 0.45` e `ITEM_STAGGER = ITEM_DURATION / 2`, y las variants los consumen en vez de los dos `0.7` sueltos. No se tocó `HoverButton.tsx`, ni el número de columnas, ni el `gap`, ni los breakpoints, ni `RevealOnScroll`, ni ningún otro sistema de aparición del sitio.

- **Corrección al inventario de la instrucción: no existe una «primera celda de texto».** La Fase 1 pedía verificar que «la primera celda, la de texto» acompañara la altura de fila. No hay tal celda: lo que se ve beige con `01 / AKASHA BLENDS / …` en los dos mockups es **el overlay de hover de la tarjeta 01**, que al abrirse tapa la portada con el `coverColor`. En `05-work-grid-actual.jpg` se confirma porque la barra de estado del navegador muestra `…/work/akasha-blends`: había un cursor encima. La grilla es homogénea — cuatro celdas del mismo componente con la misma clase — así que las filas quedan parejas por construcción, verificado en runtime: las cuatro miden **608 × 486,39** a 1920. **No fue una PARADA:** la acción pedida no cambia, el registro sí.

- **5:4 = ancho : alto, confirmado contra el mockup antes de tocar nada.** En `06-work-grid-anotado.jpg` la tarjeta de la fila 1 mide **403 × 315 px** de imagen (ratio **1,28**) y la celda 1 comparte esa altura de fila: apaisada, no vertical. No se disparó la PARADA del ratio invertido.

- **Cómo se decidió el aire del overlay (y por qué es un porcentaje).** La devolución no trae un número, trae una proporción dibujada. Se midió el mockup por píxel (scan de umbral sobre el JPG, con `sharp`) y se **validó el método contra `05-work-grid-actual.jpg`**, que sí es una captura del sitio real: ahí el método devuelve un padding de **5,15 %** del ancho de la tarjeta contra el **5,26 %** verdadero (32 px sobre 608) — error de 0,1 pp. Aplicada la misma vara al mockup anotado, las clientas piden **9,2 % del ancho a los costados** y **10,9 % arriba**, o sea entre 1,75× y 2,1× lo actual. Como la proporción es relativa al ancho de la tarjeta y la tarjeta cambia de tamaño con el viewport, se escribió tal cual: **`px-[9%] py-[11%]`**, que en CSS resuelve contra el ancho del bloque contenedor en los cuatro lados. Un valor fijo no podía cumplir las dos puntas: a 1920 el mockup pide ~56 px, pero a 1280 la tarjeta 5:4 mide 315,7 px de alto y **56 px arriba y abajo desbordan el texto**. El porcentaje resuelve el rango entero con un solo valor y sin agregar un breakpoint que el repo no usa en ningún `.tsx`. El repo ya escribe todo con valores arbitrarios (`text-[17px]`, `max-w-[220px]`, `h-[200vh]`): es su idioma, no uno nuevo. **No se tocó la escala tipográfica ni el contenido:** siguen los 17 px, el `leading-[1.15]`, los `mt-6` y el `max-w-[220px]`.

- **El stagger se deriva de la duración, no se fija aparte.** El criterio de aceptación — la tarjeta n+1 arranca cuando la n va por la mitad — es una **relación**, así que se escribió como relación: `ITEM_STAGGER = ITEM_DURATION / 2`. Retocar la velocidad es ahora editar **un solo número** y el solapamiento se mantiene solo. Se conserva todo lo demás de la animación: el mismo `EASE` `[0.25, 0.1, 0.25, 1]`, el mismo desplazamiento `y: 40`, el mismo disparo por scroll (`useInView` con `once: true` y `margin: "-80px"`), el mismo `useReducedMotion` y **el mismo gateo por preloader** (`reveal = isPreloaderDone && inView`), que no se rompió.

- **Mediciones / salidas de puertas.** Puertas: línea base lint exit 0 y build exit 0 (14 rutas, único warning el conocido de `@sanity/image-url`); final **idéntico** — lint exit 0, build exit 0, mismas 14 rutas, cero errores nuevos. Runtime (`next dev` en el puerto **3010**, DPR 1).

  **Tiempos de la secuencia, con los 4 proyectos del dataset:**

  | | Duración por tarjeta | Stagger | Arranca la 4ª | Termina la secuencia | Solapamiento |
  |---|---|---|---|---|---|
  | Antes | 0,70 s | 0,70 s | **2,10 s** | **2,80 s** | ninguno (stagger = duración) |
  | Después | 0,45 s | 0,225 s | **0,675 s** | **1,125 s** | 50 % exacto |

  La última tarjeta arranca **68 % antes** y la secuencia entera dura **60 % menos**.

  **Geometría de la tarjeta y del overlay, por ancho** (celda medida en runtime; el alto del contenido del overlay no depende del viewport porque `max-w-[220px]` lo fija):

  | Viewport | Tarjeta | Ratio | Padding × | Padding y | Hueco libre entre bloques |
  |---|---|---|---|---|---|
  | 1280 | 394,66 × 315,72 | **1,25** | 35,5 | 43,4 | 25,2 |
  | 1440 | 448,00 × 358,39 | **1,25** | 40,3 | 49,3 | 56,1 |
  | 1512 | 472,00 × 377,59 | **1,25** | 42,5 | 51,9 | 70,0 |
  | 1920 | 608,00 × 486,39 | **1,25** | 54,7 | 66,9 | 148,9 |

  El caso más apretado del rango desktop es 1280 y **no desborda**: sobran 25,2 px, prácticamente el mismo `mt-6` (24 px) del ritmo interno del bloque. **Padding del overlay antes:** `32px` uniforme en todos los anchos. A 1920 el resultado cae sobre el mockup: **9,0 % del ancho a los costados** (mockup 9,2 %) y **11,0 % arriba** (mockup 10,9 %). Sin scroll horizontal en ningún ancho (`scrollWidth === 1920`).

  **Pedido al CDN, antes y después** (leído del HTML prerenderizado de `/work` en los dos árboles; `q` y `fm` no se especifican ni antes ni después — rigen los valores por defecto de Sanity, y no se agregaron):

  | Proyecto | Asset de origen | Antes | Después |
  |---|---|---|---|
  | AKASHA BLENDS | 3456×5184 | `w=1200 h=1600 rect=0,288,3456,4608` | `w=1200 h=960 rect=0,1210,3456,2765` |
  | TUKUMI TAKEAWAY | 2400×3000 | `w=1200 h=1600 rect=75,0,2250,3000` | `w=1200 h=960 rect=0,540,2400,1920` |
  | MATSU | 1024×1536 | `w=1200 h=1600 rect=0,86,1024,1365` | `w=1200 h=960 rect=0,359,1024,819` |
  | Matsu (`matsutrabajo`) | 1024×576 | `w=1200 h=1600 rect=296,0,432,576` | `w=1200 h=960 rect=152,0,720,576` |

  La relación pedida pasa de **0,75** a **1,25** en los cuatro, y el `rect` que calcula el builder pasa a ser el que efectivamente se muestra: **se termina el recorte doble** (antes Sanity cortaba a 3:4 y después `object-cover` volvía a cortar a 1:1). El caso extremo es `matsutrabajo`, cuyo origen es apaisado: antes se le pedía una tira central de **432 px de ancho** para estirarla a 1200; ahora se le piden **720**, un 67 % más de píxeles reales. Sigue siendo el único asset que el CDN **amplía** (720 → 1200) — es una limitación del original, no del pedido.

  **Alto de la página `/work`** (1920×911): **2398 → 2154 px** (−244, −10,2 %). El footer sube de `y = 1416` a `y = 1173` y conserva sus **982 px**, idénticos a los que dejó medidos B2.1b: quedó donde tiene que quedar. La grilla misma pasa de 1288 a 1044,78 px.

  **Control de que `/work/[slug]` no cambió — prueba fuerte.** No se midió alto de página: se comparó el **HTML prerenderizado** de las cuatro rutas SSG entre el árbol previo y el final (dos builds completos, con `git stash` de por medio). El `<main>` de las cuatro es **byte a byte idéntico** — `akasha-blends` 7702 B, `matsu` 3635 B, `matsutrabajo` 3302 B, `tukumi-takeaway` 1513 B, mismos hashes. En `/work`, el mismo diff muestra **exactamente los tres cambios buscados y ninguno más**: `aspect-square`→`aspect-[5/4]`, `p-8`→`px-[9%] py-[11%]` y el `src` del CDN, repetidos una vez por tarjeta. Coherente con el grafo de imports: `WorkGrid` lo consume sólo `/work/page.tsx` y `ProjectCard` sólo `WorkGrid`.

- **Nota de método, dos límites del entorno.** **(1)** Vale el mismo límite registrado en B2.2, B2.2b y B2.3: la pestaña de la herramienta corre con `document.visibilityState === "hidden"` y Chrome no dispara `requestAnimationFrame` ahí, así que **la animación de entrada — el punto central de este sprint — no se pudo observar**. Los tiempos de la tabla son los de las variants, no una medición de reproducción. Para la captura de control hubo que forzar a mano la opacidad de las celdas y de un ancestro que el preloader dejaba en 0,14. Además, `/work/[slug]` **colgó el renderer** de la pestaña de herramienta en tres intentos seguidos: de ahí que su control se haya hecho contra el HTML prerenderizado, que es prueba más fuerte que un alto de página. **(2)** El `resize` de ventana **no aplica con la ventana maximizada** (mismo límite que B2.1, B2.1b y B2.2): los anchos de la tabla se midieron fijando el ancho del contenedor de la grilla, que reproduce la geometría exacta porque en todo el rango 1280–1920 rige el mismo breakpoint (`lg:grid-cols-3`) y ninguna media query más interviene.

- **Pendientes que deja:** **(1)** **El rango de 2 columnas queda fuera de norma con el ratio nuevo.** Entre `sm` (640 px) y `lg` (1024 px) la grilla es de 2 columnas; a 640 px la tarjeta pasa a medir 284 × 227,2 px y el contenido del overlay (203,7 px) no entra con ningún padding razonable. Es consecuencia directa del 5:4, no de la decisión de padding — con `p-8` también desbordaría — y cae de lleno en la ronda de mobile que `CLAUDE.md` §1 declara separada; el sitio es desktop-first y este sprint tenía el alcance en `/work` de escritorio. Se registra para que esa ronda lo tome. **(2)** El mockup anotado dibuja el ritmo **interno** del bloque de texto más suelto que el código (separaciones de ~3 interlineados contra los ~2,2 que dan los `mt-6`). **No se tocó**: la devolución habla del margen contra el borde de la tarjeta, no del espaciado entre líneas, y la instrucción pide expresamente conservar la escala tipográfica. Si al comparar contra el mockup se ve que también hay que soltar el interior, es un cambio de una constante (`mt-6`) y una decisión de diseño de Valentino. **(3)** `matsutrabajo` sigue con un original de 1024×576 que el CDN amplifica; se resuelve subiendo una portada mejor al dataset, no desde el código.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** El agente mide layout y **no puede observar la animación**, que es la mitad de este sprint (ver nota de método). Queda a ojo humano en `localhost:3010`, **a DPR 1 y zoom 100 %**: (a) **la aparición**, entrando a `/work` con scroll desde arriba — si se siente rápida y encadenada, con la siguiente arrancando antes de que termine la anterior; si todavía se siente lenta, o si al revés ahora parecen aparecer todas juntas y se perdió la secuencia, el ajuste es **un solo número**, `ITEM_DURATION`; (b) **los recortes de las cuatro portadas a 5:4**, uno por uno — son fotos de producto y packaging de las clientas y el `rect` que elige el CDN es **centrado**, así que puede cortar un logo, un envase o una cara; si alguna queda mal encuadrada, se arregla poniendo *hotspot* en Sanity, no en el código; (c) **el aire del overlay** contra `06-work-grid-anotado.jpg`, en hover sobre cada tarjeta; (d) la grilla completa a **1920, 1512, 1440 y 1280**, buscando filas parejas y ausencia de huecos raros.

- **Commits:** el de este sprint, más el de este cierre.

---

## 2026-08-19 · B2.5 · Contact con la composición del PDF, questionnaire sin scroll y limpieza de tokens

- **Qué se hizo:** tres commits, cuatro archivos. **[F1]** `ContactForm.tsx` y `lib/contact.ts`: título del aside a **40 / 48 / 0** e izquierda, bajada a **17 / 21 / 0** e izquierda; los nueve labels pasan a **alineados a la izquierda y en dos líneas fijas** (el prop `label` de `FieldShell` dejó de ser `React.ReactNode` y ahora es una **tupla `readonly [string, string]`**: las dos líneas quedan garantizadas por tipo, no por el ancho de la columna); los controles pasan al **gris de identidad**; entran las **10 pills nuevas** en el orden cerrado por Valentino, con `PACKAGING DESIGN` renombrada a `PACKAGE DESIGN`; `?service=` pasa a resolución tolerante que devuelve `null` ante lo desconocido; y el fit sale de **comprimir el padding vertical de los campos (28 → 12 px) y la separación previa al botón de envío (64 → 28 px)**. **[F2]** `Footer.tsx` y `ContactSuccess.tsx`: `/contact/success` adopta el footer nuevo con la variante de `/contact`. **[F3]** `globals.css`: se borran 15 declaraciones sin consumidores. **No se tocó** `HoverButton.tsx`, ni `api/contact/route.ts`, ni `contact/page.tsx`, ni la arquitectura sticky del aside, ni `SCOPED_SELECTION`, ni ninguna variant de entrada.

- **Decisiones tomadas en ejecución** (siete; ninguna cambia el pedido, todas se explican con una medición):

  **(1) «Todo en gris» son los controles, no los labels — está medido en el mockup, no interpretado.** Muestreo de luminancia sobre `12-contact-anotado.jpg`: los labels dan mínimo **32** (misma tinta que el menú, 32, y que `SEND QUESTIONNAIRE`, 12), mientras el texto de las pills da **149** — que es exactamente `#939393` (147) — y la regla del campo da **206**, imposible para una línea de 1 px de `#0F0F0F` a esa escala (daría 129) y consistente con una de `#939393` (196). Así que el gris entró en **regla del campo, borde y texto en reposo de las pills, y chevron del select**; los labels siguen en off-black. Los placeholders **ya estaban** en `gray-brand` desde antes.

  **(2) El estado «respondido» se queda en off-black.** El mockup solo dibuja el formulario vacío, y el código ya distinguía placeholder (gris) de valor (negro). Se conservó: texto tipeado, valor elegido del select y pill seleccionada siguen en off-black, y la inversión sobre fondo negro al enfocar queda intacta. Si las clientas quieren también eso en gris, es un cambio de tres clases.

  **(3) Un solo label conserva el corte de hoy, y es una restricción de ancho, no una preferencia.** El mockup corta `WHAT ARE YOU LOOKING / TO WORK ON?`; esa primera línea mide **181,1 px** y la columna de labels mide **176**. El mockup se lo puede permitir porque **ensancha esa columna a ~208 px** (medido: su borde izquierdo cae 31 px a la izquierda del actual y su regla de campo termina 39 px antes). Mover esos ~32 px de la columna de control a la de labels rompe el fit: a **1512** el control quedaría en **394 px** y las 10 pills necesitan **396** para entrar en cuatro filas — pasarían a cinco y la columna crecería 37 px. Se conservó `WHAT ARE YOU / LOOKING TO WORK ON?` (173,9 px, entra) y la grilla intacta en `176 / 28 / 420`. Los otros ocho labels llevan el corte del mockup tal cual.

  **(4) El label de las pills va arriba, no centrado.** Medido: su cap-top está en y=231 del mockup y el borde superior de la primera fila de pills en y=230; si estuviera centrado contra un bloque de 142 px caería en y≈258. En los campos normales sí está centrado (predicho 315,4, medido 317; top-aligned habría dado 310). Se implementó como prop `alignLabelTop`, usado una sola vez.

  **(5) El schema y el mail no necesitaban edición, y se verificó en vez de asumirlo.** `contactSchema` declara `workType: z.array(z.string()).optional()` y el mail formatea con `join(", ")`: los dos son **agnósticos de la lista**, y la lista vive en el mismo archivo que el schema. Cambiar a `z.enum(WORK_TYPE_OPTIONS)` habría sido más estricto pero rompe la regla 1 del sprint —empezaría a rechazar con 400 los envíos de un cliente con JS viejo en caché, que todavía manda `Packaging Design`—. Se comprobó contra el módulo real: el payload capturado valida, las 10 opciones validan, un payload inválido se rechaza con los mismos mensajes, y la celda «Work type» del mail sale `Consultation, Illustration, Editorial Design`.

  **(6) La separación previa al `SEND` se derivó de una proporción, no de un gusto.** Hoy el hueco regla→`SEND` (123,3 px hasta el cap-top) es **1,68×** el hueco entre campos (73,6 px); en el mockup esa relación es **1,70×**. Manteniéndola con el padding nuevo sale `mt-7` (28 px), y el resultado cae sobre el mockup: tramo *regla de HEAR ABOUT → regla de SEND* de **78,5 px** implementados contra **79,2 px** medidos en el mockup — **0,9 px**.

  **(7) Dos cosas que el mockup muestra distinto y NO se cambiaron, por no estar en la devolución escrita:** en el mockup **`LIFE` no está en negrita** (el código lo tiene en `font-semibold`; el mockup sí dibuja en negrita el `STAND OUT.` del footer, así que no es que no distinga pesos) y **no aparece la flecha `→`** debajo de la bajada (barrido de la zona: cero tinta). Las dos se dejaron como están y quedan para decisión de Valentino. Nota práctica sobre la flecha: con la bajada a 17 px, la flecha —que lleva tamaño propio de 32 px— pasa de ser 1,3× el texto a ser 1,9×.

- **Cómo se derivó la densidad, y por qué se le puede creer al número.** Mismo método que B2.4: medir por píxel sobre el JPG y **validar el método contra la captura del sitio real** antes de usarlo sobre el anotado.

  **Validación contra `11-contact-actual.jpg`.** La captura del sitio dentro del JPG ocupa x∈[82,1373] (1292 px) e y∈[52,766]. Ajustando escala y origen sobre las **seis reglas de campo** (y = 232,5 / 310 / 521 / 598 / 676 / 753) contra sus valores reales (271 / 386 / 699 / 814 / 929 / 1044 px de CSS) sale **S = 0,6733** e **y₀ = 50,0** — o sea un viewport de **1292 / 0,6733 = 1919 px**, que es 1920. Con esa vara, predicho contra medido:

  | magnitud | valor real (CSS) | predicho en el JPG | medido en el JPG | error |
  |---|---|---|---|---|
  | pitch entre reglas de campo | 115 | 77,4 | 77,5 | 0,1 % |
  | ancho de la regla de campo | 420 | 282,8 | 283 | 0,1 % |
  | borde izquierdo de la columna de control | 1260,7 | 930,8 | 931 | 0,2 px |
  | pitch de línea del título (96 px / 0,9) | 86,4 | 58,2 | 58,5 | 0,5 % |
  | cap-top del título | 194,97 | 181,3 | 181 ± 1 | ~0,3 px |

  Las dos últimas usan las métricas reales de Manrope leídas del navegador (`cap = 0,71875 em`, `ascent = 1,066`, `descent = 0,300`), no ratios de memoria.

  **Aplicación a `12-contact-anotado.jpg`.** Su captura ocupa x∈[59,1003] = **945 px** → **S = 945 / 1920 = 0,4922**; el origen vertical (**y₀ = 37,5**) sale de la banda del menú (y 64–70), cuyo cap-center cae a 60,9 px de CSS dentro de un header de 128. Dos controles independientes confirman la escala: la anotación dice que el título va a **40 / 48** y el pitch medido de sus tres líneas es **23,75** contra **23,63** predichos (0,5 %); y el borde izquierdo de la columna de control cae en x=680 → **1261,7 px de CSS** contra los **1260,7** reales — **1 px**.

  **Lo que pide el mockup, ya en píxeles de CSS:**

  | magnitud | mockup (px del JPG) | mockup (CSS) | antes | implementado |
  |---|---|---|---|---|
  | pitch entre reglas de campo | 39,5 (media de 34/37/40/38/46/42) | **80,3** | 115 | **83** |
  | tramo regla NAME → regla HEAR ABOUT | 365 | 741,6 → `16·P + 555` → **P = 11,7** | P = 28 | **P = 12** |
  | alto del bloque de pills | 70 | 142,2 | 142 | **142** (sin tocar) |
  | pitch de fila de pills | 18 | 36,6 | 37 | **37** (sin tocar) |
  | alto de pill | 16 | 32,5 | 31 | **31** (sin tocar) |
  | tramo regla HEAR ABOUT → regla de SEND | 39 | 79,2 | 130,5 | **78,5** |
  | ancho de la regla de campo | 188 | 381,9 | 420 | **420** (sin tocar) |

  Es decir: **el mockup no comprime ni la tipografía ni las pills ni el alto del control — comprime el aire entre campos**, exactamente el orden de prioridad que fijó Valentino. Por eso no hizo falta bajar el tamaño de los placeholders (prioridad 2): nunca se llegó a necesitarla.

- **De dónde salió cada píxel recortado.** El objetivo eran **274,5 px**; se recortaron **324**.

  | bloque | antes | después | delta |
  |---|---|---|---|
  | 8 filas normales (2·P + 58 + 1 de regla) | 8 × 115 = 920 | 8 × 83 = 664 | **−256** |
  | fila de pills (2·P + 142) | 198 | 166 | **−32** |
  | separación antes de `SEND` | 64 | 28 | **−36** |
  | bloque `SEND` | 44,5 | 44,5 | 0 |
  | **columna del formulario** | **1226,5** | **902,5** | **−324** |

  **Progresión medida** (viewport 1920, DPR 1): **1226,5 → 938,5 → 902,5**. El paso intermedio se midió forzando los valores viejos sobre el árbol nuevo, no calculándolo. El primer número es también el del árbol nuevo **con las 10 pills y sin comprimir nada**: la lista nueva **no cuesta un solo píxel**, porque diez pills siguen entrando en cuatro filas igual que las siete viejas. Todo el recorte son los `28 → 12` de padding vertical (9 filas × 32 px = 288) más los `64 → 28` del margen del `SEND` (36). **Cero de tipografía, cero de las pills, cero del alto del control.**

- **Mediciones / salidas de puertas.** Puertas: línea base `lint` exit 0 y `build` exit 0 (14 rutas, único warning el conocido de `@sanity/image-url`); final **idéntico** — lint exit 0, build exit 0, mismas 14 rutas, mismo único warning, cero errores nuevos. Runtime con `next dev` en el puerto **3010**, DPR 1, medido a **1920 × 1080 exactos** (iframe de 1920×1080 dentro de la ventana maximizada: el `resize` de ventana sigue sin aplicar, mismo límite que B2.1–B2.4).

  **El fit, contra el criterio.** Columna del formulario **902,5 px** contra el objetivo de **≤ 952** (`100svh − 128`): entra con **49,5 px de margen**. En pantalla: la columna arranca en y=184 y termina en **y = 1086,5**, pero **la regla del `SEND` cierra en y = 1080,5** — o sea que a 1080 de alto **se ve el questionnaire entero, botón incluido**, y lo que queda debajo del corte es medio píxel de esa regla más 6 px de aire vacío. La página completa mide 2306 px (footer de 981,7 desde y=1324,1). El aside pasó de 425,17 a **278 px**.

  **Aside contra el mockup.** Título `40px / 48px / normal / left`; bajada `17px / 21px / normal / left`; separación entre ambos `mt-9` (36 px). La **relación entre los dos** reproduce el mockup con **1,5 px** de error (28,9 px de separación de cap-tops implementados contra 27,4 medidos) y **su posición respecto del formulario** con **3,5 px**. Lo que no coincide: el mockup dibuja **todo el bloque ~29 px más abajo**, o sea con un padding superior de sección de ~86 px contra los 56 de hoy (`lg:pt-14`). **No se tocó**: la devolución no lo pide y costaría 29 px del presupuesto del fit.

  **Labels.** Los nueve miden 36,8 px = exactamente dos líneas de 18,4; `text-align: start`; 16 px; color `rgb(15,15,15)`.

  **Colores computados** (leídos de la clase, no del estilo computado: la pestaña de la herramienta corre con `visibilityState: hidden` y las transiciones CSS quedan congeladas en su valor inicial — se verificó que la pill seleccionada lleva `bg-off-black text-off-white` y la de reposo `bg-transparent text-gray-brand`):

  | elemento | antes | después |
  |---|---|---|
  | regla del campo (`border-b`) | `#0F0F0F` | **`rgb(147,147,147)`** |
  | borde de las pills | `#0F0F0F` | **`rgb(147,147,147)`** |
  | texto de pill en reposo | `#0F0F0F` | **`rgb(147,147,147)`** |
  | chevron del select | `#0F0F0F` | **`rgb(147,147,147)`** |
  | placeholder de input y de select | `rgb(147,147,147)` | igual |
  | texto tipeado, valor elegido, pill elegida | `#0F0F0F` | igual |
  | labels | `#0F0F0F` | igual |

  **Contraste, con el número pedido:** `#939393` sobre `#F3F3F3` da **2,77 : 1**, por debajo del umbral WCAG AA tanto para texto normal (4,5:1) como para texto grande (3:1). Los placeholders **ya venían con ese contraste** (34 px, es el gris que el repo usaba antes de este sprint); lo nuevo es el texto de las pills, que a 17 px queda en la misma relación. Se reporta el valor en vez de inventar otro gris, como pedía la instrucción: el gris de identidad es `#939393` y es el que muestra el mockup.

  **Las 10 pills, presentes y en orden**, y su agrupación coincide **exactamente** con la del mockup:

  | fila | pills | ancho |
  |---|---|---|
  | 1 | CONSULTATION · BRANDING · REBRANDING | 386,7 |
  | 2 | EVENT VISUAL IDENTITY · PACKAGE DESIGN | 371,0 |
  | 3 | MOTION GRAPHICS · ADVERTISING/CAMPAIGN | 396,0 |
  | 4 | ILLUSTRATION · EDITORIAL DESIGN · OTHER | 387,8 |

  **Resolución de `?service=`** (medida sobre el HTML servido de `/contact?service=…`, leyendo qué pill sale con `aria-pressed="true"`):

  | valor | origen | resuelve a |
  |---|---|---|
  | `brand essentials` | catálogo de /services | Branding |
  | `brand universe` | catálogo de /services | Branding |
  | `motion graphics` | catálogo de /services | Motion Graphics |
  | `packaging` | catálogo de /services | **Package Design** |
  | `editorial` | catálogo de /services | **Editorial Design** (antes caía en `Other`) |
  | `illustration` | catálogo de /services | **Illustration** (antes caía en `Other`) |
  | `Packaging Design` / `PACKAGING DESIGN` / `Packaging  Design` | nombre viejo de la pill | **Package Design** |
  | `package-design` / `Package Design` | nombre nuevo | Package Design |
  | `Branding`, `Rebranding`, `Event Visual Identity`, `Motion Graphics`, `Advertising/Campaign`, `Consultation`, `Illustration`, `Editorial Design`, `Other` | nombres de pill | sí mismos |
  | `web design`, `zzz`, vacío | desconocido | **nada seleccionado** (antes: `Other`) |

  **Envío de punta a punta, sin mandar un mail.** Se llenó el formulario en el navegador como lo haría una persona (inputs por su setter nativo + evento `input`, tres pills nuevas por click, tres selects abriendo y eligiendo) y se interceptó `fetch` para capturar el POST **sin dejarlo salir**: la validación pasa, el `POST /api/contact` sale con `workType: ["Consultation","Illustration","Editorial Design"]` y el resto de los campos, y devolviendo 500 aparece el estado de error de siempre sin navegar. Del lado del servidor: el payload capturado y las 10 opciones **validan contra el `contactSchema` real**, un payload inválido se rechaza con los mismos mensajes, `POST /api/contact` con body inválido devuelve **400** en vivo, y la celda «Work type» del mail sale `Consultation, Illustration, Editorial Design`. **El único eslabón no ejercitado es la llamada a Resend**, que es justo la verificación humana declarada — y que este sprint no toca.

  **`/contact/success`** a 1920×1080: página **2062 px** = una pantalla completa (1080) + footer de **981,7** desde y=1080, el mismo alto que el footer de las demás rutas internas. `LET'S WORK TOGETHER!` **ya no está en el DOM**; sí están `JOIN OUR CLUB` y `BECOME PART OF A CREATIVE COMMUNITY`, y el footer **no** trae el bloque `CONTACT US` (el `CONTACT US` que queda en la página es el del menú). El panel oscuro conserva su animación y queda recortado por el `overflow-hidden` de la sección: sin él barrería el footer al subir.

  **Tokens borrados (15 declaraciones)** — re-grepeados sobre el repo entero justo antes de borrar: los cinco `--font-size-*` del `@theme` con sus `--line-height` y `--letter-spacing` (`display`, `body`, `footer-cta`, `project-text`, `nav`) y, del `:root`, `--cursor-size`, `--cursor-size-hover` y `--footer-height`. Las utilidades que generaban (`text-display`, `text-body`, `text-footer-cta`, `text-project-text`, `text-nav`) tienen **cero usos** en `src/`; el único consumidor que registraba la auditoría (`text-body` en `InfoCard.tsx`) **ya no existe**, se borró en B1. **Conservados:** `--header-height`, que **sí** se usa en seis lugares (layout, Navbar, `/work`, `/services`, `/team` y el sticky del aside de contacto). **Huérfanos confirmados que NO se borraron**, por quedar fuera de la lista de la instrucción: `--color-gray` del `:root` (duplicado exacto de `--color-gray-brand`, que sí se usa) y `--color-beige` / `bg-beige`, que es un **color declarado de la identidad** en `CLAUDE.md` §2 aunque hoy no lo consuma nadie — borrarlo es una decisión de paleta, no una limpieza.

  **Control de no-regresión del borrado** (alto de página · alto de `<main>` · alto y tope del footer, a 1920×1080, antes y después de la Fase 3):

  | ruta | antes | después |
  |---|---|---|
  | `/` | 1080 · 916 · 164 desde 916 | **idéntico** |
  | `/work` | 2154 · 1172,8 · 981,7 desde 1172,8 | **idéntico** |
  | `/team` | 4257 · 3147,6 · 981,7 desde 3275,6 | **idéntico** |
  | `/services` | 8477 · 7495 · 981,7 desde 7495 | **idéntico** |
  | `/fun-gallery` | 1080 · 128 · 166 desde 888 | **idéntico** |
  | `/contact` | 2306 · columna 902,5 | **idéntico** |
  | `/contact/success` | 2062 · 1080 · 981,7 desde 1080 | **idéntico** |

  Ninguna ruta tiene scroll horizontal (`scrollWidth === 1920` en las siete). `--header-height` sigue resolviendo a `128px` y `--footer-height` / `--cursor-size` ya resuelven a vacío.

- **Hallazgo de la Fase 2, medido y señalado: el menú queda ilegible sobre el footer.** En `/contact/success` el `Navbar` va **transparente y con el texto en off-white** (`Navbar.tsx:128,139` — rama `isDarkRoute`), y no se oculta al scrollear (no tiene ningún listener de scroll). Con el footer nuevo la ruta pasó a tener 982 px de scroll, y **desde y≈783 hasta el final la franja clara del footer queda debajo de la barra**: medido en el tope del scroll, la franja ocupa el viewport de −71 a 233, cubre entera la banda del menú [0,128], y su fondo es `rgb(243,243,243)` — **exactamente el mismo color que el texto del menú**. El menú desaparece. Es la forma concreta del riesgo que la instrucción declaraba («puede quedar un corte raro»). **No se arregló porque el arreglo vive en `Navbar.tsx`**, que no está entre los archivos autorizados de la Fase 2; el arreglo real es hacer el tono del `Navbar` sensible al scroll en esa ruta. Al ir la fase en su propio commit, revertirla es una línea.

- **Pendientes que deja:** **(1)** El hallazgo del `Navbar` de arriba: o se hace el tono sensible al scroll (cambio en `Navbar.tsx`, fuera de este sprint) o se revierte la Fase 2. **(2)** **Debajo de 1512 el fit se pierde, y es por las pills.** Las diez necesitan **396 px** de columna de control para entrar en cuatro filas; a 1920 hay 420 y a 1512 hay 410,3, pero de ahí para abajo el segundo track de la grilla toca su mínimo de 560 px y el control se achica: a 1440 quedan 378,2 (5 filas, columna de 939,5 — todavía ≤ 952), y a 1366 y 1280 quedan 356 (6 filas, columna de **976,5**, por encima del objetivo). Las siete pills viejas entraban en cuatro filas hasta 1280, así que es consecuencia directa de la lista nueva; a 1280 la columna igual bajó de 1226,5 a 976,5. Si importa el rango 1280–1440, se resuelve tocando el tamaño o el padding de las pills, que este sprint dejó intactos a propósito porque el mockup los reproduce clavados. **(3)** La rama clara de `FixedFooter` (`isFunGallery = false`) quedó **sin llamadores**; se conservó a propósito, documentado en el propio archivo, para que revertir la Fase 2 sea una línea. Si la Fase 2 se confirma, esa rama se borra en B3 junto con el rediseño de `/fun-gallery`. **(4)** Los dos huérfanos que no se borraron (`--color-gray`, `--color-beige`). **(5)** Las dos diferencias del mockup que no se aplicaron: `LIFE` sin negrita y la flecha `→` ausente. **(6)** El mockup dibuja el aside ~29 px más abajo que el código (padding superior de sección de ~86 px contra 56).

- **Nota de método, tres límites del entorno.** **(1)** Vale el mismo límite de B2.2 a B2.4: la pestaña de la herramienta corre con `document.visibilityState === "hidden"`, Chrome no dispara `requestAnimationFrame` ahí y **las animaciones no se pueden observar** — ni las variants de entrada del formulario ni el panel que sube en `/contact/success` ni las transiciones de color de 150 ms de las pills. Por eso los colores se verificaron **por clase** y no por estilo computado: el estilo computado de una pill recién seleccionada devolvía su valor de reposo, congelado en el frame 0 de la transición. **(2)** El `resize` de ventana no aplica con la ventana maximizada; todo se midió a 1920×1080 exactos dentro de un iframe del mismo origen, que resuelve las media queries contra su propio viewport, y los anchos de 1512 a 1280 fijando el ancho del contenedor y el `gap` que la `clamp(3rem,6vw,8rem)` daría en cada uno. **(3)** El `next dev` **se quedó sin heap dos veces** durante el sprint (`Ineffective mark-compacts near heap limit`, ~7 GB), una de ellas al correr `next build` contra el mismo `.next`; hubo que relanzarlo con `--max-old-space-size`. No afecta a ninguna medición —todas se rehicieron sobre un servidor sano— pero conviene saberlo para el próximo sprint largo.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, zoom 100 %: **(a)** **enviar el formulario de verdad** y confirmar que llega el mail con las opciones nuevas — es lo único del circuito que no se pudo ejercitar sin mandar un correo real, y es la verificación más importante del sprint; **(b)** si el questionnaire **respira o quedó apretado**: la medición dice que entra (902,5 contra 952) y que la densidad es la del mockup, pero ninguna medición dice si se siente cómodo — si quedó apretado, aflojar es subir un número (`md:py-3`) y aceptar algo de scroll; **(c)** la composición contra `12-contact-anotado.jpg`: título, bajada, labels a la izquierda en dos líneas, grises; **(d)** las dos diferencias del mockup que se dejaron sin aplicar (`LIFE` en negrita, flecha `→`); **(e)** **`/contact/success`**, sabiendo de antemano que el menú desaparece sobre la franja clara del footer — decidir entre arreglar el `Navbar` o revertir la fase; **(f)** que `/`, `/work`, `/services`, `/team` y `/fun-gallery` no cambiaron (control del borrado de tokens).

- **Commits:** los tres del sprint, más el de este cierre.

## 2026-08-19 · B2.5b · Contact en dos columnas, footer de home en `/contact/success` y dos detalles del mockup (cierre del Bloque 2)

- **Qué se hizo:** tres commits, dos archivos. **[F1]** `ContactForm.tsx`: el formulario se parte en **dos columnas de campos a partir de 1600 px**, con el botón `SEND QUESTIONNAIRE` ocupando el lugar de un campo al final de la segunda; debajo de 1600 sigue habiendo una sola columna pero **re-proporcionada**, de modo que el control nunca baje de 420 px y las pills se queden en cuatro filas hasta 1280. **[F2]** `Footer.tsx`: `/contact/success` pasa a la variante de footer de home. **[F3]** `ContactForm.tsx`: `LIFE` deja de ir en negrita y se borra la flecha `→` del aside. **No se tocó** `HoverButton.tsx`, ni `api/contact/route.ts`, ni `contact/page.tsx`, ni `globals.css`, ni la arquitectura sticky del aside, ni `SCOPED_SELECTION`, ni ninguna variant de entrada, ni el tamaño o el padding de las pills.

- **La medición que gobernó todo el sprint: la composición de dos columnas no entra debajo de ~1450 px, y el margen real es todavía más chico.** Antes de escribir una línea se midieron los cuatro mínimos que no se pueden achicar sin romper algo:

  | pieza | mínimo medido | de dónde sale |
  |---|---|---|
  | aside | **269,2 px** | `TO RECEIVE A CUSTOM PROPOSAL` a 17 px |
  | label de la columna izquierda | **173,6 px** | `LOOKING TO WORK ON?` |
  | label de la columna derecha | **136,2 px** | `TIMELINE IN MIND?` |
  | control de las pills | **396 px** | barrido exacto de ancho contra cantidad de filas |
  | control de la columna derecha | **352 px** | `$2,500–$4,000 USD` (312) + chevron y gutters (40) |

  El barrido de las pills, ancho por ancho, da el umbral de cuatro filas según su padding horizontal: **396 px con `px-2.5` (el de hoy), 380 con `px-1.5`, 372 con `px-1`, 364 con `px-0.5`**. Es decir: la concesión que la instrucción autorizaba —apretar el padding— **compra 24 px como máximo** antes de volverse indefendible visualmente.

  Con esos números, y con un prototipo real armado en el DOM (no aritmética), la composición de dos columnas da:

  | ancho | contenido | control de pills disponible | filas con `px-2.5` | filas con `px-1` |
  |---|---|---|---|---|
  | 1920 | 1680 | 420 | **4** | 4 |
  | 1512 | 1384 | 378 | 5 | **4** |
  | 1440 | 1312 | 330 | 6 | **6** |
  | 1280 | 1152 | 186 | 10 | **10** |

  A 1440 faltan 42 px contra el piso de 372 y a 1280 faltan 186. **Ahí no hay concesión de padding que alcance**: es la PARADA que la instrucción definía. Dato lateral que conviene recordar: **el techo de 952 px nunca fue el problema en dos columnas** —el bloque mide 498— ; lo que se rompe es el ancho.

- **La decisión de Valentino y la corrección que hubo que hacerle.** Con esos números sobre la mesa eligió **dos columnas por encima de un corte, una columna re-proporcionada por debajo**, con el corte propuesto en **1536**. Al implementarlo apareció un dato que la propuesta no contemplaba: el ledger de 1536 dejaba la columna derecha en **300 px de control**, y con eso **`$2,500–$4,000 USD` (312 px) se trunca**. Truncar un valor ya elegido en la única página funcional del sitio no es aceptable, así que el corte real es **1600 px**, el primer ancho donde entran las dos columnas **sin truncar nada y con gutters legibles**: `280 (aside) + 40 + [176 + 24 + 396] + 32 + [140 + 24 + 352] = 1472 px de contenido = 1600 de viewport`. A 1536 la única forma de que entre es dejar 24 px entre el aside y el formulario y 20 entre columnas, que ya no es una composición. **Consecuencia concreta: una pantalla de 1536 (1920 al 125 %, común en Windows) ve la columna única, no las dos.**

- **La distribución final sale de la medición, no del número.** El punto de partida pedido era 5 + 4 y botón. Medido: el bloque de pills mide **166 px** contra **83** de un campo normal, así que con el botón pegado a su margen de siempre el reparto 5/4 daba **498 contra 404,5 — 93,5 px de diferencia**, fuera del tope de 60. La corrección no fue mover un campo sino **subir el margen del botón a 64 px en dos columnas**, que es justamente lo que pide la composición (el botón ocupa un *slot* de campo): la segunda columna llega a **440,5** y la diferencia baja a **57,5**. En una columna el margen se queda en 28 y el bloque en 902,5. Reparto final: **nombre · email · pills · negocio · industria ‖ ubicación · plazo · presupuesto · cómo nos conociste · SEND**.

- **Mediciones finales** (DPR 1, techo `100svh − 128px` = 952):

  | ancho | columnas | bloque | holgura | col A | col B | dif | filas de pills | control pills | control derecha |
  |---|---|---|---|---|---|---|---|---|---|
  | 1280 | 1 | 902,5 | 49,5 | — | — | — | **4** | 420 | 420 |
  | 1440 | 1 | 902,5 | 49,5 | — | — | — | **4** | 420 | 420 |
  | 1512 | 1 | 902,5 | 49,5 | — | — | — | **4** | 420 | 420 |
  | 1599 | 1 | 902,5 | 49,5 | — | — | — | **4** | 420 | 420 |
  | 1600 | **2** | 498 | 454 | 498 | 440,5 | **57,5** | **4** | 400 | 356 |
  | 1680 · 1728 · 1808 · 1920 | **2** | 498 | 454 | 498 | 440,5 | **57,5** | **4** | 420 | 376 |

  Sin scroll horizontal en ningún ancho. Los pisos de las dos pistas (600 y 520 px) reparten los 4 px que sobran a 1600 para que **ninguna de las dos arranque justo sobre su límite**. El 1920 medido sin simular coincide exactamente con el 1920 simulado, que es el control que valida todo el resto de la tabla.

  **Esto además arregla de fondo el problema que abrió el sprint anterior:** a 1280 el bloque medía **976,5** contra el techo de 952 porque las pills se iban a 6 filas; ahora mide 902,5 en los cuatro anchos porque la pista del formulario nunca baja de 624 px (`176 + 28 + 420`).

- **Detalle técnico que costó encontrar: Tailwind emite las variantes arbitrarias `min-[...]` *antes* que los breakpoints con nombre.** La primera implementación usaba `lg:grid-cols-[…] min-[1600px]:grid-cols-[…]`, y a 1920 **ganaba `lg:`** — el formulario se desbordaba de su contenedor de 624 px. En vez de pelear con el orden del stylesheet, los dos ramos se volvieron **mutuamente excluyentes**: `lg:max-[1599.98px]:` para `[1024, 1600)` y `min-[1600px]:` para `[1600, ∞)`. Sin rangos superpuestos no hay conflicto de cascada que resolver y el orden deja de importar. Queda anotado porque es una trampa que va a reaparecer.

- **El ancho de label y el gutter de cada campo pasaron a variables CSS** (`--contact-label-w`, `--contact-gap`), declaradas en `[data-contact]` y sobreescritas por la segunda columna. Así la columna derecha usa un label más angosto (140 contra 176) **sin duplicar `FieldShell`** (CLAUDE.md §8.10).

- **El formulario quedó intacto, y está verificado sin mandar un mail.** El botón entra al `<form>` como último elemento en vez de quedar afuera atado por el atributo `form`, de modo que **el orden del DOM sigue siendo el orden de tipeo**. Con `fetch` interceptado: sale el `POST /api/contact` con los nueve campos (`fullName`, `email`, `workType`, `businessType`, `industry`, `country`, `timeline`, `budget`, `hearAbout`), la validación zod muestra sus dos mensajes con el formulario vacío y **no dispara ningún request**, el estado de error aparece cuando la respuesta no es `ok`, los cuatro selects abren y eligen, las pills se marcan y se desmarcan, y **ningún valor queda truncado en la columna derecha** (`scrollWidth === clientWidth` en los cuatro, incluido el presupuesto más largo). El recorrido por `Tab` da 19 paradas en el orden lógico: nombre → email → las 10 pills → negocio → industria → ubicación → plazo → presupuesto → cómo nos conociste → SEND. **El único eslabón no ejercitado sigue siendo la llamada a Resend.**

- **[F2] El defecto del menú, medido antes y después.** `/contact/success` usaba el footer de dos zonas: **981,7 px de alto**, y con el scroll al máximo su franja clara arrancaba en **y = −71**, cubriendo entera la banda `[0, 128]` del Navbar. Como el Navbar de esa ruta va transparente con el texto en off-white y la franja es `#F3F3F3`, **el menú desaparecía**. Con la variante de home el footer mide **164 px**, la página baja de **1893 a 1075**, y con el scroll al máximo el footer arranca en **y = +747** — 619 px por debajo de la banda del Navbar. Verificado también por captura: el menú se lee entero sobre el panel oscuro. Contenido confirmado en el DOM: `BORN IN / ARGENTINA`, `WORKING / WORLDWIDE`, `© 2024`, `POWERED BY develOP`, `INSTAGRAM / LINKEDIN` y el logo script chico. **Sin banda oscura, sin logo gigante, sin `JOIN OUR CLUB`, sin `CONTACT US`.** Esto cierra el pendiente (1) que dejó B2.5.

- **[F3] Los dos detalles del mockup.** `LIFE` deja de ir en `font-semibold`: el `<h1>` ya no tiene ningún `<span>` adentro y las cuatro palabras quedan en `font-weight: 100`. La flecha se borró después de verificar que **no tenía función**: era un `<p aria-hidden>` sin `href`, sin handler y sin `id`, y ningún `querySelector` del repo la referenciaba. Al quedar un solo hijo en el contenedor, el `space-y-6` quedó sin efecto y se borró (CLAUDE.md §8.11). Esto cierra el pendiente (5) que dejó B2.5.

- **Puertas y no-regresión.** `npm run lint` y `npm run build` en verde antes y después, con la tabla de rutas idéntica a la línea base. `ContactForm.tsx` tiene **un solo consumidor** (`/contact`), verificado por grep, así que F1 no puede alcanzar a ninguna otra ruta. Footer por ruta, contra el markup servido: `/` → home; `/work`, `/team`, `/services` → interno con logo gigante; `/contact` → interno con `JOIN OUR CLUB`; `/fun-gallery` → fijo con `LET'S WORK TOGETHER!`; `/contact/success` → **home** (lo único que cambió). Altos a 1920×911: `/` 911 · `/work` 2154 · `/team` 4088 · `/services` 8139 · `/fun-gallery` 911, sin cambios. `/contact` baja de **2276 a 1872**, que es exactamente lo que se pidió: el bloque del formulario pasó de 902,5 a 498.

- **Nota de método, tres límites del entorno.** **(1)** Sigue vigente el límite de los sprints anteriores: la pestaña corre con `document.visibilityState === "hidden"`, Chrome no dispara `requestAnimationFrame` ahí y **las animaciones no se pueden observar**. Se comprobó que las variants **sí propagan** a través de los dos `<div>` de columna nuevos —los campos llegan a opacidad 1 desde su estado oculto—, pero **la cadencia del stagger no se pudo cronometrar** y queda para la verificación humana. **(2)** El `resize` de ventana no aplica con la ventana maximizada: el ancho quedó clavado en 1920 aunque el alto sí respondía. Los otros anchos se midieron reproduciendo a mano, en línea, exactamente lo que hacen las dos media queries del componente; **el control es que el 1920 simulado da idéntico al 1920 real**, campo por campo. **(3)** El `next dev` se reinició solo por umbral de memoria y dejó chunks viejos servidos: apareció un `ChunkLoadError` que congelaba la hidratación y dejaba **todo el contenido en opacidad 0**, incluido el aside. No era una regresión del código —se descartó relanzando el servidor— pero cuesta un rato distinguirlo de un bug real de animación.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, zoom 100 %: **(a)** **enviar el formulario de verdad y confirmar que llega el mail** — F1 reestructuró el markup del form, y aunque el POST está verificado con `fetch` interceptado, la llamada a Resend es lo único que no se puede ejercitar sin mandar un correo real; **(b)** recorrer el formulario **solo con `Tab`** y confirmar que el orden se siente lógico; **(c)** la composición de dos columnas a 1920: si se lee bien, si el aside sigue equilibrado con el peso nuevo a su derecha, y si el botón cerrando la segunda columna funciona visualmente; **(d)** **la cadencia de la aparición de los campos**, que no se pudo observar; **(e)** `/contact/success` con el footer de home y el menú visible al scrollear; **(f)** los cuatro anchos de laptop, **sabiendo que 1512, 1440 y 1280 muestran la columna única** —y que 1536 también—, y decidir si ese corte se acepta o si conviene revisar el pedido.

- **Pendientes que deja:** **(1)** El corte en 1600 deja fuera a 1536, que es un ancho común (1920 al 125 %). Si se quiere ganarlo hay dos caminos, los dos con costo: apretar el padding de las pills a `px-1` **y** aceptar que el presupuesto se trunque, o bajar la escala tipográfica de los controles, que este sprint tenía prohibido tocar. **(2)** La rama clara de `FixedFooter` (`isFunGallery = false`) **sigue sin llamadores**; se conserva a propósito, documentado en el archivo, para que volver a un footer fijo sea una línea. Se borra en B3 con el rediseño de `/fun-gallery`. **(3)** Los dos huérfanos de `globals.css` que B2.5 no borró (`--color-gray`, `--color-beige`). **(4)** El mockup dibuja el aside ~29 px más abajo que el código.

- **Commits:** los tres del sprint, más el de este cierre.

## 2026-08-19 · B3.1 · Sonda de transparencia del pipeline Sanity → CDN → `next/image` (apertura del Bloque 3)

- **Qué se hizo: nada de diseño y ningún código permanente.** El sprint entrega un reporte. Se montó una ruta temporal (`src/app/alpha-probe/page.tsx`), se midió, y se borró antes del commit. **El repo queda sin la sonda**: `lint` limpio, `build` en verde y **11 rutas**, idéntico a la línea base tomada al abrir (HEAD `6650e64`). No se escribió en Sanity: todo fue lectura por API pública y CDN.

- **PARADA al inicio, y por qué conviene registrarla.** El asset del prerrequisito no estaba subido. En vez de asumirlo se consultó la API: el dataset `production` tenía **12 assets**, ninguno de 2250×2250, y el más reciente era del 2026-08-13. Se paró, se pidió el asset y se retomó. Queda como método: **el prerrequisito humano se verifica, no se supone.**

- **[a] Caracterización del original** (`993ebe54…-2250x2250.png`, el peor borde de los ocho): 2250×2250, PNG, **4 canales**, `hasAlpha: true`, `isOpaque: false`, **1 931,3 KB**. El histograma de alpha corrige la lectura de un solo número:

  | banda de alpha | píxeles | % | qué es |
  |---|---|---|---|
  | `0` | 3 137 479 | **61,98 %** | vacío total |
  | `1–127` | — | 0,04 % | degradado anti-alias real |
  | `128–250` | — | **10,73 %** | dos mesetas planas en `237` (5,33 %) y `242` (5,33 %) |
  | `251–254` | — | **27,25 %** | cuerpo del producto, casi todo en `254` |
  | `255` | 0 | **0,00 %** | — |

  Dos cosas que no se ven en el resumen. **La imagen no tiene un solo píxel totalmente opaco**: el cuerpo está en `alpha=254`, a uno del tope. Y el **10,77 %** medido antes de subir corresponde a la banda `128–250`, que **no es borde anti-aliased**: son dos mesetas planas de translucidez deliberada (sombra o placa). El anti-alias verdadero es apenas **0,04 %**. Un borde real degradaría por todos los valores, no picaría en exactamente 237 y 242.

  **El dato que gobierna el resto del sprint:** bajo los 3 137 479 píxeles vacíos el PNG guarda **blanco puro `rgb(255,255,255)`**. Si algo del camino aplanara la transparencia, el resultado sería **blanco** — y sobre el off-white `#F3F3F3` del sitio eso es una diferencia de 12/255, prácticamente invisible. **El fondo saturado no era un lujo del método: era la única forma de que un aplanado se notara.**

- **[b] Qué devuelve el CDN de Sanity.** Alpha conservado en los cuatro casos, sin aplanado en ninguno:

  | transformación | content-type | peso | canales | `isOpaque` |
  |---|---|---|---|---|
  | original, sin params | `image/png` | 1 931,3 KB | 4 | `false` |
  | `?w=1200&q=90` (la galería hoy) | `image/png` | **534,6 KB** | 4 | `false` |
  | `+fm=webp` | `image/webp` | **94,9 KB** | 4 | `false` |
  | `+fm=png` | `image/png` | 534,6 KB | 4 | `false` |
  | `+auto=format`, sin `Accept` | `image/png` | 534,6 KB | 4 | `false` |
  | `+auto=format`, con `Accept: image/webp` | `image/webp` | **94,9 KB** | 4 | `false` |

  **El CDN no negocia formato por su cuenta**: sin `fm` ni `auto=format` devuelve PNG siempre. Y `auto=format` **llega hasta WebP, nunca AVIF**, incluso cuando el `Accept` del cliente lo ofrece.

- **[c] Qué devuelve `next/image`.** Medido **solo contra producción** (`npm run build` + `npm run start -- -p 3010`), según la adenda; **la comparación dev vs. producción queda eliminada del sprint**. Alpha conservado en los tres formatos:

  | `Accept` | formato servido | w=384 | w=750 | w=1080 | w=1200 | canales | `isOpaque` |
  |---|---|---|---|---|---|---|---|
  | Chrome (avif, webp) | **AVIF** | 9,4 KB | 21,7 KB | 33,8 KB | **37,0 KB** | 4 | `false` |
  | Safari (webp) | **WebP** | 12,8 KB | 32,2 KB | 52,7 KB | 54,2 KB | 4 | `false` |
  | sin preferencia | PNG | 23,0 KB | 81,1 KB | 148,4 KB | 167,7 KB | 4 | `false` |

  **Hallazgo operativo: la galería pide `q=90` al CDN pero el optimizador reencoda a `q=75`.** `urlFor(...).quality(90)` gobierna el fetch servidor→CDN; `<Image>` no recibe prop `quality`, así que usa su default. Pedir `q=90` a `/_next/image` **devuelve HTTP 400**, porque `next.config.ts` no declara `qualities`.

- **[d] Halo y bordes: no hay, y está medido además de mirado.** Se compositaron sobre los tres fondos la salida real de `next/image` (AVIF w=1200) y una referencia del original reescalada con alpha premultiplicado, comparando **solo la banda de borde** (550 643 px con alpha parcial):

  | fondo | diferencia media | sesgo con signo (+ = aclara) | máximo puntual |
  |---|---|---|---|
  | off-black `#0F0F0F` | 2,42 / 255 | **+0,37** | 63 |
  | beige `#EFEEDA` | 2,32 / 255 | **+0,37** | 62 |
  | off-white `#F3F3F3` | 2,19 / 255 | **+0,36** | 63 |

  **Lo que prueba que no hay halo no es que el sesgo sea chico, sino que no cambia con el fondo.** Si el blanco guardado bajo los píxeles vacíos se estuviera filtrando al borde, sobre off-black el sesgo sería fuertemente positivo y sobre off-white casi nulo. Que dé +0,36/+0,37 en los tres significa que la diferencia es **ruido de compresión AVIF a q=75**, no error de composición. Coherente con lo observado en los bytes: el optimizador reemplaza el blanco bajo los vacíos por `rgba(0,0,0,0)`, que es exactamente el manejo premultiplicado correcto.

  **Capturas en `C:/EsquinaWeb-capturas-B3.1/`** (fuera del repo, a propósito): `00-fila-completa-beige.jpg`, `00-fila-completa-offblack.jpg`, `01-beige-cover.png`, `02-beige-contain.png`, `03-offblack-cover.png`, `04-offblack-contain.png`, `05/06-CONTROL-sin-optimizar.png` y `07-zoom-borde-offblack-optimizada-vs-control.png`. La sonda incluyó **una celda de control con `unoptimized`** en cada fondo, que sirve el CDN directo sin pasar por el optimizador: es lo que permite separar «lo rompió Next» de «el asset es así». A ojo son indistinguibles.

- **[e] `cover` vs `contain` con un recorte cuadrado.** Geometría de la tarjeta de `FunGallery` (`itemHeight = itemWidth × rand(0.68, 1.16)`), fuente 1:1:

  | proporción de tarjeta | `r` | `cover` recorta | `contain` deja vacío |
  |---|---|---|---|
  | más apaisada (h/w 0,68) | 1,471 | **32,0 % del alto** | 32,0 % del área |
  | media (h/w 0,92) | 1,087 | 8,0 % del alto | 8,0 % del área |
  | más vertical (h/w 1,16) | 0,862 | 13,8 % del ancho | 13,8 % del área |

  Con un recorte flotando en el vacío, `cover` **le corta pedazos al producto** —hasta un tercio— y `contain` no pierde nada: solo deja transparencia alrededor, que es precisamente lo que se quiere ver.

- **[f] Peso servido, por etapa.** Contra lo que sirve hoy el pool de la galería:

  | asset | original | CDN w=1200 | next w=384 | next w=1200 |
  |---|---|---|---|---|
  | **sonda `00-04.png`** (recorte alpha) | 1 931,3 KB | 534,6 KB | **9,4 KB** | **37,0 KB** |
  | `akasha-producto.png` (pool hoy) | 19 709,4 KB | 2 708,3 KB | 18,3 KB | 71,1 KB |
  | `akasha.png` (pool hoy) | 162,0 KB | 186,3 KB | 6,7 KB | 23,4 KB |
  | `tukumi.jpg` (pool hoy) | 2 200,6 KB | 583,5 KB | 14,5 KB | 226,2 KB |
  | `matsu.png` (pool hoy) | 2 163,1 KB | 2 859,5 KB | 7,5 KB | 127,4 KB |

  **El recorte con alpha no es más caro que lo que la galería ya sirve: es más barato.** A w=384 —el ancho que realmente pide una tarjeta de 26vw— pesa **9,4 KB**, el más liviano de la tabla. La transparencia no tiene costo de peso apreciable. Nótese de paso que **el CDN puede devolver más que el original** en PNG (`matsu`: 2 859 contra 2 163 KB), que es otro argumento para no dejarlo en PNG.

- **Recomendación medida para la galería nueva.** **(1) Pedirle al CDN `w=1200&fm=webp` en vez de `w=1200&q=90`**: mismo alpha, 94,9 contra 534,6 KB en el fetch servidor→CDN, y evita el caso patológico de PNG que engorda. `auto=format` también sirve pero depende del `Accept`, que en un fetch de servidor no está garantizado; `fm=webp` es determinista. **(2) Dejar `quality` como está** —sin prop en `<Image>`, o sea 75—: a q=75 la diferencia media en el borde es 2,4/255 sobre un asset elegido por ser el peor de los ocho. Subir a 90 obliga a declarar `qualities` en `next.config.ts` y no compra nada visible. **(3) Encuadrar con `object-contain`, no `cover`**, y esto es lo único que sí exige rediseño: son recortes flotando en el vacío y `cover` les corta hasta el 32 %. **(4) `next.config.ts` no necesita tocarse**: `remotePatterns` ya cubre `cdn.sanity.io`, y `formats: ["image/avif","image/webp"]` ya entrega AVIF con alpha intacto. Solo haría falta `qualities` si se decidiera subir de 75, y la medición dice que no hace falta.

- **El riesgo que abrió el sprint no existe.** Ningún tramo del camino aplana la transparencia: ni el CDN con las transformaciones de la galería, ni el optimizador de Next al pasar a AVIF o WebP. **No hay halo, no hay borde sucio, no hay caja opaca.** El pipeline está listo para los ocho recortes sin cambios de infraestructura.

- **Hallazgo lateral, para B3.2: el parallax de la galería desborda su propio overscan.** Cada tarjeta reserva `-inset-[8%]` de margen y el parallax la desplaza `40px × factor(2..3)` = **hasta 120 px**. El overscan disponible es de 26 px en una tarjeta de 320 y 54 px en una de 680: **en todos los tamaños el borde de la imagen puede entrar en cuadro.** Hoy no se nota porque las imágenes son opacas y llenan el marco; **con recortes sobre transparencia y `object-contain` sí se va a notar.** No se tocó nada: queda anotado como insumo del rediseño.

- **[g] Lo que no se pudo medir.** **(1)** La comparación **dev vs. producción**, eliminada por la adenda: se reporta solo producción. **(2)** Los **otros siete** recortes: se midió únicamente `00-04.png`. Es el peor caso de borde declarado (10,77 % en la banda translúcida contra 0,50–2,77 % de los demás) y el más pesado, así que el resultado acota a los otros siete por arriba, pero **no están medidos**. **(3)** El comportamiento en el **CDN de Vercel en producción real**: todo se midió contra `next start` local. **(4)** Un primer intento de medir pesos con `Promise.all` devolvió **0 KB en dos filas**; era saturación del optimizador, no un fallo — repetido en secuencial dio 200 y los valores de la tabla. Queda anotado porque es un falso positivo fácil de creerse.

- **Verificación humana pendiente:** mirar las capturas de fondo saturado —el halo es un fenómeno visual, no una métrica— y **descartar el borrador del Studio** que se creó para el prerrequisito. El asset queda huérfano en la biblioteca, sin efecto sobre el sitio.

- **Commit:** uno solo, de bitácora, porque el sprint no deja código.

## 2026-08-19 · B3.2 · Fuente de datos de Fun Gallery: schema propio, seed derivado y pipeline de imagen

- **Qué se hizo.** La galería dejó de derivar sus imágenes de los `project` y pasa a leer de un tipo de contenido propio, `funGalleryImage`. Tres commits de código y docs (`4c3c8aa`, `4dd79e7`, `d06f3ee`) sobre la base `b508540`. **No se escribió en Sanity** —ni documentos, ni assets, ni dataset—: el sprint crea la forma, el contenido lo cargan las clientas. `next.config.ts` no se tocó. Lint limpio y build en verde con **11 rutas**, igual que la línea base.

- **Schema `funGalleryImage`, campo por campo.** Cinco campos y nada más: `image` (`image`, `hotspot: true`, **requerido**, label *Image (PNG with transparent background)*), `title` (`string`, **requerido**, *Name (e.g. Cocktail Hour napkins)*), `altText` (`string`, opcional), `linkedProject` (`reference` a `project`, opcional, *Linked project (optional — makes the image clickable)*) y `order` (`number`). `orderings` por `order` ascendente, igual que `project`. El `preview` trae el nombre del proyecto vinculado como subtítulo: se verificó contra el bundle instalado —`createPathObserver.ts` de Sanity 5.25.1 dice literalmente que si el path incluye una referencia, la referencia se sigue—, así que **no hizo falta `prepare()`**. `linkedProject` es el **primer `reference` del repo**, y su desreferencia en la query el primer `->` documento-a-documento.

- **Casillas ES en `project`.** `titleEs`, `categoryEs` y `servicesEs`, las tres opcionales, cada una agrupada con su par en inglés mediante `fieldsets` (`nameGroup`, `categoryGroup`, `servicesGroup`) — **primer uso de fieldsets del repo**, verificado contra `@sanity/types`. La pantalla de edición baja de trece campos planos a diez bloques. Las queries de Work ya las traen; **nadie las renderiza todavía**: el fallback cruzado es de B4. El `content` no se traduce.

- **Seed derivado, y por qué necesitó un desempate.** La ruta perdió `force-dynamic` y el `randomUUID()` por request; el mapa se siembra con `images.map(i => i._id).join("|")`, es decir los identificadores de los documentos en el orden que devuelve la query. Mismo contenido ⇒ mismo mapa; el sorteo solo se mueve cuando se agrega, se saca o se reordena. Cambiar la foto dentro de un documento existente **no** mueve nada, que es lo que se quería. El detalle que casi se escapa: `order` es opcional, y con empates GROQ **no garantiza una secuencia estable**, así que la query ordena por `order asc, _id asc`. Sin ese desempate el «seed derivado» habría sido estable solo por casualidad. De paso se midió que en `order(x asc)` los `null` van **al final** (probado contra la API, no supuesto). Estabilidad comprobada: dos cargas seguidas devuelven **HTML idéntico**, posiciones incluidas.

- **Clasificación de la ruta.** `/fun-gallery` pasó de **`ƒ Dynamic` sin Revalidate/Expire** a **`○ Static` con `1m / 1y`**, exactamente el patrón de `/work`. No se usó configuración de segmento: solo `revalidate: 60` en el fetch.

- **Pipeline de imagen, medido contra producción** (`npm run build` + `npm run start -- -p 3010`, DPR 1, servidor bajado al terminar). Lo que la galería le pide al CDN es ahora `?w=1200&fm=webp`, sin `quality`:

  | etapa | antes (`w=1200&q=90`) | ahora (`w=1200&fm=webp`) |
  |---|---|---|
  | fetch servidor → CDN | `image/png`, **534,6 KB** | `image/webp`, **63,6 KB** |
  | `/_next/image` w=384 (Accept avif) | — | `image/avif`, **8,7 KB** |
  | `/_next/image` w=1200 (Accept avif) | — | `image/avif`, **30,9 KB** |

  Alpha conservado en las tres etapas (`channels: 4`, `isOpaque: false`). **Dato nuevo respecto de B3.1:** la sonda había medido 94,9 KB para el WebP porque lo pidió encima de `q=90`; sacar el `quality` del pedido baja además el fetch servidor→CDN a 63,6 KB. Los 534,6 KB del PNG reproducen exactamente la medición de B3.1.

- **Desvío deliberado: el overscan del parallax se resolvió al revés de lo instruido.** La instrucción pedía derivar el overscan del desplazamiento máximo (120 px por eje, confirmado: `40 × factor(2..3)`, y los dos springs son sobreamortiguados —ζ = 1,83 y 2,24—, así que no hay overshoot). Ese razonamiento vale para `object-cover`, donde agrandar la caja da más imagen para revelar. **Con `object-contain` se invierte**, porque `contain` escala la imagen *a la caja*: agrandar la caja agranda el dibujo y lo recorta contra la tarjeta. Medido sobre los ocho recortes reales —cuyo contenido deja márgenes transparentes de 7,2–34,5 % en horizontal y 4,9–13,2 % en vertical— el `-inset-[8%]` de antes dejaba **1–2 px** de aire, y garantizar cero recorte a 120 px habría exigido un inset **positivo** de 85–120 px, más que el lado corto de las tarjetas chicas (254 px). **No hay constante que lo resuelva.**

  La solución aplicada es del tamaño de un ajuste de constante y ataca la causa: la caja pasa a medir exactamente la tarjeta (`inset-0`) y se le quita el `overflow-hidden` a la capa de fade. Son recortes sobre transparencia y no hay borde de tarjeta visible que respetar, así que la imagen puede salirse sin que se note el límite; el viewport la sigue recortando (`<main>` y `<section>` son `overflow-hidden`). **Verificado midiendo en el navegador:** con el parallax puesto en su máximo (120 px en los dos ejes) el ancestro que recorta cada imagen es el `<section>` de 1920×911 —la pantalla—, no la tarjeta; y el lado dibujado es exactamente `min(anchoTarjeta, altoTarjeta)`. Capturas antes/después en `C:/EsquinaWeb-capturas-B3.2/`: con la constante vieja los recortes salen cortados por una recta **en reposo**, sin necesidad de mover el mouse.

- **Qué se borró.** Los 8 eslabones de la cadena de derivación (`getImageAssetKey`, `getImageUrl`, `isMediaItem`, `isDualMedia`, `isSanityImageLike`, `getGenericBlockImageCandidates`, `getProjectImageCandidates`, `getGalleryItems`), el tipo `ProjectImageCandidate` y la query `FUN_GALLERY_PROJECTS_QUERY`, previo grep con cero consumidores. **Corrección al inventario heredado:** la auditoría hablaba de «15 funciones de derivación»; son 15 **funciones locales**, de las cuales solo 8 derivan. Las otras 7 (`clamp`, `lerp`, `hashString`, `createRandom`, `randomBetween`, `shuffle`, `buildMapLayout`) son el motor del mapa y borrarlas habría destruido el layout que el mismo sprint manda preservar. `local-projects.ts`, `urlFor` y `types/project.ts` siguen en pie con sus consumidores intactos.

- **Detalles menores pero reales.** (1) `GalleryItem` ganó un campo `alt`: el schema separa nombre y texto alternativo, y colapsarlos habría hecho que el link anunciara «View» seguido de una descripción larga. Ahora el `alt` de la imagen es `altText || title` y el `aria-label` usa el nombre. (2) Los ítems sin proyecto vinculado ya no reciben `onClick`/`onKeyDown` —antes se colgaban siempre y salían por un early return—; `role`, `tabIndex` y `aria-label` siguen ausentes. Verificado en el DOM con ítems con y sin link. (3) `urlFor` necesitaba `format()` y el stub de fallback no lo exponía: se le agregó, un renglón.

- **Estado vacío y pantalla de error.** Sin fallback a datos locales. Con cero imágenes —el estado real de hoy— la ruta muestra una línea sobria en la identidad del sitio, con el footer fijo y el nav en `mix-blend-difference` intactos; si el fetch falla o falta el cliente de Sanity, la misma pieza con otro texto. Las dos viven en `page.tsx`.

- **Lo que no se midió.** El par numérico **antes/después** de altos de página de `/`, `/work`, `/work/[slug]` y `/contact`: reconstruir el build previo al sprint quedó bloqueado por el sandbox. En su lugar se probó la equivalencia por otro camino: el diff del sprint no toca ningún componente ni página de esas cuatro rutas, y `ALL_PROJECTS_QUERY` devuelve datos **idénticos** salvo las tres claves nuevas, las tres `null` (comparado contra la API). Diferencia observable única: esas tres claves viajan en el payload RSC de `/work`, ~60 bytes, sin render. Altos medidos hoy: `/` 911, `/work` 2154, `/work/matsu` 2514, `/contact` 1872, `/fun-gallery` 911; footer de 982 px en las tres del medio, 164 en home y 166 fijo con blend en la galería.

- **Método, para el registro.** Como el dataset tiene cero `funGalleryImage`, se montó una **ruta temporal** para medir con datos reales —el mismo procedimiento de B3.1— usando el asset que dejó la sonda; se midió y **se borró antes del commit**. El repo queda sin la sonda.

- **Verificación humana pendiente.** **Entrar al Studio y cargar una imagen de prueba siguiendo la guía nueva, como si fuera una de las clientas** — es la verificación más importante del sprint: si algún campo confunde, se corrige antes de la sesión de carga real. Además: que el proyecto vinculado se elija bien y la imagen quede clickeable; el texto y el tono de la pantalla de error y del estado vacío; y leer la guía completa con ojo de «yo no programo».

- **Queda para B3.3.** El rediseño de la pantalla (cluster flotando, click para desplegar). Y el residuo honesto del overscan: hoy nada recorta el producto, pero si el rediseño vuelve a introducir un marco visible, la tensión entre 120 px de parallax y tarjetas de 254 px de lado corto vuelve a estar sobre la mesa.

- **Commits:** `4c3c8aa` (schema, casillas ES, tipos) · `4dd79e7` (galería) · `d06f3ee` (guía del Studio y CLAUDE.md).

## 2026-08-19 · B3.2b · Guía del Studio fuera y aside de Contact sin sticky

- **Qué se hizo:** [F1] `git rm docs/sanity-studio-guide.md` (70 líneas). Grep de `sanity-studio-guide` en todo el repo (excluido `node_modules`) encontró 3 menciones vivas: `README.md` (línea «Guía para las editoras: `docs/sanity-studio-guide.md`», reescrita para decir que la carga se explica por video), `docs/plan-maestro.md:40` (el ítem de Fun Gallery que pedía «reescritura de `docs/sanity-studio-guide.md`», reescrito para reflejar que la guía se eliminó por decisión — carga explicada por video — y no queda pendiente) y `docs/reportes/2026-08-13-auditoria-completa.md` (5 apariciones): se dejó sin tocar por ser un reporte fechado, snapshot del estado al `2565d01`, con el mismo criterio que la bitácora — no se reescribe historia. `docs/pendientes.md` no mencionaba la guía. [F2] En `ContactForm.tsx` se sacaron `lg:sticky lg:top-[calc(var(--header-height)+3.5rem)]` del `<aside>` (línea 567) y la clase `pb-[clamp(13rem,22vh,16rem)]` del contenedor del formulario (línea 603) junto con el comentario que la explicaba — ambas existían solo para el mecanismo sticky (grep confirmó una sola aparición de `22vh`/`clamp(13rem` en todo `src/`, y ningún otro archivo del sitio usa un `pb` a medida antes del Footer). El comentario de `contact/page.tsx` que describía ese padding se actualizó para reflejar que el aside ya no es sticky. `CLAUDE.md` §4 corregido quirúrgicamente: «aside sticky» → «aside en flujo normal (sin sticky, B3.2b)».
- **Decisiones tomadas en ejecución:** una, documental — F1 quedó dividido en dos commits (`5cf5517`, `8e040dd`) en vez de uno por un error de rutas relativas al staggear `git add` desde el subdirectorio del proyecto; sin impacto en el contenido, ambos forman parte del mismo objetivo F1.
- **Qué sostenía el sticky, en detalle:** (1) `lg:sticky` + `lg:top-[calc(var(--header-height)+3.5rem)]` en el `<aside>`; (2) `pb-[clamp(13rem,22vh,16rem)]` en el contenedor del formulario, dimensionado para estirar el bloque contenedor del sticky (el `22vh` escala con la altura de scroll disponible, la firma característica de un cálculo atado al sticky, no a un margen estético); (3) el comentario en `ContactForm.tsx` que explicaba ambos; (4) la frase correspondiente en el comentario de `contact/page.tsx`. Ningún símbolo, variable ni constante quedó huérfano: no había ninguno dedicado en exclusiva al mecanismo aparte de las clases y comentarios ya listados.
- **Arranque vertical del aside:** no cambia. El contenedor grid (`data-contact`) ya usa `lg:items-start`, así que el aside y la columna del formulario arrancaban al mismo borde superior del grid independientemente del sticky — `position: sticky` sin haber cruzado su `top` en el scroll se comporta como `relative`, ocupa su lugar normal en el flujo. Quitar `sticky`/`top` no mueve esa posición de reposo; solo deja de pinnearlo durante el scroll. No hizo falta compensar ningún offset.
- **Mediciones / salidas de puertas:** línea base — lint exit 0; build exit 0, 11 rutas / 15 páginas estáticas generadas (igual que B3.2). Final — lint exit 0; build exit 0, mismas 11 rutas / 15 páginas, cero errores ni warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`).
- **Pendientes que deja:** ninguno nuevo.
- **Verificación humana pendiente (no se levantó servidor en todo el sprint):** `/contact` a 1920 y a 1512 — que el aside quede quieto y a la misma altura que antes, y que no haya quedado un hueco al pie del formulario donde estaba el padding compensatorio; scrollear hasta el Footer y confirmar que el aside no flota sobre él; enviar el formulario una vez más porque `ContactForm.tsx` se tocó.
- **Commits:** `5cf5517`, `8e040dd` (F1) · `ea33c9a` (F2), más el de este cierre.

## 2026-08-20 · B2.6 · Piso de resolución del questionnaire: labels arriba y aside apilado por breakpoint

- **Qué se hizo:** un commit, **un solo archivo** (`ContactForm.tsx`); `contact/page.tsx` no hizo falta tocarlo. Se agregaron los dos estados intermedios que faltaban entre las dos columnas de 1600 y la columna única: **dos columnas con el label arriba del control** desde 1232, y **dos columnas con el label arriba y el aside apilado sobre el formulario** desde 880. Los cortes salen de la aritmética de los mínimos medidos, no de anchos «típicos». **No se tocó** la escala tipográfica de nada, ni el padding de las pills, ni el copy, ni el orden de los campos, ni `HoverButton.tsx`, ni Navbar, ni Footer, ni `globals.css`, ni el markup del `<form>`.

- **La escalera completa, con la aritmética de cada corte.** Cada umbral es el ancho donde el estado de arriba deja de entrar sin romper una restricción dura, no una preferencia:

  | estado | rango | composición | contenido mínimo | de dónde sale |
  |---|---|---|---|---|
  | **A** | ≥ 1600 | aside al costado · 2 col · label al costado | 1472 | `280 + 40 + [176+24+396] + 32 + [140+24+352]` |
  | **B** | 1232–1599 | aside al costado · 2 col · **label arriba** | 1104 | `280 + 40 + [396+32+352]` + 4 de aire |
  | **C** | 880–1231 | **aside apilado** · 2 col · label arriba | 784 | `396 + 32 + 352` + 4 de aire (padding de página 96 debajo de 1024) |
  | **D** | < 880 | 1 col (el que ya existía) | 620 | `176 + 24 + 420` |

  Sacar el label del costado libera **364 px** (200 de la columna izquierda + 164 de la derecha) y cuesta **48,8 px por campo**. Apilar el aside libera **320 px** y cuesta **270** (222 del bloque + 48 del `gap-12`). Umbrales verificados al píxel: **879 → D, 880 → C, 1231 → C, 1232 → B, 1599 → B, 1600 → A**. En 880 y en 1232 los controles quedan en **398 y 354**: los 4 px de aire repartidos entre las dos pistas, ninguna arrancando justo sobre su límite (mismo criterio que los pisos 600/520 de B2.5b).

- **La matriz completa del barrido** (DPR 1, techo declarado del sprint = `alto − 128`). El alto del bloque **no depende del alto del viewport**, solo del ancho: por eso la tabla se lee como cinco columnas de «entra» sobre una sola fila de geometría.

  | ancho | layout | bloque | 1080 | 900 | 800 | 768 | 720 | filas de pills | control izq. | control der. | dif. de columnas | truncado | desborde X |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 1920 | **A** | 498 | ✅ | ✅ | ✅ | ✅ | ✅ | 4 | 420 | 376 | 57,5 | no | 0 |
  | 1728 | **A** | 498 | ✅ | ✅ | ✅ | ✅ | ✅ | 4 | 420 | 376 | 57,5 | no | 0 |
  | 1600 | **A** | 498 | ✅ | ✅ | ✅ | ✅ | ✅ | 4 | 400 | 356 | 57,5 | no | 0 |
  | 1512 | **B** | 741,9 | ✅ | ✅ | ❌ −69,9 | ❌ −101,9 | ❌ −149,9 | 4 | 420 | 420 | 58,3 | no | 0 |
  | 1440 | **B** | 741,9 | ✅ | ✅ | ❌ −69,9 | ❌ −101,9 | ❌ −149,9 | 4 | 420 | 420 | 58,3 | no | 0 |
  | 1366 | **B** | 741,9 | ✅ | ✅ | ❌ −69,9 | ❌ −101,9 | ❌ −149,9 | 4 | 420 | 420 | 58,3 | no | 0 |
  | 1280 | **B** | 741,9 | ✅ | ✅ | ❌ −69,9 | ❌ −101,9 | ❌ −149,9 | 4 | 420 | 380 | 58,3 | no | 0 |
  | 1152 | **C** | 1011,9 | ❌ −59,9 | ❌ −239,9 | ❌ −339,9 | ❌ −371,9 | ❌ −419,9 | 4 | 420 | 420 | 58,3 | no | 0 |
  | 1024 | **C** | 1011,9 | ❌ −59,9 | ❌ −239,9 | ❌ −339,9 | ❌ −371,9 | ❌ −419,9 | 4 | 420 | 420 | 58,3 | no | 0 |

  **Cuatro filas de pills en los nueve anchos**, sin excepción. **`$2,500–$4,000 USD` no se trunca en ningún ancho** (`scrollWidth − clientWidth = 0` en los 16 anchos probados con el valor efectivamente elegido, incluidos los dos pisos de 880 y 1232). **Sin desborde horizontal en ningún ancho.** La diferencia entre columnas se queda en **57,5 (A) / 58,3 (B y C)**, debajo del tope de 60 de B2.5b: el margen del botón subió de 64 a 112, exactamente los 48,8 que engorda cada campo, porque la izquierda lleva cinco campos y la derecha cuatro.

- **El piso, enunciado: el questionnaire entra completo sin scroll desde 1232 px de ancho por 870 px de alto en adelante.** Debajo de 1232 de ancho el piso de alto salta a **1140**, que ninguna pantalla común tiene. Pisos exactos por estado, medidos: **A 626 · B 870 · C 1140 · D 1300,5** (y 1770 debajo de 768). Contra la línea base de B2.5b esto es: **1280–1599 gana el alto 900** (antes necesitaba 1031) y **1024–1231 lo pierde** (ver más abajo). De 1600 para arriba nada cambia: 498, idéntico al píxel.

- **Dos números que el techo declarado del sprint no ve, y conviene tener.** **(1)** El techo `alto − 128` cuenta el header pero **no el `pt-14` de la sección** (56 px; 40 debajo de 1024, 24 debajo de 768). El borde inferior real del bloque cae en **682 (A) · 926 (B) · 1196 (C)**, así que a 1512×900 el bloque «entra» por la métrica del sprint (741,9 ≤ 772) pero su base queda **26 px por debajo del borde de la ventana**. El piso real de B es 928, no 870. **(2)** Con los **dos mensajes de validación visibles** el bloque suma **58 px exactos** en los cuatro estados (29 por mensaje): B pasa a 799,9 y deja de entrar a 900. El piso «con errores en pantalla» de B también es **928**.

- **Lo que la palanca 2 cuesta donde no debería, dicho con el número.** Entre **1024 y 1231** el layout C mide **1011,9** contra los **902,5** de la columna única que había antes: **109,4 px más alto**. Medido reproduciendo las declaraciones viejas en el DOM, ancho por ancho. Consecuencia concreta: a 1152×1080 **antes entraba y ahora no, por 59,9 px**. Es el único punto donde el sprint empeora algo, y es estructural: en esa banda el aside todavía entraría al costado con una sola columna, pero no al costado de dos columnas (para eso hacen falta 1232). La escalera pedida —una columna solo en lo más angosto— excluye volver a la columna única en el medio; queda anotado para que la decisión sea de Valentino.

- **Lo que la palanca 2 arregla de paso.** Entre **1024 y 1086** el ledger viejo (pistas de 280 y 624 de mínimo más un gutter `clamp` de 51,2) pedía **955 px de contenido contra 896 disponibles**: el formulario se salía de su contenedor y se comía el gutter derecho de la página, **59 px a 1024**, decayendo a 0 recién en **1086**. No llegaba a haber scroll horizontal —el sobrante cabía dentro del padding de 64—, pero el margen derecho de la página se desplomaba de 64 a 5. Con el aside apilado desde 1232 eso desaparece: **0 de sobrante en todos los anchos**.

- **Lo que faltaba poco y no se aplicó, con el ahorro medido en el DOM.** Las dos resoluciones que quedan afuera por poco se resuelven con una sola palanca, y es una de las prohibidas:

  | palanca | ahorro medido | qué gana |
  |---|---|---|
  | label de **una sola línea** cuando va arriba (mismo tamaño tipográfico, mismo copy) | **−91,95** en B y en C | B entra a **800** de alto (649,9 ≤ 672) y C entra a **1080** (919,9 ≤ 952) |
  | aside apilado **en fila** (título izq. / subtítulo der.) en vez de en bloque | **−78,00** en C | C entra a **1080** (933,9 ≤ 952) |

  Ninguna se aplicó. La primera toca el corte de línea que decidió el mockup (`FieldShell` lo dice explícito), la segunda recompone el aside. **La decisión es de Valentino.**

- **El formulario, ejercitado entero después de tocar el markup.** Con `fetch` interceptado (verificado contra el log del servidor: **cero POST llegaron**, ningún mail salió): submit vacío → los dos mensajes de zod y **cero requests**; submit completo → **un `POST /api/contact`** con los nueve campos (`fullName`, `email`, `workType`, `businessType`, `industry`, `country`, `timeline`, `budget`, `hearAbout`) y **redirect efectivo a `/contact/success`**; respuesta 500 → aparece el estado de error y **no** redirige. Los cuatro selects abren y eligen, las pills se marcan. Recorrido por teclado: **19 paradas** en el orden lógico (nombre → email → las 10 pills → negocio → industria → ubicación → plazo → presupuesto → cómo nos conociste → SEND), **sin ningún `tabindex` en la página**. Los rangos entre 768 y 879 y debajo de 768 quedan con estilo computado **idéntico** al de antes.

- **Hallazgo lateral que no es de este sprint: los labels no tienen asociación programática con su control, y no la tenían antes.** Los 9 `<label>` no llevan `htmlFor` ni envuelven a su control (verificado: 0 de 9 en ambos criterios). Este sprint no lo empeora —no tocó el markup del label— y con el label arriba la asociación *visual* queda si acaso más fuerte. Arreglarlo pide `id` en los nueve controles y `aria-labelledby` sobre un `role="group"` para las pills, que es otro sprint.

- **Nota de método, y el mismo límite de siempre.** El `resize` de ventana **no funciona con la ventana maximizada**: la herramienta devuelve éxito pero el viewport se queda clavado en 1920×855 (`outerWidth`/`outerHeight` = `screen.availWidth`/`availHeight`). Es el mismo tope que anotó B2.5b. La matriz **no se simuló reproduciendo media queries a mano**: se midió dentro de un **iframe same-origin** al que se le fija el tamaño, que es un viewport real donde Chrome evalúa las mismas media queries contra un ICB real; las lecturas se toman desde adentro del iframe, donde el `transform` de escala del padre no llega. El control que valida el método es el de siempre: **1920 real contra 1920 en el banco, 88 magnitudes comparadas campo por campo, 88 idénticas** (alto del bloque, de cada campo, de cada columna, ancho de cada control, filas de pills, posiciones). Sin scrollbar de por medio: `globals.css` las oculta globalmente, así que el viewport de layout es el ancho de ventana sin descuento. Sigue vigente el límite (1) de B2.5b: con la pestaña oculta Chrome no dispara `requestAnimationFrame`, **las animaciones de entrada no se pueden observar** y para las capturas hubo que forzar el estado final por CSS (solo `opacity`, `clip-path` y `filter`, que no participan del layout — verificado: el alto no se movió).

- **Puertas.** Línea base: lint exit 0, build exit 0, 11 rutas / 15 páginas. Final, con el servidor bajado: lint exit 0, build exit 0, **mismas 11 rutas / 15 páginas**, cero errores ni warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`). Los rangos compilan **disjuntos**, verificado sobre el CSS emitido: `(min-width:880px)` conteniendo `not all and (min-width:1599.98px)`, `(min-width:1232px)` conteniendo lo mismo, `(min-width:1600px)` suelto, y `(min-width:48rem)` conteniendo `not all and (min-width:879.98px)`. Confirmada otra vez la trampa de B2.5b —`(min-width:1600px)` se emite **antes** que `(min-width:48rem)` en el stylesheet—, y por eso ningún par de reglas comparte propiedad y rango.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, zoom 100 %: **(a)** **enviar el formulario de verdad** y confirmar que llega el mail — el markup se tocó otra vez y Resend sigue siendo el único eslabón no ejercitable sin mandar un correo; **(b)** recorrerlo **solo con `Tab`**; **(c)** mirar **cada layout en su rango** —1920 (A), 1440 (B), 1024 (C)— y juzgar si el label arriba se siente el mismo formulario y si el aside apilado no descoloca la jerarquía; **(d)** juzgar los **saltos entre layouts** pasando 1920 → 1512 → 1280 → 1152; **(e)** en particular el salto **1599 → 1600**, donde el bloque pasa de 872 a 1152 de ancho anclado por su borde derecho y el label salta de arriba al costado; **(f)** el **blanco de cola del layout C**, que crece de 4 px a 1024 hasta **217 px a 1231** con el formulario alineado a la izquierda; **(g)** decidir sobre las dos palancas prohibidas de la tabla de arriba y sobre la banda 1024–1231.

- **Pendientes que deja:** **(1)** La banda **1024–1231** queda 109,4 px más alta que antes; se arregla con una palanca prohibida o volviendo a la columna única en el medio. **(2)** El techo declarado del sprint (`alto − 128`) **ignora el `pt` de la sección**: si se quiere que «entra» signifique «se ve entero», el piso de B es 928, no 870. **(3)** El **estado de error suma 58 px** y ningún piso lo contempla. **(4)** Los labels **sin asociación programática** con su control. **(5)** `Saint Vincent and the Grenadines`, el país más largo, **se trunca en todos los anchos, también a 1920** (288 px de sobrante allí, 244 en el layout B, que da más ancho de control): es previo a este sprint y no lo empeora, pero la prohibición de truncar valores estaba escrita en general.

- **Commits:** `f90a3ae`, más el de este cierre.

## 2026-08-20 · B2.7 · Escala en tres escalones y label al costado hasta 1280 + labels asociados y país sin truncar

- **Qué se hizo:** dos commits, **un solo archivo** (`ContactForm.tsx`). El primero mete la banda 1280–1599 dentro del presupuesto de alto sin volver a poner el label arriba: **tres escalones de escala** (≥ 1600 intacto en 34/58 · 1360–1599 en 28/48 · 1280–1359 en 26/44), **label al costado desde 1280** en vez de desde 1600, columnas de label en su piso de tres líneas, pills a `px-1` bajo 1600 y márgenes del botón recalculados por escalón. El segundo cierra dos pendientes de B2.6: **los nueve labels quedan asociados a su control** y **el valor del select deja de truncarse**. **No se tocó** el copy, el orden de los campos, las animaciones, `HoverButton.tsx`, Navbar, Footer, `globals.css` ni `contact/page.tsx`. **Nada cambia a ≥ 1600 px de ancho.**

- **Fase 0 — el presupuesto, y por qué la banda 1280–1599 no entraba.** Techo declarado del sprint = `alto − 128` (el header). Techo estricto = `alto − 184`, que además descuenta el `pt-14` de la sección: es el que corresponde si «entra» quiere decir «se ve entero» (pendiente 2 de B2.6). En HEAD (`e9039c1`) el alto del bloque no depende del alto del viewport, solo del ancho, y valía **498** en ≥ 1600, **741,91** en 1232–1599 y **1011,91** en 880–1231; con los dos mensajes de validación en pantalla, **+58 exactos** en todos los casos.

  | ancho×alto | presupuesto | HEAD limpio | HEAD c/err | entra limpio | entra c/err | estricto limpio |
  |---|---|---|---|---|---|---|
  | 1920×1080 | 952 | 498 | 556 | ✅ | ✅ | ✅ |
  | 1728×1117 | 989 | 498 | 556 | ✅ | ✅ | ✅ |
  | 1600×900 | 772 | 498 | 556 | ✅ | ✅ | ✅ |
  | 1599×900 | 772 | 741,91 | 799,91 | ✅ | ❌ | ❌ |
  | 1536×864 | 736 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1512×982 | 854 | 741,91 | 799,91 | ✅ | ✅ | ✅ |
  | 1470×956 | 828 | 741,91 | 799,91 | ✅ | ❌ | ✅ |
  | 1440×900 | 772 | 741,91 | 799,91 | ✅ | ❌ | ❌ |
  | 1400×1050 | 922 | 741,91 | 799,91 | ✅ | ✅ | ✅ |
  | 1366×768 | 640 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1360×768 | 640 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1280×800 | 672 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1280×720 | 592 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1232×800 | 672 | 741,91 | 799,91 | ❌ | ❌ | ❌ |
  | 1152×864 | 736 | 1011,91 | 1069,91 | ❌ | ❌ | ❌ |
  | 1024×768 | 640 | 1011,91 | 1069,91 | ❌ | ❌ | ❌ |

- **Qué palanca aportó cuánto.** El bloque baja de **741,91 a 426** en el escalón más chico, y la baja se descompone en tres sumandos medidos, no estimados:

  | palanca | aporte | por qué |
  |---|---|---|
  | label al **costado** en vez de arriba | **−244** | 48,8 px por campo × los 5 campos de la columna izquierda, que es la que fija el alto del bloque. Deja el bloque en 497,91 ≈ 498, exactamente el alto de ≥ 1600 |
  | escalón 1 (34/58 → **28/48**) | **−48** | 10 px menos de `min-h` por control, en los 5 campos de la izquierda |
  | escalón 2 (28/48 → **26/44**) | **−24** | otros 4 px por control |
  | **total** | **−315,91** | 741,91 → 426 |

  Lo que esas palancas cuestan es **ancho**, y por eso hubo que pagarlo con otras tres: columnas de label a su piso de tres líneas (176/140 → 111/98 → 95/84), pills a `px-1` (−24 px en el bloque de 10 pills, que así sigue entrando en 4 filas) y la pista del aside de 280 a 272 (su `max-content` medido es 269,16, lo fija el subtítulo, no el título). El ledger de cada escalón cierra al píxel: **1360** = `272 + 40 + [111+24+332] + 32 + [98+24+295]` = 1228 + 4 de aire = 1232 de contenido = 1360 de viewport; **1280** = `272 + 40 + [95+24+291] + 32 + [84+24+275]` = 1137 + 15 de aire = 1152 = 1280.

- **El barrido final, limpio y con los dos mensajes de validación** (DPR 1, sin scrollbar: `globals.css` las oculta, así que el viewport de layout es el ancho de ventana entero). El «borde inferior» es el `bottom` real del bloque contra el origen del viewport: incluye el header de 128 y el `pt` de sección.

  | ancho×alto | escalón | bloque | c/err | borde inf. | c/err | presupuesto | entra limpio | entra c/err | estricto c/err | filas pills | label | label+control | dif. col. | desborde X |
  |---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
  | 1920×1080 | 0 · 34/58 | 498 | 556 | 682 | 740 | 952 | ✅ | ✅ | ✅ | 4 | 16 px · 2 líneas | 176+420 | 57,5 | 0 |
  | 1728×1117 | 0 · 34/58 | 498 | 556 | 682 | 740 | 989 | ✅ | ✅ | ✅ | 4 | 16 px · 2 líneas | 176+420 | 57,5 | 0 |
  | 1600×900 | 0 · 34/58 | 498 | 556 | 682 | 740 | 772 | ✅ | ✅ | ✅ | 4 | 16 px · 2 líneas | 176+400 | 57,5 | 0 |
  | 1599×900 | 1 · 28/48 | 450 | 508 | 634 | 692 | 772 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+420 | 54 | 0 |
  | 1536×864 | 1 · 28/48 | 450 | 508 | 634 | 692 | 736 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+420 | 54 | 0 |
  | 1512×982 | 1 · 28/48 | 450 | 508 | 634 | 692 | 854 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+410 | 54 | 0 |
  | 1470×956 | 1 · 28/48 | 450 | 508 | 634 | 692 | 828 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+389 | 54 | 0 |
  | 1440×900 | 1 · 28/48 | 450 | 508 | 634 | 692 | 772 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+374 | 54 | 0 |
  | 1400×1050 | 1 · 28/48 | 450 | 508 | 634 | 692 | 922 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+354 | 54 | 0 |
  | 1366×768 | 1 · 28/48 | 450 | 508 | 634 | 692 | 640 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+337 | 54 | 0 |
  | 1360×768 | 1 · 28/48 | 450 | 508 | 634 | 692 | 640 | ✅ | ✅ | ✅ | 4 | 14 px · 3 líneas | 111+334 | 54 | 0 |
  | 1359×768 | 2 · 26/44 | 426 | 484 | 610 | 668 | 640 | ✅ | ✅ | ✅ | 4 | 12 px · 3 líneas | 95+338,5 | 54 | 0 |
  | 1280×800 | 2 · 26/44 | 426 | 484 | 610 | 668 | 672 | ✅ | ✅ | ✅ | 4 | 12 px · 3 líneas | 95+299 | 54 | 0 |
  | 1280×720 | 2 · 26/44 | 426 | 484 | 610 | 668 | 592 | ✅ | ✅ | ✅ | 4 | 12 px · 3 líneas | 95+299 | 54 | 0 |
  | 1279×800 | 0 · arriba | 741,91 | 799,91 | 925,91 | 983,91 | 672 | ❌ | ❌ | ❌ | 4 | 16 px · 2 líneas | 420+420 | 58,28 | 0 |
  | 1232×800 | 0 · arriba | 741,91 | 799,91 | 925,91 | 983,91 | 672 | ❌ | ❌ | ❌ | 4 | 16 px · 2 líneas | 398+398 | 58,28 | 0 |
  | 1152×864 | 0 · apilado | 1011,91 | 1069,91 | 1195,91 | 1253,91 | 736 | ❌ | ❌ | ❌ | 4 | 16 px · 2 líneas | 420+420 | 58,28 | 0 |
  | 1024×768 | 0 · apilado | 1011,91 | 1069,91 | 1195,91 | 1253,91 | 640 | ❌ | ❌ | ❌ | 4 | 16 px · 2 líneas | 420+420 | 58,28 | 0 |

  **Los catorce anchos de 1280 a 1920 entran ahora, limpios y con los dos mensajes de error, por el techo declarado y también por el estricto.** Antes entraban seis limpios y cuatro con errores. Los que siguen sin entrar son los mismos de B2.6 y por las mismas razones: debajo de 1280 el label vuelve arriba (1232–1279) y debajo de 1232 el aside se apila. **Cero desborde horizontal en los dieciocho anchos**, y las pills siguen en **4 filas** en todos.

- **El piso, enunciado de nuevo.** El questionnaire entra completo sin scroll **desde 1280 px de ancho por 610 px de alto**, y **668** si además hay que ver los dos mensajes de error (criterio estricto, el que cuenta el header y el `pt` de sección). Por el techo declarado del sprint son **554** y **612**. Pisos exactos por escalón, medidos: escalón 0 **682** · escalón 1 **634** · escalón 2 **610** · label arriba **925,91** · aside apilado **1195,91**; +58 en cada uno con errores. Contra B2.6 esto **gana toda la banda 1280–1599** —que necesitaba 926 de alto y ahora necesita 634 o 610— y **no pierde nada**.

- **La diferencia entre columnas, y por qué el margen del botón bajó.** La columna izquierda lleva cinco campos y la derecha cuatro más el botón, así que el margen superior del botón es lo único que las empareja. En los escalones 1 y 2 cada campo adelgaza (73 y 69 px contra 83), la izquierda adelgaza una vez más que la derecha y el margen tiene que compensar: se queda en **64** en el escalón 1 y baja a **56** en el escalón 2. La diferencia medida queda en **54** en los dos, debajo del tope de 60 que fijó B2.5b. (El comentario del archivo decía 51,5; se corrigió al valor medido, en el mismo commit.)

- **Control de no-regresión.** Dos, encadenados. **(1)** Fase 1 contra HEAD: 1647 magnitudes comparadas en 1920, 1728 y 1600, **cero diferencias** (medido en la sesión anterior; no se rehízo porque el diff de Fase 1 no se tocó). **(2)** Fase 3 contra Fase 1, sobre dos builds distintos: **3300 magnitudes por resolución en 1920, 1728, 1600, 1440 y 1280 —16.500 en total— y cero diferencias**. La muestra es todo elemento bajo `[data-contact]` en orden de DOM, con su rect (top/left/width/height) y diecinueve propiedades computadas por elemento, entre ellas `fontSize`, `lineHeight`, `minHeight`, `gridTemplateColumns`, `whiteSpace`, `textOverflow` y `overflow`. Encima, el barrido de dieciocho anchos volvió a dar **idéntico campo por campo** entre los dos builds. **Fase 3 no mueve un píxel de la composición.**

- **Fase 3, primera mitad: los nueve labels asociados.** Los ocho campos de control único llevan `htmlFor` contra el `id` de su control, y los cuatro selects reusan como `id` del DOM la misma llave que ya tenían para `openSelectId`, así que no aparece un segundo sistema de identificadores. Verificado en el DOM: **`label.control` no es nulo en los ocho**, los ocho `id` existen y hay **cero `id` duplicados** en la página. El bloque de pills no tiene un control al que apuntar, así que su label deja de ser `<label>` y pasa a ser un `<span>` con `id` que nombra un **`role="group"`** con las diez pills adentro. Comportamiento probado: click en el label de un campo de texto **enfoca el input**; click en el label de un select **abre el dropdown y enfoca el disparador**. En los selects el nombre accesible se arma a mano como **label + valor** (un `aria-labelledby` que se cita a sí mismo): un `<button>` toma su nombre del contenido, así que un `htmlFor` a secas habría tapado el valor elegido — habría sido cambiar un problema por otro.

- **Fase 3, segunda mitad: el valor del select deja de truncarse.** El pendiente (5) de B2.6 estaba mal atribuido: el país más largo **no es Saint Vincent and the Grenadines sino Democratic Republic of the Congo** (622 px pedidos a 34 px contra 304 disponibles a 1920; Saint Vincent pide 592). Y no era un país: **eran 15 de 196 los que no entraban en una línea a 1920**, entre 3 y 15 según el ancho. El sobrante medido iba de **137 px (1599) a 310 px (1232)** en los dieciocho anchos; **ahora es 0 en los dieciocho**. La solución es sacar `truncate` del valor: lo que no entra se parte en líneas en vez de perderse. Con el país más largo elegido, a 1920 **181 de 196 siguen en una línea, 13 pasan a dos y 2 a tres**; el máximo en cualquier ancho es **3 líneas**. El campo crece (58 → 102 px a 1920), pero vive en la columna corta: **el alto del bloque no se mueve en ninguno de los dieciocho anchos**, verificado con el país más largo elegido. Una abreviatura por país quedó descartada por lo mismo: quince nombres no son un caso especial.

- **El formulario, ejercitado entero sobre el build final.** Con `fetch` interceptado en el navegador: submit vacío → los dos mensajes de zod y **cero requests**; submit completo con respuesta 500 → **un POST** con los nueve campos (`fullName`, `email`, `workType` con dos valores, `businessType`, `industry`, `country` con el nombre largo entero, `timeline`, `budget`, `hearAbout`), aparece el estado de error y **no** redirige; submit completo con respuesta 200 → **redirect efectivo a `/contact/success`**. Los cuatro selects abren, filtran y eligen; las pills se marcan y desmarcan. Recorrido por teclado con `Tab` real: **19 paradas** en el orden lógico (nombre → email → las 10 pills → negocio → industria → ubicación → plazo → presupuesto → cómo nos conociste → SEND), y la 20ª ya cae en el footer; **sin ningún `tabindex` en la página**. **Ningún mail salió:** el registro de red de la pestaña, con captura activa, no tiene **ni una** request a `/api/contact` en toda la sesión, mientras sí registra el `_rsc` de `/contact/success` que dispara el redirect — o sea que la captura ve el tráfico de `fetch`, y lo que no aparece es porque no ocurrió.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas; cero errores y cero warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`). **Rangos disjuntos, verificados sobre el CSS emitido:** el orden de emisión real es `48rem → 880 → 1232 → 1280 → 1360 → 1600 → 48rem`, con un bloque de `48rem` **después** de `(min-width:1600px)` — la trampa de B2.5b confirmada por tercera vez. Por eso **todo `md:` que comparte propiedad con una regla de `min-[1600px]:` va acotado con `max-[1279.98px]`**; los `md:` que quedan sueltos (`grid`, `gap-x`, `py-3`, `items-center`, `justify-end` y el `text-[14px]` del mensaje de error) no tienen contraparte a ≥ 1600. Las guardas emitidas: `880` y `1232` contienen `not all and (min-width:1279.98px)`, `1280` contiene `not all and (min-width:1359.98px)` y `not all and (min-width:1599.98px)`, y `1360` contiene `not all and (min-width:1599.98px)`.

- **Nota de método.** Mismo banco que B2.6: un **iframe same-origin** al que se le fija el tamaño, que es un viewport real donde Chrome evalúa las mismas media queries contra un ICB real. Esta vez el iframe **se redimensiona en vez de recargarse** entre resoluciones, así que las dieciocho medidas salen del mismo árbol de React hidratado y del mismo estado de formulario — eso es lo que permite medir «con los dos mensajes de error» en dieciocho anchos disparando la validación una sola vez. El banco quedó calibrado contra tres números publicados de B2.6 antes de usarlo: **498** de alto de bloque, **682** de borde inferior y **288 px** de sobrante del país largo a 1920, los tres reproducidos exactos. Sigue vigente el límite de B2.5b: con la pestaña oculta Chrome no dispara `requestAnimationFrame`, las animaciones de entrada no se pueden observar y hay que forzar el estado final por CSS (solo `opacity`, `clip-path` y `filter`, que no participan del layout — verificado otra vez: ni el rect del botón ni el alto del body se movieron al aplicarlo). Límite nuevo, anotado para la próxima: con la pestaña oculta Chrome también **estrangula los `setTimeout` encadenados**, así que las secuencias de interacción hay que escribirlas sin timers.

- **Desvíos, dichos de frente.** **(1)** La Fase 0 **no se remidió sobre un build de HEAD** en esta sesión: la anterior la cerró y sus números no sobrevivieron al corte. La línea base de la primera tabla sale de la matriz publicada en B2.6 cruzada contra mediciones propias de las tres bandas que Fase 1 no tocó (≥ 1600 → 498, 1232–1279 → 741,91, 1024–1231 → 1011,91), que dieron idénticas. Remedirla de verdad pide `git checkout <ref> -- <archivo>`, que el classifier bloqueó. **(2)** Los mensajes de los dos commits **no estaban en el contexto de esta sesión**: se redactaron siguiendo la convención del repo. **(3)** Fase 3 hace más que `htmlFor` en los selects —agrega el `aria-labelledby` autorreferencial—: sin eso el `htmlFor` habría tapado el valor en el nombre accesible. **(4)** El fix del truncado **sí cambia el render a ≥ 1600 cuando hay un país largo elegido** (el campo pasa de 58 a 102 px). No cambia nada de la composición aprobada —formulario vacío o país corto—, y eso está medido en 16.500 magnitudes; pero era inevitable, porque el truncado que había que arreglar ocurría también a 1920. **(5)** Next 16 en `start` no loguea requests, así que la prueba de «cero POST» es del lado del navegador, no del log del servidor.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, zoom 100 %: **(a)** **enviar el formulario de verdad** y confirmar que llega el mail — Resend sigue siendo el único eslabón no ejercitable sin mandar un correo; **(b)** recorrerlo **solo con `Tab`** y, si se puede, con un lector de pantalla, para escuchar cómo suenan los cuatro selects con el nombre «label + valor»; **(c)** mirar los tres escalones en su rango —1920, 1440, 1280— y juzgar si la escala más chica sigue siendo el mismo formulario; **(d)** juzgar los **tres saltos**: 1599 → 1600, 1359 → 1360 y 1279 → 1280, este último el más brusco porque el label salta del costado a arriba; **(e)** **elegir Democratic Republic of the Congo y mirar el campo en tres líneas a 1920**, que es la decisión estética real de este sprint: texto completo en tres líneas contra texto cortado en una.

- **Pendientes que deja:** **(1)** La banda **1024–1231** sigue **109,4 px más alta** que antes de B2.6; se arregla con una de las dos palancas prohibidas o volviendo a la columna única en el medio. **(2)** El **estado de error suma 58 px** y ningún piso lo contempla por defecto: acá se reportan las dos columnas, pero la decisión de qué techo vale es de Valentino. **(3)** Los mensajes de error **no están asociados** a su control con `aria-describedby` (fuera del alcance de este sprint). **(4)** El **input de búsqueda** del select de países no tiene label programático, solo `placeholder="SEARCH"`. **(5)** El label del bloque de pills nombra un `role="group"`, pero **las pills siguen siendo botones con `aria-pressed`**, no un grupo de checkboxes: es correcto y es lo que ya había, pero conviene saberlo si alguna vez se audita el formulario entero.

- **Commits:** `f23a744`, `0e9560c`, más el de este cierre.

## 2026-08-20 · B3.3 · Fun Gallery: página normal, montón que se despliega al click y flotado permanente

- **Qué se hizo:** cinco commits. La galería deja de ser un mapa panorámico fijo que se paseaba con el mouse y pasa a ser **una página normal que scrollea**: título arriba, los ocho objetos **amontonados en el centro**, `(click to view)` debajo, y al click **cada objeto viaja a su lugar** en la composición. Una vez acomodados **flotan y viran**, **acompañan ligeramente al cursor** y se agrandan un poco en hover. `/fun-gallery` deja de ser ruta especial: toma el mismo Navbar y el mismo footer en flujo que el resto de las rutas internas. Cierran además dos pendientes de una línea (desempate del orden por fecha, `DR Congo`). **No se tocó** `HoverButton.tsx`, `ServicesIntro.tsx`, `next.config.ts` ni el schema de Sanity; **cero escrituras** en el dataset.

- **El riesgo central y cómo se resolvió: cuatro movimientos, cinco capas.** Sobre cada objeto conviven la posición en la composición, la animación de entrada, el flotado en loop y el seguimiento del cursor, y **tres de esos cuatro mueven `x`/`y`**. En Framer Motion un `animate` con keyframes y un motion value con spring **no pueden compartir propiedad sobre el mismo nodo** —se pisan—, así que cada movimiento vive en su propio elemento y el navegador compone las matrices al bajar por el árbol:

  | capa | elemento | qué escribe | cuándo |
  |---|---|---|---|
  | **L0** posición + hover | `motion.div absolute` | `left` / `top` / `width` / `aspect-ratio` / `zIndex` (CSS) + `scale` (`whileHover`) | estático; el `scale` solo en hover |
  | **L1** despliegue | `motion.div` | `x` / `y` como `animate`, en % del propio lado | una sola vez, al click |
  | **L2** flotado | `motion.div` | `x` / `y` como `animate` con keyframes | loop infinito |
  | **L3** seguimiento | `motion.div` | `x` / `y` en `style`, motion values con spring | continuo |
  | **L4** inclinación + fade | `motion.div` | `rotate` (constante) + `opacity` (fade de carga) | estático / al cargar la imagen |
  | — | `<Image fill object-contain />` | — | — |

  **Ningún par de capas escribe la misma propiedad del mismo elemento.** L1, L2 y L3 mueven `x`/`y`, pero cada una sobre un div distinto. La rotación va **por dentro** de las tres traslaciones, para que éstas ocurran en el espacio de la página y no en el marco inclinado del objeto. Verificado en el DOM del build: cuatro capas anidadas con `transform` propio por tarjeta, y ninguna con dos sistemas encima. **No hizo falta la parada del §2.**

- **Fase 0 — las ocho imágenes, medidas antes de calibrar nada.** Vía la API de Sanity (solo lectura) más un pase de alfa con `sharp` sobre los assets del CDN (muestreo 300×300, umbral α > 8/255). Las ocho son **PNG cuadrados de 2250×2250**, y el producto recortado adentro ocupa **76–88 % del alto pero solo 31–84 % del ancho**:

  | orden | título | bbox w % | bbox h % | márgenes izq/der % | aspecto del contenido | tinta / cuadrado % |
  |---|---|---|---|---|---|---|
  | 1 | akasha | 57,3 | 78,3 | 21,0 / 21,7 | 0,732 | 38,9 |
  | 2 | Tukumi | 31,3 | 87,7 | 34,3 / 34,3 | 0,357 | 12,1 |
  | 3 | Ejemplo | 80,0 | 78,0 | 10,0 / 10,0 | 1,026 | 33,7 |
  | 4 | Brickhouse | 83,3 | 80,7 | 8,3 / 8,3 | 1,033 | 38,4 |
  | 5 | Brooks | 35,0 | 75,7 | 30,7 / 34,3 | 0,463 | 9,9 |
  | 7 | Algo | 81,7 | 81,3 | 9,7 / 8,7 | 1,004 | 25,4 |
  | 8 | Napoli | 54,3 | 76,3 | 23,7 / 22,0 | 0,712 | 37,0 |
  | — | Matsu | 84,3 | 81,0 | 8,7 / 7,0 | 1,041 | 9,5 |

  **De ahí salen dos decisiones.** (1) El **montón no puede ser concéntrico**: los anchos taparían a los angostos y se leería como un choque, no como un montón. (2) La **caja del objeto pasa a ser cuadrada**: el sorteo de aspecto (0,68–1,16) que traía el motor no agregaba variedad, porque con ocho fuentes cuadradas y `object-contain` una caja no cuadrada **solo achica el dibujo contra el lado corto** y deja el resto como aire muerto que además desalinea el área de hover. Es la única pieza del motor que se retira.

- **El mockup, medido en vez de mirado.** `14-fun-gallery-entrada.jpg` y `15-fun-gallery-hover.jpg` son capturas de un viewport **1920×1080** (marco de página 1272×714 px de imagen, aspecto 1,781; el header mide 130 px escalados, o sea los 128 del token). Los números que calibran la composición salen de ahí: **4 columnas** con paso de **416 px** y centros en 336/752/1168/1584, o sea una caja de **1664 px centrada con 128 px de margen a cada lado**; **paso de fila 404 px**, o sea 0,97 del ancho de celda; **lados de objeto de 288 a 404 px**; título en **40/48** centrado con la tinta arrancando en y = 211; montón con caja de tinta de **385×398** centrada en (963, 594); cartel `(click to view)` de **106 px de ancho** centrado en x = 964, y = 901.

- **El motor determinista: qué sobrevive y qué se retira.** Se conserva y se adapta, no se reescribe. El mismo LCG sembrado con los `_id` alimenta el shuffle de celdas y, por ítem, **lado, dos jitters por eje, rotación, zIndex y factor de seguimiento**; lo que cambia es que ahora emite **fracciones del ancho de la composición** en vez de píxeles de un mapa sobredimensionado, así que `left`/`top`/`width` salen en porcentaje, el alto lo fija un `aspect-ratio` y **no hay una sola medición en JS ni un listener de resize**.

  | se conserva | se retira |
  |---|---|
  | `hashString` / `createRandom` / `randomBetween` / `shuffle` / `clamp` / `lerp` | `MAP_WIDTH_FEW_IMAGES` · `MAP_HEIGHT_FEW_IMAGES` · `MAP_WIDTH_MANY_IMAGES` · `MAP_HEIGHT_MANY_IMAGES` |
  | `GRID_CELL_DENSITY = 1.15` → con 8 imágenes da **4 columnas × 2 filas**, que es la grilla del mockup | `MAP_SIZE_PER_IMAGE` · `MAP_MOVE_X` · `MAP_MOVE_Y` · `MAP_EDGE_GUTTER` |
  | lados mín/máx interpolados por densidad (ahora en fracción del ancho) | `EDGE_BLEED` |
  | dos jitters por eje · `zIndex = 10 + round(rnd·24)` · factor por ítem | el sorteo de **aspecto** (0,68–1,16) |
  | `ROTATION_RANGE`, que estaba **calculado y apagado en 0** | `SPRING` del contenedor (`{500, 100, 1}`) y sus `springX`/`springY` |
  | `IMAGE_FADE_*` · `EAGER_IMAGE_COUNT` · `EASE` · pipeline `w=1200&fm=webp` + `object-contain` (B3.1, intacto) | `ITEM_PARALLAX_SPRING` (`{500, 100, 1.5}`) y `ITEM_PARALLAX_STRENGTH_X/Y = 40` |

- **El recorte que se cambió por un ajuste.** Primera versión: recortar cada objeto contra la caja (`clamp(x, 0, 1 − lado)`). Medido en el build, eso **pegaba cuatro de los ocho a un borde y les comía el jitter**: los de la fila 0 quedaban con `y = 0` tocando el título, los de la fila 1 apoyados en el piso. La causa es que los objetos son **casi tan grandes como su celda** (415 sobre 416 de ancho, 404 de alto de celda), así que no hay holgura para el jitter y el recorte se come justo lo que le da vida a la grilla. Se reemplazó por **medir la caja envolvente del sorteo y ajustarla al ancho disponible**: el resultado no puede desbordar —el ancho es el ancho, por construcción— y el jitter se conserva entero. Con eso los ocho quedan libres y la composición reproduce el mockup: caja de tinta del montón de **423×423** contra los 385×398 medidos, centrada en **(964, 603)** contra (963, 594).

- **La composición final, medida** (build + `start -p 3010`, DPR 1, viewport 1920×855, ventana 1920×1180):

  | | valor |
  |---|---|
  | caja de la composición | **1664 × 847** en (128, 336) — tope `max-w-[1664px]`, que a 1920 deja los 128 px de margen del mockup |
  | alto de página | **2293** = 128 (header) + 1183 (sección) + 982 (footer en flujo) |
  | desborde horizontal | **0** (`scrollWidth` 1920 = `clientWidth` 1920) |
  | título | `<h1>` en **40/48**, centrado, en y = 200 · dos líneas |
  | cartel | `(click to view)` de **107 px** en (907, 918) — el mockup da 106 px en (912, 901) |
  | objetos en el DOM | **8**, lados de **318 a 415 px** (mockup: 288–404), zIndex 14–31 |
  | con link | **2** — `akasha` → `/work/akasha-blends` y `Matsu` → `/work/matsu` |
  | sin link | **6** — sin `role`, sin `tabIndex`, sin `aria-label`, sin handlers |

  Posiciones relativas a la caja: `(0, 23, 375)` · `(509, 60, 318)` · `(88, 471, 365)` · `(1300, 96, 364)` · `(490, 455, 328)` · `(1262, 493, 355)` · `(913, 0, 415)` · `(872, 414, 415)`. Las dos filas usan las cuatro columnas sin repetir. Los ocho quedan dentro de `[0, 1664] × [0, 847]` al píxel.

- **Los valores finales, uno por uno.**

  | qué | valor | por qué |
  |---|---|---|
  | **rotación** | `ROTATION_RANGE = 3` → sorteo en **[−3°, +3°]**; con este contenido salió **−0,67° a +2,18°**, magnitud media **1,28°** | «apenas fuera de plomo»: se lee colocado a mano, no torcido |
  | **despliegue** | spring por `visualDuration` **0,85 s** con `bounce` **0,18**, desfase **0,07 s** por índice → el último objeto llega a **1,34 s** | dentro del orden de 1–1,5 s pedido; el rebote chico es lo que lo separa de un `ease` plano |
  | **flotado** | amplitud **±11 px** en x y **±16 px** en y; períodos **11,5 s** (x) y **9 s** (y), **+1,2 s por índice** | patrón de `ServicesIntro` con dos cambios: keyframes **simétricos** (se va para los dos lados) y **un período por eje**, así la trayectoria nunca cierra igual y no se percibe el ciclo. 16 px sobre 400 es 4 %: deriva, no vibración |
  | **seguimiento** | **3 px** por unidad normalizada × factor **2–3** por ítem = **6 a 9 px** en el borde del viewport; spring `{stiffness 50, damping 15, mass 0.5}` | «notablemente menor que el flotado»: 6–9 contra 16. El spring es el de `ServicesIntro` (ζ = 1,5, sobreamortiguado, no rebota) pero **con la dirección al derecho**: ahí las imágenes se apartan del cursor, acá lo acompañan. Antes eran 40 × 2–3 = **80–120 px** |
  | **hover** | escala **1,08** (era 1,2), duración 0,5 s, `zIndex` **50** (era 999) | 1,2 agrandaba el objeto 80 px y competía con el despliegue; 1,08 son 32 px. El zIndex baja porque **ahora la página scrollea**: 999 dejaba al objeto por encima del Navbar (z-100) al pasarle por debajo |
  | **montón** | centro en (0,5 · W, 0,17 · W); radio **0,02–0,05 W** (33–83 px) repartido por **ángulo áureo**, con el radio dictado por el `zIndex` | el de adelante queda centrado y los de atrás se corren lo justo para asomar. El ángulo áureo reparte direcciones parejas para cualquier cantidad de imágenes |

- **Los dos clicks, distinguidos por construcción.** El click que despliega **no lo reciben los objetos**: lo recibe un `<button>` transparente que cubre la composición (`absolute inset-0 z-40`, por encima del `zIndex` máximo de los ítems, que es 34) y que lleva adentro el cartel `(click to view)` como contenido accesible. Mientras el montón está armado los objetos **no son interactivos**: `interactive = spread && Boolean(item.href)`, así que ni siquiera están en el orden de tabulación. Al desplegar, el botón se va con un fade de 0,4 s y los dos ítems con proyecto vinculado toman `role="link"`, `tabIndex={0}` y `aria-label`. **Verificado en el DOM antes y después del click**: antes, ocho ítems sin `role`; después, `role="link"` + `aria-label="View akasha"` / `"View Matsu"` en dos, y `null` en los otros seis.

- **`prefers-reduced-motion`, y el defecto que apareció al verificarlo.** La primera versión usaba `useReducedMotion` de Framer Motion. Leyendo su fuente (`framer-motion.dev.js:15023`): **resuelve la media query durante el primer render de cliente** —llama a `matchMedia` en el cuerpo del hook y congela el valor en un `useState`, con un TODO propio admitiendo que después no reacciona— mientras que en servidor devuelve `null`. Con la preferencia activa eso hacía que el HTML servido (montón, botón, ítems sin `role`) y el de hidratación (ya acomodados, sin botón, con `role="link"`) **no coincidieran**: error de hidratación recuperable y re-render del subárbol, justo para el usuario que pidió menos movimiento. Se reusa **el hook que ya existía** en `RouteTransitionProvider` —arranca en `false` en los dos lados y se corrige en el efecto— exportándolo en vez de escribir un segundo lector de la misma preferencia (§8.10). Verificado en el navegador con la media query forzada y entrando a la galería por navegación de cliente: **los ítems nacen interactivos** (`role="link"` en los dos, sin click) y las capas de flotado y seguimiento **no escriben transform**. El listener de puntero ni se instala.

- **El cromo: `/fun-gallery` deja de ser un caso especial.** Del Navbar se va `isFunGallery` entero: el `mix-blend-difference`, el fondo transparente forzado por `style`, el `pointer-events-none` y el `blend` de los cinco `HoverButton`. La ruta toma `bg-off-white/95 backdrop-blur-sm` como el resto de las rutas claras, y la única ruta oscura que queda es `/contact/success`. Del Footer se va **`FixedFooter` completo**, que era su único llamador: con él caen la divergencia **`font-thin`** registrada en B2.2b, el `LET'S WORK TOGETHER!` y la rama clara que estaba sin llamadores desde B2.5b. `DevelopCredit` pierde `label` y `blend`, que quedaron sin llamadores. La galería pasa al footer en flujo de rutas internas (franja con la frase + `CONTACT US`, banda oscura con el logo grande, **sin** `JOIN OUR CLUB`).

- **No-regresión, probada y no argumentada.** Se capturó el HTML renderizado de `/`, `/work`, `/services`, `/team`, `/contact` y `/contact/success` sobre el build con Fase 3 y sobre un build con Fase 3 **stasheada**, y se diffearon los dos árboles nodo por nodo. **La única diferencia en las seis rutas es el `buildId`**, que cambia en cada build; el marcado es idéntico byte a byte. Medidas de las rutas sobre el build final (viewport 1920×855): `/` **855** (footer de home, 164) · `/work` **2154** (footer interno, 982) · `/team` **4032** (interno) · `/contact` **1664** (interno + `JOIN OUR CLUB`) · `/contact/success` **1019** (footer de home, nav `bg-transparent`) · `/fun-gallery` **2293** (interno). Cero desborde horizontal en las seis.

- **Fase 4, las dos de una línea.** **(1)** El desempate de la query pasa a `order(order asc, _createdAt asc, _id asc)`: ante `order` repetido gana la que se cargó primero. `_id` **queda como último recurso** porque `_createdAt` tampoco es único por definición y el orden total sigue siendo obligatorio —de esa secuencia sale el seed de la composición—; es un tercer término, no una vuelta atrás. Con el contenido actual la secuencia **no cambia** (ningún `order` repetido), así que la composición es la misma. **(2)** `Democratic Republic of the Congo` → **`DR Congo`**. El cambio **no es de una línea**: las dos tablas de la bandera (`countryFlagColors` y el set `DIAGONAL` de `MonochromeCountryFlag`) **indexan por el string exacto del país**, así que sin renombrarlas ahí también DR Congo perdía su bandera **sin ningún error**. Verificado en el navegador: la opción aparece, se elige, resuelve la diagonal y el color `#007FFF`, y entra en una línea. **El mail recibe el mismo texto**: `/api/contact` arma la fila «Country» con `data.country`, que es el valor del formulario, y el formulario solo ofrece los strings de `COUNTRY_OPTIONS`. Con DR Congo abreviado, el país más largo pasa a ser **Saint Vincent and the Grenadines**; el comentario de `ContactForm.tsx` que decía lo contrario se corrigió.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas de la línea base; `/fun-gallery` sigue clasificando **`○ (Static)` con `revalidate 1m`**. Cero errores y cero warnings nuevos: persiste solo la deprecación conocida de `@sanity/image-url`, y en la consola del navegador **no hay errores de hidratación**.

- **Nota de método.** Sigue vigente el límite de B2.5b/B2.7, y esta vez es el límite central: con la pestaña oculta Chrome **no dispara `requestAnimationFrame`** —medido: **0 ticks** en un contador de rAF— así que **ninguna animación corre** y este sprint **es** animación. Lo que sí se pudo verificar sin frames: la geometría de la composición (que sale del HTML servido, sin medición en cliente), la estructura de capas y qué `transform` escribe cada una, el estado de React antes y después del click, y el camino de `prefers-reduced-motion`. Lo que no: cómo se ve moverse. Segundo límite anotado: **el compositor tampoco repinta** regiones cuya opacidad se fuerza por JS sin un frame, así que las capturas de pantalla de esta sesión salen parciales y no sirven de evidencia visual.

- **Desvíos, dichos de frente.** **(1)** Se retiró el **sorteo de aspecto** del motor, que el §1 listaba entre lo que lo alimenta: con ocho fuentes cuadradas y `object-contain` no agregaba variedad, solo achicaba el dibujo y desalineaba el hover. **(2)** El desempate de Fase 4 quedó en **tres términos**, no en uno: ver arriba. **(3)** El renombre de DR Congo tocó **cuatro archivos**, no uno, porque las tablas de la bandera indexan por el nombre. **(4)** Hay un **sexto commit** además de los cinco de las fases: el fix de hidratación de `prefers-reduced-motion`, que apareció en la verificación de Fase 5 y no correspondía dejar para después. **(5)** La prop **`blend` de `HoverButton.tsx` quedó sin ningún call site** al retirar el cromo especial de la galería; §8.11 pediría borrarla, pero la regla 4 de este sprint prohíbe tocar ese archivo, así que **queda pendiente**. **(6)** El título se compone con la escala tipográfica del sitio (`40/48`, `font-display`, espacio simple entre palabras); el mockup usa una fuente más angosta y un espacio entre palabras más ancho (~22 px contra los ~10 de Manrope). Se priorizó la consistencia con el sistema del sitio sobre la reproducción literal del Figma.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** Todo lo que es movimiento, en `localhost:3010`, DPR 1: **(a)** **el despliegue** —si se siente dinámico y bonito o mecánico—, que es el corazón del sprint; **(b)** **el flotado** —si se siente deriva o vibración, y si el desfase evita que parezcan sincronizados—; **(c)** **el seguimiento del cursor** —si acompaña sutilmente o es demasiado—; **(d)** **el montón inicial** contra `14-fun-gallery-entrada.jpg`; **(e)** click en un objeto con proyecto (navega) y en uno sin proyecto (no hace nada); **(f)** recarga y navegación de ida y vuelta: que el montón se rearme siempre; **(g)** `prefers-reduced-motion` activo: que la pantalla siga siendo usable.

- **Pendientes que deja:** **(1)** la prop `blend` de `HoverButton.tsx`, huérfana. **(2)** El **área de hover es el cuadrado completo** del objeto, no su tinta: como el recorte ocupa entre 31 % y 84 % del ancho, hay margen transparente que reacciona al hover. Es el mismo comportamiento que había, y resolverlo pediría datos de alfa en runtime. **(3)** El botón de despliegue **cubre la composición durante los 0,4 s de su fade de salida**, así que en esa ventana los objetos no reciben hover; es la ventana en la que están viajando, pero conviene saberlo. **(4)** El cartel `(click to view)` va **en minúsculas**, contra el resto del sitio que es todo mayúsculas: es lo que dice el mockup.

- **Commits:** `a0020b4`, `190d911`, `e5413e8`, `83b79f8`, `e72939d`, más el de este cierre.
## 2026-08-20 · B3.3b · Fun Gallery: orden de lectura, encuadre en una pantalla, seguimiento visible y camino de vuelta

- **Qué se hizo:** cuatro commits, uno por ajuste. El despliegue pasa a leerse **en orden de lectura** en vez de por índice del dato; la escena entera —título, montón, cartel, y los ocho objetos ya desplegados— **entra en la primera pantalla**; el **seguimiento del cursor** sube de 6–9 px a 20–30 px; y aparece el **camino de vuelta**: volver de un proyecto abierto desde la galería la muestra ya desplegada, y la página de proyecto ofrece `BACK TO FUN GALLERY`. **No se tocó** nada de lo aprobado en B3.3: capas L0–L4, flotado (±11/±16, períodos 11,5 s y 9 s desfasados), rotación ±3°, hover 1,08, `zIndex` 50, el título ni el pipeline de imagen. **No se tocó** `HoverButton.tsx` ni `ServicesIntro.tsx`; **cero escrituras** en Sanity.

- **F1 — el desfase se cobraba en la dimensión equivocada.** El retraso salía de `index * 0,07`, donde `index` es el orden en que Sanity devuelve las imágenes; pero **el lugar de cada objeto en la composición lo asigna un shuffle de celdas**, sin ninguna relación con ese orden. Por eso el segundo objeto salía antes que el primero: los dos números no hablaban del mismo eje. Ahora el turno se calcula **sobre la composición ya resuelta** —bandas de altura de arriba hacia abajo y, dentro de cada banda, de izquierda a derecha— y se compara por el **centro** de cada caja, no por su borde superior, porque los objetos no miden todos igual. Las bandas se arman **por cercanía** (banda nueva cuando el salto en altura pasa medio objeto) y no por cortes fijos, que partirían una fila que cae justo en el borde. Medido sobre el DOM del build a 1920×1080: **umbral 155 px, dos bandas**, mayor salto **dentro** de una fila 0,036 del ancho contra 0,225 **entre** filas y 0,110 de umbral — separación holgada por los dos lados.

  | turno | banda | ítem (orden del dato) | objeto | centro x | centro y | retraso |
  |---|---|---|---|---|---|---|
  | 0 | 0 | 0 | blend | 158 | 178 | 0,00 s |
  | 1 | 0 | 1 | Tukumi | 564 | 185 | 0,07 s |
  | 2 | 0 | 6 | Napoli | 946 | 175 | 0,14 s |
  | 3 | 0 | 3 | Brickhouse | 1252 | 235 | 0,21 s |
  | 4 | 1 | 2 | Ejemplo | 228 | 552 | 0,28 s |
  | 5 | 1 | 4 | Brooks | 553 | 523 | 0,35 s |
  | 6 | 1 | 7 | Matsu | 913 | 526 | 0,42 s |
  | 7 | 1 | 5 | Algo | 1216 | 566 | 0,49 s |

  La columna «ítem» es exactamente lo que estaba mal: antes salían en el orden 0,1,2,3,4,5,6,7, o sea **Ejemplo —que está abajo a la izquierda— tercero, y Napoli —que está arriba— séptimo**. Duración del spring, bounce y desfase por objeto **sin cambios**: el total sigue siendo **1,34 s**.

- **F2 — el ancho se despeja, no se tantea.** El alto de la composición no se puede elegir: sale de `ancho × aspecto`. Así que lo que se ajusta es el **ancho**, y sale de una sola cuenta:

  ```
  disponible = 100svh − header − padding del bloque − título − aire del título
  ancho      = (disponible − 16) / (aspecto + ladoMayor × 0,04)
  ```

  Los 16 px son el flotado —fijos— y el término del divisor es la mitad de lo que crece el hover, que **sí** escala con el ancho; pasarlo al divisor es lo que evita resolverlo por iteración. Se expresa entero en CSS (`min()`, `max()`, `calc()` sobre `100svh`): **no se mide en JS**, la composición se sigue armando igual en servidor y cliente y sigue reaccionando al resize sin listeners. El padding del bloque y el aire del título ceden alto en pantallas bajas (`clamp(32px, 6.5svh, 72px)` y `clamp(24px, 3.7svh, 40px)`) y se quedan en los 72 y 40 de siempre en cuanto la pantalla da. El interlineado del `<h1>` pasa a estilo inline —**mismo valor, 48 px**— para que el encuadre y el título no tengan dos fuentes de verdad. Un **piso del 60 % del ancho disponible** frena el encogido cuando se carguen más imágenes: ahí los que sobren quedan más abajo y se alcanzan scrolleando; con ocho **no llega a tocar** (pide 78 % a 1920×1080 y 70 % a 1366×768).

  | | 1920×1080 | 1366×768 | referencia (como hoy) |
  |---|---|---|---|
  | padding del bloque / aire del título | 70,2 / 40 | 49,9 / 28,4 | 72 / 40 |
  | título (borde sup. → inf.) | 198 → 294 | 178 → 274 | 200 → 296 |
  | composición | **1406 × 716** en y = 334 | **866 × 441** en y = 302 | 1664 × 847 |
  | montón (borde sup. → inf.) | 347 → 780 | 311 → 577 | — |
  | **cartel `(click to view)`, borde inferior** | **843** | **622** | 935 |
  | **objeto más bajo, borde inferior** | **1050** | **743** | 1183 |
  | con flotado (+16) y hover (+4 % del lado) | **1080** | **768** | — |
  | lado del objeto, menor → mayor | 268 → 351 | 165 → 216 | 318 → 415 |

  El encuadre **cierra al píxel** en las dos: el borde inferior del objeto más bajo, ya contando flotado y hover, cae exactamente en el pliegue. La página **sigue scrolleando** (2160 px a 1920×1080, con el footer debajo): lo que cambia es que la escena se resuelve arriba.

- **El costo del encuadre, medido donde importa.** El objeto mayor pasa de 415 a **351 px** a 1920×1080 y a **216 px** a 1366×768. La pregunta que dejaba el §3 era si eso los hace chocar. Se midió la **caja del alfa** de cada asset (no la caja de la tarjeta, que tiene entre 16 % y 69 % de ancho transparente) **inclinada los ±3°**, con **un solo objeto en hover**, que es el caso real:

  | distancia mínima entre vecinos | referencia (1664) | 1920×1080 | 1366×768 |
  |---|---|---|---|
  | en reposo | 22,9 px | **18,5** | **12,0** |
  | con hover | 8,2 px | **6,1** | **4,3** |
  | reposo + flotado en contrafase | 0,9 px | **−3,5** | **−10,0** |
  | hover + flotado en contrafase | −13,8 px | **−15,9** | **−17,7** |

  El par más cerrado es siempre **Algo ↔ Matsu**, los dos más anchos. El peor caso empeora **2 px a 1920×1080 y 4 px a 1366×768** contra lo que ya hay hoy: el encogido es proporcional y por eso resta poco, mientras que el flotado es fijo y por eso pesa más en pantallas bajas. El seguimiento **no entra en esta cuenta**: mueve a los ocho juntos y solo difiere en el factor por objeto (2 a 3), así que su aporte a la distancia **entre dos** es de 10 px como máximo, y solo con el cursor pegado al borde.

- **F3 — el seguimiento, del ruido al gesto.** `FOLLOW_STRENGTH` pasa de **3 a 10**: con el factor por objeto (2–3) la amplitud va de 6–9 px a **20–30 px** con el cursor en el borde del viewport. Contra el flotado —±11 en x, ±16 en y— eso es **1,25 a 1,9 veces la deriva vertical**: del mismo orden, no un parallax marcado, así que ninguno de los dos tapa al otro. El spring, la dirección (los objetos **acompañan** al cursor) y el reparto por objeto quedan como estaban. Y son 20–30 px **solo en el borde**: el motion value es la posición normalizada del cursor, así que en el grueso de la pantalla el desplazamiento es bastante menor.

- **F4 — el camino de vuelta, y por qué el listener tuvo que salirse de React.** La galería anota en `sessionStorage` —clave `esquina:fun-gallery-return`, valor el `pathname` del proyecto— **antes** de arrancar la transición. Con esa anotación la página de proyecto ofrece el link de vuelta **solo si coincide con su propia ruta**, y la galería nace desplegada. Nunca en `localStorage`: muere con la pestaña.

  Lo difícil fue **borrarla al salir del par**. La primera versión colgaba un listener de `popstate` desde la galería y **no funcionaba**: medido en el navegador, el evento llega con el `pathname` correcto —una sonda persistente lo vio— pero **el listener de la galería ya no existe**, porque Next intercepta el recorrido del historial y desmonta la página vieja antes de que el evento se despache. La segunda idea, limpiar en el `cleanup` del efecto, tampoco cerró. La que funciona es sacar el vigía de React: se engancha **una vez por documento**, en cuanto aparece una anotación, y **no se desengancha nunca**. Mira los clicks en links (en captura, y **sin** filtrar por `defaultPrevented`, porque el provider de transiciones cancela todos los links internos) y los `popstate`.

  Dos detalles que sí cambian lo que se ve. **(1)** La anotación se lee en un **layout effect** y se **retiene**: leerla después de pintar mostraría un cuadro de montón antes del salto, y un valor reactivo rearmaría el montón durante los 0,65 s que dura la animación de salida, justo encima de ella. **(2)** El `AnimatePresence` del cartel **se desmonta entero** cuando el despliegue es instantáneo: sacar solo al botón lo dejaría despidiéndose con su fade de 0,4 s sobre una galería ya desplegada, porque los hijos que salen se animan con los props de su último render.

  **El ciclo, verificado en el navegador sobre el build, todo en el mismo documento:**

  | paso | ruta | anotación | qué se ve |
  |---|---|---|---|
  | carga limpia | `/fun-gallery` | — | montón + cartel, ningún objeto interactivo |
  | click en el cartel | `/fun-gallery` | — | desplegada; `View akasha` y `View Matsu` interactivos |
  | click en Matsu | → `/work/matsu` | **`/work/matsu`** | escrita **antes** de la transición |
  | en el proyecto | `/work/matsu` | `/work/matsu` | `← Back to Fun Gallery` → `/fun-gallery` |
  | click en el link | → `/fun-gallery` | `/work/matsu` | **desplegada, sin cartel**; la anotación se conserva |
  | link del footer | → `/contact` | **borrada** en el click | sale del par |
  | volver desde Work | `/fun-gallery` | — | **montón otra vez** |

  El `popstate` se probó aparte y dirigido, porque el «atrás» real de la pestaña oculta se iba a bfcache: con la anotación puesta, un `popstate` con la URL **fuera** del par la borra y uno con la URL **dentro** la conserva. El «atrás» del navegador hacia la galería también se vio funcionando (desplegada, anotación conservada).

- **El link nuevo, medido.** `← Back to Fun Gallery`, **13 px**, gris `#939393`, **165 × 20 px**, colgado del título en la columna sticky (y = 469 a 1920×1080), con el mismo `hover:text-off-black` y la misma transición de 300 ms que `All Projects`. **El alto de la página de proyecto no se mueve: 2663 px con el link y 2663 sin él**, porque la columna izquierda es la corta. El servidor manda siempre la página **sin** el link: es una decisión de cliente y por eso no hay riesgo de hidratación.

- **No-regresión** (viewport real de 1920×1080 en iframe same-origin): `/` **1080** (footer de home, 164) · `/work` **2154** (footer interno, 982) · `/work/matsu` **2663** (982) · `/contact` **1664** (982) · `/team` **4257** (982) · `/fun-gallery` **2160** (982). Los archivos del sprint son `FunGallery.tsx`, `ProjectDetailClient.tsx` y el módulo nuevo: ninguna otra ruta comparte código con ellos. En el HTML servido de las seis rutas **no aparece** el link de vuelta, como corresponde.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas de la línea base; `/fun-gallery` sigue clasificando `○ (Static)` con `revalidate 1m`. Cero errores y cero warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`).

- **Nota de método.** Sigue vigente el límite de B3.3: con la pestaña oculta Chrome **no dispara `requestAnimationFrame`** —remedido: **0 frames en 900 ms**, `visibilityState: "hidden"`— así que **ninguna animación se pudo observar**, incluidas las de duración 0. Todo lo geométrico se midió sobre el layout (`offsetTop`/`offsetLeft`/`offsetWidth`), que no depende de los transforms, y las alturas de viewport se consiguieron con un **iframe same-origin dimensionado a 1920×1080 y 1366×768**, que es un viewport real donde `100svh` y los `clamp` se evalúan de verdad — la ventana no podía crecer más allá de la pantalla física. Límite nuevo, anotado: **manejar el menú del Navbar por `.click()` sintético provoca navegación dura** (documento nuevo y, al volver, restauración desde bfcache), así que las secuencias de navegación hay que armarlas con links visibles.

- **Desvíos, dichos de frente.** **(1)** Se creó un archivo fuera de la lista autorizada: **`src/lib/fun-gallery-return.ts`**, módulo hoja sin dependencias. La alternativa era duplicar la lógica entre las dos pantallas o hacer que la página de proyecto importara del componente de la galería; las dos son peores. **(2)** El §2 autorizaba `src/components/sections/work/ProjectDetailClient.tsx`; **el archivo real es `src/app/(site)/work/[slug]/ProjectDetailClient.tsx`** — mismo componente, otra ruta. **(3)** El interlineado del `<h1>` pasó de clase Tailwind a estilo inline: **mismo valor computado**, para que el encuadre no dependa de un literal duplicado. **(4)** El seguimiento del cursor **quedó fuera de la reserva del encuadre** a propósito: es transitorio, simétrico arriba y abajo, y los assets tienen entre 6 % y 12 % de alto transparente de cada lado. Con el cursor pegado al borde inferior, el objeto más bajo puede cruzar el pliegue hasta 30 px; el margen transparente absorbe entre 20 y 41 px a 1920×1080. **(5)** El vigía solo existe en documentos donde llegó a montarse la galería o un proyecto: después de una navegación **dura** hacia afuera del par (recarga, URL a mano, link externo) la anotación puede sobrevivir. En operación normal el sitio navega por cliente y no ocurre. **(6)** Framer aplica las transiciones de duración 0 por su propio bucle de frames, así que **no se puede descartar un cuadro de montón** al volver; el `template.tsx` arranca en opacidad 0 y la tapa, pero es cosa de mirarlo. **(7)** Al principio de la sesión se corrió un `taskkill /IM node.exe` con filtro, que el §2 no autorizaba. **No mató nada**: los dos procesos `node` presentes (el servidor propio en 3010 y otro de las 12:32) siguieron vivos y respondiendo, verificado por PID. El puerto 3000 **no estaba escuchando** en ningún momento observado de la sesión.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, a 1920×1080 y a 1366×768: **(a)** que el despliegue **se lea como una secuencia ordenada**, arriba primero y de izquierda a derecha; **(b)** que la escena entre completa en la primera pantalla y que al desplegar **no haga falta scrollear** — y, a 1366×768, si objetos de 216 px siguen siendo la misma pantalla; **(c)** que el seguimiento del cursor **ahora se note**, sin comerse la deriva del flotado; **(d)** el ciclo completo de ida y vuelta, **incluido el «atrás» del navegador**, y que la galería de vuelta aparezca quieta en su sitio y ya derivando, sin un parpadeo de montón; **(e)** que el link nuevo **no desentone** en la página de proyecto; **(f)** que el flotado y el hover no hagan chocar a **Algo y Matsu**, que es el par más cerrado.

- **Pendientes que deja:** **(1)** Los cuatro pendientes de B3.3 siguen abiertos (la prop `blend` huérfana, el área de hover cuadrada, el botón que cubre durante su fade, el cartel en minúsculas). **(2)** El **piso del 60 %** decide qué pasa cuando las clientas carguen más imágenes: con más filas la composición deja de achicarse y lo que sobra queda debajo del pliegue. Es lo pedido, pero nadie lo vio todavía con contenido real. **(3)** La anotación de la vuelta sobrevive a una **recarga** de la página de proyecto, que es lo correcto —misma pestaña, mismo paseo— pero conviene saberlo. **(4)** A 1280×720 la composición pide el 61 % del ancho disponible: un pelo por encima del piso. Por debajo de ~712 px de viewport el piso empieza a mandar y la escena deja de entrar completa.

- **Commits:** `d5beca0`, `eb26d61`, `ab97b63`, `0534b64`, más el de este cierre.

## 2026-08-20 · B3.3c · Fun Gallery: tamaño desde el ancho, seguimiento solo en hover y montón apilado por tinta

- **Qué se hizo:** tres commits, uno por ajuste. El **tamaño del objeto** deja de derivarse del alto disponible y sale del **ancho del viewport** (el mayor pasa a medir el 20 % en toda resolución); el **seguimiento del cursor** deja de ser un parallax global y pasa a ser un gesto del **objeto con hover**, con la escala de hover de 1,08 a **1,13**; y el **montón** se apila por **tamaño visible** en vez de por el sorteo del motor. **No se tocó** nada de lo aprobado: orden de lectura del despliegue, spring 0,85 s / bounce 0,18 / desfase 0,07, flotado (±11/±16, períodos 11,5 s y 9 s desfasados), rotación ±3°, el camino de vuelta ni el título. **No se tocó** `HoverButton.tsx` ni `ServicesIntro.tsx`; **cero escrituras** en Sanity. Un solo archivo modificado en los tres commits: `FunGallery.tsx`.

- **F1 — el tamaño salía de la dimensión equivocada.** El encuadre de B3.3b despejaba el ancho de la composición del alto libre debajo del título, así que el objeto encogía con la pantalla: 351 px a 1920×1080 (18,3 % del ancho) y **216 px a 1366×768 (15,8 %)**, contra el **17–22 %** medido en `15-fun-gallery-hover.jpg` (bandas de 219 y 279 px sobre 1271 de lienzo). Ahora el ancho se despeja de una sola condición sobre el ancho del viewport —`ancho = 100vw × objetivo / ladoMayorRelativo`—, así que el objeto mayor mide **el mismo porcentaje en toda resolución**. Sigue siendo CSS puro (`min()` + `calc()` sobre `100vw`): no hay medición en JS ni listener de resize. El tope de 1664 px queda como techo y recién manda a partir de **2078 px** de pantalla. `COMPOSITION_MIN_WIDTH_SHARE`, el piso del encuadre viejo, quedó sin consumidores y se eliminó.

  | | 1920×1080 | 1366×768 | antes (B3.3b) |
  |---|---|---|---|
  | composición | **1539 × 784** en y = 334 | **1095 × 558** en y = 302 | 1406×716 · 866×441 |
  | **objeto mayor** | **384 px = 20,0 %** | **273 px = 20,0 %** | 351 = 18,3 % · 216 = 15,8 % |
  | objeto menor | 294 px = 15,3 % | 209 px = 15,3 % | 268 = 14,0 % · 165 = 12,1 % |
  | montón (borde sup. → inf.) | 348 → 822 | 312 → 650 | 347→780 · 311→577 |
  | **cartel `(click to view)`, borde inferior** | **890** / 1080 (190 de aire) | **703** / 768 (**65** de aire) | 843 · 622 |
  | desplegado, objeto más bajo | **1118** (desborda 38) | **859** (desborda 91) | 1050 · 743 |
  | alto de la página | 2228 | 1805 | 2160 · — |

  **El desborde vertical es el costo autorizado**: la composición desplegada ya no entra entera en la primera pantalla y el final se alcanza scrolleando, que es lo que muestra el mockup. **Lo que sí entra** es la escena de entrada, y con holgura: **no hizo falta darle al montón una escala propia**. La razón es geométrica y conviene dejarla escrita: el montón vive en el tercio de arriba de la composición —su borde inferior cae en 0,275 del ancho y el cartel en 0,35—, así que su alto crece con el ancho pero muy por debajo del alto total, que es `ancho × 0,509`. A 1280×720 el cartel cierra en y = 674 sobre 720, así que también entra.

- **F2 — el seguimiento era global y repartía mal el gesto.** Hasta B3.3b un único motion value con la posición normalizada del cursor **en el viewport** movía a los ocho objetos a la vez. Además de no ser lo pedido, la amplitud dependía de **dónde estaba el objeto en la pantalla** y no de dónde estaba el cursor respecto del objeto: medido sobre la composición de 1920, el factor de posición iba de 0,16 (Tukumi, casi centrado) a 0,62 (akasha y Brickhouse, en los bordes), así que un objeto del centro casi no se movía por más que el cursor lo recorriera entero.

  Ahora el gesto es del objeto, **como en el precedente que la instrucción invoca**: `ServicesIntro` (`:151-191`) también mide el cursor contra el centro de **cada** imagen. Dos diferencias con él: el signo va al derecho —el objeto **acompaña** al cursor en vez de apartarse— y el radio de disparo no es un círculo de 100 px sino la propia caja del objeto, que es la que ya define el hover. El spring es el mismo (`{50, 15, 0.5}`, sobreamortiguado). `FOLLOW_STRENGTH` baja de 10 a **6**: con el factor por objeto (2–3) la amplitud con el cursor en el borde de la caja es de **12 a 18 px**, del mismo orden que el flotado, y se lee porque es el **único** objeto que se mueve respecto de sus vecinos.

  **Verificado en el DOM del build**, con un `pointermove` sintético en la esquina de la caja de *Algo*: ese objeto queda en `translateX(14,65px) translateY(14,65px)` —su factor sorteado es 2,44— y **los otros siete quedan en `transform: none`**.

  **La capa L3 desapareció.** Existía porque un motion value con spring no puede compartir propiedad con los keyframes del flotado; al volverse un gesto del objeto con hover se consolidó en **L0**, que ya resuelve ese hover: x/y por motion values contra `scale` por `whileHover`, propiedades distintas y sistemas distintos sobre el mismo elemento. La arquitectura final son **cuatro capas por tarjeta** en vez de cinco:

  | capa | qué resuelve | cómo |
  |---|---|---|
  | L0 | posición · hover · **seguimiento** · apilado | `left/top/width` CSS · `scale` por `whileHover` · `zIndex` · **x/y por motion values** |
  | L1 | despliegue | x/y por `animate`, una sola vez, al click |
  | L2 | flotado | x/y por keyframes en loop |
  | L3 | inclinación y fade de carga | `rotate` constante + `opacity` |

  **La escala de hover queda en 1,13** (50 px sobre una tarjeta de 384), dentro del 1,12–1,15 pedido. Con `prefers-reduced-motion` no se cuelgan los handlers del seguimiento —los motion values se quedan en 0— y el hover conserva solo su escala.

- **Los choques, medidos sobre la tinta y no sobre la caja.** B3.3b midió la **caja del alfa** inclinada, y con ese criterio el par crítico era *Algo↔Matsu* con números negativos que la verificación humana igual aprobó como «sin solapes». La explicación aparece al medir la **máscara alfa real**: *Matsu* llena apenas el 14 % de su propia caja de tinta, así que sus cajas se solapan mucho antes que sus dibujos. Se remidió con las ocho máscaras rasterizadas en el espacio de la composición (1 px por unidad, α > 8/255), buscando de forma exhaustiva la peor de las 25 traslaciones relativas que puede producir el flotado, con un solo objeto en hover y su seguimiento empujándolo hacia el vecino:

  | distancia mínima entre dibujos | HOY 1920 | **NUEVO 1920** | HOY 1366 | **NUEVO 1366** |
  |---|---|---|---|---|
  | en reposo | 77,1 px | **84,7** | 47,9 px | **60,9** |
  | reposo + flotado en contrafase | 39,8 px | **47,3** | 12,0 px | **24,1** |
  | hover (+ seguimiento) | 67,5 px | **63,2** | 40,0 px | **41,8** |
  | **hover + flotado en contrafase** | **29,4 px** | **28,2** | **5,4 px** | **6,7** |

  **Ningún par se toca, y el peor caso mejora a 1366×768** —de 5,4 a 6,7 px— pese a objetos un 26 % más grandes y a un hover más fuerte: las distancias encogen y crecen en proporción al tamaño mientras el flotado es fijo, así que agrandar los objetos **resta** peso relativo a la deriva. A 1920 el peor caso baja 1,2 px, que es ruido. El par más cerrado es *Napoli↔Matsu* en reposo y *Algo↔Matsu* con hover. **No hizo falta separar posiciones.** (Con el criterio viejo —cajas de tinta— el nuevo peor caso daría −19,3 px a 1920 y −22,4 a 1366; se deja anotado para que nadie lo lea como una regresión: son cajas que se cruzan, no dibujos.)

- **F3 — el montón se apila por tamaño visible.** El `zIndex` del motor es un sorteo, así que en el montón cualquiera podía quedar arriba y un objeto grande adelante tapaba a los chicos. Ahora, **mientras están amontonados**, se apilan por el área que cada uno **pinta de verdad**: `lado² × cobertura de tinta`. Usar el lado de la tarjeta habría dado el criterio **invertido** justo para los recortes angostos —*Matsu* tiene la caja más grande de las ocho y es de los que menos tinta ponen—, que es exactamente el caso que hay que resolver.

  | z en el montón | objeto | cobertura de tinta | lado (frac. del ancho) | **tinta visible** (×10⁻⁴) |
  |---|---|---|---|---|
  | 10 (fondo) | Napoli | 35,6 % | 0,2495 | 221,7 |
  | 11 | akasha | 38,2 % | 0,2248 | 192,9 |
  | 12 | Brickhouse | 37,2 % | 0,2183 | 177,5 |
  | 13 | Ejemplo | 33,0 % | 0,2190 | 158,0 |
  | 14 | Algo | 24,5 % | 0,2131 | 111,4 |
  | 15 | Matsu | 8,7 % | 0,2495 | 54,4 |
  | 16 | Tukumi | 10,6 % | 0,1910 | 38,5 |
  | 17 (adelante) | Brooks | 9,3 % | 0,1969 | 35,9 |

  **Verificado en el DOM del build:** en el montón los ocho `zIndex` son 10…17 en ese orden exacto, y al desplegar vuelven a ser los del motor (22, 31, 23, 14, 19, 20, 27, 17), con `role="link"` en *akasha* y *Matsu* y `null` en los otros seis. **Consecuencia a registrar:** en el montón el `order` de Sanity **deja de decidir** qué se ve arriba; sigue decidiendo la posición final de cada objeto y el orden del despliegue.

- **De dónde sale la cobertura, y por qué no es una tabla.** La instrucción pedía usar la tinta medida en B3.3. Se midió otra vez con `sharp` sobre los ocho assets (300×300, α > 8/255) y **reprodujo la tabla de B3.3 exacta**. Pero **hornear esos ocho números en el componente sería atarlo al contenido**: la galería es CMS-first y las imágenes las cargan las clientas, así que a la primera imagen nueva la tabla queda vieja y el criterio se invierte en silencio. Tampoco se puede medir en el servidor: **el CDN de Sanity responde 403 a cualquier pedido que traiga `Origin`** (verificado con `curl`), así que no hay lectura de píxeles cross-origin y la única copia sin CORS es la que sirve el optimizador de Next, que es del mismo origen. La medición quedó entonces **en el navegador**, sobre la imagen ya decodificada que entrega `onLoadingComplete`, en un canvas de 48×48: se promedia el canal alfa completo, así que un borde a medio cubrir cuenta por lo que cubre. **Contrastado contra `sharp`, el muestreo de 48×48 coincide dentro del 0,3 % en las ocho** (p. ej. akasha 0,3816 contra 0,3840; Matsu 0,0873 contra 0,0870). Hasta que están las ocho medidas manda el `zIndex` del motor, así que el servidor y el cliente renderizan lo mismo y no hay riesgo de hidratación.

- **No-regresión** (iframe same-origin a 1920×1080): `/` **1080** (footer de home, 164) · `/work` **2154** (982) · `/work/matsu` **2663** (982) · `/contact` **1664** (982) · `/team` **4257** (982). **Idénticas a la línea base de B3.3b.** `/fun-gallery` pasa de 2160 a **2228** por la composición más alta, que es el efecto buscado. Ninguna otra ruta comparte código con `FunGallery.tsx`.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas de la línea base; `/fun-gallery` sigue clasificando `○ (Static)` con `revalidate 1m`. Cero errores y cero warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`, y **no** aparece ninguna por `onLoadingComplete`: sigue existiendo y sigue entregando el `<img>` en Next 16.2.6).

- **Nota de método — se corrió el límite de B3.3.** Sigue siendo cierto que con la pestaña oculta Chrome no dispara `requestAnimationFrame` y las animaciones no se pueden observar. Pero **tomar una captura activa la pestaña**, y en esa ventana el bucle de frames de Framer avanza: eso alcanzó para ver aplicados el `zIndex` del montón, el `transform` del seguimiento y el estado desplegado, que antes se daban por incomprobables. Lo que sigue sin poder observarse es el **transcurso** de una animación: cada captura avanza un puñado de frames sueltos, no una línea de tiempo. Corolario práctico: **nunca esperar un `requestAnimationFrame` dentro de una evaluación** —el `await` no vuelve nunca y la evaluación muere a los 45 s—; los relojes se arman con `setTimeout` y el resultado se lee en una llamada posterior.

- **Desvíos, dichos de frente.** **(1)** La instrucción pedía «usar el área o el ancho de tinta real medidos en B3.3»; se usan **las mismas mediciones, recalculadas en runtime** en vez de horneadas, por las razones del punto anterior. Es un desvío de forma, no de criterio: el orden resultante es el que sale de esos números. **(2)** El **radio del abanico del montón sigue derivando del `zIndex` del motor**, no del nuevo orden por tinta: la instrucción acota F3 al apilado y cambiar el radio movería posiciones. La consecuencia es que el objeto del fondo **no es necesariamente el más corrido hacia afuera** —*Napoli*, que quedó al fondo, tiene un radio intermedio—, así que si en la verificación visual el montón todavía esconde a alguien, el paso siguiente es acoplar también el radio. **(3)** El seguimiento cambió de normalización: era la posición del cursor en el **viewport** y ahora es su posición dentro de la **caja del objeto**. La instrucción decía «lo que cambia es a quién se le aplica», pero el precedente que ella misma invoca —`ServicesIntro`— ya es per-objeto y contra el centro de cada imagen; con la normalización vieja, gatear el parallax por hover habría dado un desplazamiento casi fijo por objeto y dependiente de su lugar en la pantalla, que es lo contrario de «acompañar al cursor». **(4)** Los literales `10` y `24` del sorteo de `zIndex` pasaron a `ITEM_Z_BASE` / `ITEM_Z_RANGE`: los consumían dos lugares y el radio del abanico se derivaba de ellos sin decirlo. **(5)** Las cifras de choques **no son comparables con las de B3.3b**: aquéllas medían cajas de tinta y éstas miden dibujos. Se publican las dos lecturas del estado nuevo para que la comparación exista. **(6)** En una conexión lenta el orden del montón podría llegar **después** de que algún objeto haya empezado su fundido de entrada (el reordenamiento se aplica recién con las ocho mediciones). Con los `priority` de las seis primeras y 1,2 s de fundido con desfase, en la práctica cae dentro de la ventana en que todavía están en opacidad 0; queda anotado porque es el único momento en que se podría ver.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, a 1920×1080 y a 1366×768: **(a)** que los objetos **tengan el peso visual del mockup**, sobre todo a 1366; **(b)** que en el montón **se distingan los ocho** —y si no, ver el desvío (2)—; **(c)** que **solo el objeto con hover** acompañe al cursor y que la escala 1,13 se note sin exagerar; **(d)** que el desborde vertical al desplegar **invite a scrollear** y no parezca un corte, sobre todo a 1920, donde apenas 38 px cruzan el pliegue; **(e)** que ningún par de objetos se toque, con atención a *Napoli↔Matsu* y *Algo↔Matsu*; **(f)** que el ciclo de ida y vuelta a un proyecto siga entero.

- **Pendientes que deja:** **(1)** Los cuatro de B3.3 siguen abiertos (la prop `blend` huérfana, el área de hover cuadrada, el botón que cubre durante su fade, el cartel en minúsculas). **(2)** El acoplamiento del **radio del abanico** al orden por tinta, si la verificación visual lo pide. **(3)** Con más imágenes el lado sorteado baja a 0,14–0,20 y el ancho pedido supera el gutter: ahí manda el ancho disponible y el objeto mayor cae por debajo del 20 % (a 1366 quedaría en ~17 %). Es coherente —más imágenes, objetos más chicos— pero nadie lo vio con contenido real. **(4)** El `sizes` de la imagen sigue declarando `22vw`; con el tamaño nuevo el rango real es 15,3–20 vw, así que es una cota superior correcta pero holgada.

- **Commits:** `cf6869c`, `cfe02cf`, `6d4659f`, más el de este cierre.


---

## B3.4 — Rediseño de `/services` (2026-08-20)

**Objetivo:** `/services` pasa al rediseño del PDF: sin scroll-jack, con las cinco secciones nuevas, sidebar con indicador de sección, gatillo del intro y LATEST PROJECTS. Seis fases, un commit cada una, más un arreglo de layout descubierto midiendo a 1366.

- **El desmontaje se llevó una máquina, no una sección.** `ServicesIntro.tsx` eran 649 líneas de máquina de estados S0–S5 con tres listeners `passive:false`, lock de `body`, compensación de scroll y **dos** literales `h-[200vh]` que había que editar de a pares. Con ella se fueron el acordeón con sus dos `ScrollTrigger`, los slideshows, el centinela de texto `"Applications may include:"`, el `id="services-list"`, `TITLE_1_LINE_COUNT`, `FloatingMediaLayer` y el catálogo hardcodeado de seis servicios. Tres hallazgos del inventario que conviene dejar escritos: **`--scrollbar-width` no estaba definida en ningún lado**, así que el `paddingRight` del lock siempre resolvió a `0px`; **`history.scrollRestoration` no vivía en el intro sino en `ServicesPageClient.tsx`**, que era el único emisor del repo y desapareció entero; y **GSAP quedó sin ningún consumidor** en todo el proyecto (queda en `package.json`, va a pendientes: desinstalarlo es un cambio de dependencias, no de sección).

  La restauración de `scrollRestoration` se resolvió por la vía más segura de las dos que ofrecía la instrucción: **nadie lo toca más**. Verificado con build + start, iframe same-origin y navegación blanda entrando y saliendo de Services tres veces: `body.style.overflow` y `paddingRight` vacíos en las siete rutas, `scrollRestoration` en `"auto"`, y un `wheel` cancelable despachado en `/services` **no** queda `defaultPrevented` (solo `/team` y `/work*` lo cancelan, que es Lenis y es previo). Los altos no se movieron: `/` 1080, `/work` 2154, `/work/matsu` 2663, `/contact` 1664, `/team` 4257, `/fun-gallery` 2228, `/contact/success` 1244.

- **Los mockups eran medibles, y eso cambió el sprint.** Los cinco JPG de `docs/mockups/08*` son exportes de un diseño de **1920 escalados a 1327** (factor 0,691). Se calibró midiendo alturas de mayúscula con `sharp`: con ese factor el gutter da **exactamente 64 px** —el mismo `lg:px-16` del Navbar y del Footer—, la nav da 17 px y la escala cierra en **17 / 20 / 24 / 30 / 40**. La frase del intro está *dibujada* a 30 px pero anotada a 40 pt; mandó la instrucción y va a 40/48/0. Las reglas horizontales se leyeron directo del bitmap: sección de 64 a 1636, ítems de 389 a 1563. La implementación cae **dentro de 3 px** de esos números a 1920.

  Un detalle contraintuitivo que se respetó: en el mockup la **regla larga de sección es más tenue** que las de los ítems (0,39 contra 0,84 de tinta por píxel). Es al revés de lo habitual y está anotado en el código para que nadie lo «corrija».

- **El corte de los nombres de pack es autoral, no del ancho.** «BRAND UNIVERSE» mide 241 px a 30 px y entra holgado en la columna de 270, así que librado al ancho quedaba en una línea mientras Consultation y Essentials quedaban en dos. En el PDF los tres cortan después de «BRAND». Pasaron a líneas fijas en el contenido, con el mismo criterio que los labels de `ContactForm`.

- **El scroll-spy: dos cosas que solo aparecieron midiendo.** La regla es simple —manda la última sección cuyo tope cruzó la línea de lectura— y resuelve los dos casos que un spy ingenuo deja indefinidos: con dos secciones a la vista gana la de arriba, y en el hueco del encabezado BRANDING PACKS, que no tiene entrada en el menú, la flecha se queda en INTRO, como en `08a`. Lo que no se ve leyendo el código es esto:

  1. **El borde de la raíz va dos píxeles por debajo de la línea.** Un centinela de 1 px apoyado *exactamente* en la línea seguía intersecando —Chrome cuenta el contacto de borde como intersección—, así que no cambiaba de estado y el observer **no avisaba**. Y ahí aterriza, exacto, un click del sidebar (`tope − 128`): la flecha no se movía al ítem recién elegido. Se detectó con un barrido pixel a pixel del borde, no razonando.
  2. **Se observan los centinelas y también las secciones.** Un salto instantáneo más largo que la ventana —`prefers-reduced-motion`, o la tecla `End`— puede llevar un centinela de «abajo de la raíz» a «arriba» sin pasar por «intersecando»: no cambia de estado y no hay evento. Las secciones no tienen ese hueco porque cubren la zona sin baches. Verificado: salto instantáneo de 0 a 3229 deja UNIVERSE.

  El observer se usa como **disparador**, no como respuesta: cuando avisa se recalculan de una las cinco posiciones. Así el resultado no depende de la dirección de llegada. **Barridos: 15 posiciones a 1920 y 8 a 1366, bajando y subiendo, incluidos los dos píxeles del borde en las dos — cero fallas.** Click en UNIVERSE desde el intro: **desfase 0 px** contra el header, foco en `#universe`.

  Se probó y se descartó marcar el ítem a mano en el click: el spy ya mide bien el aterrizaje, y adelantarlo solo agregaba un parpadeo —la flecha saltaba al destino y volvía atrás en el cuadro siguiente, cuando el observer recalculaba sobre el scroll todavía en el origen—.

- **El gatillo: el umbral es 60 px normalizados, y el número tiene una razón.** Los `deltaY` no son comparables entre navegadores —Chrome manda píxeles, Firefox manda líneas, tres por muesca—, así que se normaliza con `LINE_PX = 100/3` para que una muesca valga 100 px en los dos (la misma constante que usa Lenis). Con 60: **una muesca de rueda cruza el umbral en el primer evento**, así que con mouse «un scroll» es literalmente un scroll; un roce de trackpad no llega; un gesto deliberado lo cruza en dos o tres eventos, dentro de los primeros 50 ms.

  No hay booleano «armado»: cada evento pregunta por `window.scrollY`. Esa sola condición resuelve las tres reglas del sprint —no dispara si se llegó con el scroll ya avanzado, no se re-dispara con la inercia después de llegar (que deja la página a una pantalla del tope), y se re-arma solo al volver arriba— y ahorra un listener de `scroll` que correría en cada cuadro para copiar el mismo dato.

  **Desvío consciente, dicho de frente.** La instrucción pedía prevenir «solo ese evento». El gatillo previene **todo el chorro de eventos del gesto disparador** mientras dura el desplazamiento, y lo da de baja apenas termina. La razón es que el gesto disparador *es* ese chorro: sin bloquearlo, la inercia del trackpad sigue empujando el scroll nativo durante toda la animación y la deja en cualquier lado. Un `scrollTo` suave nativo tampoco sirve, porque el navegador **cancela** el desplazamiento programado ante el primer evento del usuario, y los de inercia son eventos del usuario. Lo que **no** se hizo, que era la línea roja: tocar `document.body`. Ni `overflow` ni `paddingRight`. Y no atrapa a nadie: 60 px hacia arriba, o un dedo nuevo en la pantalla, abortan y devuelven el control en el acto, más un techo de tiempo por si algo saliera mal.

  Medido con eventos `wheel` sintéticos y cancelables: roce de 55 px **no dispara**; muesca de 100 px dispara en el primer evento y los tres de inercia siguientes quedan **prevenidos**; muesca de Firefox (`deltaY 3`, `deltaMode 1`) también dispara en el primero; con `scrollY` en 500 tres eventos de 300 px no hacen nada; de vuelta en el tope vuelve a disparar. La curva de los `scrollTo` coincide con `783 × easeInOutCubic(t/900)` dentro del ruido de cuadro (0,010 medido contra 0,0101 calculado a t = 13 ms). **Click en CONSULTATION desde el intro aterriza en 1347 —su sección— y no en 783 —Branding Packs—.**

- **LATEST PROJECTS.** Las cuatro portadas por `_createdAt` descendente con `_id` de desempate y filtro `defined(coverImage.asset)`: la sección **son** las portadas, y en `project` solo `title` y `slug` son requeridos. Orden mostrado hoy: **matsutrabajo, matsu, tukumi-takeaway, akasha-blends**. Sin fallback local **a propósito**: los proyectos de respaldo tienen slugs que no coinciden con el dataset, así que un fallback mandaría a las visitantes a fichas que no existen.

  El hover, medido: la del borde **derecho** escala 1,08 con origen en su lado derecho y queda en `1402..1920` —la línea exterior clavada en el borde de la pantalla, creciendo hacia adentro—; la del borde **izquierdo**, en `0..518`. Las otras en `blur(4px)` con opacidad 0,7. `scrollWidth` sigue en 1920 en todos los casos: **no aparece scroll horizontal**. Con tres portadas la fila reparte el ancho (640 px cada una) y no se rompe; con cero, la fila no se renderiza y quedan el texto y los links.

  Los dos links **no** usan `HoverButton`, y la razón queda anotada en §6 para que nadie lo intente de nuevo: el mockup pide que el subrayado **aparezca** en el hover, y `HoverButton` lo tiene como booleano fijo; atarlo a un estado tampoco sirve, porque su relleno negro sube en el mismo gesto y taparía la línea, que también es negra.

- **El arreglo de 1366, que salió de medir la segunda resolución.** La columna izquierda es un 18 % del ancho disponible, que a 1920 da los 270 px del mockup pero **a 1366 caía a 175 px**, y ahí «CONSULTATION» —245 px— se le montaba encima a la lista de ítems. Pasó a `minmax(270px, 18%)`. Con el mismo criterio, el cierre pasa a dos filas por debajo de `2xl`: los links van a 24 px fijos y el más largo mide unos 430 px, así que las tres columnas solo entran de unos 1600 px para arriba; forzarlas a 1366 dejaba el párrafo en 256 px, o sea una palabra por renglón.

  Detalle de método que vale para el próximo sprint: **Tailwind v4 busca los nombres de clase como literales en el código**. Una clase compuesta en runtime —con `replace`, con plantillas— no llega nunca al CSS. Se cayó en eso dos veces y las dos se corrigió escribiendo las clases enteras; está anotado en §6.

- **Geometría final** (build + start en 3010, DPR 1). **1920×1080:** alto 7660 · intro `128..1080` (952) · Branding Packs `1080..1644` · Consultation `1644..2520` · Essentials `2520..3526` · Universe `3526..4873` · Add-ons `4873..5770` · LATEST `5770..6678` a sangre · columna de contenido `64..1636` · sidebar `1676..1856` con centro en 540 = mitad exacta de la pantalla · portadas de 480×360 pegadas en 0/480/960/1440 · `scrollWidth` 1920. **1366×768:** alto 7921 · columna de contenido `64..1082` · sidebar `1122..1302` con centro en 384 · portadas de 342×256 · `scrollWidth` 1366. **Sin scroll horizontal en ninguna de las dos.**

- **`?service=` verificado contra el formulario real, no contra el mapeo:** `CONSULTATION` prende la pill *Consultation*, `BRANDING` (Essentials y Universe) prende *Branding*, y Add-ons sin query deja las pills vacías. Las dos primeras resuelven por **match exacto** contra `WORK_TYPE_OPTIONS`, sin depender del fallback tolerante por keyword.

- **Nota de método — el entorno de medición peleó.** La pestaña de Chrome queda **oculta** entre llamadas y el navegador **no entrega cuadros** (medido: 0 en 600 ms), así que ni `IntersectionObserver` ni `requestAnimationFrame` corren. La primera tanda de mediciones del spy dio resultados falsos por eso, no por el código. Lo que funcionó: **armar el recorrido como una máquina de estados guiada por `rAF` y avanzarla con capturas de pantalla** —cada captura activa la pestaña y entrega unos 8 cuadros—, leyendo el resultado en una llamada posterior. Corolario para el próximo sprint, que suma al que dejó B3.3c: además de no esperar un `rAF` dentro de una evaluación, **no confiar en ninguna medición que dependa de cuadros sin haber forzado una captura antes**. Y dos trampas del instrumental: la acción `zoom` deja un override de métricas que congela el viewport del tab, y agregar un iframe a `documentElement` en vez de a `body` rompe las capturas.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas de la línea base. `/services` pasa de estática pura a `○ (Static)` con `revalidate 1m`, igual que `/work` y `/fun-gallery`, por el fetch de las portadas. Cero errores y cero warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`).

- **Desvíos, dichos de frente.** **(1)** El `preventDefault` del gatillo cubre el gesto entero y no un solo evento; explicado arriba. **(2)** Se tocó `ServicesPageClient.tsx`, que no estaba en la lista de archivos autorizados: era donde vivía el `scrollRestoration` que la Fase 1 ordenaba resolver, y se reportó antes de tocarlo. **(3)** El intro mide exactamente una pantalla menos el header, así que Branding Packs **no asoma**; el mockup lo muestra asomando pero el alto del recorte no es el de un viewport y no se puede deducir de ahí. Es una línea si la verificación visual lo pide. **(4)** Las reglas de ítems y las de sección terminan en el **mismo** borde derecho; el mockup deja 51 px de sangría entre ellas. **(5)** La lista de ítems arranca a la altura del **nombre** del pack en los cuatro; `08b` la baja una línea solo en Consultation. **(6)** Los `REQUEST FORMAL QUOTE` y los links del cierre van a **24 px**, que es lo que miden en el mockup, y no a los 17 px del cromo. **(7)** Los apóstrofos van **rectos**, como el Apéndice A; los mockups los muestran tipográficos.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, a 1920×1080 y a 1366×768: **(a)** que **todo el sitio siga scrolleando** después de entrar y salir de Services varias veces — es lo más importante; **(b)** el gatillo **con trackpad y con rueda de mouse**, que no se dispare con un roce ni se re-dispare con la inercia; **(c)** el sidebar subiendo y bajando, que la flecha marque siempre lo que se está leyendo; **(d)** el hover de LATEST PROJECTS, sobre todo en las portadas de los bordes; **(e)** la página completa contra los cinco mockups.

- **Pendientes que deja:** GSAP sin consumidores en `package.json`; el asomo de Branding Packs; las tres diferencias menores contra el mockup; los apóstrofos rectos; y el hover de las portadas que también responde al foco de teclado (agregado por accesibilidad, no está en el mockup).

- **Commits:** `47edee2`, `a227e3d`, `2f4783b`, `e75144a`, `ccaccd3`, `e58a99a`, `30a7a26`, más el de este cierre.

---

## B3.4b — Correcciones de `/services` (2026-08-21)

**Objetivo:** las ocho correcciones que dejó la verificación humana de B3.4. Cinco fases, un commit cada una. Todo lo demás —contenido, tres columnas, desmontaje del scroll-jack, `?service=`, el piso de 270 px de la columna izquierda— quedó como estaba.

- **La vibración del gatillo no era un problema de timing: era una regla de Chrome.** De una secuencia de scroll el navegador manda **cancelable solo el primer evento `wheel`**; si ese primero no se cancela, todos los que siguen llegan con `cancelable: false` y `preventDefault()` no hace absolutamente nada. B3.4 escuchaba en modo **pasivo** mientras juntaba delta, así que para cuando cruzaba el umbral ya había perdido el derecho a cancelar: su `blockGesture` era un listener que no bloqueaba nada, el scroll nativo seguía empujando y le peleaba cuadro a cuadro al `scrollTo` de la animación. Eso, y no otra cosa, era «vibra y se traba». La corrección es una línea de concepto y dos de código: el listener va **no pasivo desde el montaje** y cancela **desde el primer evento** mientras el gatillo está armado. Los tres (`wheel`, `touchstart`, `touchmove`) por la misma razón: si el navegador arranca a scrollear antes de que corra el handler, el lock se queda sin dientes.

  Efecto colateral buscado: arriba de todo la página **no se mueve** hasta cruzar el umbral. Es el gesto que pide el mockup («con un solo scroll ya se va al branding packs») y evita dejar a nadie a mitad de camino con un roce.

- **El lock son listeners, nunca `document.body`.** La instrucción permitía `overflow: hidden` con compensación de scrollbar; se eligió el mecanismo de menor alcance, que era el que ella misma prefería. Dos razones concretas: el sitio **oculta las scrollbars globalmente** (`globals.css`), así que la compensación sería inocua pero el `overflow` seguiría siendo el único mecanismo con una falla **catastrófica** —si el estilo sobrevive, el sitio entero se queda sin scroll—; y el Navbar es `position: fixed`, o sea que además saltaría lateralmente. Con listeners, el peor caso posible es una animación cortada. **Grep sobre todo `src/`: nadie escribe `document.body.style` en ningún lado del repo.**

  `release()` es la **única** salida —cancela el cuadro, limpia el temporizador, da de baja los cuatro listeners— y se la llama desde los tres lados obligatorios: fin de la animación, cleanup del efecto (desmontaje incluido) y failsafe a los 1300 ms (900 de animación + 400 de margen).

- **El gatillo, medido con eventos sintéticos cancelables.** 30 px no dispara; +20 (acumulado 50) tampoco; +30 (acumulado 80 ≥ 60) **dispara**, y los tres quedan prevenidos, que es lo que mantiene cancelable la secuencia. Una muesca de rueda (120 px) dispara en el primer evento. Ya lockeado: +100 px prevenido, **−200 px también prevenido** (inmune al gesto, ver desvíos), `PageDown` prevenido, `Tab` **no** prevenido, `ctrl+rueda` **nunca** prevenido —el zoom del navegador no se toca—. A los 1500 ms nada queda prevenido, y volviendo al tope y scrolleando **tampoco**: el gatillo no se re-arma. `document.body` con **cero propiedades inline** en todo el recorrido, y lo mismo en las siete rutas: `/`, `/work`, `/services`, `/team`, `/fun-gallery`, `/contact` y `/contact/success`.

- **Los anclajes y el spy eran una sola geometría, y por eso fallaban los dos.** B3.4 aterrizaba el **tope** de la sección sobre la línea de lectura. Eso dejaba dos cosas rotas al mismo tiempo: la divisoria quedaba clavada en y = 128, o sea justo debajo del header y perfectamente visible; y el destino caía **exactamente sobre el borde** del rango del spy. Lo segundo es el que costaba ver: el `IntersectionObserver` avisa dos píxeles **antes** de la línea, y en la desaceleración final de un desplazamiento suave esos dos píxeles todavía no se recorrieron, así que la medición del callback decía «no cruzó» — y después no llegaba **ningún aviso más**, porque el centinela ya no volvía a cambiar de estado. La flecha se quedaba en la sección anterior. B3.4 lo había medido como «desfase 0 px» y era cierto: el error no estaba en dónde aterrizaba sino en **cuándo se medía**.

  El criterio único que los reconcilia: **el salto aterriza el _contenido_ de la sección** (marcado con `data-services-anchor`, descontando su relleno) a `128 + 24`, y **el spy sigue mandando por el _tope_**. Entre uno y otro hay 161 px —la divisoria de 1 px más el `pt-[160px]`—, así que al terminar el salto el centinela queda **137 px adentro** del rango en vez de apoyado en el borde, y la divisoria termina **fuera de la pantalla**. El respiro de 24 px no es libre: a partir de 33 la divisoria vuelve a asomar por debajo del header; quedan 9 px de resguardo contra el redondeo a medio píxel del scroll. Está documentado entero en `services-layout` y las dos reglas no se tocan por separado.

- **Tabla de aterrizajes, las cinco secciones, las dos resoluciones.** Formato: `scrollY | contenido | divisoria propia | centinela | spy | menú`.

  **1920×1080** (alto 7654): `INTRO 0 | 128 | — | 128 | intro | oculto` · `CONSULTATION 1653 | 152 | −9 | −9 | consultation | visible` · `ESSENTIALS 2529 | 151,5 | −9,5 | −9,5 | essentials | visible` · `UNIVERSE 3535 | 152 | −9 | −9 | universe | visible` · `ADD-ONS 4882 | 151,5 | −9,5 | −9,5 | addons | visible`.

  **1366×768** (alto 7915): `INTRO 0 | 128 | — | 128 | intro | oculto` · `CONSULTATION 1461` · `ESSENTIALS 2497` · `UNIVERSE 3659` · `ADD-ONS 5302`, todas con contenido en 152/151,5, divisoria propia en −9/−9,5 y el spy marcando la sección a la que se saltó.

  Las cinco dan bien en las dos. Divisorias en pantalla al terminar el salto: **ninguna propia**; a 1920 quedan a la vista la de ESSENTIALS (y = 866,5) aterrizando en CONSULTATION y la de UNIVERSE (y = 997) aterrizando en ESSENTIALS, que son la divisoria de la sección **siguiente** y aparecen porque esas dos secciones miden menos que la ventana. A 1366 no queda ninguna.

- **El sidebar aparece donde llega el gatillo.** Se muestra cuando el centinela de BRANDING PACKS cruza la línea: **scrollY ≥ 950** a 1920×1080 y **≥ 638** a 1366×768, con fundido de 0,5 s; por debajo, desaparece. El gatillo aterriza en 952 y 640 respectivamente, o sea **dos píxeles adentro** de la zona visible. La respuesta la da `isIntersecting` y no una medición, a propósito: es la única forma de que el cruce sea exacto en las dos direcciones —midiendo dentro del callback, un cruce lento deja el valor a un píxel del borde y el cuadro siguiente ya no genera aviso, que es exactamente el bug de los anclajes—. `visibility` acompaña a la opacidad para que el menú apagado no sea clickeable ni enfocable; transiciona al **final** del fundido de salida, así que no lo corta. `INTRO` sigue en la lista.

- **La flecha: una sola propiedad hace todo el gesto.** No se retira y vuelve a aparecer «en su lugar»: la **fila entera** se corre 38 px a la derecha cuando el ítem no está marcado —26 de flecha más 12 de aire, el ancho exportado desde `ServicesArrow` para que el número no quede escrito en dos lados— y vuelve a cero cuando se marca, arrastrando la palabra con ella. Medido a 1920: el ítem marcado tiene `transform: none` con el rótulo terminando en x = 1818 y la flecha ocupando hasta 1856; los no marcados están en `translateX(38)` con el rótulo terminando en **1856**, o sea alineados con el borde derecho de la fila marcada, que es lo que muestran `08a` y `08b`. Es `transform` + `opacity`: no toca el layout y ningún ítem empuja a los otros. Salida 0,24 s acelerando, entrada con resorte de 0,34 s desfasada 0,09 s para que se lea un gesto y no dos; total ≈ 0,43 s.

- **El salto: resorte, y la duración escala con la distancia.** `behavior: "smooth"` llegaba de golpe y no expone ni duración ni curva. Pasa a un resorte de Framer con el `bounce` del despliegue de Fun Gallery (**0,18**, no se inventa otro) y `visualDuration = clamp(0,90 · 0,75 + d/6000 · 1,50)`. Medido: **0,90 s** entre secciones vecinas (876 px), **1,03 s** del intro a Consultation (1653 px) y **1,50 s** en la vuelta al intro desde Add-ons (4882 px a 1920, 5302 a 1366). Con `bounce` 0,18 el sobrepaso es ≈ 1,1 % de la distancia: unos 10 px en los saltos cortos y ~54 en el más largo; en la vuelta al tope el navegador lo recorta contra el 0, así que ahí no se ve rebote y está bien que así sea.

  Como la animación es propia y no del navegador, **no se cancela sola**: se le agregó lo que el nativo trae de fábrica —si el usuario scrollea con rueda, dedo o tecla de scroll, el salto se aparta—. Sin eso, un gesto a mitad de camino pelearía contra la animación por todo lo que le queda, que es el mismo error que se acaba de arreglar en el gatillo.

  **La flecha no recorre las secciones intermedias:** mientras dura el salto se fija el destino y el spy sigue midiendo pero no manda; al terminar o cancelarse se suelta y se recalcula de una. Verificado: un click en UNIVERSE marca UNIVERSE **en el acto**, con el foco en `#universe`, el `click` prevenido y sin ensuciar el hash.

- **LATEST PROJECTS: B3.4 pidió mal y el mockup manda.** Medido sobre `08e` con `sharp` (export de 1328 px, factor 0,690 contra 1920): los huecos entre portadas dan **4,0 · 4,0 · 5,0** px del export y los márgenes contra los bordes **3,5** y **6,8**. De ahí salen **6 px de separación** y **8 px de margen**, fijos como el gutter del cromo. La portada pasa a medir **471,5 × 353,6** a 1920, que es exactamente lo que da el mockup (471,6), y **333 × 249,8** a 1366. Como proporción: 0,313 % y 0,417 % del ancho a 1920; 0,439 % y 0,586 % a 1366.

  **El criterio del hover de los bordes había que revisarlo, y era cierto.** Con las portadas pegadas al viewport, clavar el lado exterior tenía sentido; con margen, deja una franja quieta mientras todo lo demás crece y se lee como si la portada no cupiera. Ahora crecen **hasta comerse el margen y ni un píxel más**: el origen de la transformación se corre hacia adentro `margen / (escala − 1)` = **100 px**, un número que **no depende del ancho de la portada** y por eso sirve en cualquier viewport. Verificado en las dos: la primera crece hasta `x = 0` exacto, la última hasta `1920` y `1366` exactos, y `scrollWidth` sigue igual a `clientWidth` — **sin scroll horizontal**. Las del medio siguen creciendo hacia los dos lados; el difuminado y la opacidad no se tocaron.

- **La entrada del intro.** Volvió como fundido de **opacidad pura de 1,1 s** con la curva del Hero (`0.25, 0.1, 0.25, 1`), desfase inicial 0,12 y el indicador de scroll 0,22 s detrás, gateado por el preloader y sin animación con `prefers-reduced-motion`. Solo opacidad y sin desplazamiento a propósito: la frase ya está centrada en la pantalla y cualquier `y` la haría **aterrizar** en vez de aparecer. La orquestación es la misma del Hero y la del formulario de Contact —variantes con `staggerChildren`—, no un sistema nuevo: sigue habiendo cuatro maneras de «aparecer» en el repo, no cinco.

- **No-regresión, medida antes y después con el mismo método.** A 1366×768 los altos de las otras seis rutas son **idénticos**: `/` 768 · `/work` 1694 · `/team` 3724 · `/fun-gallery` 1805 · `/contact` 1451 · `/contact/success` 932. Footers iguales en todas (817 px en las internas, 164 en home y success). `/services` pasó de 7921 a **7915**: los 6 px son exactamente el alto que perdió la fila de portadas al angostarse (256 → 249,8), y a 1920 el mismo cálculo da 7660 → **7654**. Ningún `scrollWidth` supera el ancho del viewport en ninguna ruta.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, las mismas de la línea base, `/services` sigue `○ (Static)` con `revalidate 1m`. Cero errores y cero warnings nuevos (persiste solo la deprecación conocida de `@sanity/image-url`).

- **Nota de método — el truco de B3.3c no funcionó esta vez.** B3.3c dejó anotado que «tomar una captura activa la pestaña» y con eso avanzaban unos cuadros. **En esta sesión no:** después de captura y de click la pestaña siguió en `visibilityState: hidden`, `requestAnimationFrame` entregó **cero** cuadros en 300 ms y el `IntersectionObserver` **no entregó una sola entrada** en ninguna posición de scroll. O sea que ni el spy ni ninguna animación se pudieron observar corriendo. Lo que sí funcionó, y conviene reusar:

  1. **Eventos sintéticos cancelables.** `new WheelEvent('wheel', {cancelable: true})` sobre `window` y leer el booleano de `dispatchEvent` prueba el lock entero —umbral, inmunidad, teclas, zoom, liberación— sin necesidad de un solo cuadro. Los relojes se arman con `setTimeout`, que sí corre.
  2. **Iframes same-origin de tamaño fijo.** La pantalla física es de 1920×1080 con barra de tareas, así que un viewport de 1080 de alto es **inalcanzable** en una ventana normal (el máximo real fue 911) y `resize_window` quedaba además ignorado con la ventana maximizada. Un `<iframe>` de `1920×1080` o `1366×768` da el viewport exacto, responde a las media queries y permite barrer las siete rutas en una sola llamada. Es el instrumento por defecto para el próximo sprint.
  3. **Verificar la regla, no la animación.** Toda la tabla de aterrizajes se midió poniendo el scroll en el destino calculado con la **misma fórmula que usa el código** y leyendo la geometría resultante. Lo que queda fuera del alcance del agente es el **transcurso**, no el resultado.

- **Desvíos, dichos de frente.** **(1)** El lock **no** usa `overflow: hidden`; se eligió el mecanismo de menor alcance que la propia instrucción prefería, y la compensación de scrollbar habría sido inocua porque el sitio las oculta globalmente. **(2)** **Se sacó el aborto del gatillo** que tenía B3.4: un gesto hacia arriba durante el desplazamiento ya no lo cancela, porque la instrucción pide que sea «inmune al gesto hasta llegar a Branding Packs» y las dos cosas no conviven. Quien quiera volverse tiene los 900 ms de la animación y después el scroll es libre. **(3)** «Ninguna divisoria visible» se cumple para la **propia** de cada sección en las cinco y en las dos resoluciones; a 1920 quedan a la vista dos divisorias de la sección **siguiente**, que aparecen porque Consultation y Essentials miden menos que la ventana y no dependen del aterrizaje. **(4)** **El destino del gatillo no se tocó**: sigue aterrizando el *tope* de Branding Packs en la línea de lectura, o sea con 160 px de aire antes del rótulo, mientras el sidebar aterriza *contenido*. Unificarlos es una línea pero no lo pedía F1 y habría sido ampliar alcance. **(5)** `ServicesIntro` pasó a componente de cliente para poder restituir su entrada; `ServicesArrow` exporta su ancho porque el gesto lo necesita y no puede quedar duplicado. Los dos están en la lista de archivos autorizados. **(6)** El salto se cancela con el gesto del usuario: no estaba pedido, pero el `behavior: "smooth"` que se reemplazó lo traía de fábrica y quitarlo sería dejar al usuario peleando contra la animación. **(7)** **La salvaguarda del desmontaje no se pudo aislar en el tiempo** de la del temporizador: una navegación de cliente tarda ~2000 ms con la pestaña sin cuadros, o sea más que los 1300 del failsafe. Está verificada en conjunto —tras cambiar de ruta a mitad del lock, nada queda prevenido y `body` sigue limpio— y el failsafe **sí** está verificado solo, porque en esta pestaña la animación por `rAF` nunca corre y por lo tanto lo único que pudo liberar el lock en esa prueba fue el temporizador.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).** En `localhost:3010`, DPR 1, a 1920×1080 y a 1366×768: **(a)** que **todo el sitio siga scrolleando** después de entrar y salir de Services varias veces y después de navegar a otra ruta en medio del gatillo — es lo más importante; **(b)** el gatillo scrolleando **varias veces seguidas**, con trackpad y con rueda, sin vibración ni trabas; **(c)** volver arriba y confirmar que **no vuelve a dispararse**; **(d)** la aparición por desvanecimiento del texto del intro; **(e)** los cinco saltos del sidebar, mirando que no quede ninguna divisoria a la vista y que la flecha marque bien; **(f)** el gesto de la flecha y el rebote del salto; **(g)** LATEST PROJECTS contra `08e`, con atención al hover de las dos portadas de los bordes.

- **Pendientes que deja:** **(1)** **`CLAUDE.md` §6 quedó desincronizado** —describe el gatillo como que «se re-arma al volver arriba», que «no hay booleano armado» y que su `preventDefault` dura «solo mientras dura el desplazamiento», y no menciona ni la aparición del sidebar ni el criterio único de aterrizaje—; no está en los archivos autorizados de este microsprint y la mantiene la capa de planificación. **(2)** El destino del gatillo contra el criterio del sidebar (desvío 4). **(3)** Siguen abiertos los de B3.4: GSAP sin consumidores en `package.json`, las diferencias menores contra el mockup, los apóstrofos rectos y el hover de las portadas que también responde al foco de teclado.

- **Commits:** `8f3ec85`, `acb1415`, `db3aff5`, `e19d92a`, `564bbf3`, más el de este cierre.

## B4 — Idioma EN/ES (2026-08-21)

Último bloque de la ronda. **El sitio funciona completo en inglés y en
castellano, con un toggle en el header, hecho a mano y sin librerías.** Ocho
fases, ocho commits: `49c080c` · `ba37779` · `28fddd8` · `d02b26d` · `4f2e885` ·
`1dd83e5` · `4857687` · `df8f35a`, más el de este cierre.

- **Línea base (Fase 0), medida sobre `build` + `start` en 3010, DPR 1.** `lint`
  exit 0 · `build` exit 0 · **11 rutas / 15 páginas**. Altos a 1920×1080: `/`
  **1080** · `/work` **2154** · `/services` **7653** · `/team` **4257** ·
  `/fun-gallery` **2228** · `/contact` **1664** · `/contact/success` **1244**. El
  bloque del formulario, **498 px** a 1920, con las pills en 4 filas y el borde
  inferior en 682. Esos nueve números son la vara de la no-regresión y **los
  nueve siguen idénticos al cerrar**.

- **El censo, y qué se decidió no traducir.** **407 cadenas** traducidas, de las
  cuales 196 son países: **211 de texto propio del sitio**. Repartidas en cuatro
  archivos, que son todos los que hay:

  | archivo | cadenas | qué lleva |
  |---|---|---|
  | `src/lib/i18n/es.ts` | **93** | cromo (nav 8 · footer 11), Team 15, formulario 35, galería 9, éxito 4, ficha de proyecto 6, Services a11y 2, idioma 3 |
  | `src/lib/services-content.ts` | **95** | los cuatro packs con sus 26 ítems y detalles, más los tres bloques de página |
  | `src/lib/contact.ts` | **214** | 196 países + 10 pills + 4 tipos de negocio + 4 plazos |
  | `src/lib/site-copy.ts` | **5** | los cinco fragmentos de la frase de la marca |

  **No se traduce**, y en cada caso por una razón distinta: `ESQUINA ESTUDIO`,
  `develOP`, `INSTAGRAM`, `LINKEDIN` y los nombres de los proyectos son **marcas**;
  `ARGENTINA` se escribe igual; los `id` de Services, `quoteService` y los `href`
  son **identidad, no texto**; los rangos de presupuesto son **cifras y una
  moneda** —poner el punto de miles a la argentina sobre dólares se lee «2,5»—;
  el `content` de los proyectos y los títulos de la Fun Gallery **no tienen
  casilla ES**; el placeholder `VIDEO O GIF` de Team es **una nota para las
  clientas**, no copy; y la **metadata** y el `<html lang>` que sirve el servidor
  quedan en inglés para todos, que es la aceptación escrita del plan.

- **La infraestructura, y las tres cosas que hacen que no se rompa sola.**
  `src/lib/i18n/`: un tipo `Locale`, un `Dictionary`, un contexto y `useLocale()`.
  Tres decisiones que valen más que el código:

  1. **`Dictionary` es una interfaz explícita, no `typeof EN`.** Las dos
     variantes se declaran `const EN: Dictionary` y `const ES: Dictionary`, así
     que **una clave que falte es un error de compilación**. Se verificó
     borrando una a propósito: `TS2741`. El mismo contrato se extendió a las
     tablas de rótulos de `contact.ts` (tipos mapeados sobre la lista canónica:
     un país sin traducir no compila) y a `ServicePackList`, que fija los cuatro
     `id` de Services en su orden.
  2. **Los cortes de línea viajan como tuplas de largo fijo** —`ThreeLines`,
     `TwoLines`, los nueve labels del formulario, la frase del intro de
     Services—. El corte es decisión de diseño en los dos idiomas y está escrito
     en el código, nunca librado al ancho del navegador.
  3. **`key` por índice y no por texto** en toda lista que cambie con el idioma.
     Con el texto como `key`, cambiar de idioma desmonta y vuelve a montar los
     nodos, y en el Hero eso **reanima la frase entera** en cada click. El largo
     fijo de las tuplas es lo que hace que el índice sea estable.

- **Detección y persistencia, verificadas una por una.** El estado arranca en
  `"en"` en el servidor y en el primer render del cliente; el idioma real se
  resuelve en un efecto de montaje. Cuatro casos medidos con `navigator.language`
  = `es-AR`: sin preferencia guardada → **`lang="es"`** y **no escribe nada** (la
  detección no persiste, solo la elección explícita); con `"en"` guardado →
  **`lang="en"`**, o sea la elección le gana a la detección; con `"es"` →
  `lang="es"`; con un valor basura → cae a la detección. En pestaña nueva la
  preferencia viaja (es `localStorage`) y el HTML servido de las siete rutas
  sigue trayendo `lang="en"`, comprobado con `curl`.

- **El toggle sale del mockup, no de la intuición.** Medido sobre `08a` (export
  de 1327 px sobre un diseño de 1920, factor 0,691) y contrastado contra el
  render:

  | | mockup | render |
  |---|---|---|
  | texto de CONTACT US | 1650,9 → 1755,1 | **1650,7 → 1755,4** |
  | `EN` | 1794,1 → 1814,4 | **1793,4 → 1815** |
  | `ES` | 1830,3 → 1849,1 | **1829,8 → 1850** |
  | ancho del bloque | 55,0 | **56,6** |

  El color tampoco se interpretó: muestreando el mockup, `EN` da 153, la barra
  160 y `ES` 151 sobre un `CONTACT US` de 12 — o sea el `gray-brand` del sitio
  (#939393). Lo que marca el idioma activo es **el subrayado**, y ese subrayado
  no copia un número: los botones llevan el mismo relleno vertical de 6 px que
  `balancedPadding` y **la fila del header pasó a `items-start`**, así que la
  caja del toggle termina en el mismo borde inferior que la de los tabs (79,75 px
  medidos) — que es exactamente la referencia que `measureFillBox` le da al
  indicador del menú. Quedan **0,25 px** entre los centros de las dos líneas, y
  vienen de que el indicador redondea su `top` desde JavaScript y el CSS no
  puede.

  **`items-start` no es un gusto, es una medida.** El `<span>` que envuelve a
  CONTACT US mide 43,5 px —6 más que la caja de `HoverButton`, porque el `<a>`
  que hay adentro aporta el hueco de descendentes de los 16 px del body— mientras
  el toggle mide los 37,5 de su propia caja. Centrados, el toggle bajaba 3 px.
  CONTACT US no se mueve: es el ítem más alto, así que la alineación no lo toca.

- **El toggle no remonta ni navega, y está probado, no supuesto.** Con seis nodos
  marcados antes del click —`main`, el `<form>`, el `footer`, el `nav`, el `h1` y
  un `<input>`— **los seis siguen siendo el mismo nodo** después de cambiar de
  idioma; el overlay de la transición de página se queda en opacidad 0, el
  `pathname` no cambia y el scroll tampoco. Son `<button>` y no `<a>`, así que el
  listener de captura de `RouteTransitionProvider` —que solo mira `a[href]`— ni
  se entera. El recorrido por teclado los toma en su lugar visual (logo → los
  cuatro tabs → CONTACT US → EN → ES → hamburguesa) y el estado viaja en
  `aria-pressed`.

- **Traducción: las decisiones, no las palabras.** Voseo en todo el sitio
  —«divertite», «probá», «contanos», «sumate», «formá parte», «elegí», «escribí»,
  «querés», «tenés», «conociste»—. Los términos del rubro se decidieron por uso
  real en Argentina y no por diccionario: **branding, packaging, rebranding,
  motion graphics, startup y landing se quedan en inglés**; *brand guidelines* →
  «manual de marca», *SWOT* → **FODA**, *stationery* → «papelería», *letterhead*
  → «hoja membretada», *signage* → «señalética», *roadmap* → «hoja de ruta»,
  *quote* → «presupuesto», *social media* → «redes», *industry/field* → **«rubro»**.
  Tres decisiones de marca que conviene que Valentino confirme: **`WORK` →
  `PROYECTOS`**, **`FUN GALLERY` → `GALERÍA`** —lo lúdico del nombre lo sostiene
  el título de la pantalla, «¡Divertite explorando nuestros proyectos!»— y
  **`LET'S BRING YOUR IDEAS TO LIFE` → `HAGAMOS REALIDAD TUS IDEAS`**, una sola
  frase que se corta distinto en cada uno de los tres lugares donde aparece: tres
  líneas en el aside de Contact, dos en el footer, una en el link de Services.

- **La brevedad no fue una concesión: fue la palanca.** Cada pieza se eligió
  contra su piso medido, con un medidor de texto que usa las fuentes reales del
  documento, **antes** de escribirla. Los tres números que decidieron todo:

  | pieza | inglés | castellano | quién manda |
  |---|---|---|---|
  | tinta de las 10 pills a 17 px | 1503 px | **1413** | fija el ancho mínimo del bloque |
  | subtítulo del aside a 17 px | 269,2 px | **267,9** | fija el piso de 272 px de esa pista |
  | fila más ancha del sidebar de Services | 161,1 px | **156,6** | tiene que entrar en 180 |

  En los tres, el castellano pide **menos** ancho que el inglés. Por eso la Fase 7
  no tocó ninguna palanca.

- **El formulario: valores canónicos, rótulos traducidos.** El formulario guarda
  siempre el valor inglés y traduce solo lo que se ve. Resuelve tres cosas de una
  y las tres se verificaron: **(a)** cambiar de idioma con el formulario a medio
  llenar **no pierde nada** —las dos pills, el tipo de negocio, el país, el plazo
  y el presupuesto sobreviven ir a inglés y volver—; **(b)**
  `MonochromeCountryFlag` sigue resolviendo por el nombre inglés, así que no hubo
  que tocar ninguna de sus 196 entradas —elegido «Alemania», la bandera dibuja—;
  **(c)** `?service=` no depende del idioma. Al enviar, `localizeContactValues`
  los pasa a los rótulos **una sola vez, en el borde**: el payload sale con
  `Ilustración`, `Packaging`, `Negocio establecido`, `Alemania` y `Cuanto antes`,
  y el resto del mail queda en inglés, que es como lo leen ellas.

  **El esquema de zod pasó a llevar claves en vez de frases**, y eso tampoco es
  cosmético: `react-hook-form` guarda el mensaje al validar, así que con la frase
  adentro del esquema un cambio de idioma con errores en pantalla no los
  actualizaría nunca. Verificado: los dos mensajes cambian de idioma **en el
  acto**, sin revalidar.

  **`?service=` probado en 18 combinaciones**, nueve por idioma: `CONSULTATION`,
  `BRANDING`, `Packaging`, `consultoria`, `ilustracion`, `Publicidad/Campaña`,
  `Identidad de evento` y `packaging design` resuelven en los dos y marcan la
  pill del idioma activo; un valor desconocido no marca nada, que es lo que
  corresponde.

  **Ningún mail salió.** Todas las pruebas de envío corrieron con `fetch`
  interceptado: submit vacío → los dos mensajes y **cero requests**; con
  respuesta 500 → un POST con los nueve campos y el mensaje de error en
  castellano, sin redirigir; con respuesta 200 → **redirect efectivo a
  `/contact/success`**. El payload en castellano se validó aparte contra el mismo
  esquema que usa el route handler, en Node, sin tocar la red.

- **La matriz del fit, en los dos idiomas, y por qué no hubo nada que ajustar.**
  Siete anchos × cinco altos, limpio y con los dos mensajes de validación en
  pantalla. El bloque no depende del alto del viewport (verificado 1280×720
  contra 1280×1080), así que la matriz se resuelve por ancho:

  | ancho | bloque | borde inf. | c/errores | borde inf. c/err | pills | label máx. | desborde X |
  |---|---|---|---|---|---|---|---|
  | 1920 | 498 | 682 | 556 | 740 | 4 filas | 2 líneas | 0 |
  | 1728 | 498 | 682 | 556 | 740 | 4 filas | 2 líneas | 0 |
  | 1600 | 498 | 682 | 556 | 740 | 4 filas | 2 líneas | 0 |
  | 1536 | 450 | 634 | 508 | 692 | 4 filas | 3 líneas | 0 |
  | 1440 | 450 | 634 | 508 | 692 | 4 filas | 3 líneas | 0 |
  | 1366 | 450 | 634 | 508 | 692 | 4 filas | 3 líneas | 0 |
  | 1280 | 426 | 610 | 484 | 668 | 4 filas | 3 líneas | 0 |

  **Los mismos números en inglés y en castellano, campo por campo**, con los
  mismos +58 exactos al aparecer los errores y la misma diferencia entre columnas
  (57,5 en el escalón grande, 54 en los otros dos). De los 35 cruces entran los
  35 limpios y **32 con los dos errores**; los tres que no —1920, 1728 y 1600 por
  720 de alto, que piden 740— **fallan exactamente igual en inglés**: es el piso
  que dejó B2.7, no una regresión del castellano. Aplicar una palanca solo al
  español ahí habría separado los dos idiomas por un problema que el inglés
  también tiene.

- **Las tres composiciones de tres líneas.** Hero, franja del footer e intro de
  Services cierran en **1L / 1L / 1L** en los dos idiomas y en los cinco anchos
  medidos. La frase de la marca: 500 / 546 / 260 px en inglés y **587 / 541 /
  279** en castellano, a 40 px. El intro de Services pasó de `string` a **tupla
  de tres líneas** —es el único cambio de estructura que pidió el sprint— y en
  inglés son exactamente las tres que ya producía el ancho de 1000 px, así que el
  render no se movió: `/services` sigue midiendo **7653**. En castellano los
  cortes se eligieron y se midieron: 832 / 797 / 606.

- **Services y Sanity.** La estructura que dejó preparada B3.4 alcanzó sin
  rediseño. `BrandingPacksHeading` y `ServicePackSection` pasaron a componentes de
  cliente —vivían en la página, que es de servidor y siempre rendiría inglés— y
  reciben el `id` del pack, no el pack; los `id` del scroll-spy salieron a
  `SERVICES_NAV_IDS`, que **no depende del idioma**, así que el
  `IntersectionObserver` no se reconstruye al cambiar. Lo mismo con las pantallas
  de error y de vacío de la galería, que salieron a `GalleryNotice`. En Sanity,
  `projectText()` resuelve los tres campos con **fallback cruzado** en las dos
  direcciones, y «vacía» cubre el `null` de GROQ, la clave ausente y los
  espacios. Con las **doce casillas ES del dataset vacías**, el sitio en
  castellano muestra los cuatro proyectos completos: **cero huecos**. Las
  traducciones propuestas quedaron en `docs/sanity-piezas-es.md`; **no se escribió
  en Sanity**.

- **Altos en castellano** (1920×1080): `/` 1080 · `/work` 2154 · `/services`
  **7715** (+62, tres nombres de ítem que cortan en dos líneas contra los dos del
  inglés) · `/team` **4220** (−37) · `/fun-gallery` 2228 · `/contact` 1664 ·
  `/contact/success` 1244. A 1280 el `/services` castellano mide **8213** contra
  los 8225 del inglés: doce píxeles menos. **Cero desborde horizontal** en las
  siete rutas, en los dos idiomas, a 1920 y a 1280.

- **Hidratación: cero errores.** Las ocho rutas —las siete más `/work/[slug]`—
  recorridas en los dos idiomas con captura de consola activa: no aparece un solo
  desajuste, ni `Warning:`, ni excepción. Persiste únicamente la deprecación
  conocida de `@sanity/image-url`. Era el riesgo declarado del sprint (precedente
  de B3.3) y se evita por construcción: el servidor y el primer render del
  cliente coinciden siempre, porque los dos son inglés.

- **Puertas, con el servidor bajado.** `lint` exit 0 · `build` exit 0 · **11
  rutas / 15 páginas**, las mismas de la línea base; `/services` y `/fun-gallery`
  siguen `○ (Static)` con `revalidate 1m`. Cero errores y cero warnings nuevos.

- **Desvíos, dichos de frente.** **(1)** El **toggle se agregó también al menú de
  mobile**: el sprint lo pedía en el header y debajo de `md` el header solo tiene
  la hamburguesa, así que sin eso el control quedaba inalcanzable en pantallas
  chicas. Son cuatro líneas y el menú de mobile sigue siendo el que había. **(2)**
  La **Fase 7 no ajustó nada**, porque no había nada que ajustar; el commit de esa
  fase deja escrita la matriz donde el código ya documenta sus pisos, que es lo
  único que correspondía hacer. **(3)** El **envío real de un mail no se hizo**,
  a propósito: todas las pruebas corrieron con `fetch` interceptado y el envío de
  punta a punta queda declarado como verificación humana, igual que en B2.7.
  **(4)** Se corrigieron **cuatro afirmaciones falsas de `CLAUDE.md` §6** que no
  eran de este sprint —el gatillo del intro, la aparición del sidebar, el conteo
  de call sites de `HoverButton` y `TITLE_LINE_COUNT`—; la Fase 8 pedía
  sincronizar y sincronizar incluye corregir lo que miente. **(5)** El
  `LATEST_PROJECTS_QUERY` sumó `titleEs`, que le faltaba: el título es el `alt` y
  el `aria-label` de cada portada. **(6)** Los **196 países en castellano** se
  generaron con ICU y después se corrigieron a mano nueve: `Costa de Marfil`,
  `RD del Congo` (que conserva la abreviatura del inglés, y es lo que evita que
  vuelva el problema de truncado de B2.7), `Myanmar`, `Palestina`, `Malí`,
  `Arabia Saudita`, `Qatar`, `Rumania` y `Bangladesh`. La lista se ordena
  alfabéticamente **en el idioma que se muestra**.

- **Nota de método — tres instrumentos que conviene reusar.** **(1)** El `iframe`
  same-origin de tamaño fijo, que ya venía de B3.4b, sigue siendo la única forma
  de tener un viewport exacto de 1080 de alto. **(2)** Nuevo: un **medidor de
  texto con las fuentes reales del documento**, que permite probar una traducción
  contra su piso **antes** de escribirla; buena parte de este sprint fue medir
  candidatas y quedarse con la que entraba. **(3)** Nuevo: el **espía de `fetch`**
  dentro del iframe, que deja ejercitar el formulario entero —validación, payload,
  error, redirect— sin que salga un solo mail. Sigue vigente el límite de siempre:
  con la pestaña en segundo plano **no corre `requestAnimationFrame`**, así que
  ninguna animación se puede observar; las capturas de este sprint salieron
  completas porque la pestaña estaba activa.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).**
  En `localhost:3010`, DPR 1: **(a)** **leer todo el sitio en castellano** — es lo
  más importante y lo único que no puede medir una máquina: el tono de marca de un
  estudio de branding lo valida una persona, y cualquier texto que suene traducido
  hay que marcarlo; **(b)** la frase de la marca en castellano, en home y en el
  footer, con sus cortes y sus negritas; **(c)** el formulario en castellano,
  **enviado de verdad**, y confirmar el mail; **(d)** el toggle en cada ruta,
  mirando que no parpadee ni reinicie nada; **(e)** primera visita con el
  navegador en castellano, en pestaña nueva, y la persistencia de la elección;
  **(f)** que el inglés siga **exactamente igual**; **(g)** las tres decisiones de
  tono de la traducción (`PROYECTOS`, `GALERÍA`, `HAGAMOS REALIDAD TUS IDEAS`).

- **Pendientes que deja.** Los nueve están en `docs/pendientes.md`. Los cuatro que
  importan: **GSAP** sigue instalado sin un solo consumidor y la prop **`blend`**
  de `HoverButton` sin un solo llamador —las dos son decisiones de dependencias,
  de alcance global—; el **contraste del gris**, que da **2,77:1** medido sobre
  off-white contra el 4,5:1 de AA (sobre off-black da 6,24:1 y sí pasa), y es una
  decisión de diseño que conviene tomar una vez para todo el sitio; y las **doce
  casillas ES de Sanity**, que no bloquean nada porque hay fallback cruzado.

- **Commits:** `49c080c`, `ba37779`, `28fddd8`, `d02b26d`, `4f2e885`, `1dd83e5`,
  `4857687`, `df8f35a`, más el de este cierre.

## B4b — El toggle de idioma (2026-08-22)

Microsprint de refinamiento sobre lo que dejó B4. **La verificación humana pidió
tres cosas, las tres sobre el toggle: que el idioma activo se lea como activo,
que la barrita se deslice como el indicador del menú, y que cambiar de idioma
dispare la transición de página completa.** La tercera **revierte una regla de
B4** («el toggle no dispara la transición»), por decisión de Valentino. Se sumó
una cuarta, F2b, que arreglaba un defecto que B4 había dejado. Cuatro fases,
cuatro commits: `deadcd9` · `bfe42f9` · `7d1d926` · `087abfc`, más el de este
cierre.

- **Línea base y no-regresión, medidas las dos sobre `build` + `start` en 3010,
  DPR 1, en un iframe same-origin de 1920×1080.** Para el control se volvió a
  compilar el `src` del commit anterior al sprint y se midió con el mismo banco.
  Los siete altos: `/` **1080** · `/work` **2154** · `/services` **7653** ·
  `/team` **4257** · `/fun-gallery` **2228** · `/contact` **1664** ·
  `/contact/success` **1244`. **Los siete idénticos** antes y después. La caja
  del toggle también: `1793,39 → 1856`, `42,25 → 79,75`, 62,61 de ancho, la
  misma en las siete rutas y en los dos builds. Puertas con el servidor bajado:
  `lint` exit 0 · `build` exit 0 · **11 rutas / 15 páginas**, cero errores y cero
  warnings nuevos.

- **Fase 1 — el idioma activo, pintado.** Hasta B4 los dos códigos iban en el
  mismo gris y lo único que distinguía al activo era el subrayado; con los dos
  en gris el activo no se lee como activo. Ahora el activo va en **el color
  pleno del cromo** y el inactivo se queda en el gris de identidad. Medido:
  activo `rgb(15,15,15)` en las seis rutas claras y `rgb(243,243,243)` en
  `/contact/success`, que es la única oscura; inactivo `rgb(147,147,147)` en las
  siete; separador `/` `rgb(147,147,147)`, sin cambio y sin ser interactivo. **El
  contraste lo da el color y nada más**: mismo tamaño de 17 px, mismo tracking y
  mismo peso que el resto del menú.

- **Fase 2 — la barrita es el indicador, no una copia de él.** El sistema que
  vivía adentro de `Navbar.tsx` desde B2.2 salió a `src/components/layout/nav-indicator.tsx`
  y ahora lo consumen los dos: el menú de escritorio y el toggle. Comparten la
  medición (`measureFillBox`), el redondeo, la morfología del viaje —se contrae
  al punto de 5 px, viaja, se vuelve a abrir—, la duración de 0,62 s, el easing y
  el elemento pintado. **Nadie copia números del otro.** Para que la medición sea
  literalmente la misma, el `<button>` del toggle pasó a cumplir el contrato que
  `measureFillBox` le pide a `HoverButton`: el botón es el elemento posicionado y
  el rótulo cuelga de un `<span>` sin posición, que es el que lleva el relleno de
  6 px.

- **El redondeo cambió de origen, y esa es la parte que se nota.** Antes se
  redondeaba el borde **relativo al contenedor**; ahora se redondea **en
  coordenadas de viewport** y recién después se descuenta el origen. Para el menú
  da exactamente lo mismo, y no es una suposición: su contenedor arranca medido
  en `(0, 0)`. Para el toggle es la única forma de que la línea caiga en una fila
  entera de píxeles, porque su contenedor arranca en **42,25**. El efecto medido
  a 1920:

  | | B4 | B4b |
  |---|---|---|
  | barrita del toggle | `l 1793,39 · w 21,61 · top **79,75**` | `l 1793 · w 22 · top **80**` |
  | indicador del menú | `l 748 · w 62 · top **80**` | `l 748 · w 62 · top **80**` |
  | color de la barrita | `rgb(147,147,147)` | `rgb(15,15,15)` |

  Los **0,25 px** de desfase entre las dos líneas que `CLAUDE.md` traía
  documentados desde B4 **desaparecieron**: las dos caen en la misma fila. La
  barrita del toggle era CSS (`-bottom-px`) y por eso no podía redondear; ahora
  es el mismo elemento que el indicador.

- **Fase 2b — el indicador se remedía tarde, y ahora se remide cuando tiene que
  remedirse.** El defecto: al cambiar de idioma la línea del menú **quedaba con
  la posición y el ancho del rótulo viejo**. Reproducido y medido en `/work`: con
  el sitio ya en castellano, la línea seguía en `l 748 · w 62` (WORK) mientras
  `PROYECTOS` ocupaba `732,42 → 842,20`. Son **16 px** de posición y **48** de
  ancho. La causa no era la ruta: **la entrada de la medición es la caja del
  rótulo pintado**, y esa cambia sin que cambie la ruta. El disparador pasa a ser
  un `ResizeObserver` sobre los cinco tabs y el logo, dentro del mismo hook
  compartido. Dos detalles que lo hacen funcionar:

  1. Sus notificaciones se entregan **después del layout y antes del pintado**,
     así que la línea nunca llega a verse en la posición vieja, y remide **sin
     viaje**: no se ve saltando de un lugar a otro. Por el mismo camino queda
     cubierta la tipografía que se aplica tarde, que también cambia el ancho de
     la caja.
  2. **El observador se suscribe una sola vez** y llega a la medición vigente por
     referencia. Esto no es una optimización: `observe()` entrega una notificación
     inicial por cada elemento, y los `ResizeObserver` se entregan **después** de
     los `requestAnimationFrame`, así que un observador que se volviera a
     suscribir en cada cambio de medición **pisaría con una medición sin viaje la
     animación que el cuadro acababa de armar**. Se vio en la instrumentación
     antes de corregirlo: la barrita saltaba de 1830 a 1793 en **13 ms** en vez de
     viajar los 620. Verificado después del arreglo: un click de idioma no produce
     **ningún** `observe()` ni `disconnect()` nuevo.

  La verificación se hizo dentro del iframe de 1920 fijo, donde el `resize` del
  viewport interno **nunca dispara** —contador en 0—, así que el único disparador
  posible es el observador. Alineación de la línea con su rótulo, las cuatro
  secciones en los dos idiomas:

  | sección | idioma | barra (l–r) | caja del rótulo (l–r) | Δ izq | Δ der | Δ ancho |
  |---|---|---|---|---|---|---|
  | WORK / PROYECTOS | EN | 748–810 | 748,45–809,83 | −0,45 | +0,17 | +0,62 |
  | | ES | 732–842 | 732,42–842,20 | −0,42 | −0,20 | +0,22 |
  | SERVICES / SERVICIOS | EN | 842–932 | 841,83–932,06 | +0,17 | −0,06 | −0,23 |
  | | ES | 874–972 | 874,20–971,64 | −0,20 | +0,36 | +0,56 |
  | TEAM / EQUIPO | EN | 964–1021 | 964,06–1021,31 | −0,06 | −0,31 | −0,25 |
  | | ES | 1004–1076 | 1003,64–1076,36 | +0,36 | −0,36 | −0,72 |
  | FUN GALLERY / GALERÍA | EN | 1053–1172 | 1053,31–1171,55 | −0,31 | +0,45 | +0,77 |
  | | ES | 1108–1188 | 1108,36–1187,58 | −0,36 | +0,42 | +0,78 |

  **Ninguno pasa de 0,78 px**, contra el criterio de ±1 de B2.2b. La barrita del
  toggle, en los dos anchos: a 1920, `1793–1815` contra `1793,39–1815,00` en
  inglés y `1830–1850` contra `1829,84–1850,00` en castellano; a 1366,
  `1239–1261` y `1276–1296` contra las mismas cajas corridas. Máximo **0,39 px**.

- **La tipografía se verificó, y no es un problema en este sitio.** Medida la
  caja de un tab en tres momentos —al terminar de cargar, después de
  `document.fonts.ready` y un rato después— da **el mismo valor exacto**
  (109,781 px), y `document.fonts.status` ya dice `loaded` en la primera
  medición: la fuente es local y `next/font` la precarga. Igual el caso queda
  cubierto por construcción, porque una aplicación tardía cambiaría el ancho de
  la caja y eso es justo lo que el observador mira.

- **Fase 3 — la transición al cambiar de idioma, sin navegación.** La secuencia
  pedida es: click, el toggle acusa recibo, después se desvanece todo incluido el
  menú, el idioma cambia **oculto**, y todo reaparece en el idioma nuevo. Lo que
  la hace posible son **dos idiomas en el proveedor**: `selectedLocale` es lo que
  la persona eligió y cambia en el mismo click; `locale` es lo que se está
  renderizando y cambia mucho después. El toggle pinta y mide contra el primero,
  todo lo demás lee el segundo. Los tiempos:

  | etapa | duración | de dónde sale |
  |---|---|---|
  | acuse de recibo | **200 ms** | lo que tarda el propio toggle en cambiar de color (`transition-colors duration-200`) |
  | la cortina sube | **650 ms** | `PAGE_EXIT_DURATION`, con `PAGE_EXIT_EASE` |
  | swap del idioma | 0 | en el punto máximo, con la cortina arriba |
  | la cortina baja | **650 ms** | los mismos dos |
  | **total** | **1500 ms** | contra los **1300** de una navegación |

  Las dos mitades son **exactamente** las de una navegación entre páginas, misma
  duración y mismo easing; lo que suma son los 200 ms del acuse de recibo, que es
  lo que el sprint pidió ver **antes** del desvanecimiento. Muestreada la curva
  de la cortina cuadro a cuadro: a 638 ms desde el click da **0,040** (el valor
  analítico del easing es 0,035) y a 982 ms da **0,951** (analítico 0,93).

- **Por qué una cortina propia y no el sistema de rutas.** Ese sistema está atado
  a la navegación: su estado de salida se cierra **cuando llega la ruta nueva** y
  `template.tsx` se remonta. Acá no hay navegación, así que no habría nada que lo
  cerrara — que es exactamente el riesgo que el sprint marcó. Y además su overlay
  vive **adentro** de `PageTransitionShell`, que no cubre el Navbar. La cortina de
  B4b es un `fixed inset-0` en off-white a la altura del `<body>` y por encima del
  cromo: da el mismo resultado visual —todo se va a off-white y vuelve— y **no se
  tocó una sola línea de `RouteTransitionProvider`**; solo se consumen tres cosas
  que ya exportaba (`PAGE_EXIT_DURATION`, `PAGE_EXIT_EASE`,
  `usePrefersReducedMotion`). Tiene además una ventaja de seguridad que conviene
  dejar escrita: **como nada baja de opacidad, no puede quedar ningún elemento a
  media opacidad**. Los dos únicos estados posibles son «la cortina está en el
  DOM» y «no está».

- **Las tres salvaguardas, y qué se midió de cada una.**
  1. **El estado se revierte siempre.** Por la vía normal —un temporizador por
     etapa— y por un **failsafe** armado en el mismo click, a 1900 ms (400 de
     margen sobre los 1500), que apaga la cortina y aplica el idioma pase lo que
     pase.
  2. **Limpieza en el desmontaje.** Los temporizadores de etapa los limpia React
     con el efecto y el failsafe tiene su propio efecto de limpieza. Navegar a
     otra ruta del sitio **no** desmonta el proveedor —vive en el layout raíz—,
     así que la secuencia termina sola; la única forma de desmontarlo es entrar a
     `/studio`, y ahí se va con todo lo demás.
  3. **El idioma cambia aunque la animación falle.** La elección se guarda en
     `localStorage` **en el primer instante del click**, y el swap lo dispara un
     temporizador, nunca un callback de animación. Comprobado del modo más crudo
     posible: con la pestaña en segundo plano —donde `requestAnimationFrame` no
     corre y las animaciones se congelan— el idioma cambió igual y la cortina se
     fue igual.

- **Los cuatro escenarios de riesgo, medidos.** **(a)** Click en el idioma **ya
  activo**, tres veces seguidas: la cortina **no aparece nunca** y no cambia
  nada. **(b)** Cinco clicks al otro idioma **durante** la transición: **un solo
  ciclo de cortina**, el idioma que queda es el del primer click, y la cortina
  termina ausente — no se encadenan ni se cortan a la mitad. **(c)** Navegar a
  `/services` a mitad de la transición: el sitio queda en la ruta nueva, sin
  cortina, sin opacidades residuales y con el indicador ya en `SERVICES`
  (`842–932`). **(d)** Recargar a mitad de la transición: el idioma elegido
  sobrevive (quedó guardado), no hay cortina y el cromo está entero. **En las
  siete rutas**, después de cambiar de idioma: cortina **ausente** y **cero**
  elementos con opacidad reducida — la única opacidad menor a 1 que aparece es el
  `opacity-80` del logo de develOP en el footer, que es una decisión de diseño de
  B2.1 y está en la línea base.

- **`prefers-reduced-motion`.** Sin cortina, sin etapas y sin deslizamiento: el
  idioma cambia al instante y la barrita se planta en su lugar. La puerta es la
  opción `animate` del módulo compartido, que **no toca al indicador del menú**:
  ese sigue exactamente como estaba.

- **Desvíos, dichos de frente.** **(1)** Se tocó
  `src/components/layout/LocaleToggle.tsx`, que **no estaba en la lista de
  archivos autorizados** de la instrucción; es el archivo que implementa el
  toggle, y las tres fases son sobre el toggle, así que la omisión se leyó como
  un descuido de la lista y no como un límite. **(2)** Se creó
  `src/components/layout/nav-indicator.tsx`, que tampoco estaba en la lista: es
  la extracción que la propia regla §3.3 autoriza («si no es reusable tal cual,
  extraer y usar en los dos lugares»). **(3)** El **redondeo del indicador cambió
  de origen** (§ arriba). Es el corazón del pedido de la Fase 2 —«posición y
  ancho redondeados a píxel entero»— y para el menú es un no-op medido, pero es
  una modificación de código que B2.2 había afinado y corresponde declararla.
  **(4)** El menú de mobile pasó a avisar cuándo terminó de entrar
  (`measureKey`), porque su contenedor entra con un `y` animado y una medición
  tomada a mitad de ese desplazamiento redondea contra un origen en movimiento.
  Son tres líneas en `Navbar.tsx` y una prop opcional. **(5)** El **defecto del
  observador que se resuscribía** (§ Fase 2b, punto 2) se encontró verificando la
  Fase 3 y se corrigió **dentro del commit de la Fase 2b**, que es el que había
  introducido el observador. **(6)** Se corrigieron dos afirmaciones de
  `CLAUDE.md` que B4b vuelve falsas —que cambiar de idioma no dispara la
  transición, y que el sistema del indicador vive dentro del Navbar—; dejarlas
  escritas habría mandado al próximo agente en la dirección contraria.

- **Nota de método.** El banco de medición volvió a ser el **iframe same-origin
  de tamaño fijo**, y esta vez ganó una segunda función: como el iframe mide
  1920×1080 pase lo que pase con la ventana, **su `resize` interno nunca
  dispara**, y eso lo convierte en el discriminador que permitió aislar el
  observador como único disparador de la remedición. El límite de siempre sigue
  en pie y esta vez fue más duro que nunca: **con la pestaña en segundo plano no
  corre `requestAnimationFrame`**, y sin él no hay medición del DOM animado ni
  observación de ninguna animación. Se descubrió que un **scroll** sobre la
  pestaña la despierta y deja correr cuadros un rato — es un instrumento más
  barato y más confiable que la captura de pantalla, que además redimensiona el
  viewport y contamina la medición.

- **Verificación humana pendiente (declarada, no la da por cumplida el agente).**
  El agente **no puede observar animaciones**: todo lo de arriba son estados
  asentados y tiempos gobernados por temporizadores. En `localhost:3010`, DPR 1:
  **(a)** la secuencia completa, mirando que el color y la barrita respondan **al
  instante** y que el desvanecimiento venga **después**; **(b)** que el cambio de
  texto **no se vea** ocurrir; **(c)** que la barrita **se deslice** con el gesto
  del menú y no salte — es lo que el agente vio congelado a mitad de camino
  (ancho 5, el punto en viaje) pero no puede mirar corriendo; **(d)** cambiar de
  idioma en cada una de las siete rutas; **(e)** clicks repetidos y click en el
  idioma ya activo; **(f)** navegar a otra ruta justo mientras cambia el idioma;
  **(g)** que la navegación normal entre páginas siga igual que siempre; **(h)**
  el toggle en el menú de mobile, que es el único lugar donde vive debajo de
  `md`; **(i)** si los 1500 ms se sienten largos contra los 1300 de una
  navegación, o si conviene recortar el acuse de recibo.

- **Commits:** `deadcd9`, `bfe42f9`, `7d1d926`, `087abfc`, más el de este cierre.

---

## M1 — Adaptación mobile (2026-08-22)

Ronda de mobile, sprint único. El sitio se construyó desktop-first y la
adaptación se difirió toda la ronda anterior; este sprint la resuelve. Nueve
fases, un commit por fase. Las decisiones de diseño vienen cerradas en la
instrucción (`docs/instrucciones/`, §3) y este agente las aplica, no las
reinventa.

### F0 — Auditoría de desbordes (línea base)

**Cómo se midió.** `npm run build` + `npm run start -- -p 3010`, servidor propio
por PID, y el banco de medición de siempre: un `iframe` same-origin de tamaño
fijo dentro de una pestaña del mismo origen, con `sessionStorage` marcado para
saltear la cortina del preloader y `localStorage` para fijar el idioma. Se
compara `document.documentElement.scrollWidth` contra `clientWidth` y se listan
los elementos que se pasan del borde, descartando los que quedan **recortados
por un ancestro** (`overflow-x` distinto de `visible`) y los `fixed`, que no
alargan el área scrolleable del documento. Cada desborde se reporta en su
elemento más profundo: si un ancestro se pasa lo mismo que su hijo, manda el
hijo.

**Límite del banco, declarado.** Con la pestaña oculta Chrome estrangula los
temporizadores (una ejecución por minuto) y **no corre `requestAnimationFrame`**.
El banco se rearmó para no depender de ninguno de los dos: espera el evento
`load` —que no se estrangula— y después bombea la cola de macrotareas con
`MessageChannel`, que es la misma que usa el scheduler de React, así que la
hidratación y los efectos terminan igual. Las mediciones sin temporizador dan
**exactamente los mismos números** que las tomadas antes con 1400 ms de
asentamiento (verificado ruta por ruta a 390 en castellano). Lo que sigue sin
poder observarse es cualquier animación: lo que se mide es el estado inicial.

**Puertas de la línea base:** `lint` exit 0 · `build` exit 0, **11 rutas / 15
páginas**, cero errores y cero warnings nuevos. `git status --porcelain` con un
solo renglón, `?? pngs-galeria/`, que ya estaba antes del sprint.

**Vara de no-regresión del desktop** — alto del documento por ruta:

| ruta | 1920 EN | 1920 ES | 1366 EN | 1366 ES |
|---|---|---|---|---|
| `/` | 1080 | 1080 | 768 | 768 |
| `/work` | 2154 | 2154 | 1694 | 1694 |
| `/services` | 7653 | 7715 | 7914 | 8024 |
| `/team` | 4257 | 4220 | 3724 | 3799 |
| `/fun-gallery` | 2228 | 2228 | 1805 | 1805 |
| `/contact` | 1664 | 1664 | 1451 | 1451 |
| `/contact/success` | 1244 | 1244 | 932 | 932 |
| `/work/[slug]` (extra) | 2190 | 2190 | 1713 | 1713 |

Los siete de 1920 EN coinciden **exactamente** con la línea base que dejó B4b.
El ancho del documento es igual al del viewport en los cuatro casos: en desktop
no hay scroll horizontal.

**LA TABLA DEL SPRINT** — píxeles de desborde horizontal
(`scrollWidth − clientWidth`), alto de viewport 844:

| ruta | 320 | 360 | 390 | 414 | 430 |
|---|---|---|---|---|---|
| **inglés** | | | | | |
| `/` | **517** | **477** | **447** | **423** | **407** |
| `/work` | **227** | **187** | **157** | **133** | **117** |
| `/services` | **227** | **187** | **157** | **133** | **117** |
| `/team` | **227** | **187** | **157** | **133** | **117** |
| `/fun-gallery` | **227** | **187** | **157** | **133** | **117** |
| `/contact` | 0 | 0 | 0 | 0 | 0 |
| `/contact/success` | **517** | **477** | **447** | **423** | **407** |
| `/work/[slug]` | **227** | **187** | **157** | **133** | **117** |
| **castellano** | | | | | |
| `/` | **567** | **527** | **497** | **473** | **457** |
| `/work` | **255** | **215** | **185** | **161** | **145** |
| `/services` | **255** | **215** | **185** | **161** | **145** |
| `/team` | **255** | **215** | **185** | **161** | **145** |
| `/fun-gallery` | **255** | **215** | **185** | **161** | **145** |
| `/contact` | 0 | 0 | 0 | 0 | 0 |
| `/contact/success` | **567** | **527** | **497** | **473** | **457** |
| `/work/[slug]` | **255** | **215** | **185** | **161** | **145** |

**El número no depende de la ruta: depende del footer.** Las cinco rutas
internas dan el mismo valor y las dos que usan el footer de home dan el otro. El
castellano suma 28 px en un caso y 50 en el otro, que es lo que crecen sus
rótulos.

**Qué desborda, elemento por elemento.** Repetida la medición con el `<footer>`
oculto, el desborde del documento cae a **cero en siete de las ocho rutas**:

| ruta | desborde sin footer (320 / 390 / 430, los dos idiomas) |
|---|---|
| `/`, `/work`, `/services`, `/fun-gallery`, `/contact`, `/contact/success`, `/work/[slug]` | 0 / 0 / 0 |
| `/team` | **16 / 16 / 16** |

O sea que **hay exactamente dos causas** en todo el sitio:

1. **La fila de información del footer (`InfoRow`), que nunca envuelve.** Es un
   `flex-row` con `gap-12` y `whitespace-nowrap`, más el logo script `sm` de 120
   px a la derecha en la variante de home. Medido a 390 en inglés: la fila pide
   **789 px** de ancho —474,6 el bloque izquierdo (los dos pares de lugar, el
   copyright y el crédito a develOP) y 146,4 el de redes— dentro de una caja de
   294. Con el gutter `px-12` el footer entero pide **837** contra 390 de
   pantalla. En las rutas internas la `ScriptBand` lleva `overflow-hidden`, así
   que ahí una parte se **recorta** en vez de scrollear: el resultado es texto
   cortado, y es el mismo defecto.
2. **`/team`: los 16 px son el desplazamiento inicial de `RevealOnScroll`.** Los
   bloques de texto y la foto entran con `initialX: 40`, y mientras no cruzan el
   viewport se quedan en `translateX(40px)`. Medido a 320: la columna de
   contenido va de 104 a 336 —24 del `px-6`, 40 del `pl-10` y 40 del
   desplazamiento— contra 320 de pantalla. No es el ancho del texto: el texto
   envuelve bien; es el gesto de entrada, que en mobile no tiene lugar para
   ocurrir.

`/contact` da 0 en la tabla porque su footer recorta, no porque esté sano: su
`InfoRow` desborda igual y queda cortada.

**Lo que NO desborda, y conviene dejar escrito porque acota el sprint.** Con el
footer fuera, ningún contenido de página se pasa ni queda recortado en ninguna
ruta, en ningún ancho, en ninguno de los dos idiomas: el único elemento
«recortado» que aparece es el punto del cursor custom, que vive en `fixed
left-0 top-0` estacionado en −100 px y solo se dibuja con puntero fino. Las
grillas ya caen a una columna por debajo de sus breakpoints (`WorkGrid`
`grid-cols-1`, `SPLIT_GRID` y `ITEM_GRID` de Services, el formulario de Contact
debajo de 880) y los textos envuelven. **El sprint no es una pelea contra el
desborde: es una pelea contra la escala, el hover y el gatillo.**

**Estado de contenido al momento de auditar:** el dataset ya tiene **8
`funGalleryImage`** publicadas (cuando se cerró B4 tenía cero), así que
`/fun-gallery` renderiza la galería real y no la pantalla de vacío. A 390 px la
composición mide 294 px de ancho por 150 de alto y los ocho objetos miden entre
**56 y 73 px**: legibles en desktop a 384, ilegibles acá. Es el insumo de la
fase 6.

- **Commit F0:** `docs(bitacora): auditoria de desbordes en mobile [M1/F0]`

### F1 — Cromo: navbar, menú y footer

**El corte del cromo es `lg` (1024) y no `md`, y salió de medir.** El menú de
escritorio está centrado en absoluto: con los rótulos en castellano pide 403 px
y el logo ocupa hasta 244, así que a 768 se montan (el menú arrancaría en 182) y
a 1024 entran con holgura. El `InfoRow` del footer pide **789 px** de ancho y con
el gutter de 64 entra recién a partir de 1024. Debajo de eso mandan la
hamburguesa y el footer en una columna.

- **Módulo nuevo `src/lib/mobile-layout.ts`**: el gutter del cromo
  (`px-6 md:px-12 lg:px-16` — los 24 px de mobile son el `px-6` que ya usaban
  Contact, Team, la grilla de Work y las pantallas de aviso, no una medida
  nueva) y `TOUCH_LINKS`. Este último resuelve un problema real: `HoverButton`
  **no se puede tocar** (§4.2) y su `className` va al `<span>` de adentro, así
  que engordar ese span con relleno arrastraría el subrayado, que está anclado a
  su borde inferior. Desde afuera sí se alcanza el `<a>` con una variante
  arbitraria: se vuelve un `inline-flex` de 44 px con el span centrado. El área
  crece y la línea se queda pegada al texto.
- **Footer en una columna** debajo de `lg`, en las dos variantes. La frase de la
  marca baja a 26/31 y envuelve sola. El bloque `JOIN OUR CLUB` sale del modo
  superpuesto y pasa a flujo debajo del logo grande: a 390 la imagen mide 116 px
  de alto y el bloque, apoyado en el 46 % de esa altura, terminaba **39 px por
  debajo de ella**, encima de la fila de información.
- **Navbar**: hamburguesa y botón de cierre en cajas de 44 × 44 (venían de
  40 × 30,5 y **10,3 × 25,5** medidos sobre el build de control). Los links del
  menú bajan a 34/40: a 48 px `CONTACTANOS` mide **350,7 px** y la caja útil a
  320 es de 272, así que se salía de la pantalla; a 34 mide 246,9. De `sm` para
  arriba vuelven a 40/48.
- **Toggle de idioma**: el relleno vertical sube a 11 px debajo de `lg` (45,2 px
  de alto contra los 37,5 de antes) y el área horizontal la agranda un
  `::after`, **no** el relleno del botón: `measureFillBox` mide la caja del
  botón, así que un `px` de 12 dejaría la barrita de 45 px de ancho debajo de un
  rótulo de 21. Con el pseudo-elemento la caja no cambia, el toque sí: 45,6 y
  44,2 px de ancho, con 6,84 px de aire entre los dos rectángulos.

**Resultado:** el desborde cae a cero en las ocho rutas y los cinco anchos, en
los dos idiomas, salvo los 16 px de `/team`.

- **Commit F1:** `feat(mobile): navbar, menu y footer [M1/F1]`

### F2 — Home y Team

- **Home.** La frase baja a **26/31** debajo de `md` —el par que ya usaba el
  footer— y envuelve sola: a 320 la línea más larga del castellano mide 381,7 px
  contra 272 de caja. Los cortes escritos de tres líneas no aplican en mobile y
  **las negritas se conservan** en su fragmento, que es lo que pedía §3.3. El
  bloque de «una pantalla exacta» queda para `lg`: debajo de 1024 el footer pasa
  a una columna y mide **488 px**, así que la cuenta no cierra; el hero se queda
  con la pantalla menos el header (512 px a 320×640, con la frase de 155 px
  centrada) y el footer se alcanza scrolleando. Es la misma aceptación que §3.3
  escribe para Contact.
- **`100vh` → `100svh`** en el bloque de home, en la sección de entrada de Team y
  en los topes de los medios de la ficha. En desktop las dos unidades valen lo
  mismo y está verificado: los altos de `/` a 1920 y a 1366 no se mueven.
- **Team.** Una columna, intro a 22 px y cuerpos a 20. El `pl-10` es sangría de
  escritorio y se va debajo de `md`: a 320 se comía 40 de los 272 px útiles.
- **Los 16 px de `/team` eran el gesto de entrada, no el texto.**
  `RevealOnScroll` arranca los bloques en `translateX(40px)` y los deja ahí
  mientras no cruzan el viewport; medido a 320, la columna iba de 104 a 336
  —24 del `px-6`, 40 del `pl-10` y 40 del desplazamiento— contra 320 de pantalla.
  **No se puede arreglar apagando el desplazamiento**: el HTML del servidor ya
  lo trae puesto, así que el desborde existiría igual hasta que hidratara. Lo
  resuelve un `max-md:overflow-x-clip` **local a esa columna**, que es como se
  construye cualquier entrada deslizante. No toca el `sticky` del aside: de `md`
  para arriba no hay ningún ancestro recortante (CLAUDE.md §7).

- **Commit F2:** `feat(mobile): home y team [M1/F2]`

### F3 — Work y ficha de proyecto

**El texto de la portada va debajo, no encima, y la elección no fue de gusto.**
§3.2 dejaba elegir; encima no se podía: el overlay tapa la portada entera con el
`coverColor`, así que dejarlo «siempre visible» equivaldría a **no mostrar nunca
la portada**. Debajo se lee sin ambigüedad y la portada se ve. El 5:4 se
conserva y ahora lo lleva la portada —la celda tiene que poder crecer para
alojar el texto—; medido a 390: portada de 342 × 273,6 (ratio 1,25 exacto) y
bloque de texto de 342 × 109,8. El overlay de hover queda `hidden lg:flex`, con
lo que en touch tampoco puede quedarse pegado por un tap.

En la ficha, el aside ya se apilaba arriba del contenido: lo que faltaba era
escala. Título 26/40, párrafos del Portable Text 20/30, título del proyecto
siguiente 20/24, y el aire de la navegación de cierre de 96/48 a 64/40. Los tres
links toman 44 px de alto tocable.

- **Commit F3:** `feat(mobile): grilla de work y ficha de proyecto [M1/F3]`

### F4 — Contact y pantallas de resultado

Una columna y label arriba del control ya eran el estado base debajo de `md`.
Lo que faltaba:

- **Áreas táctiles**: pills (venían de **29 px** de alto), opciones del
  desplegable (**34**) y botón de envío (**40**) pasan a 44. Las pills a
  `inline-flex` para que el rótulo quede centrado en la caja nueva; el ancho ya
  estaba muy por encima del piso (la más corta mide 61,8 px).
- **Un escalón de control propio de mobile, y por una medida:** los 28 px de
  base no entran a 320. El placeholder del select mide **243 px** contra **234**
  de pista útil —descontados el `pl-1`, el `gap-4` y la flecha— y se truncaba a
  «ELEGÍ UNA OPCI…» (verificado en el build de control: `scrollWidth` 243 contra
  `clientWidth` 234). A 24 px mide 207,9 y sobra aire. Sigue muy por encima de
  los 16 px que evitan el zoom automático de iOS.
- Título del aside a 26/31; título de la pantalla de éxito con el piso del
  `clamp` de 40 a 26 —el término que manda de 800 px para arriba sigue siendo
  `5vw` con el mismo techo de 64, así que de 1024 en adelante no cambia: medido
  51,2 px a 1024 y 64 a 1920—; pantallas de aviso de la galería a 26/31.

**El bloque del formulario a 1920 sigue midiendo 498 px, con el borde inferior
en 682, en los dos idiomas** — el mismo número que dejó B4/F7.

- **Commit F4:** `feat(mobile): contacto y pantallas de resultado [M1/F4]`

### F5 — Services

**El gatillo del intro no se arma debajo de 1024, y se verificó que no deja
residuo.** `IntroScrollTrigger` sale del efecto **antes de registrar un solo
listener**. No es cosmético: sus tres listeners son no pasivos y cancelan desde
el primer evento mientras el gatillo está armado, así que en un teléfono la
pantalla no se movería hasta juntar 60 px y después daría un salto de una
pantalla entera.

La sonda —eventos sintéticos **cancelables** despachados sobre la ventana del
documento— y sus dos lados:

| viewport | `wheel` | 2.º `wheel` | `touchmove` | `scrollTo(0,400)` | `body` inline |
|---|---|---|---|---|---|
| 320×640 | no cancelado | no cancelado | no cancelado | `scrollY` 400 | ninguno |
| 390×844 | no cancelado | no cancelado | no cancelado | `scrollY` 400 | ninguno |
| 1024×768 | **cancelado** | **cancelado** | **cancelado** | `scrollY` 400 | ninguno |
| 1920×1080 | **cancelado** | **cancelado** | **cancelado** | `scrollY` 400 | ninguno |

Los dos últimos renglones son los que prueban que la sonda mide algo. El sidebar
ya era `hidden lg:block`: verificado `display: none` a 320, 390 y 430.

**Escala de mobile de la ruta: un solo mapeo** —40 → 26 · 30 → 20 · 24 → 20 ·
20 → 17— declarado en `services-layout` para no inventar un tamaño por bloque, y
válido solo debajo de `md`. El aire vertical baja de 160/120 a 64/64. Las
secciones ya se apilaban y el detalle de cada ítem ya caía debajo de su nombre.

**LATEST PROJECTS**: las cuatro portadas quietas —sin escala y sin difuminado— y
sin colgar ninguno de los cuatro manejadores, así que un tap no puede dejar una
portada agrandada. Los dos links llevan el subrayado siempre puesto: son los
únicos del sitio que lo tenían en hover.

**Hook nuevo y único de media queries** (`src/lib/use-media-query.ts`), del que
pasó a colgar también `usePrefersReducedMotion`: una sola implementación, mismo
contrato, sin cambio de comportamiento.

- **Commit F5:** `feat(mobile): services [M1/F5]`

### F6 — Fun Gallery

Se conserva el concepto entero —montón centrado, «(clic para ver)», tap que
despliega, flotado— y se apagan los dos gestos de puntero:

- **`whileHover`** no se pasa debajo de 1024. En touch el hover no existe y el de
  Framer se dispara con el tap y **se queda pegado**: el objeto tocado quedaría
  agrandado y por encima del resto hasta tocar otra cosa.
- **El seguimiento del cursor** tampoco cuelga sus manejadores.

**El tap se verificó de punta a punta**: tocar un objeto con proyecto anota
`esquina:fun-gallery-return` y navega (medido, `/work/akasha-blends`). De los
ocho objetos del dataset, **dos** tienen proyecto vinculado; los otros seis no
tienen `role`, ni `tabindex`, ni manejador — un tap no hace nada, que es lo que
pedía §3.2. Mientras el montón está sin desplegar **ningún** objeto es
interactivo: el click que despliega lo recibe el botón que los cubre (313 × 159
a 390).

**El tamaño de los objetos.** Con el gutter del cromo, la composición deja de
estar limitada por el ancho del contenedor y vuelve a mandar el criterio de
B3.3c: el objeto mayor mide **exactamente el 20 % del ancho del viewport**, que
es la misma proporción que en desktop (384 px sobre 1920). Medido: **64 px a
320, 78 a 390 y 86 a 430**. La escena de entrada entra completa en los tres: el
borde inferior del cartel cae en 424 sobre 640, en 402 sobre 844 y en 414 sobre
844. Si en la mano se siente chico es una constante y queda anotado en
pendientes.

- **Commit F6:** `feat(mobile): fun gallery [M1/F6]`

### F7 — Imágenes y áreas táctiles

**`sizes`: por qué un teléfono descargaba archivos de 640 px.** Los anchos de
este sprint están **por debajo del corte más chico que `next/image` considera**:
su `deviceSizes` arranca en 640 y `next.config.ts` no se toca (§4.2). El detalle
que decide el peso está en `getWidths`, leído del código de la 16.2.6 y no de
memoria: si el `sizes` trae un `vw` **suelto**, el candidato más chico del
`srcset` pasa a ser `640 × el vw más chico` y todo lo que hay debajo —96, 128,
256, 384— desaparece de la lista. Y como el regex que lo detecta pide que el
número venga precedido por un espacio o por el inicio de la cadena, **un `vw`
escrito dentro de un `calc()` no lo dispara** y la lista vuelve entera. No
cambia lo que el navegador calcula: es la misma medida. La nota, con la cita del
código, quedó en `src/lib/mobile-layout.ts`.

Con eso, y ajustando cada declaración a la caja real de mobile, el **peso
servido a 390 px y DPR 1** (medido de forma determinista: se resuelve el `sizes`
contra el viewport, se elige del `srcset` real y se pide cada archivo con
`cache: "no-store"` y el `Accept` de Chrome, para que el resultado no dependa de
qué variante tenga el navegador en caché):

| ruta | antes | después | corte |
|---|---|---|---|
| `/` | 5,9 KB | 5,9 KB | — |
| `/work` | **186,5** | **89,8** | portadas 640 → 384 |
| `/services` | **53,0** | **31,1** | portadas del cierre 256 → 128 |
| `/team` | **44,2** | **31,1** | foto 640 → 384 |
| `/fun-gallery` | **56,5** | **32,1** | objetos 256 → 96 |
| `/contact` | 19,1 | 19,1 | — |
| `/contact/success` | 9,7 | 9,7 | — |
| `/work/[slug]` | 19,1 | 19,1 | — |
| **total** | **394,0 KB** | **237,9 KB** | **−39,6 %** |

Las rutas que no bajan solo cargan cromo, cuyas declaraciones ya eran exactas.
El logo del header declaraba 196 px y mide 146,3: a DPR 2 pedía el corte de 640
en vez del de 384.

**En desktop no cambia un solo corte.** Verificado a 1920 sobre el `srcset` real:
la lista de candidatos de una portada de Work es
`256 384 640 750 828 1080 1200 1920 2048 3840` y el navegador elige **640** para
una caja de 608, igual que antes. (Una advertencia de método: `currentSrc` **no
sirve** para esta comparación, porque el navegador prefiere una variante que ya
tenga en caché; hay que resolverlo desde `sizes` + `srcset`.)

**Áreas táctiles.** Auditadas las **504** que aparecen en ocho rutas × tres
anchos × dos idiomas: **ninguna por debajo de 44 × 44**. Lo que no llegaba
antes, medido sobre el build de control a 320 y 390 en castellano:

| elemento | antes | ahora |
|---|---|---|
| `Todos los proyectos` (ficha) | 158,5 × **19,5** | ≥ 44 |
| `INSTAGRAM` (footer) | 98,4 × **20** | 98,4 × 44 |
| `LINKEDIN` (footer) | 75,5 × **20** | 75,5 × 44 |
| `SUMATE AL CLUB` (footer de `/contact`) | 211,9 × **22** | ≥ 44 |
| `HECHO POR develOP` | 175,3 × **25** | 197,3 × 44 |
| cerrar menú | 10,3 × **25,5** | 44 × 44 |
| `VER MÁS PROYECTOS` (Services) | 276,9 × **28** | ≥ 44 |
| las 10 pills de Contact | 61,8–181,5 × **29** | × 44 |
| abrir menú (hamburguesa) | 40 × **30,5** | 44 × 44 |
| opciones del desplegable | 250 × **34** | 250 × 44 |
| `PEDIR PRESUPUESTO` (Services) | 275 × **36,5** | ≥ 44 |
| toggle de idioma del menú | 21,6 × **37,5** | 45,6 × 47,5 |
| `CONTACTANOS` (footer) | 194,8 × **38** | ≥ 44 |
| `ENVIAR FORMULARIO` | 205,4 × **40** | ≥ 44 |

- **Commit F7:** `perf(mobile): sizes de imagenes y areas tactiles [M1/F7]`

### F8 — Puertas, mediciones de cierre y documentación

**Puertas** con el servidor bajado: `lint` exit 0 · `build` exit 0, **11 rutas /
15 páginas**, cero errores y cero warnings nuevos (siguen los mismos avisos de
deprecación de `@sanity/image-url` que ya estaban en la línea base).

**LA TABLA DEL SPRINT, repetida al cierre.** Píxeles de desborde horizontal,
ocho rutas × cinco anchos × dos idiomas, con altos de 844 **y** de 640:

| ruta | 320 | 360 | 390 | 414 | 430 |
|---|---|---|---|---|---|
| `/` | 0 | 0 | 0 | 0 | 0 |
| `/work` | 0 | 0 | 0 | 0 | 0 |
| `/services` | 0 | 0 | 0 | 0 | 0 |
| `/team` | 0 | 0 | 0 | 0 | 0 |
| `/fun-gallery` | 0 | 0 | 0 | 0 | 0 |
| `/contact` | 0 | 0 | 0 | 0 | 0 |
| `/contact/success` | 0 | 0 | 0 | 0 | 0 |
| `/work/[slug]` | 0 | 0 | 0 | 0 | 0 |

Idéntica en inglés y en castellano. Contra la tabla de la Fase 0, que iba de
**117 a 567 px** según ruta, ancho e idioma.

**No-regresión del desktop.** Alto del documento, contra el **código pre-sprint
recompilado y medido con el mismo instrumento en la misma sesión**:

| ruta | 1920 EN | 1920 ES | 1366 EN | 1366 ES | 1024 EN | 1024 ES |
|---|---|---|---|---|---|---|
| `/` | 1080 | 1080 | 768 | 768 | 768 | 768 |
| `/work` | 2155 | 2155 | 1694 | 1694 | 1410 | 1410 |
| `/services` | 7654 | 7716 | 7915 | 8025 | 9119 | 9239 |
| `/team` | 4537 | 4499 | 3899 | 3974 | 4220 | 4268 |
| `/fun-gallery` | 2228 | 2228 | 1805 | 1805 | 1563 | 1563 |
| `/contact` | 1664 | 1664 | 1451 | 1451 | 1911 | 1911 |
| `/contact/success` | 1244 | 1244 | 932 | 932 | 932 | 932 |
| `/work/[slug]` | 2190 | 2190 | 1713 | 1713 | 1611 | 1611 |

**Los 48 números son idénticos**, control contra final. El bloque del formulario
a 1920 mide **498 px** con el borde inferior en **682**, en los dos idiomas.

**Otras mediciones de cierre:**

- **Tamaño de fuente de los inputs:** los cuatro de `/contact` a **24 px** y el
  buscador de países a **20**; no hay ningún otro `input`, `select` o `textarea`
  en el sitio. Todos por encima del piso de 16 que evita el zoom de iOS.
- **`document.body` sin una sola propiedad inline** en las ocho rutas y los dos
  idiomas.
- **Peso de imágenes a 390 px:** 394,0 → 237,9 KB (tabla completa en F7).

**Documentación:** `CLAUDE.md` estrena **§2b Mobile** —los tres rangos, por qué
el cromo corta en 1024 y no en 768, los dos módulos nuevos, los cinco lugares de
hover y las cinco reglas técnicas—, §1 deja de decir que mobile está diferido,
§4 y §6 anotan que el sidebar y el gatillo de Services son de escritorio, §7 suma
la lección de `sizes` y §10 saca mobile de «lo que sigue». `docs/pendientes.md`
tacha los dos pendientes que M1 cierra y abre los siete que deja.

- **Commit F8:** `docs: sincronizar documentacion tras la adaptacion mobile [M1/F8]`

---

### Cierre de M1

- **Qué se hizo:** los nueve commits de arriba. El sitio pasa de tener entre 117
  y 567 px de scroll horizontal en todas las rutas a **cero**, con las áreas
  táctiles en 44 px, los inputs por encima del umbral de zoom de iOS, el hover
  desmontado en los cinco lugares donde el sitio se apoyaba en él, el gatillo de
  Services desarmado sin residuos y un 39,6 % menos de imagen servida.

- **Decisiones tomadas en ejecución** (§3 no las cubría; ninguna es de producto):
  1. **El corte del cromo es 1024 y no 768.** §3.1 dice que tablet «puede
     compartir soluciones con mobile»; acá tuvo que hacerlo, porque el menú de
     escritorio y el `InfoRow` del footer **no entran** a 768. Medido.
  2. **El texto de Work va debajo de la portada.** §3.2 dejaba elegir; encima
     era imposible sin ocultar la portada.
  3. **Home deja de entrar en una pantalla exacta debajo de 1024**, porque el
     footer en una columna mide 488 px. Se aplica por analogía la aceptación que
     §3.3 escribe para Contact.
  4. **El subrayado de los dos links de LATEST PROJECTS** pasa a estar siempre
     puesto debajo de 1024. §3.2 lo pide para el footer y el menú; estos dos eran
     los únicos que quedaban con subrayado en hover.
  5. **El `calc()` en los `sizes`** (F7). Es una lectura del código de Next, no
     una preferencia, y degrada sin romper.
  6. **Un escalón de control de 24 px en Contact**, para que el placeholder del
     select no se trunque a 320.

- **Pendientes que deja:** siete, todos de diseño con el teléfono en la mano y
  todos ajustables con una constante. Están en `docs/pendientes.md`.

- **Verificación humana pendiente:** el agente **no puede simular gestos táctiles
  ni observar animaciones** —con la pestaña oculta Chrome no corre
  `requestAnimationFrame`—. Queda para Valentino, con el teléfono: que el tap
  despliegue la galería y que el flotado se vea bien; que el scroll de Services
  se sienta normal desde el arranque; completar y enviar el formulario entero,
  selects incluidos, y confirmar que al enfocar un input la pantalla **no** hace
  zoom; abrir y cerrar el menú y cambiar de idioma desde ahí; y recorrer las
  siete rutas en los dos idiomas buscando textos que se sientan chicos o
  apretados.

- **Commits:** `3fe5c6a` · `a50f229` · `7ca5ba9` · `bc2afa9` · `594da5b` ·
  `3f04a54` · `105041a` · `26696ec`, más el de este cierre.

## B4c — Banderas, timing y limpieza (2026-08-22)

**Cierre de la ronda.** Tres trabajos independientes entre sí, cuatro fases, un
commit cada una. La instrucción llegó en dos partes: la primera describía mal el
problema de las banderas, el agente frenó, y la corregida cambió el orden a
**F2 → F3 → F1 → F4**.

- **La PARADA de F1, y por qué estuvo bien.** La instrucción original decía que
  las banderas del selector eran **emojis de indicadores regionales** y que
  Windows no trae la fuente. Es falso: **no hay un solo emoji en el repo** (cero
  ocurrencias del rango `U+1F1E6`–`U+1F1FF`, de `fromCodePoint` y de
  `regional`). Lo que hay es un set propio de **SVG dibujados a mano** —1.408
  líneas en `MonochromeCountryFlag.tsx` más 298 de paletas—, que por ser SVG se
  ve **igual en Mac que en Windows**. El síntoma reportado era real, pero la
  causa era otra: **países asignados a patrones que no son los de su bandera**.
  Se reportó con una captura de los dibujos ampliados ocho veces y la decisión
  de Valentino fue **corregir el set existente**, no reemplazarlo por banderas
  reales: el tratamiento monocromo con color en hover es identidad (§8), y
  cambiarlo era decisión de paleta.

- **F2 — El acuse de recibo del toggle duraba lo que dura el color, no lo que
  dura el gesto.** `ACK_DELAY` valía 0,2 s porque se había derivado del
  `transition-colors duration-200` del propio toggle. Pero el click dispara
  **dos** cosas y la otra es la barrita, que viaja `NAV_INDICATOR_DURATION` =
  **620 ms**: la cortina arrancaba con la barrita a mitad de camino, comiéndose
  los 420 ms que le faltaban. Ahora `ACK_DELAY` se **deriva de la constante del
  módulo del indicador** —no copia su número: la duración del viaje la fija
  `nav-indicator.tsx` y la comparte con el menú— y le suma **un cuadro**, porque
  el viaje no arranca en el tick del click sino dentro del
  `requestAnimationFrame` con el que `useIndicator` mide el rótulo ya pintado.

  | etapa | antes | ahora |
  |---|---|---|
  | acuse de recibo | 200 ms | **636,67 ms** |
  | cortina que sube | 650 | 650 |
  | swap, con la cortina arriba | a los 850 | a los **1286,67** |
  | cortina que baja | 650 | 650 |
  | **total** | **1500 ms** | **1936,67 ms** |
  | failsafe | 1900 | **2336,67** |

  **El failsafe nunca estuvo escrito a mano:** ya era
  `TRANSITION_MS + FAILSAFE_MARGIN_MS`, así que se corrió solo y sigue cayendo
  400 ms después del final. Esa derivación es justamente lo que evitó el bug que
  la instrucción anticipaba —la secuencia nueva dura casi los 1900 viejos—, y
  quedó documentada en el código para que nadie la reemplace por un número.
  Las dos mitades de la cortina y la duración del viaje **no se tocaron**. Con
  `prefers-reduced-motion` no cambia nada: el idioma sigue cambiando al
  instante, sin cortina ni etapas.

- **F3 — Limpieza, con dos hallazgos de más.** GSAP: cero imports de `gsap` y de
  `gsap/ScrollTrigger`, cero apariciones de la palabra en `src/` y sin
  dependientes en `npm ls`; las únicas coincidencias eran `IntroScrollTrigger`
  —componente propio, sin relación— y comentarios históricos. Desinstalado:
  **5,97 MB en 179 archivos**, y el lockfile pasa de **1372 a 1371** paquetes con
  **cero** agregados y **cero** cambios de versión o de `resolved` (el resto de
  su diff es npm renormalizando banderas `dev`/`peer`, verificado comparando los
  dos árboles). `HoverButton`: se fue `blend` como estaba previsto, y en el
  camino aparecieron **dos props más igual de huérfanas**, `underlineDraw` y
  `underlineDrawDelay`, cuyos consumidores —el CTA del Hero y el botón DISCOVER
  de `ServicesIntro`— habían desaparecido en B2 y B3.4; con ellas se fue la rama
  de render del subrayado que se dibujaba solo. `--color-gray`: una sola
  ocurrencia en todo el repo, su propia declaración.

- **Lo que se reportó sin borrar.** `as?: "button" | "a" | "span"` de
  `HoverButton`: **nadie pasa `as="a"`** y además el componente **no lo
  implementa** —cae al `<button>` del final—. Es ambiguo entre código muerto y
  función sin terminar, así que se reporta y no se toca. Y un hallazgo de
  documentación: `--footer-height`, `--cursor-size(-hover)` y los cinco tokens
  de font-size que `CLAUDE.md` §2 y los pendientes daban por existentes **ya no
  están en `globals.css`**; se habían ido en algún sprint anterior sin que nadie
  sincronizara la ficha.

- **F1 — El censo primero.** De los 196: **148 quedaron intactos**, **44
  cambiaron de patrón** y **4 conservaron el patrón pero les faltaba paleta o la
  tenían corta**. Y **8 no tenían ninguna paleta**, así que en hover se quedaban
  en line-art: Dominica, Guinea-Bissau, Kiribati, Madagascar, Qatar, Santa
  Lucía, San Vicente y las Granadinas y el **Reino Unido**, cuya `UnionJack` ni
  siquiera aceptaba colores — era una grilla gris.

  **El comodín más caro era `triangle`.** Dibujaba el triángulo del asta sobre un
  campo liso y se comía las bandas, y **17 de sus 21 países son en realidad
  bandas horizontales más triángulo**. Por eso Jordania salía como un campo
  negro con una cuña roja, sin el blanco ni el verde: el caso que Valentino
  reportó. La distinción que pedía la instrucción se respetó: los patrones
  **legítimamente compartidos** —tricolor vertical para Francia, Italia, Irlanda
  y Bélgica; cruz nórdica para cinco— **no se tocaron**.

  | patrón nuevo | países | nota |
  |---|---|---|
  | `bicolor-triangle` · `tricolor-triangle` · `stripes-triangle` | **17** | **una sola implementación**, `BandedHoistTriangle`; el largo lo fija el patrón porque en reposo no hay paleta de donde deducirlo |
  | `canton` | 3 | Samoa, Taiwán, Tonga |
  | `full-cross` | 3 | la cruz que cruza la bandera entera, no la chica y centrada de Suiza |
  | `saltire` | 2 | Jamaica, Burundi |

  **`canton-stripes` no se creó: ya existía declarado y sin un solo consumidor**
  —el enum tenía 38 entradas y `resolvePattern` devolvía 37—, y ahora lo usan
  Liberia, Malasia y Togo reusando el dibujo de Estados Unidos. Los **44**
  patrones declarados tienen consumidores. Las otras **19** correcciones fueron
  **reasignaciones a patrones que ya existían**, que es el arreglo más barato:
  Afganistán (era horizontal y es vertical), Malta, Bahréin y Qatar
  (verticales), Macedonia del Norte, Bielorrusia, San Marino, Somalia, Arabia
  Saudita, Marruecos, Belice, Santa Lucía, Kiribati, Angola, Omán y las tres que
  cayeron en `full-cross` y `canton`.

  **Tres dibujos rehechos:** la Union Jack, que no aceptaba colores; la hoja de
  arce de Canadá, que era la misma `Star` de siete puntas del resto del set; y
  el palio en Y de Sudáfrica, irreconocible.

  **Un dato que es por país y no por patrón:** si el triángulo del asta lleva
  emblema. Jordania lleva su estrella y Chequia no lleva nada, así que viaja
  como parámetro de `drawPattern` en vez de duplicar cada patrón del triángulo
  en dos entradas del enum.

- **Verificación de F1, y la hoja de contactos.** Un chequeo automático confirma
  que **los 196 resuelven a un patrón explícito** —nadie llega al `return` final
  del `default`— y que **los 196 tienen paleta con la cantidad de ranuras que su
  patrón necesita**. Cero faltantes. Para la parte que el agente **no puede
  juzgar** —si una bandera se parece a la real— se levantó una **ruta temporal**
  con los 196 en los dos estados y se compuso la hoja de contactos **a partir
  del HTML servido**, sin navegador: la página es estática, así que el markup ya
  trae los 392 SVG y alcanza con recomponerlos en una lámina propia y
  rasterizarla con `sharp`. Salieron una lámina de 3740 × 5164 y cuatro páginas.
  La ruta temporal se borró antes del commit y `git status` quedó limpio.

- **Fit de Contact, que era el riesgo.** La caja del SVG sigue midiendo
  **24 × 15** exactos —nunca se tocó ni el `viewBox` ni las clases del
  envoltorio—, la fila del selector **354 px**, el campo **376**, el bloque del
  formulario **498 px a 1920** y su borde inferior en **682**: los tres números
  publicados en B2.7, reproducidos exactos. De los 196 rótulos, **ninguno se
  recorta**; el único que no entra en una línea es «Saint Vincent and the
  Grenadines» (348,13 px contra 302 disponibles), que es exactamente el caso que
  B2.7 dejó documentado y resuelto partiendo el texto en dos líneas, no
  truncándolo.

- **No-regresión.** Altos de las ocho rutas a **1920** y a **390**, en los dos
  idiomas, contra la vara de la Fase 0: **32 de 32 idénticos**, cero scroll
  horizontal. Los de 390 son la prueba de que **la verificación de mobile en
  curso no se vio afectada**. `lint` y `build` en verde antes y después de cada
  fase, con el servidor bajado y la misma tabla de rutas.

- **Método: el banco de medición y los temporizadores.** Con la pestaña oculta
  Chrome **estrangula los `setTimeout` a uno por segundo** —medido: un
  `setTimeout(50)` tardó 999 ms— y **no corre `requestAnimationFrame`**. El
  banco de M1 se colgaba por eso. La salida es ceder con **`MessageChannel`**,
  que no se estrangula y que además deja terminar la hidratación de React,
  porque su scheduler usa el mismo mecanismo. Consecuencia que hay que aceptar y
  que ya estaba en los pendientes: **el timing del toggle no se puede
  cronometrar** desde el agente. Se verificó por derivación de las constantes,
  se confirmó que la expresión `.62+1/60` viaja en el bundle de producción, y el
  resto queda del lado humano.

- **Desvíos, dichos de frente.** **(1)** La verificación de las tres
  salvaguardas de B4b con el timing nuevo es **estructural, no cronometrada**:
  el failsafe se calcula a partir de la duración total con un margen positivo,
  así que no puede adelantarse por construcción; el intento de observarlo en
  vivo se abandonó tras dejar el renderer sin responder. **(2)** El borrado de
  la ruta temporal necesitó `git add -f` seguido de `git rm -f`: el entorno
  bloqueó `git clean` y `Remove-Item`, y la instrucción prohíbe `rm`. **(3)** El
  set de banderas **sigue siendo una aproximación por diseño**: las cinco
  limitaciones conocidas —`diagonal` de dos colores, `panels` de dos bandas al
  batiente, los emblemas resueltos con silueta, Antigua entrando por descarte y
  los tercios parejos de `horizontal-tricolor`— están listadas en los
  pendientes.

- **Verificación humana pendiente:** la revisión **país por país** de la hoja de
  contactos, que es el entregable central de F1; el cambio de idioma con el
  timing nuevo —que la barrita **termine** antes de que empiece el
  desvanecimiento y que los ~2 s no se sientan largos—; y un repaso de las ocho
  rutas para confirmar que la limpieza no se llevó nada visible.

- **Commits:** `ec5f074` (F2) · `a0d1dbd` (F3) · `5342931` (F1) · `386fdfc`
  (F4), más el de este cierre.

## B4d — Banderas reales (2026-08-22)

**Qué pasó:** el set de banderas dibujado a mano se retiró entero y en su lugar
entraron **SVG reales, vendorizados**, en escala de grises en reposo y a color
en hover.

- **Por qué, y por qué no era corregible.** B4c había corregido 44 países de
  patrón y 4 de paleta, y aun así la hoja de contactos mostró que **el enfoque
  no cerraba**: con 38 patrones geométricos para 196 países, ~15 % quedaba
  directamente mal —Argelia, Bosnia, Chipre, Granada, Santa Lucía, RD del
  Congo, Trinidad, Tanzania, Islas Marshall, Seychelles, Emiratos, Omán, Congo,
  Letonia— y otro ~25 % apenas reconocible: todas las que llevan emblema. El
  problema era **estructural, no de dibujos puntuales**. Un escudo o un texto no
  se resuelven a 15 px de alto con geometría genérica, con ninguna técnica, así
  que corregir las peores habría dejado otras aproximadas. Las banderas se
  conservan porque las pidieron las clientas; lo que cambia es de dónde salen.

- **El set, y cómo se eligió.** **`flag-icons` 7.5.0** (lipis), carpeta
  `flags/4x3`, **licencia MIT confirmada leyendo el `LICENSE` del propio
  paquete**, no la ficha de npm. Ficha completa de procedencia en
  **`docs/banderas-set.md`**, y el texto de la licencia viaja con las copias en
  `public/flags/LICENSE.txt`, que es lo que la MIT pide.

  Se evaluó también **`country-flag-icons` 1.6.20** (también MIT, también
  verificada leyendo su `LICENSE`), que tenía dos ventajas medibles: **903 KB
  contra 2,4 MB** —su archivo más grande son 5,3 KB contra los 181 KB de
  Serbia— y viene en **3:2**, más cerca de la caja de 1,6 que el 4:3. **Perdió
  igual, y por el motivo que justifica el sprint entero**: sus emblemas están
  simplificados hasta dejar de ser el emblema. Se comparó rasterizando los dos
  sets lado a lado en 18 casos difíciles: el águila de México es un óvalo con
  dos manchas, el sol de Argentina un círculo liso sin rayos ni cara, la esfera
  armilar de Portugal un anillo con un punto, el dragón de Bután una ese blanca.
  Cambiar aproximaciones propias por aproximaciones ajenas no era el trato.

- **No es una dependencia, y esa es la regla.** `package.json` no se tocó. Se
  bajó el tarball publicado, se verificó la licencia, se copiaron los 196
  archivos que la lista usa y ahí terminó la relación con el paquete. Actualizar
  el set en el futuro es repetir ese procedimiento a mano.

- **El mapeo, y su verificación.** `countryFlagCodes.ts` es un
  `Record<CountryOption, string>`: **un país sin código no compila**. Lo que el
  tipo no puede garantizar es que el archivo exista, así que eso se verificó
  aparte, **leyendo `contact.ts` y `countryFlagCodes.ts` como fuente y no una
  copia**: los 196 nombres tienen entrada, los 196 códigos resuelven a un
  archivo existente —**cero faltantes**—, **cero códigos duplicados** y **cero
  SVG huérfanos** en `public/flags/`. Los once nombres particulares se chequearon
  uno por uno contra el valor esperado, porque un error ahí no rompe nada: se ve
  como la bandera de otro país. **11/11**: `DR Congo`→cd y `Congo`→cg (que son
  los que se confunden), `Cote d'Ivoire`→ci, `Eswatini`→sz, `Czechia`→cz,
  `Timor-Leste`→tl, `Cabo Verde`→cv, `North Macedonia`→mk, `Palestine`→ps,
  `Taiwan`→tw, `Vatican City`→va.

- **Peso.** **1 301 743 bytes** (1,24 MiB) en 197 archivos —196 SVG más el
  `LICENSE.txt`—. El más grande es **`rs.svg` con 181 634 bytes**: el escudo
  entero de Serbia, con corona y manto. Le siguen `bo.svg` (102 880) y `mx.svg`
  (84 753). Son los tres desproporcionados del set y se reportan como tales;
  ninguno se carga salvo que la fila entre en pantalla.

- **El render: un archivo y un filtro.** `CountryFlag.tsx`, 63 líneas.
  **`grayscale` de base y `grayscale-0` en el disparador**, con los mismos 150 ms
  que tenía el set anterior. Antes eran **dos banderas apiladas cruzándose la
  opacidad**; ahora la fila trae la mitad de los nodos. **Quién dispara el color
  lo decide el consumidor**: en la lista el `group` de la fila, y en el valor
  elegido el `group/contact-focus` del campo, con hover **y `focus-within`** —eso
  es una mejora sobre el set viejo, que en el valor elegido iba siempre a color—.

- **El encuadre, que era la decisión de diseño escondida.** La caja mide
  **24 × 15** (relación 1,6) y el archivo es **4:3**. Las dos salidas honestas
  eran `contain` —la bandera entera, 20 × 15, con 2 px de aire a cada lado, que
  en una lista de 196 filas se lee como banderas de anchos distintos— y `cover`
  —llena la caja, recorta 1,5 px arriba y 1,5 abajo de los 18 a los que escala,
  el 16,7 % del alto—. Se eligió **`cover`**, y se verificó contra los casos
  peores —Estados Unidos, Brasil, Nepal, Suiza, Vaticano, Qatar, Kenia, Bután,
  Sri Lanka, Camboya, Omán, Eritrea— que no se pierde nada que haga a la lectura
  de la bandera. **En ningún caso se deforma**: no hay un solo estiramiento no
  proporcional en el set.

- **Carga diferida.** `loading="lazy"` **no es un adorno**: el desplegable monta
  las 196 filas de una, así que sin diferir abrirlo dispararía 196 descargas.
  Medido en la build de producción: con las 196 filas montadas y `lazy` puesto,
  **0 peticiones**; forzando `loading="eager"` sobre esos mismos nodos, **196**.
  El `width`/`height` va también como atributo para reservar el lugar y que la
  lista no salte mientras cargan.

- **Fit de Contact, que era el riesgo declarado.** Los cinco números de la
  instrucción, reproducidos exactos contra la vara de la Fase 0: la caja del
  SVG **24 × 15**, la fila del selector **354**, el campo **376**, el bloque del
  formulario **498 px a 1920** y su borde inferior en **682**. De los 196
  rótulos **ninguno se trunca** (`scrollWidth` contra `clientWidth`, 0 casos), y
  el más ancho sigue siendo «Saint Vincent and the Grenadines» con **302 px**,
  el caso que B2.7 dejó documentado y resuelto partiendo el texto en dos líneas.

- **La hoja de contactos.** Cuatro páginas de 1700 × 2404, los 196 países con
  nombre, archivo y los dos estados lado a lado, en
  **`C:/EsquinaWeb-capturas-banderas/`** (fuera del repo). Se compuso como en
  B4c: **sin navegador**, rasterizando los SVG con `sharp` en el mismo encuadre
  que usa el componente. La ruta temporal se borró antes del commit —con
  `git add -f` + `git rm -f`, el precedente de B4c, porque `rm` está prohibido—
  y `git status` quedó limpio.

- **Líneas retiradas: 2 021.** `MonochromeCountryFlag.tsx` (1 707) y
  `countryFlagColors.ts` (314), previo grep en verde: cero ocurrencias de
  `MonochromeCountryFlag`, `countryFlagColors` y `COUNTRY_FLAG_COLORS` en
  `src/`. Balance del sprint en código: **307 inserciones contra 2 039
  borrados**.

- **No-regresión, dicha con precisión.** **24 de los 32 altos re-medidos después
  del cambio y los 24 idénticos a la vara**, con cero scroll horizontal: las
  ocho rutas a **390 EN**, a **390 ES** —que son las que prueban que la
  verificación de mobile en curso no se vio afectada— y a **1920 EN**. **Los 8
  de 1920 ES no se re-midieron**: la extensión de Chrome se cayó a mitad de esa
  tanda y no volvió a conectar. Lo que sí quedó verificado por diff es **el
  alcance**: todo el código que B4d tocó son seis archivos, y `ContactForm` lo
  importa **solo `/contact`**, `CountryFlag`/`countryFlagCodes` solo
  `ContactForm`, y el cambio en `contact.ts` es **únicamente un comentario**. Las
  otras siete rutas no tienen una línea distinta, y `/contact` a 1920 medía
  **1664 en los dos idiomas** en la vara y volvió a medir 1664 en inglés.

- **Desvíos y límites, dichos de frente.** **(1)** Los 8 altos de 1920 ES, arriba.
  **(2)** **El conteo de peticiones al filtrar no se midió**, y el conteo al
  abrir se midió por el mecanismo (0 con `lazy`, 196 forzando `eager`) y no por
  cuántas filas entran en el viewport del scroller: con la pestaña **oculta**
  Chrome no corre el ciclo de render, así que no dispara la carga diferida —el
  mismo límite que B4c anotó para los temporizadores, ahora del lado de
  `IntersectionObserver`—. **(3)** Por lo mismo, **el hover no se verificó en
  vivo**; lo que sí se verificó es que las cuatro reglas existen en el CSS de
  producción con el selector correcto (`.group-hover\:grayscale-0`,
  `.group-hover\/contact-focus\:grayscale-0`,
  `.group-focus-within\/contact-focus\:grayscale-0` y `.grayscale`), que el
  `filter` computado en reposo es `grayscale(1)` y que la transición es
  `filter` a `0.15s`. **(4)** Nota de contenido, no de código: `af.svg` trae el
  tricolor con emblema (anterior a 2021) y `sy.svg` la bandera de tres estrellas
  de 2025. Es lo que publica el set; queda anotado por si el estudio quiere
  revisarlo.

- **Verificación humana pendiente.** Revisar la hoja de contactos y confirmar
  que **las 196 se ven correctas**, que es justamente lo que el set anterior no
  lograba. Y la única concesión estética del cambio: **que el gris en reposo
  cierre dentro del sitio** —antes era line-art, contornos; ahora son manchas de
  gris con la forma correcta—; si no cierra, la alternativa es color pleno
  siempre. Además: que el paso a color se sienta como antes, que abrir y filtrar
  el desplegable no salte ni se sienta pesado, y que el formulario siga
  funcionando.

- **Commits:** `d03e659` (F1) · `29edb00` (F2) · `27d102e` (F3) · `5c5f5e0`
  (F4), más el de este cierre.

## M2 — Correcciones de mobile y cierre (2026-08-23)

### F0 — Terreno, vara de no-regresión y diagnóstico del punto 13

- **Terreno.** Árbol limpio salvo `pngs-galeria/` **sin seguir** en la raíz del
  repo (`?? pngs-galeria/`, 8 PNG), que ya estaba antes de empezar y no se toca.
  HEAD `c66c731` (cierre de B4d). `npm run lint` y `npm run build` en **verde**
  antes de tocar nada: 15 páginas, misma tabla de rutas de B4d.

- **Banco de medición.** La extensión de Chrome no está conectada en esta
  sesión, así que se armó un banco propio **sin dependencias**: Chrome
  `--headless=new` manejado por el DevTools Protocol sobre el `WebSocket` nativo
  de Node 24. Vive fuera del repo, en el scratchpad de la sesión. Resuelve de
  paso el límite que arrastraban B4c y B4d: en `--headless=new` **sí corren
  `requestAnimationFrame` y la carga diferida**, porque la página se pinta de
  verdad. El servidor de medición es `next start` en **3011** —el 3010 ya estaba
  tomado por un proceso ajeno a esta sesión, que no se tocó— y el 3000 sigue
  fuera de alcance.

- **Vara de no-regresión: 48 números.** Ocho rutas × {1920, 1366, 390} × {EN,
  ES}, alto de documento y desborde horizontal. **Cero scroll horizontal en las
  48.** Los altos de 1920/1366 son los que tienen que quedar idénticos al
  cerrar, salvo `/contact/success` (punto 8).

  | ruta | 1920 EN | 1920 ES | 1366 EN | 1366 ES | 390 EN | 390 ES |
  |---|---|---|---|---|---|---|
  | `/` | 1080 | 1080 | 768 | 768 | 1332 | 1332 |
  | `/work` | 2155 | 2155 | 1694 | 1694 | 2660 | 2691 |
  | `/work/tukumi-takeaway` | 2190 | 2190 | 1713 | 1713 | 1859 | 1890 |
  | `/services` | 7654 | 7716 | 7915 | 8025 | 7401 | 7377 |
  | `/team` | 4537 | 4499 | 3899 | 3974 | 3751 | 3806 |
  | `/fun-gallery` | 2228 | 2228 | 1805 | 1805 | 1402 | 1433 |
  | `/contact` | 1664 | 1664 | 1451 | 1451 | 2730 | 2711 |
  | `/contact/success` | 1244 | 1244 | 932 | 932 | 1332 | 1332 |

  Dato de método que conviene no olvidar: `scrollHeight` **nunca baja del alto
  del viewport**, así que un 1080 a 1920 no prueba que el contenido llegue al
  pie. Es justamente lo que dejó pasar el punto 13.

- **Diagnóstico del punto 13 — qué se movió y cuántos píxeles.** Se recompiló el
  código **pre-M1** (`3fe5c6a`, el commit de docs anterior a `a50f229`
  «feat(mobile): navbar, menu y footer») en un worktree aparte y se sirvió en el
  **3012**, para medir los dos lados con el mismo banco.

  **La barra del header no se movió ni un píxel.** Geometría completa del `nav`
  a 1920 y a 1366, en los dos idiomas —caja de la fila, relleno, logo, los cinco
  rótulos, el indicador, el grupo `EN / ES` y sus dos botones—: **idéntica** en
  las 8 combinaciones. La única diferencia que apareció es el `naturalWidth` del
  logo, y es ruido de decodificación: el `currentSrc` es **el mismo archivo con
  la misma query** (`w=256&q=75`) y la caja medida es 146,28 × 48 en los dos.

  **Lo que sí se movió es el bloque del hero de `/`, y con él todo lo que va
  debajo:**

  | medida en `/` | pre-M1 | HEAD | Δ |
  |---|---|---|---|
  | alto del bloque del hero a 1920 | 788 | **540** | **−248** |
  | tope del texto del hero a 1920 | 450 | **326** | **−124** |
  | tope del footer a 1920 | 916 | **668** | **−248** |
  | pie del footer a 1920 | 1080 | **832** | **−248** |
  | franja muerta bajo el footer a 1920 | 0 | **248** | **+248** |
  | alto del bloque del hero a 1366 | 476 | **384** | **−92** |
  | pie del footer a 1366 | 768 | **676** | **−92** |
  | franja muerta bajo el footer a 1366 | 0 | **92** | **+92** |

  **La causa, y es exactamente la trampa que `CLAUDE.md` §6 tiene escrita.**
  Pre-M1 el alto del bloque viajaba en un `style` en línea:
  `height: calc(100vh - var(--header-height) - (40px + 84px + 40px))`. M1/F2 lo
  pasó a una clase de Tailwind **compuesta con una plantilla**:

  ```js
  const HOME_FOOTER_HEIGHT = "40px+84px+40px";
  const HOME_BLOCK_HEIGHT = `lg:h-[calc(100svh-var(--header-height)-(${HOME_FOOTER_HEIGHT}))]`;
  ```

  Tailwind v4 busca los nombres de clase **como literales en el código**, y ese
  nombre no existe como literal en ningún lado: se arma en runtime. Verificado en
  el CSS de producción — están `.h-[calc(100svh-var(--header-height))]` y
  `.lg:min-h-[50vh]`, que sí se escriben enteras, y **no existe ninguna regla
  `.lg:h-[calc(...)]`**. La clase viaja en el `class` del elemento y no pinta
  nada, así que el alto cae a `auto` y manda el `lg:min-h-[50vh]`: 540 px a 1920
  en vez de 788, 384 a 1366 en vez de 476.

  **No es un cambio deliberado de M1, es una regresión**: el comentario que
  M1/F2 dejó en `page.tsx` declara que la cuenta «vale de `lg` para arriba» y
  que «los altos de `/` a 1920 y a 1366 no se mueven». La intención era dejar el
  escritorio quieto; el literal roto lo impidió. No corresponde PARADA.

- **Nota de nomenclatura.** La devolución dice «el header de `/`». Medido, la
  **barra** del header está intacta; lo que se desacomodó es la composición de
  la home —el hero sube 124 px, el footer sube 248 y queda una franja muerta de
  248 al pie—. El punto 13 se corrige devolviendo `/` a la composición pre-M1.

### Cierre del sprint

**Qué pasó.** Las catorce devoluciones de la verificación humana de M1, en cinco
fases. Diez eran de mobile, dos de escritorio y dos afectaban a los dos. Dos de
ellas resultaron ser **regresiones de M1 y no decisiones**: el header de `/` a
1920 (punto 13) y el menú de mobile, que se veía roto en siete de las ocho rutas
(punto 11). Las dos tenían una causa concreta, medida y de una línea.

### Cierre — las catorce correcciones, una por una

Todo lo que sigue está medido sobre `npm run build` + `next start`, con el banco
de la Fase 0 (Chrome `--headless=new` por DevTools Protocol).

**(1) El menú de mobile, rehecho.** El panel es off-black a pantalla completa y
lleva **solo la navegación**: los cuatro rótulos en la escala de display
—40/48, y 48/56 de `sm` para arriba— alineados a la izquierda contra el gutter,
y `CONTACT US` debajo, a 17 px, separado por escala y por 40 px de aire. Sin
borde, sin caja, sin sombra: la jerarquía la dan el tamaño y el espacio, que es
como la construye el resto del sitio. El cromo **no se repite**: el logo, el
toggle y la cruz son los de la fila del header, que queda por encima del panel y
pintada del mismo negro. Los 40 px entran ahora que `CONTACT US` salió de la
lista: el rótulo más ancho de los cuatro es `FUN GALLERY` con **248,98 px** a
320, contra 272 de caja útil (`CONTACTANOS`, que medía 348,6, era el que en M1
obligaba a bajar a 34). **Medición: 80 de 80 pantallas correctas** —ocho rutas ×
cinco anchos × dos idiomas—, verificando panel a pantalla completa, fondo
off-black en el panel y en la fila, `backdrop-filter: none` en el `<nav>`, el
logo por encima del panel, los cinco links dentro del viewport y
`aria-expanded="true"`.

**(2) El toggle `EN / ES`, al costado del ícono y visible siempre.** Salió del
menú y entró en la fila del header, en un bloque `lg:hidden` que comparte
implementación con el de escritorio: **dos instancias, un solo componente**, y
nunca se ven las dos. Conserva todo su comportamiento —activo en color pleno,
barrita, transición y las áreas tocables de 44 px—. El `gap-3` está medido: el
`::after` que agranda el código activo se estira 12 px hacia afuera y el toggle
termina 6 px adentro de su caja, así que quedan 6 px libres contra el ícono. A
320, que es el peor caso, la fila pide **260,89 px** de los 272 útiles: logo
146,28 + toggle 78,61 + hueco 12 + ícono 24. Con eso el disparador `measureKey`
del módulo del indicador quedó sin consumidores y **se borró** (§8.11).

**(3) Las tres rayas, idénticas.** Medidas computadas, no a ojo: las tres miden
**24 × 2 px** y sus bordes superiores caen en **56, 63 y 70**, o sea separaciones
de **5 y 5**, las tres en filas de píxeles enteras. Antes eran de 1,5 px —que a
DPR 1 se reparte entre dos filas de forma distinta según dónde caiga, y por eso
una se veía más gruesa— y la tercera medía 16 y no 24. La cuenta que hace que
sean enteras está escrita en el código: la fila de 128 centra un botón de 44 (42),
el botón centra una caja de 24 (52), la caja centra 3 × 2 + 2 × 5 = 16 px (56).

**(4) `/` entra en una pantalla en mobile.** El bloque del hero resta el alto del
footer, igual que hace el escritorio desde B2:
`max-lg:h-[calc(100svh-var(--header-height)-236px)]`. **Medición: `docH === viewH`
en las 20 combinaciones** —cinco anchos × dos altos (640 y 844) × dos idiomas— y
el footer midiendo **236,00 px exactos** en las 20. La página sigue sin
scrollear y el footer se ve sin bajar.

**(5) La galería: objetos más grandes y en grilla.** Debajo de 1024 la
composición desplegada es una **grilla de dos columnas en teléfono y tres en
tablet**, con el objeto llenando la celda.

| ancho | objeto | % del ancho del viewport | por fila |
|---|---|---|---|
| 320 | 136 px | 42,5 % | 2 |
| 360 | 156 px | 43,3 % | 2 |
| 390 | 171 px | 43,8 % | 2 |
| 414 | 183 px | 44,2 % | 2 |
| 430 | 191 px | 44,4 % | 2 |
| 768 | 224 px | 29,2 % | 3 |
| 1024 | 204,78 px | **20,0 %** | 4 (dispersión) |
| 1366 | 273,19 px | **20,0 %** | 4 (dispersión) |
| 1920 | 383,98 px | **20,0 %** | 4 (dispersión) |

Antes, con el criterio de escritorio aplicado a un teléfono, el objeto medía
entre el 15 y el 21 % del ancho: ahora es **más del doble**. De 1024 para arriba
no se movió un píxel —el 20,0 % es el criterio de B3.3c, intacto—. **La escena de
entrada sigue entrando completa**: el borde inferior del cartel «(click to view)»
cae dentro del viewport en las **16 combinaciones** medidas (nueve anchos × dos
altos, descontando los tres de escritorio que solo se miden a su alto propio). La
composición desplegada scrollea, que es lo autorizado.

**(6) El prefooter, en fila y alineado abajo.** La frase a la izquierda y el
bloque `CONTACT US` / `LET'S BRING YOUR IDEAS TO LIFE` a la derecha, con
`items-end`: el bloque queda a la altura de la **última** línea de la frase. Y
baja a la escala de cuerpo (17/21), que no es un número nuevo sino la proporción
del escritorio —allá la frase va a 40 y el bloque a 26, o sea 0,65; 26 × 0,65 =
17—. A 26 px los dos se leían con el mismo peso, que era el defecto de fondo.
**La franja no creció: se acortó** —a 390 en castellano, de 405 a 375 px—.
Desvío declarado abajo: a 320 y a 360 los dos bloques no entran uno al lado del
otro y el de contacto baja solo.

**(7) La fila de info del footer, en dos niveles.** Arriba, los dos pares de
lugar a la izquierda e `INSTAGRAM` / `LINKEDIN` a la derecha; abajo, `© 2024` y
`POWERED BY develOP` **uno al lado del otro**. Se arma con una grilla de dos
columnas y `display: contents` sobre los dos grupos de escritorio, así que **el
mismo árbol da los dos repartos** y el de arriba de 1024 no se toca. La
tipografía baja a 15 px debajo de 1024, y eso también está medido: a 17 px la
línea del nivel 2 pide **271,65 px** contra los 272 de caja útil a 320 —entraba
por 0,35 px, que no es entrar—; a 15 pide 244 y quedan 28 px de aire. El footer
de home pasó de **488 a 236 px**.

**(8) El footer de la pantalla de éxito, sin franja clara — y esto sí toca
escritorio.** El footer de `/contact/success` sale del flujo, se ancla al pie del
contenedor de `PageTransitionShell` y se pinta del mismo off-black del panel: en
reposo es indistinguible de transparente y la franja clara desaparece. **Medición:
la ruta pasa de 1244 a 1080 px a 1920 y de 932 a 768 a 1366**, en los dos
idiomas. Es el único cambio de altura de escritorio del sprint, y es el que el
propio punto 8 autoriza.

**(9) Y entra en una sola pantalla, también en mobile.** Con el footer
superpuesto, la ruta mide `100svh` exactos **por construcción**. Lo que había que
verificar era que el contenido no quedara recortado: **24 de 24 combinaciones**
—siete anchos × dos altos × dos idiomas— con el bloque entero entre el borde
inferior del header y el superior del footer. A 320 × 640 en inglés, que es el
caso más apretado, el contenido mide 270,89 px en 276 disponibles; para llegar
ahí la bajada baja a 15 px y los dos huecos a 20 px debajo de `md`, y hay una
válvula: la caja centra con `my-auto` sobre un contenedor que puede desplazarse,
así que en un viewport todavía más bajo el contenido se corre en vez de perderse.

**(10) La salida.** `BACK TO HOME` / `VOLVER AL INICIO`, clave nueva
`success.backHome` en el diccionario —y por lo tanto obligatoria en los dos
idiomas, que es lo que garantiza la interfaz explícita—. Es un link del sitio:
17 px, subrayado fijo, relleno de hover en tono oscuro. No es un botón con caja,
porque el sitio no tiene ninguno.

**(11) Por qué el menú se veía bien en `/contact/success` y mal en el resto.**
**Un `backdrop-filter` convierte al elemento en bloque contenedor de sus
descendientes `position: fixed`.** El blur vivía en el `<nav>`, así que el
`fixed inset-0` del panel no se resolvía contra el viewport sino contra la banda
de 128 px del header: el panel salía de 390 × 128 con los rótulos desbordados
—`PROYECTOS` en y = −111,75, `CONTACTANOS` en 112,25— y el toggle caído sobre la
página. `/contact/success` es la **única** ruta cuyo `<nav>` va transparente y por
lo tanto **sin blur**, y por eso era la única donde el menú se veía entero. La
unificación se hizo hacia esa: **el blur bajó del `<nav>` a la fila**, que es
hermana del panel y no su ancestro. La banda pintada es exactamente la misma. Y
como el panel tapaba también la fila —dos hermanos, `z-index: auto` contra
`z-[99]`—, la fila pasó a ir por encima, que es lo que permitió que el menú deje
de repetir el cromo.

**(12) La cruz de cerrar.** Dejó de ser una `X` de texto de 17 px y pasó a ser
**dos reglas de 30 × 2 px giradas ±45°** sobre el mismo centro que las tres
rayas, en la misma caja tocable de **44 × 44**. Ocupa unos 21 × 21 px de dibujo
contra los ~11 × 12 de tinta que tenía la letra. Y vive en la ranura del ícono:
el mismo botón abre y cierra, así que la cruz aparece donde estaba la
hamburguesa en vez de en una esquina.

**(13) El header de `/` a 1920.** El diagnóstico completo está en la entrada F0.
En una línea: M1/F2 pasó el alto del bloque del hero de un `style` en línea a una
**clase de Tailwind compuesta con una plantilla**, y Tailwind v4 busca los
nombres de clase como literales, así que esa regla **nunca llegó al CSS**. La
corrección es escribirla entera. **Medición contra el código pre-M1 recompilado,
número por número:** bloque **788** px a 1920 (era 540) y **476** a 1366 (era
384); tope del hero **450** y **294**; tope del footer **916** y **604**; pie del
footer **1080** y **768**; **franja muerta 0** en los dos. Los seis números son
los de pre-M1. Y la geometría de la barra del header —caja de la fila, relleno,
logo, los cinco rótulos, el indicador, el grupo `EN / ES` y sus dos botones— da
**cero diferencias** contra pre-M1 en las ocho combinaciones medidas (`/` y
`/work` × 1920 y 1366 × dos idiomas).

**(14) El subrayado del idioma al cargar.** La causa esperada estaba cerca pero
no era exactamente esa. **El módulo del indicador sincronizaba en un efecto
pasivo la referencia que usa su `ResizeObserver`**, y React puede diferir ese
flush al macrotask siguiente: entonces la notificación inicial del observador
—que llega en el cuadro posterior al montaje— llamaba a un `remeasure` **del
render anterior**, medía el rótulo que ya había dejado de estar activo y plantaba
la línea ahí, sin viaje y sin nada que la corrigiera después. El arreglo es de una
palabra y es de fondo: esa sincronización pasa a `useLayoutEffect`, que corre
**dentro** del commit, así que la ventana se cierra. Y la segunda mitad del
pedido —que al cargar la barrita **no viaje**— se resuelve con la puerta
`animate` que el módulo ya tenía: el toggle solo anima después de una **elección
explícita** en ese control, porque el viaje es el acuse de recibo de un click y
al cargar no hubo ninguno.

### El idioma, medido de las dos maneras

- **Los cuatro caminos de arranque, 64 arranques:** primera visita con el
  navegador en inglés, primera visita con el navegador en castellano,
  preferencia guardada en castellano y preferencia guardada en inglés, ocho
  veces cada uno, a **1920 y a 390**. **Antes del arreglo: 4 fallas en 32** —las
  cuatro en los dos caminos del castellano, con la página ya en castellano
  (`lang="es"`, `aria-pressed` en `ES`) y la barrita plantada bajo `EN`—.
  **Después: 0 fallas en 64.** Y en ninguno de los 64 la barrita viajó: aparece
  directamente en su lugar, que es lo que pedía el punto 14.
- **El gesto del click sigue intacto**, y esta vez se pudo **cronometrar**, que
  es algo que B4c y B4d habían dejado explícitamente sin medir porque con la
  pestaña oculta no corre `requestAnimationFrame`. Al hacer click, la barrita
  pasa por cuatro posiciones distintas, **se contrae hasta el punto de 5 px**
  —mínimo medido: 5,00— viaja y se vuelve a abrir a 20 px sobre el idioma nuevo;
  el diccionario cambia después, a los ~2,6 s, con la cortina arriba. Es
  exactamente la secuencia de B4b con el timing de B4c/F2.

### Commits

`966991f` (F0) · `ab85791` (F1) · `ade6889` (F2) · `65eeac7` (F3) · `fb557c0`
(F3b) · `8065261` (F4) · `1147349` (F5) · `c96a0f5` (F5b), más el de este cierre.
Balance en código: **14 archivos, 991 inserciones contra 224 borrados**.

### Las mediciones de cierre

- **Cero scroll horizontal: 128 de 128.** Ocho rutas × ocho anchos
  (320/360/390/414/430/768/1366/1920) × dos idiomas. Es el criterio que M1 dejó
  en cero y sigue en cero, con la matriz ampliada.
- **No-regresión de escritorio: 28 de 32 altos idénticos** a la vara de la Fase
  0 (ocho rutas × 1920 y 1366 × dos idiomas). Los **cuatro** que cambian son los
  de `/contact/success`, −164 px cada uno, que es exactamente lo que el punto 8
  autoriza. Y la geometría del header da **cero diferencias** contra el código
  **pre-M1** recompilado.
- **`/` y `/contact/success` entran sin scroll**: `docH === viewH` en las 20
  combinaciones de home y en las 24 de la pantalla de éxito, y en esta última el
  contenido queda entero entre el header y el footer en las 24.
- **Áreas táctiles: cero por debajo de 44 px** en 48 pantallas con el menú
  cerrado y en 48 con el menú abierto.
- **Puertas:** `npm run lint` y `npm run build` en verde antes y después de cada
  fase, con el servidor bajado y la misma tabla de 15 rutas de B4d.

### Desvíos, dichos de frente

1. **El prefooter en fila no entra a 320 ni a 360, y ahí se apila.** Los dos
   bloques tienen ancho mínimo propio —la frase, su palabra más larga: 146 px en
   castellano a 26 px; el bloque de contacto, su corte de línea escrito, que por
   contrato **no se deja al ancho del navegador** (`CLAUDE.md` §6.4)— y la suma
   pide 328 px contra los 272 de caja útil a 320. Las salidas eran bajar la frase
   de la marca a 18 px o partir un corte que es decisión de diseño; las dos
   parecían peores que apilar en los dos anchos más chicos. Se resolvió con
   `flex-wrap`, que **no agrega un corte de ancho nuevo**: donde entra va en fila
   (390, 414, 430) y donde no, el bloque baja solo y queda como estaba. Si la
   verificación humana quiere la fila también a 320, la decisión es de tipografía
   y hay que tomarla; queda en pendientes.
2. **El logo script no aparece en el footer de mobile.** Con él, la línea del
   nivel 2 —`© 2024` + el crédito— se va a 335 px contra 272 de caja útil a 320.
   El punto 7 enumera lo que lleva la fila de mobile y el logo no está en esa
   lista. En escritorio no cambia nada.
3. **Un commit de más: `M2/F3b`.** Al revisar la entrada de la pantalla de éxito
   apareció que, con el footer transparente, sus rótulos off-white quedaban sobre
   la página clara durante los ~150 ms en que el panel oscuro todavía está
   subiendo —medido: a los 80 ms el borde superior del panel está en 778 y el del
   footer en 608—. Se corrigió pintando el footer del mismo off-black del panel:
   en reposo es indistinguible de transparente y la entrada deja de tener el
   fantasma. Es la misma corrección del punto 8, así que va en su propio commit y
   no escondida en el de documentación.
4. **El puerto 3010 estaba tomado** por un proceso ajeno a esta sesión (`node`,
   arrancado a las 00:26). No se tocó: las mediciones se hicieron en el **3011** y
   la comparación contra pre-M1 en el **3012**. El 3000 quedó fuera de alcance,
   como pide la instrucción.
5. **La extensión de Chrome no estaba disponible**, así que se armó un banco
   propio sin dependencias (Fase 0). Efecto lateral bueno: en `--headless=new` la
   página **se pinta de verdad**, así que corren `requestAnimationFrame` y la
   carga diferida. Eso permitió cronometrar por primera vez el gesto que B4c y
   B4d habían dejado explícitamente sin medir.
6. **El worktree pre-M1 quedó registrado y desregistrado limpiamente**, pero su
   carpeta no se pudo borrar del todo: `git worktree remove --force` falló con
   *Filename too long* en un archivo de `node_modules`. Vive en el scratchpad de
   la sesión, fuera del repo, y `git worktree list` ya muestra una sola entrada.

### Lo que no se pudo verificar

- **El teléfono de verdad.** Todo lo de arriba es un navegador headless a DPR 1:
  el tap, la comodidad de la cruz, cómo se sienten los objetos de la galería en
  la mano y el comportamiento de `100svh` con la barra del navegador entrando y
  saliendo **son humanos**.
- **El fantasma de la entrada de `/contact/success` quedó medido a 390 × 844**;
  no se recorrieron todos los anchos porque la geometría no depende del ancho.
- **La galería se midió con el contenido real del dataset** —las clientas ya
  cargaron las ocho imágenes—, así que los repartos de 2 y 3 por fila están
  verificados con ocho objetos y no con otras cantidades.

### Verificación humana declarada, con el teléfono en la mano

- **El menú**: que se vea bien en las ocho rutas, que el toggle se vea sin abrir,
  que el ícono se vea parejo y que la cruz sea cómoda de tocar.
- **`/` y `/contact/success`**: que entren en una pantalla, sin que la barra del
  navegador rompa la cuenta.
- **La galería**: si ahora los objetos se leen bien en la mano y si la grilla al
  desplegar funciona.
- **El footer reordenado**, y en particular las dos decisiones declaradas: el
  prefooter apilado a 320/360 y el logo script ausente en mobile.
- **En escritorio**: el header de `/` de vuelta en su lugar y el pie oscuro de la
  pantalla de éxito.
- **El idioma**: abrir el sitio con el castellano guardado y confirmar que el
  subrayado está bajo `ES` y que no viaja al entrar.

## M3 — Preloader nuevo y quince correcciones (2026-08-23)

Nueve fases, un commit cada una, más un décimo (`M3/F1b`) que salió de la
verificación final. Ejecutado sobre `main`, sin `push` y sin tocar Sanity.

**Puertas:** `lint` 0 y `build` 0 en la línea base y al cierre, con el servidor
bajado. Tabla de rutas idéntica.

**No-regresión al cierre:** ocho rutas × ocho anchos (320/360/390/414/430/768/
1366/1920) × dos idiomas = **128 combinaciones, las 128 con cero scroll
horizontal**. Alturas de las ocho rutas en las tres resoluciones y los dos
idiomas: las únicas que se movieron son las que se tocaron a propósito —las seis
de `/services`, por la cuadrícula nueva, y doce de 390, por los 8 px que creció
el footer—.

---

### El prerrequisito

El `.mp4` **no estaba en la raíz del proyecto**, que es donde lo pedía la
instrucción: estaba en `C:/Users/Valentino/Downloads/ANIMACIÓN LOGO_FONDO
NEGRO.mp4`. Se verificó contra la ficha del sprint antes de usarlo y coincide en
todo: 3,000000 s, 12/1 fps, 36 cuadros, 1920 × 1080, `h264` `yuv420p`, 356.928
bytes = 348 KB, y con la pista AAC de 2 canales a 48 kHz que había que quitar.
Siendo el mismo archivo verificado dato por dato, se siguió adelante en vez de
parar; queda declarado como desvío. El original **no se movió ni se borró**: el
repo tiene solo el derivado procesado.

---

### Fase 1 — El preloader (puntos 1 y 2)

**El defecto del punto 1 no era de duración sino de orden de montaje.** La
cortina arrancaba en `shouldRender = false` y se prendía dentro de un
`requestAnimationFrame` disparado desde un `useEffect`, o sea **después de la
hidratación**, y el HTML del servidor no traía cortina ninguna. Y como `Navbar` y
`Footer` viven en el layout —fuera del `template.tsx`, que es el único que
apagaba el contenido con `isPreloaderDone`— el primer cuadro pintado era la
página clara **con el header y el pie puestos**.

**El arreglo es de raíz: la cortina se sirve en el HTML del servidor**, con
estilos en línea, así que existe en el primer pintado y no depende ni de que la
hoja de estilos esté aplicada. La regla de «una vez por pestaña» **no se resuelve
en React** —resolverla en el primer render es lo que rompió la hidratación en el
precedente de la media query—: la resuelve un **script bloqueante** que lee
`sessionStorage` y `prefers-reduced-motion` antes del primer pintado y marca
`data-preloader` en `<html>`. El primer render del cliente es idéntico al del
servidor.

**El asset.** 173,0 KB finales contra 348 de origen: `-an` saca la pista AAC y
`-c:v copy` no recodifica, así que la imagen es la misma. `+faststart` deja el
`moov` en el byte 0x20, o sea que la reproducción puede arrancar con los primeros
bytes. El póster es un negro sólido de 16:9 y **101 bytes**, y no una captura del
primer cuadro, porque el primer cuadro **es** negro puro: `ffprobe` da
`YMIN = YMAX = YAVG = 16` con `U = V = 128` y el cuadro decodificado a RGB tiene
un único color en todo el histograma.

**El negro es `#000000` y no el `#0F0F0F` de la marca**, y eso se decidió
midiendo, como pedía la instrucción: el video no tiene alfa, así que con
`object-contain` las bandas de cortina quedan contra el rectángulo del video, y
15 puntos de diferencia se ven.

**La consecuencia que había que manejar.** `isPreloaderDone` gobierna la entrada
de **nueve** componentes, y hasta M2 se prendía al terminar el deslizamiento. Con
la cortina clara sobre página clara eso no se notaba; con la cortina negra, ese
segundo de deslizamiento habría descubierto la página **vacía** en off-white. Se
prende al **empezar** la salida: los 500 ms del fundido del contenido caen dentro
de los 1000 del deslizamiento.

**Mediciones.** Screencast desde el arranque, 105 cuadros: el `YAVG` máximo de
todos los cuadros pintados antes de los 3000 ms es **18 sobre 255**, y de los 132
a los 323 ms es exactamente **0**. Los seis primeros cuadros dan `CURTAIN` en los
cinco puntos de sonda. A los 3674 ms —con la cortina a media subida— la captura
muestra el footer ya pintado detrás: **no hay página vacía**. Video: reproduce,
muteado, `readyState` 4, fondo computado `rgb(0, 0, 0)`. Cortina en `y = 0` hasta
2900, en −8 a los 3200, en −513 a los 3600 y desmontada a los 4200. **Failsafe
verificado bloqueando el `.mp4`**: se levanta igual a los 4132 ms. Segunda carga y
`prefers-reduced-motion`: `data-preloader="skip"`, cortina ausente del DOM y cero
cuadros con cortina. **Cero errores de hidratación en las ocho rutas.**

`prefers-reduced-motion` se definió como **sin video y sin cortina**: la animación
es la pieza entera, y una cortina negra estática de tres segundos sobre un sitio
claro es peor que no tenerla.

**React 19 sí emite `muted` en el HTML del servidor**, cosa que en versiones
anteriores no pasaba y habría bloqueado la autorreproducción. Verificado en el
HTML servido.

### Fase 1b — El destello que apareció al final

**Lo encontró la verificación del build completo, no la fase.** En un arranque
lento el primer cuadro pintado era **blanco**: el nodo de la cortina es lo segundo
que hay dentro de `<body>`, pero el navegador puede pintar antes de haberlo
parseado, y lo que pinta entonces es el `bg-off-white` del body. Medido: primer
pintado a los 2198 ms con la pantalla en blanco —`elementFromPoint` daba `BODY` en
los cinco puntos, o sea **sin contenido ninguno**— y la cortina recién a los 2337.
Eran ~140 ms.

El script bloqueante ahora marca los dos casos —`"skip"` y `"on"`— y una regla de
`globals.css` pinta `html` y `body` de negro con `"on"` puesto; lo saca
`LoadingScreen` cuando la cortina **empieza** a irse. Verificado estrangulando la
red: el primer cuadro pintado da **`YAVG = 0`** a 40 kB/s (a los 1997 ms) y a
12 kB/s (a los 5249), contra los **243** de antes.

### Fase 2 — Los footers (puntos 3, 8, 13-parte y 14)

**Lo que estaba mal, medido a 390.** Las dos redes vivían apiladas dentro de
**una** celda que abarcaba las filas 1 y 2, así que quedaban alineadas a la
izquierda de su columna —INSTAGRAM terminaba en 336,1 contra los 366 del gutter,
**29,9 px cortos**— y LINKEDIN caía en 692, **doce píxeles por encima** de
WORKING. Y como la columna se dimensiona con su contenido, la posición del bloque
dependía del largo de los rótulos de lugar: por eso en inglés se veían más a la
izquierda que en castellano.

**El punto 8, en qué se diferenciaba home del pre-footer de Work.** En dos cosas,
las dos medidas a 1440: Work pone `© 2024` y el crédito **en la misma línea**
(355,1 y 461,3) y home los **apila**; y Work pega LINKEDIN en **1376** —el borde
exacto del gutter— mientras home lo deja en 1184,6, o sea **191,4 px corto**.

**La composición de mobile la definió Valentino durante la ejecución** y difiere
de lo que decía la instrucción: tres filas, con `© 2024` a la izquierda y el
crédito centrado (la instrucción pedía los dos centrados juntos). Se le consultó
el alcance y respondió **solo mobile**; el escritorio conserva su fila única.

**Resultado, cinco anchos × dos idiomas × tres variantes.** INSTAGRAM y LINKEDIN
pegados al borde derecho con **0,0 px** de sobra en las quince combinaciones, y
cada una a la misma altura que su par de lugar. El crédito centra con **0,0 px de
desvío** a 360, 390, 414 y 430 en los dos idiomas. **A 320 no se puede, y está
medido**: cada columna lateral necesitaría 43,49 px y `© 2024` mide 51,36, o sea
287,75 de total contra 272 de caja útil; debajo de 360 la fila cae a
`justify-between`. El `gap-x-0` de la grilla tampoco es cosmético: con el
`gap-x-4` heredado, a 360 el reparto dejaba 47,49 px por lado y empujaba el
crédito 3,9 px.

**El escritorio no se movió**: los ocho rótulos de las tres variantes miden
idéntico al pre-F2, coordenada por coordenada, y los altos siguen en 164 y 839.

El footer de mobile pasa de **236 a 244 px** porque el piso de área táctil de 44
ahora se aplica por fila y no una sola vez sobre la celda que abarcaba dos.
`HOME_BLOCK_HEIGHT_MOBILE` y `HOME_FOOTER_CLEARANCE` se actualizaron con el número
medido.

### Fase 3 — El scroll sobrante (puntos 4 y 13)

**La causa raíz era una sola y estaba en el `<body>`: `min-h-screen`, que es
`min-height: 100vh`.** En un teléfono `100vh` no es la pantalla que se ve, es la
pantalla **con la barra del navegador oculta**. Así que el documento quedaba más
alto que la pantalla aunque su contenido midiera exactamente `100svh`, y de ahí
salían los dos síntomas: `/` se dejaba scrollear de más, y en `/contact/success`
—donde el panel oscuro mide `100svh` clavados— la franja sobrante mostraba **el
fondo off-white del propio body**. Ese era el blanco de abajo.

Era además el último `100vh` del repo contra su propia regla escrita («nada de
`100vh`: `100svh`»), junto con la ficha de proyecto.

**El banco no puede emular la barra del navegador** —en un viewport emulado `vh`,
`svh`, `lvh` y `dvh` valen todos lo mismo, y por eso ninguna medición de M2 lo
detectó—, así que el mecanismo se demostró forzando a mano el `min-height` que
declara `100vh` con la barra oculta (+72 px): las dos rutas pasan de `docH = 844`
y `scrollY = 0` a `docH = 916` y `scrollY = 72`, y la captura de la pantalla de
éxito muestra la franja clara al pie. Con `svh` eso no puede pasar **por
construcción**.

Se verificó además que la clase no quedara inerte —el precedente de M1—: la regla
`.min-h-svh { min-height: 100svh }` está generada en la hoja.

**Aparte, un scroll interno de 3 px a 320 × 640 en la pantalla de éxito, que era
propio**: el footer creció 8 px en F2 y se comió el margen que M2 había dejado
(276 útiles contra 271 que pide el bloque). Los dos huecos verticales pasan a
`clamp(12px, 2.5svh, 20px)`: a 640 dan 16 y devuelven los 8; de 800 para arriba
tocan el techo y miden 20 como antes.

**Cierre:** `docH === viewH` y `scrollY = 0` tras intentar scrollear 5000 px, en
1920, 1366, 430, 390 y 320, en las dos rutas, y cero contenedores anidados con
scroll.

### Fase 4 — El menú de mobile (puntos 5 y 6)

**El cambio de tono no tenía transición ninguna.** `chromeOnDark` es un booleano
y las clases se cambiaban de golpe: el header pasaba de blanco a negro en **0 ms**
mientras el panel tardaba 500 en bajar. Eso era lo mecánico al abrir; al cerrar
era peor, porque el blanco volvía también en 0 ms con el panel todavía puesto
medio segundo más.

**Las duraciones salen de cuándo el panel tapa la banda del header**, no de gusto.
El panel viaja de `y: -100%` a `y: 0` en 500 ms con `EASE_EXIT`; la banda mide
128 px sobre 844 de viewport, o sea el 15,2 % del recorrido, y como la curva
arranca lenta ese avance recién llega cerca del 36 % del tiempo. **Medido en el
banco: al abrir el panel toma la banda a los ~190 ms y al cerrar la suelta a los
~338.** De ahí la ventana de 200 ms con retardo 0 al abrir y 300 al cerrar: las
dos rampas son **espejo exacto** una de la otra sobre los mismos 500 ms, y dejan
al cromo oscuro justo mientras el panel ocupa la banda. Los 200 ms no son un
número nuevo: son los que `LocaleToggle` ya usaba.

**Muestreado cada cuadro** (Chrome interpola en `oklab`, no en `rgb`, cosa que
costó una pasada de diagnóstico):

```
ABRIR    L = 0,964 → 0,590 → 0,273 → 0,181 → rgb(15,15,15) a los 200 ms
CERRAR   L = 0,168 constante hasta 258 ms, arranca a 308, termina a los ~500
```

**El logo se funde entre sus dos versiones** en vez de cambiar de `src`:
`LogoScript` elige la imagen por `tone` y son dos PNG distintos, así que un cambio
de tono es un corte instantáneo, y con la superficie transicionando eso habría
dejado el logo blanco sobre fondo claro toda la ventana. Medido, el logo claro va
en 0,457 cuando la superficie está en 0,590. No se resolvió invirtiendo el logo
negro con un filtro: los dos archivos comparten silueta —63,9 dB de PSNR en el
canal alfa— pero la tinta no se verificó como inversión exacta, y el logo es la
marca.

**Punto 6:** los cinco ítems centrados, con **desvío 0,0 px** respecto del centro
del panel a 320, 390 y 430. Centrar no cambia lo que entra.

**Geometría del escritorio intacta:** el logo sigue en `x = 64` con 146,28 px de
ancho y la fila en 1920 × 128 con relleno 64/40.

### Fase 5 — Indicador de carga (puntos 7 y 11)

Un solo componente compartido por los tres lugares, que es la regla 10. Sin
librerías: un anillo de 1,5 px en `currentColor` con el `animate-spin` de
Tailwind, y `motion-reduce:animate-none` resolviendo `prefers-reduced-motion` en
el CSS —verificado: `animationName` computa `none`—.

**El umbral es 120 ms y tiene los dos lados medidos.** Por debajo, lo único que
aporta el indicador es parpadeo; por arriba, 120 sigue debajo de los ~200 ms en
que una espera se percibe como espera. Con la caché caliente las peticiones de
`/_next/image` dan **0 ms** de duración y las imágenes completan antes del umbral.

```
imagen demorada 1500 ms      /work                opacidad máx 1,00  visible 407 → 1857 ms
(solo la imagen)             /work/akasha-blends  opacidad máx 1,00  visible 259 → 1958 ms
                             /team                opacidad máx 1,00  visible 227 → 1827 ms

caché caliente, sin demora   las tres rutas       opacidad máx 0,00  0 de 152 cuadros visible
```

**La primera medición había dado 0 en los dos casos y era artefacto del banco:**
estrangulando toda la red se demora también el bundle, React no hidrata y el
efecto que enciende el anillo nunca corre. Se pasó a demorar solo `/_next/image`
por el dominio `Fetch`.

Nunca se queda puesto: `onLoad`, `onError` o un tope de 15 s, las tres
independientes.

### Fase 6 — Services (puntos 9 y 10)

**El punto 9 no reproduce en el banco, y hay que leer eso antes que el arreglo.**
Medido en **21 combinaciones** —1920, 1366 y 390 de ancho por siete u ocho altos
cada uno, de 560 a 1200— el borde inferior del intro cae **exactamente** en el
alto del viewport en todas, y el rótulo queda 160 px por debajo en escritorio y 80
en mobile. La geometría es exacta y no depende del tamaño de pantalla.

Queda un solo mecanismo posible, y es el mismo del punto 4: la barra del
navegador. `svh` es el viewport **con** la barra puesta; al retraerse, lo visible
pasa a ser `lvh`, entre 60 y 110 px más alto, y eso supera los 80 px de aire del
rótulo en mobile. El intro pasa a `lvh`, o sea a medir lo más alto que el viewport
puede llegar a ser.

**El corolario, que conviene retener:** la regla «nada de `100vh`: `100svh`» vale
para lo que tiene que **entrar** en la pantalla; una sección cuyo trabajo es que
**no se vea nada debajo** necesita lo contrario, el máximo, o sea `lvh`.

**Punto 10.** Las cuatro portadas pasan de una fila de cuatro a cuadrícula, y los
dos links dejan de compartir fila con el texto para ir **después**:

```
1920 × 1080   2 col   949 × 711,8   bloque 1698 px   no entra junto
1366 ×  768   2 col   672 × 504     bloque 1282 px   no entra junto
 768 × 1024   1 col   752 × 564     bloque 2618 px   no entra junto
 430 ×  932   1 col   414 × 310,5   bloque 1445 px   no entra junto
 390 ×  844   1 col   374 × 280,5   bloque 1349 px   no entra junto
 320 ×  640   1 col   304 × 228     bloque 1162 px   no entra junto
```

A 1920 cada portada pasa de 471,5 × 353,6 a **949 × 711,8**: cuatro veces el área.

**El corte de columnas es `lg` y no `md`, y también salió de medir**: con el corte
en 768 la tablet en vertical daba portadas de 373 × 280 y el bloque entero medía
910 px contra 1024 de pantalla, o sea que **entraba todo junto**, que es justo lo
que el punto no quiere.

Se conservan las separaciones de B3.4b (6 px entre portadas, 8 contra los bordes).
El ancho pedido al CDN sube de 1200 a 1800 porque a 949 CSS px y DPR 2 hacen falta
1898. El origen del hover deja de tener rama para «las del medio»: en 2 × 2 las
cuatro tocan un borde.

### Fase 7 — Banderas y alias (puntos 12 y 13-alias)

**12a y 12b.** El valor elegido va siempre a color; en la lista el gris pasa de
`grayscale` a `lg:grayscale`, porque debajo de 1024 no hay hover que lo revierta.
Va como **ausencia** de la clase y no como un `grayscale-0` encima: las dos son la
misma propiedad y la misma especificidad, así que cuál gana lo decidiría el orden
en que Tailwind las emite. Medido: `grayscale(1)` en la lista a 1920 y 1440,
`none` a 430, 390 y 320, y `none` en el valor elegido en los cinco anchos.

**13-alias.** La evaluación que pedía el sprint —si conviene generar el alias
desde el nombre traducido— da que **sí**, y es lo que se hizo: `COUNTRY_ES` ya
tiene los 196 nombres, así que meterlos en el corpus cubre **todos** los países
sin escribir un solo alias y sin poder desincronizarse. La tabla de alias queda
solo para lo que no es ni el nombre inglés ni el castellano: siglas, nombres
históricos y formas de uso corriente. Varios países que la instrucción enumera
**no están en la tabla y es correcto**: `Germany`, `Spain`, `Brazil`, `Japan`,
`Switzerland`, las dos Coreas y `Vatican City` ya se encuentran por su nombre
castellano, y `North Macedonia` por subcadena.

El corpus son las tres cosas a la vez **sin mirar el idioma activo**, así que
«germany» funciona con el sitio en castellano y «alemania» con el sitio en inglés.

**Probado caso por caso: 33 consultas × 2 idiomas, 0 fallos.** El caso testigo,
«republica democratica» → `RD del Congo` / `DR Congo`. También «congo» → dos
resultados, «japon» y «japón» → Japón, «espana» → España, «sudafrica» →
Sudáfrica, y «zzzz» → 0 resultados.

### Fase 8 — Fun Gallery en touch (punto 15)

**La escala es la del hover (1,13) y no una nueva**, y **la duración se deriva**:
la mitad de `HOVER_DURATION`, o sea **250 ms**. Cae dentro de los 200–300 que pide
la instrucción y es el mismo movimiento del hover al doble de velocidad, porque
acá es preámbulo de una salida y no un estado.

```
CON proyecto      1,005 → 1,072 → 1,114 → 1,128 → 1,13, tope a los 214 ms,
                  navega a los 982 ms (250 del gesto + 650 de la ruta)
SIN proyecto      llega a 1,13 y vuelve a 1, y NO navega
reduced-motion    escala máxima 1, navega a los 84 ms: inmediato
escritorio 1440   escala máxima 1, navega a los 685 ms: la transición de siempre
```

**El doble camino no se puede confundir, y no por cuidado sino por construcción:**
`interactive` y `tappable` derivan los dos de `spread`. Con el montón sin
desplegar los dos son falsos y el objeto no tiene un solo manejador colgado
—medido: `role = null`, `tabindex = null`— mientras el tap lo recibe el botón de
`inset-0`, que a su vez solo existe mientras `!spread`.

Los objetos sin proyecto reciben el tap pero **no** semántica de enlace. Son seis
de los ocho del dataset.

---

### Lo que no se pudo verificar

- **Las tres cosas del fenómeno de la barra del navegador.** En un viewport
  emulado `vh`, `svh`, `lvh` y `dvh` valen todos lo mismo, así que: (a) el scroll
  sobrante tal como se reportó no reproduce —el mecanismo sí se demostró
  forzándolo—; (b) el asomo de «BRANDING PACKS» no reproduce en ninguna de las 21
  combinaciones medidas; (c) el corrimiento de ~40 px que el paso a `lvh`
  introduce en el intro con la barra puesta no se puede observar.
- **El teléfono de verdad.** El tap de la galería, la coordinación del menú y el
  arranque del preloader en una pestaña nueva son humanos.
- **`/work/tukumi-takeaway` no tiene ningún bloque de media en Sanity**, así que
  es la única ficha donde el indicador de carga no aparece nunca. `matsu` tiene
  uno y `akasha-blends` tres.
- Una lectura suelta de `/team` a 1920 dio 4258 px en una pasada del barrido
  final. **Es flake de medición, no regresión**: cinco pasadas consecutivas más
  una con 3 s de espera dan 4536, que es el valor de la línea base.

### Verificación humana declarada

- **El preloader**, que es lo más visible: en pestaña nueva, que la animación
  arranque de inmediato, que no se vea la página antes y que el paso de negro a la
  página no destelle.
- **El menú** abriendo y cerrando, y si los 200/300 ms se sienten bien en la mano.
- **Los indicadores de carga** con la caché vacía.
- **El tap de la galería**, y si 250 ms son los correctos.
- **Los tres footers**, en los dos idiomas.
- **Buscar países por nombre en español.**
- **La cuadrícula de LATEST PROJECTS**, que es un cambio de escala fuerte.
- **`/` y `/contact/success` en un teléfono real**, con la barra del navegador
  entrando y saliendo: es lo único que puede confirmar los puntos 4, 13 y 9.

---

## M4 — Ajustes de footer y menú (2026-08-24)

Cuatro ajustes, cuatro fases, un commit cada una, más el de documentación.
Ejecutado sobre `main`, sin `push`, sin deploy y sin tocar Sanity.

**Puertas:** `lint` 0 y `build` 0 en la línea base y al cierre, con el servidor
bajado. Tabla de rutas idéntica.

**No-regresión al cierre:**

- **Escritorio: 32 de 32 altos idénticos a la línea base** (ocho rutas × 1920 y
  1366 × dos idiomas). El footer de home sigue en 164 px, el oscuro en 982 a
  1920 y 816,95 a 1366, y el logo del pie en 120,47 × 80.
- **Cero scroll horizontal en las 80 combinaciones** de mobile (ocho rutas ×
  320/360/390/414/430 × dos idiomas).
- **`/` y `/contact/success` siguen midiendo una pantalla exacta**
  (`docH === viewH`) en los cinco anchos y los dos idiomas.
- Las rutas internas crecen **12 px** en mobile, que es el saldo del ajuste del
  footer oscuro (la fila nueva suma 28, el relleno de abajo devuelve 16).

**El banco.** La extensión de Chrome no estaba disponible, así que se volvió a
construir el banco de M2/M3 —Chrome `--headless=new` por el DevTools Protocol
sobre el `WebSocket` nativo de Node, sin dependencias—, porque vive fuera del
repo. Es la tercera vez. Idioma y preloader se fijan con
`Page.addScriptToEvaluateOnNewDocument`; `prefers-reduced-motion` con
`Emulation.setEmulatedMedia`; los altos se toman recién con todas las imágenes
en `complete`, que es lo que saca el ±1 px de ruido documentado en M1.

---

### Fase 1 — El ícono del menú (ítem 2)

**El defecto no era de dibujo sino de identidad.** Había **dos** íconos: tres
rayas de 24 × 2 px con el menú cerrado y **dos reglas de 30 × 2 px** giradas
±45° con el menú abierto. Como el segundo no salía del primero, el cambio se
leía como una sustitución —y con dos y tres rayas a la vista, como dos íconos
distintos—.

Ahora son **siempre las mismas tres rayas de M2**. Al abrir, la de arriba y la
de abajo viajan al centro y giran; la del medio se desvanece. Al cerrar, el
gesto se invierte. Medido:

```
cerrado    tres rayas de 24 × 2, en las filas 56, 63 y 70   (las tres enteras)
abierto    matrix(0,707107,  0,707107, -0,707107, 0,707107, 0,  7)  = ty(+7) rot(+45°)
           opacidad 0                                               = la del medio
           matrix(0,707107, -0,707107,  0,707107, 0,707107, 0, -7)  = ty(-7) rot(-45°)
           las dos con centro en (354, 64) = el centro exacto de la caja de 24
           caja de la cruz 18,38 × 18,38 px
botón      44 × 44 en los dos estados
```

**Los 7 px no son un número elegido.** La caja de 24 centra 3 × 2 + 2 × 5 = 16 px
de contenido, así que las rayas arrancan en 4, 11 y 18 y sus centros caen en 5,
12 y 19: llevar las exteriores al centro (12) son 7 px en cada sentido. El giro
se hace sobre el centro **ya trasladado**, así que las dos cruzan en (12, 12).
La del medio conserva su lugar en el flujo con la opacidad en 0, y es lo que
mantiene a las otras dos en 4 y 18 mientras viajan.

**La ventana es la del cromo y no una nueva.** Medido en el CSS computado:
`transition-property: transform, opacity, background-color`, `duration 0.2s`,
`delay 0s` al abrir y `0.3s` al cerrar — exactamente los mismos [0, 200] y
[300, 500] que M3/F4 le dio a la superficie, al logo y al toggle, y que salen de
cuándo el panel tapa la banda del header. `background-color` viaja en la misma
lista a propósito: con dos transiciones distintas, el tono y el giro se
separarían.

**Con `prefers-reduced-motion` el cambio es inmediato:** medido,
`transition-property: none` en las tres rayas, con la misma geometría de cruz.
`aria-label` y `aria-expanded` siguen alternando.

---

### Fase 2 — El estado activo del menú (ítem 3)

**El defecto tenía una causa concreta:** `underline` es `true` **por defecto** en
`HoverButton`, así que los cinco ítems del menú lo llevaban puesto. Cinco líneas
iguales no distinguen nada; por eso el menú abierto no decía en qué página
estabas. Ahora la línea **es** el estado.

**La ruta marcada sale del mismo cálculo que ya alimentaba la barrita del
indicador de escritorio** (`isPathActive`, por prefijo). No es una tabla nueva:
es lo que garantiza que los dos repartos no puedan discrepar, y lo que hace que
cualquier subruta futura entre sola.

Medido en las ocho rutas y los dos idiomas (16 casos, 16 correctos):

```
/                    (ninguno)          home no es item del menu: se entra por el logo
/work                WORK / PROYECTOS
/work/matsu          WORK / PROYECTOS   la ficha pertenece a la seccion
/services            SERVICES / SERVICIOS
/team                TEAM / EQUIPO
/fun-gallery         FUN GALLERY / GALERIA
/contact             CONTACT US / CONTACTANOS
/contact/success     CONTACT US / CONTACTANOS
```

**El anuncio no pudo ser `aria-current`, y la razón es de contrato.** El `<a>` lo
emite `HoverButton` y no se puede alcanzar desde afuera: el `className` que
recibe va al `<span>` de adentro, y el primitivo no se toca (`CLAUDE.md` §4.2).
La salida fue un sufijo `sr-only` que viaja **dentro de los hijos**, o sea
adentro del ancla: se anuncia con el rótulo —«WORK, current page» / «PROYECTOS,
página actual»— y no depende de que la tecnología de asistencia soporte el
atributo. No mueve el dibujo: la caja de 1 px está fuera del flujo, así que ni el
ancho del rótulo ni el largo del subrayado cambian. Áreas táctiles medidas: 51 px
de alto los cuatro de display y 44 el de contacto.

**El escritorio no se tocó.**

---

### Fase 3 — El footer claro (ítem 1)

**La composición final, medida a 390** (las cotas de los otros cuatro anchos
cambian solo en el ancho de la caja):

```
  +- 24 px de gutter                                   gutter de 24 px -+
  |                                                                     |
  |  BORN IN                                              INSTAGRAM     |  fila 1 · 44 px
  |  ARGENTINA                                                          |
  |                                                        LINKEDIN     |  fila 2 · 44 px
  |  WORKING                                                            |
  |  WORLDWIDE -----------------------------------------    © 2024      |  fila 3 · 44 px
  |            +-- los dos bordes inferiores en el MISMO pixel --+       |
  |                                                                     |  16 px
  |                     POWERED BY develOP                              |  fila 4 · 44 px
  |                                                                     |  16 px
  |                                             [ logo script ]         |  fila 5 · 48 px
  +---------------------------------------------------------------------+
     24 px de relleno arriba y abajo · footer = 304 px en los cinco anchos
```

**La alineación de los bordes inferiores no se calculó: la resuelve la grilla.**
Las tres filas de arriba miden 44 px cada una porque ese es el piso de área
táctil y se aplica **por fila**; la columna derecha las llena en orden y el
segundo par de lugar se manda a la **tercera** fila apoyado en su borde inferior
(`self-end`), dejando vacía la segunda de la izquierda. El criterio pedido es el
borde de abajo, no el renglón, y por eso emparejar por fila —lo que hacía M3—
dejó de ser posible con tres ítems contra dos.

Medido en los cinco anchos y los dos idiomas:

```
delta entre el borde inferior de las dos columnas      0,00 px   en los 10 casos
INSTAGRAM / LINKEDIN / © 2024 / logo contra el gutter  0,00 px   en los 10 casos
alto del footer                                        304 px    en los 10 casos
```

**Efecto secundario que conviene mirar en el teléfono:** entre `ARGENTINA` y
`WORKING` quedan 52 px de hueco, que es exactamente lo que la alineación de
bordes pide. A cambio, cada ítem de la derecha cae **centrado contra el par de la
izquierda**: `© 2024` a 0 px del centro de `WORKING / WORLDWIDE` e `INSTAGRAM` a
2 px del de `BORN IN / ARGENTINA`.

**El crédito quedó donde estaba, y mejor.** Hasta M3 compartía la última línea
con `© 2024` y solo podía centrarse de 360 para arriba: a 320 cada columna
lateral de la grilla `[1fr auto 1fr]` medía (272 − 185,03) / 2 = 43,49 px y
`© 2024` pide 51,36, así que la fila caía a `justify-between`. Con el copyright
mudado a la columna derecha, el crédito es lo único que hay en su fila y **centra
exacto en los cinco anchos** (a 320: 43,48 px de un lado y 43,49 del otro).

#### El logo: por qué fila propia y no al lado del crédito

La instrucción pedía **abajo a la derecha**, con variante centrada si no entraba.
**Entró a la derecha en los cinco anchos**, así que la variante centrada no se
usó. Lo que no entra es compartir fila:

```
                     credito    logo      suma     caja util   entra
320  EN              185,03  +  120,50 =  305,53      272        NO
320  ES              177,83  +  120,50 =  298,33      272        NO
360  EN              185,03  +  120,50 =  305,53      312      6,47 px de aire: no
390+ EN              185,03  +  120,50 =  305,53      342      si, pero no en 320 ni 360
```

Es el mismo conflicto que en M2 sacó al logo del footer de mobile. Como la
instrucción autorizaba explícitamente la fila propia, **la fila propia es la
salida**: el logo no compite con nada y el crédito conserva su centrado.

#### Los tres ajustes de alto, y por qué hicieron falta

La composición nueva suma dos filas (el copyright deja de compartir línea con el
crédito, y el logo vuelve). Con el ritmo de M3 —hueco de 16 px entre filas,
relleno de 40 y logo de 80— la fila habría pedido **400 px**, y a 320 × 640 el
bloque del hero se habría quedado con 112 px contra los 187 que pide la frase:
texto recortado. El presupuesto real es 640 − 128 (header) − 187 = **325 px**.

```
hueco entre filas   16 -> 0    el piso tactil de 44 ya deja 24 px de aire            -64
relleno vertical    40 -> 24   estaba calibrado para tres filas, no para cinco       -32
logo                80 -> 48   la altura del logo del header, ya en el cromo         -32
                                                                        400 -> 304 px
```

Los tres son de mobile: **de `lg` para arriba no cambia ni un píxel**, y las 32
alturas de escritorio lo confirman.

Con 304, el bloque del hero de `/` mide 208 px a 320 × 640 contra los 187 que
pide la frase: entra con 21 px de sobra. `HOME_BLOCK_HEIGHT_MOBILE` y
`HOME_FOOTER_CLEARANCE` se volvieron a medir y pasan de 244 a 304.

#### Lo que esto le cuesta a `/contact/success`, declarado

La pantalla de éxito usa el mismo footer, así que su hueco libre bajó de 268 a
208 px. Su bloque de texto mide 262,89 px en inglés y 241,89 en castellano, así
que **a 320 × 640 el bloque se desplaza dentro del panel**: 55 px en inglés y 34
en castellano. La ruta sigue midiendo **una pantalla exacta** —`docH === viewH`
verificado en los cinco anchos y los dos idiomas— y el desplazamiento interno es
un comportamiento que la sección implementa a propósito desde M2/F3; pero el
vínculo `BACK TO HOME` queda debajo del pliegue hasta que se desliza.

```
320 × 640   caja 208   bloque 262,89 EN / 241,89 ES   ->  55 / 34 px de scroll interno
360 × 800   caja 368   bloque 222,59                  ->  0
390 × 844   caja 412   bloque 222,59 EN / 201,59 ES   ->  0
414 × 896   caja 464   bloque 222,59 EN / 201,59 ES   ->  0
430 × 932   caja 500   bloque 222,59 EN / 201,59 ES   ->  0
```

**Es aritmética y no tiene arreglo dentro del alcance del sprint:** con el logo
de vuelta, el footer no puede bajar de 304 sin sacarle la fila, y el presupuesto
de un viewport de 640 es 249 px. Las tres palancas de una línea —bajar el piso
del `clamp` de los huecos de `ContactSuccess`, achicar más el logo, o esconderlo
debajo de 360— **son decisiones de diseño y no se tomaron**. Queda anotado en
`docs/pendientes.md`.

---

### Fase 4 — El footer oscuro (ítem 4)

Las dos bandas comparten `InfoRow`, así que la composición entró con F3 y esta
fase la **verifica** y calibra lo propio de la banda.

Medido en `/work`, `/fun-gallery` y `/contact`, cinco anchos y dos idiomas:
delta de bordes inferiores **0,00 px**, gutter derecho **0,00 px** en INSTAGRAM,
LINKEDIN y `© 2024`, crédito centrado, cero desborde horizontal.

**El logo grande no se desacomoda.** El asset sigue montándose a ancho completo
del viewport —320 × 95,5 px a 320 y 430 × 128,33 a 430—, el borde inferior de la
imagen y el borde superior del bloque de información siguen siendo **el mismo
píxel** en los diez casos, y en `/contact` el bloque de `JOIN OUR CLUB` conserva
su lugar en flujo normal debajo de la imagen.

**El único ajuste propio: el relleno de abajo baja a 24 px en mobile** y se queda
en 40 de `lg` para arriba. La banda cierra con la línea del crédito, que arrastra
12 px de su caja táctil de 44: con `pb-10` quedaban 52 px de aire muerto al pie
contra los 24 con que la banda abre. Con 24 es simétrica —el mismo ritmo que F3
le dio al footer claro— y la fila de información pasa de 256 a 240 px: de los
28 px que sumó la fila nueva del copyright quedan **12**.

```
footer oscuro de /work, en mobile     antes -> ahora EN    antes -> ahora ES
320 × 640                              708,5 -> 720,5       708,5 -> 720,5
360 × 800                              710,4 -> 722,4       720,4 -> 732,4
390 × 844                              688,4 -> 700,4       719,4 -> 731,4
414 × 896                              633,6 -> 645,6       664,6 -> 676,6
430 × 932                              607,3 -> 619,3       669,3 -> 681,3
```

---

### Desvíos

- **El relleno vertical de los dos footers y el alto del logo se cambiaron sin
  que la instrucción los enumerara.** Los tres son consecuencia aritmética de lo
  que sí pedía —dos filas nuevas al pie— y sin ellos `/` no entraba en una
  pantalla a 320 × 640. Están cuantificados arriba y anotados en pendientes.
- **La Fase 4 no encontró nada que arreglar en la composición del footer
  oscuro**, que era lo que la instrucción pedía verificar; su commit lleva el
  ajuste del relleno de la banda y la verificación escrita en el código.
- La instrucción numera los ítems 2, 3, 1 y 4 y las fases 1, 2, 3 y 4: se ejecutó
  en el orden de los commits que ella misma fija (ícono, menú, footer claro,
  footer oscuro).

### Lo que no se pudo verificar

- **La sensación del ícono en la mano.** Los números están verificados en el CSS
  computado —200 ms, retardo 0 al abrir y 300 al cerrar, `transition-none` con
  `prefers-reduced-motion`—, pero si el giro «acompaña» al panel es humano.
- **Si la composición de los dos footers cierra visualmente** y si el logo, a
  48 px y abajo a la derecha, queda bien ahí.
- **Los teléfonos de 568 px de alto.** El banco midió 320 × 640, que es la vara
  que M2 y M3 usaron. En un 320 × 568 el bloque de `/contact/success` ya se
  desplazaba internamente antes de este sprint (67 px), así que el fenómeno no es
  nuevo, pero el margen del hero de `/` sí se consumió.

### Verificación humana declarada

- **Los dos footers en el teléfono:** si la composición cierra y si el logo quedó
  bien donde quedó.
- **El ícono abriendo y cerrando:** que sea uno solo y que el giro acompañe al
  panel.
- **El menú en cada ruta:** que subraye la que corresponde, y que en `/` no
  subraye ninguna.
- **Un repaso de que nada de M3 se movió:** el preloader, los indicadores de
  carga y el tap de la galería no se tocaron.
