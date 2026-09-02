# Plan maestro — Esquina Estudio

Fuente de verdad del mapa de bloques de la ronda. Lo mantiene la capa de planificación; el agente de ejecución **no lo edita** salvo instrucción explícita (B4/F8 lo pidió para cerrar la ronda; M6/F5 lo pidió para archivarla; M7 sumó su fila a la tabla de sprints y corrigió los punteros de `docs/` que el archivado movió).

**Estado al 2026-09-01.** La primera ronda (B1–B4) se ejecutó entre el 15 y el 21 de agosto; después vinieron **siete sprints de corrección y cierre (M1–M7)**, del 22 al 26, **seis más (M8–M13)** hasta el 28, y la **ronda 2 de devoluciones (R2)** el 1 de septiembre. El detalle de cada uno está en `docs/bitacora.md`; el resumen, al pie de este archivo.

**R2 corrigió una omisión de este archivo:** el mapa se detenía en M7 mientras M8 a M13 ya estaban ejecutados **y publicados**. Los seis tienen su fila más abajo.

## Ronda en curso: devoluciones de las clientas

- Fuente del alcance: `Final.pdf` (13-08-2026, 15 páginas de mockups y anotaciones).
- Insumo técnico: auditoría completa `docs/reportes/2026-08-13-auditoria-completa.md` (HEAD `2565d01`, 9 bloques, 7 sesiones). **Ojo: está parcialmente obsoleta** —lo dice su propio encabezado desde R2— y no se lee como estado del código, sino como el registro de cómo estaba el repo el 13 de agosto.
- Desktop-first. La adaptación mobile se planeó como ronda futura separada y **se ejecutó en M1** (2026-08-22), con cinco sprints de corrección detrás.

## Decisiones cerradas

1. Los «pt» de las anotaciones de las clientas equivalen a **px CSS** (evidencia medida: 40↔40, 30↔30, 17↔17).
2. Menú: 13 → **17px**, interletrado 0. La nivelación con el «sistema 17» del sitio es decisión de las clientas, consciente.
3. Contact se compacta según mockup: título 96→40/48, subtítulo →17/21, labels a la izquierda en dos líneas, «todo en gris», y el questionnaire debe entrar en un viewport **sin scroll**.
4. Footer nuevo global: franja blanca con la frase del hero (40/48/0, izq.) + banda off-black con logo script gigante, «JOIN OUR CLUB» → **`/contact`**, y fila de info. Footer de home: una línea, redes y logo a la derecha, interlineado 20.
5. Catálogo de Services: contenido **nuevo** según el PDF, **hardcodeado bilingüe** (no migra a Sanity en esta ronda).
6. Países del formulario: **se traducen** (dataset ES se genera en B4).
7. Contenido de Sanity: **bilingüe por dos casillas** por campo de texto de `project`. Los campos actuales quedan como EN (cero migración); casillas ES opcionales con **fallback cruzado** (si una está vacía se muestra la otra, nunca un hueco); pares agrupados con fieldsets. La forma de la variante ES del Portable Text de `content` quedaba abierta, con una sola restricción: **no duplicar los bloques de media**. **Resuelta en M6/F3** y en esa dirección: `contentEs` es un campo de **solo texto**, y al renderizar en castellano los párrafos salen de ahí mientras **las imágenes siguen saliendo de `content`, en su lugar original**. El emparejamiento es por **posición entre los bloques de texto**; si faltan, sale el inglés en su lugar exacto; si sobran, no se muestran y el Studio avisa. Nunca hay dos copias de una imagen que puedan desincronizarse.
8. Fun Gallery: **schema propio** (`funGalleryImage`: imagen + alt + order + referencia opcional a `project` — primer uso de referencias del repo) + pantalla de entrada con recortes flotando → click despliega al mapa. La derivación desde los `project` se retira.
9. Toggle EN/ES: en el header, a la derecha de CONTACT US. Server siempre EN; detección en cliente durante el preloader; la elección explícita persiste y le gana a la detección; sin librerías de i18n. Aceptaciones escritas: recarga a mitad de sesión sin cortina (swap a la vista) y metadata + `<html lang>` en EN para todos.
10. `/api/seed-sanity` eliminado (B1). Regla nueva: tooling de escritura a Sanity = script local fuera de `app/`, con guard; nunca una ruta pública.

## Bloques

### B1 — Fundación · **CERRADO** (sprint único faseado, 2026-08-15)
- **Objetivo:** el repo deja de mentir. Documentación sincronizada, muertos eliminados, registros creados.
- **Alcance:** CLAUDE.md reescrito · README real · 2 comentarios stale de Contact · borrar InfoCard / SanityImage / types-service / seed-sanity · destrackear devserver logs · crear plan-maestro / pendientes / bitácora.
- **Depende de:** nada. **Desbloquea:** todo (cualquier agente que cargue el CLAUDE.md viejo obedece reglas de junio, incluida la prohibición derogada del schema de Fun Gallery).

### B2 — Devoluciones visuales sobre lo existente · **CERRADO** (2026-08-20, siete sprints: B2.1–B2.7)
- **Objetivo:** todas las anotaciones del PDF sobre páginas existentes, aplicadas.
- **Alcance:** Home (frase nueva, sin botón CTA, interlineado 48) · menú 17/0 + recalibrar el indicador (offset `-7`) · footer de home reordenado · **footer nuevo global** · Team (intro 40→30/36, centrado, dos párrafos) · Work grid (1:1→5:4, hover con más aire, reveal más rápido y solapado) · Contact compacto contra mockup, con pills nuevas y mapeo tolerante de `?service=`.
- **Sprints aprox.:** 5 (home+menú · footer · Team · Work grid · Contact).
- **Decisión del ritual del bloque:** tokens de font-size del `@theme` — adoptar como punto central o borrar.
- **Depende de:** B1. **Insumo externo:** asset del logo grande (formato a confirmar con las clientas; solo frena el sprint de footer).

### B3 — Rediseños de sección: Fun Gallery y Services · **CERRADO** (2026-08-20, B3.1–B3.4b)
- **Arranque obligatorio: sonda de transparencia.** 1 PNG con alpha real por el camino completo Sanity → CDN → `next/image` (avif/webp), montado sobre fondo de color, comparando `object-cover` vs. `contain`. Reporte antes de diseñar nada encima (es el único camino del pipeline no ejercitado por ninguna imagen del sitio).
- **Fun Gallery:** schema `funGalleryImage` + casillas ES de `project` + **una sola sesión de carga de las clientas** (8 PNG + ~19 piezas ES) + pantalla de entrada/despliegue + fallback realineado. La carga se explica a las clientas por video (decisión B3.2b); la guía escrita del Studio se eliminó.
- **Services:** IA nueva (INTRO / BRAND CONSULTATION / 01 ESSENTIALS / 02 UNIVERSE / + ADD-ONS), sidebar sticky centrado con flecha scroll-spy y click-scroll, indicador de scroll en lugar del botón DISCOVER, LATEST PROJECTS (4 portadas + links), retiro completo del stack viejo (acordeón, ScrollTriggers, slideshows). El intro se conserva con copy nuevo.
- **Sprints aprox.:** FG 3 · Services 3–4. **Depende de:** B1 (regla de schema derogada) y B2 (las páginas nuevas se construyen y verifican contra el chrome final).

### B4 — Idioma EN/ES · **CERRADO** (2026-08-21, sprint único de ocho fases)
- **Objetivo:** toggle funcional con el sitio completo en dos idiomas.
- **Alcance:** control EN/ES en el header · detección + persistencia + `lang` por escritura al DOM · diccionario (cromo de UI + catálogo nuevo de Services + países ES + footer nuevo + FG) · queries y render bilingüe de Sanity con fallback cruzado · adaptación ES de cortes de línea (Valentino, sobre la tipografía final) · convertir a `lines.length` los conteos literales que sobrevivan · aceptaciones escritas (recarga sin cortina; metadata EN).
- **Sprints aprox.:** 3 → **se hizo en uno**, faseado en ocho commits (`49c080c` … `4857687` + docs).
- **Qué quedó, contra lo planeado:** todo el alcance, más tres cosas que el plan no había anticipado y salieron del propio trabajo: (a) el formulario guarda **valores canónicos** y traduce solo el rótulo, que es lo que hace que cambiar de idioma a mitad de formulario no vacíe la selección ni rompa las banderas; (b) el esquema de zod pasó a llevar **claves** en vez de frases, para que los errores en pantalla sigan al idioma sin revalidar; (c) el `LocaleToggle` se sumó también al menú de mobile, porque si no quedaba inalcanzable debajo de `md`.
- **Lo que NO se hizo, y es correcto:** ninguna palanca de fit. La matriz en castellano dio **idéntica** a la inglesa en los siete anchos, limpia y con los dos mensajes de validación, así que no había nada que ajustar.
- **Insumo externo que quedó abierto:** las casillas ES de los proyectos de Sanity. **Al 2026-08-26 las ocho de una línea están cargadas** (los tres `Title (ES)` van vacíos a propósito, porque son marcas) y queda el cuerpo, cuyo campo `contentEs` entró en M6/F3 con las traducciones propuestas ya escritas en `docs/archivo/sanity-piezas-es.md`. El sitio funciona sin ellas: hay fallback cruzado.
- **Depende de:** B2 y B3 (ambos cerrados).

## Fuera de esta ronda

~~Adaptación mobile (ronda aparte con skill dedicada)~~ **— hecha en M1** · `error.tsx` / `not-found.tsx` · `<main>` anidados · instalación del harness ECC en el repo. Los tres que quedan siguen fuera de alcance y necesitan su propio chat de planificación.

## Cierre de la ronda — 2026-08-21

Los cuatro bloques quedaron ejecutados y el sitio funcionó completo en inglés y
en castellano. Lo que quedó abierto no era alcance sin hacer: era **deuda
decidida**, y vive en `docs/pendientes.md`.

## Los siete sprints de cierre — M1 a M7 (22 al 26 de agosto)

Después de cerrar los bloques vinieron siete sprints que no abrieron alcance
nuevo: adaptaron, corrigieron lo que la verificación humana devolvió y
archivaron.

| Sprint | Fecha | Qué hizo |
|---|---|---|
| **M1** | 22-08 | **Adaptación mobile.** Nueve fases. El sitio entra y se usa en teléfonos: un solo corte a 1024, cero scroll horizontal en ocho rutas × cinco anchos × dos idiomas. |
| **M2** | 23-08 | **Las catorce devoluciones de la verificación humana de M1.** Diez de mobile, dos de escritorio —una de ellas una regresión, no una decisión— y dos de los dos. |
| **M3** | 23-08 | **Preloader nuevo y quince correcciones.** La cortina pasa a ser el video del logo y se arregla de raíz el orden de aparición; se elimina el scroll sobrante, que resultó ser el `100vh` del `<body>`. |
| **M4** | 24-08 | **Footer y menú.** Un solo ícono de menú, subrayado de la sección actual y los dos footers de mobile en dos columnas, con el logo script de vuelta. |
| **M5** | 25-08 | **La compuerta del preloader deja de escribir sobre `<html>`.** El aviso de hidratación era solo de desarrollo, pero el arreglo es de raíz y no de silenciado. |
| **M6** | 26-08 | **Cierre de la ronda.** El lienzo negro de `/studio`, la pantalla de éxito en teléfonos de 640, `contentEs`, la limpieza del repo y **el archivo del conocimiento técnico**. |
| **M7** | 26-08 | **Limpieza y archivado del repo.** Sin cambios de producto: los 32 altos quedaron idénticos. La documentación histórica —20 mockups, las instrucciones, `banderas-set.md` y `sanity-piezas-es.md`— se **archivó en `docs/archivo/`**, no se borró, con sus 20 punteros actualizados. **Borrar no hubo nada que borrar**: lo que no tiene consumidores en este repo ya no existe. |

## Los seis sprints que el mapa no registraba — M8 a M13 (26 al 28 de agosto)

**Este bloque faltaba.** El plan maestro se detenía en M7 mientras había seis
sprints ejecutados **y publicados** después de él; R2 los incorporó. Ninguno
abrió alcance nuevo: los seis son correcciones de devolución humana.

| Sprint | Fecha | Qué hizo |
|---|---|---|
| **M8** | 26-08 | **El cierre de `/services` vuelve a su composición de escritorio** y la cuadrícula queda acotada a mobile. Revirtió el reparto que M3/F6 había aplicado en todos los rangos. |
| **M9** | 27-08 | **El 500 del formulario** —configuración de la cuenta de Resend, destinatario configurable y error del proveedor registrado— y el orden y la distribución de Fun Gallery. |
| **M10** | 27-08 | **El orden y el reparto de Fun Gallery, de verdad.** Lo que se veía en producción era el motor pre-M9: `main` estaba **tres commits adelante de `origin/main`** y M9 nunca se había desplegado. Dejó la regla operativa: *una verificación que no se corre contra lo que ve el visitante no es una verificación*. |
| **M11** | 28-08 | **El tamaño del logo del preloader deja de depender del alto de la ventana** y pasa a declararse en `vw`, medido y no estimado. |
| **M12** | 28-08 | **Las proporciones del logo del preloader quedan al revés** de como las había aplicado M11, que las había cruzado. |
| **M13** | 28-08 | **El logo del preloader se achica en escritorio a 19 % del ancho del viewport**, que es la cuenta que iguala la presencia relativa que mobile ya tenía aprobada. |

## R2 — Ronda 2 de devoluciones de las clientas (2026-09-01) · **CERRADA**

Fuente: dos PDF de devolución, `Correcciones_Traducción` (15 páginas) y
`Correcciones_Mobile` (5), exportados como imagen en `docs/archivo/mockups/`
(`r2-trad-01…15.jpg`, `r2-mob-01…05.jpg`). **Son la fuente de verdad de esta
ronda**, igual que `Final.pdf` lo fue de la anterior.

Doce fases con un commit cada una, sobre `main`, sin `git push`:

| Fase | Qué hizo |
|---|---|
| **2–5** | **Services y home.** Precio y CTA por pack (`$200` + `BOOK A CONSULTATION` / `SOLICITAR CONSULTORÍA`), copy nuevo en inglés y en castellano de los cuatro packs, párrafo de ÚLTIMOS PROYECTOS y `FUN GALLERY` sin traducir en el menú. |
| **6** | **Team.** Copy nuevo bilingüe —tres párrafos en la sección 01, cuatro en la 03— y, sobre todo, **los cortes de línea salen del contenido**: se fueron los `
` intra-párrafo, el renglón fantasma del `


` y el `space-y-0` que lo compensaba. |
| **7** | **La banda de cierre.** La frase de marca en castellano pasa a dos líneas, `JOIN OUR CLUB` desaparece del sitio y la banda blanca **no se monta** en `/contact`. |
| **8** | **El formulario.** Rótulos ES nuevos, `SELECCIONAR` como placeholder, `RESPUESTA BREVE` / `RESPUESTA CORTA` separadas, `Naming` en lugar de `Motion Graphics` y los cuatro rangos de presupuesto nuevos. |
| **9** | **Fun Gallery.** Frase nueva bilingüe y aparición sin fundido escalonado. |
| **10** | **La entrada de Contact** pasa a ser la del intro de Services, extraída a un módulo compartido: se fueron el `clipPath` y el `blur`. |
| **11–12** | **Mobile.** Logo del header a 37 px, toggle de idioma como desplegable `EN ⌄`, footer en dos columnas sin `WORKING WORLDWIDE` ni prefijo del crédito, Team alineado a la izquierda, galería con la frase más chica y los objetos más grandes, y un botón de volver arriba. |
| **13** | **Registros.** Esta entrada, la bitácora, los pendientes y el banco de medición, que **deja de ser desechable** y pasa a vivir en `tools/bench/`. |

**Lo que R2 dejó abierto está en `docs/pendientes.md`**, sección «Abiertos al
cerrar R2»: cinco cosas para consultar con las clientas y cuatro técnicas, todas
con su medición.

## Decisiones de arquitectura durables

Las cuatro de abajo **sobreviven a la ronda**: no son de un sprint, son de cómo
está construido el sitio. Cambiarlas es una decisión de arquitectura, no un
ajuste.

**1 · La Fun Gallery tiene schema propio (`funGalleryImage`), no deriva de los
proyectos.** Imagen + `altText` + `order` + una referencia opcional a `project`.
Es el **primer y único `reference` del repo**, y su desreferencia en la query
(`->`) el primer salto documento-a-documento. Dos consecuencias que hay que
respetar: la galería se carga sola, sin tocar los proyectos, y **el orden de la
query tiene que ser total** (`order`, después `_createdAt`, después `_id`),
porque de esa secuencia sale el seed de la composición y sin desempate GROQ no
garantiza la misma lectura dos veces. Con esto quedó **derogada** la regla vieja
de «no crear schemas nuevos»: se crean cuando el plan lo indica.

**2 · El bilingüe de Sanity va por campos hermanos, con fallback cruzado.** El
campo existente queda como inglés —cero migración— y al lado va su casilla ES,
**opcional**, agrupada con un `fieldset`. Si la casilla del idioma activo está
vacía se muestra la otra, **en las dos direcciones**, y «vacía» incluye `null`,
la clave ausente y los espacios: **nunca queda un hueco**. Aplica a los tres
campos de una línea (`titleEs`, `categoryEs`, `servicesEs`) y, desde M6/F3,
también al cuerpo — con una variante, porque el cuerpo no es una casilla sino una
composición: **`contentEs` lleva solo el texto y las imágenes se siguen tomando
de `content`**, emparejadas por posición entre los bloques de texto. Todo eso
vive en **un solo módulo**, `src/lib/project-text.ts`; cualquier campo bilingüe
nuevo se cuelga de ahí y no se escribe un segundo sistema.

**3 · El pipeline de imagen de la galería: `w=1200&fm=webp` al CDN, sin prop
`quality`, `object-contain` y sin recorte en la capa de parallax.** Sale de la
sonda de transparencia con la que arrancó B3: es el único camino del pipeline
—PNG con alfa real por Sanity → CDN → `next/image`— que ninguna imagen del sitio
ejercitaba. `contain` y no `cover` porque con `cover` se recortaba el producto; y
por lo mismo la capa de parallax va `inset-0` **sin `overflow-hidden`**, porque
el overscan negativo volvía a recortarlo. Aparte, y para todo el sitio: un `vw`
suelto en el `sizes` de `next/image` impide servir nada más chico que 640 px
(§7.5 de `CLAUDE.md`).

**4 · El tooling de escritura a Sanity va como script local con guard, y nunca
como ruta pública.** Origen: `/api/seed-sanity`, que era una ruta de la app capaz
de escribir en el dataset y que B1 eliminó. La regla es de seguridad y no de
estilo: una ruta pública con permiso de escritura es una ruta pública con permiso
de escritura, por más que nadie la enlace. Corolario vigente: **el agente no
escribe en el dataset**; lo que haya que cargar se redacta como propuesta en
`docs/archivo/sanity-piezas-es.md` y lo carga una persona desde el Studio.

## Qué mirar primero en el próximo chat de planificación

Lo que sigue abierto está en `docs/pendientes.md`, con su contexto. Los cuatro
cabos que conviene mirar primero:

1. **Contraste del gris.** `gray-brand` (#939393) sobre off-white da **2,77:1**
   —medido—, por debajo del 4,5:1 de AA para texto normal y del 3:1 para texto
   grande. Sobre off-black da 6,24:1, que sí pasa. Es atenuación deliberada, no
   un bug: hay que tomar la decisión una vez para todo el sitio en vez de
   parchearla componente por componente.
2. ~~**Dos decisiones de tono que son de marca y no de código:** `FUN GALLERY` →
   `GALERÍA` y `WORK` → `PROYECTOS`.~~ **Cerradas en R2, y las cerraron ellas:**
   `FUN GALLERY` **se queda en inglés** («MANTENER EN INGLES», `r2-trad-01.jpg`) y
   `WORK` sigue siendo `PROYECTOS`. Con el mismo criterio, los dos pares de lugar
   del footer volvieron al inglés.
3. **Contenido de las clientas:** el cuerpo de los proyectos en castellano —el
   campo ya existe, las traducciones propuestas están escritas—, el tipeo
   `FOOD & SEVERAGES`, el bloque de texto vacío de Akasha y el bloque repetido de
   Matsu, y el gif/video de Team.
4. **Lo que quedó fuera de ronda y necesita su propio sprint:** `error.tsx` /
   `not-found.tsx`, los `<main>` anidados, `NEXT_PUBLIC_SITE_URL` sin definir y
   la instalación del harness ECC. ~~Y una decisión de método: **dejar el banco de
   medición headless como herramienta del proyecto** en vez de reconstruirlo en
   cada sprint (van cuatro veces).~~ **El banco se cerró en R2:** vive en
   `tools/bench/`, trackeado, con su README. Fue la quinta reconstrucción y la
   última.
