# Plan maestro — Esquina Estudio

Fuente de verdad del mapa de bloques de la ronda. Lo mantiene la capa de planificación; el agente de ejecución **no lo edita** salvo instrucción explícita. Estado al 2026-08-15.

## Ronda en curso: devoluciones de las clientas

- Fuente del alcance: `Final.pdf` (13-08-2026, 15 páginas de mockups y anotaciones).
- Insumo técnico: auditoría completa `docs/reportes/2026-08-13-auditoria-completa.md` (HEAD `2565d01`, 9 bloques, 7 sesiones).
- Desktop-first. La adaptación mobile es una ronda futura separada.

## Decisiones cerradas

1. Los «pt» de las anotaciones de las clientas equivalen a **px CSS** (evidencia medida: 40↔40, 30↔30, 17↔17).
2. Menú: 13 → **17px**, interletrado 0. La nivelación con el «sistema 17» del sitio es decisión de las clientas, consciente.
3. Contact se compacta según mockup: título 96→40/48, subtítulo →17/21, labels a la izquierda en dos líneas, «todo en gris», y el questionnaire debe entrar en un viewport **sin scroll**.
4. Footer nuevo global: franja blanca con la frase del hero (40/48/0, izq.) + banda off-black con logo script gigante, «JOIN OUR CLUB» → **`/contact`**, y fila de info. Footer de home: una línea, redes y logo a la derecha, interlineado 20.
5. Catálogo de Services: contenido **nuevo** según el PDF, **hardcodeado bilingüe** (no migra a Sanity en esta ronda).
6. Países del formulario: **se traducen** (dataset ES se genera en B4).
7. Contenido de Sanity: **bilingüe por dos casillas** por campo de texto de `project`. Los campos actuales quedan como EN (cero migración); casillas ES opcionales con **fallback cruzado** (si una está vacía se muestra la otra, nunca un hueco); pares agrupados con fieldsets. La forma de la variante ES del Portable Text de `content` se decide en el ritual de B3 (no se duplican los bloques de media).
8. Fun Gallery: **schema propio** (`funGalleryImage`: imagen + alt + order + referencia opcional a `project` — primer uso de referencias del repo) + pantalla de entrada con recortes flotando → click despliega al mapa. La derivación desde los `project` se retira.
9. Toggle EN/ES: en el header, a la derecha de CONTACT US. Server siempre EN; detección en cliente durante el preloader; la elección explícita persiste y le gana a la detección; sin librerías de i18n. Aceptaciones escritas: recarga a mitad de sesión sin cortina (swap a la vista) y metadata + `<html lang>` en EN para todos.
10. `/api/seed-sanity` eliminado (B1). Regla nueva: tooling de escritura a Sanity = script local fuera de `app/`, con guard; nunca una ruta pública.

## Bloques

### B1 — Fundación · **EN EJECUCIÓN** (sprint único faseado, 2026-08-15)
- **Objetivo:** el repo deja de mentir. Documentación sincronizada, muertos eliminados, registros creados.
- **Alcance:** CLAUDE.md reescrito · README real · 2 comentarios stale de Contact · borrar InfoCard / SanityImage / types-service / seed-sanity · destrackear devserver logs · crear plan-maestro / pendientes / bitácora.
- **Depende de:** nada. **Desbloquea:** todo (cualquier agente que cargue el CLAUDE.md viejo obedece reglas de junio, incluida la prohibición derogada del schema de Fun Gallery).

### B2 — Devoluciones visuales sobre lo existente · PENDIENTE
- **Objetivo:** todas las anotaciones del PDF sobre páginas existentes, aplicadas.
- **Alcance:** Home (frase nueva, sin botón CTA, interlineado 48) · menú 17/0 + recalibrar el indicador (offset `-7`) · footer de home reordenado · **footer nuevo global** · Team (intro 40→30/36, centrado, dos párrafos) · Work grid (1:1→5:4, hover con más aire, reveal más rápido y solapado) · Contact compacto contra mockup, con pills nuevas y mapeo tolerante de `?service=`.
- **Sprints aprox.:** 5 (home+menú · footer · Team · Work grid · Contact).
- **Decisión del ritual del bloque:** tokens de font-size del `@theme` — adoptar como punto central o borrar.
- **Depende de:** B1. **Insumo externo:** asset del logo grande (formato a confirmar con las clientas; solo frena el sprint de footer).

### B3 — Rediseños de sección: Fun Gallery y Services · PENDIENTE
- **Arranque obligatorio: sonda de transparencia.** 1 PNG con alpha real por el camino completo Sanity → CDN → `next/image` (avif/webp), montado sobre fondo de color, comparando `object-cover` vs. `contain`. Reporte antes de diseñar nada encima (es el único camino del pipeline no ejercitado por ninguna imagen del sitio).
- **Fun Gallery:** schema `funGalleryImage` + casillas ES de `project` + **una sola sesión de carga de las clientas** (8 PNG + ~19 piezas ES) + pantalla de entrada/despliegue + fallback realineado. La carga se explica a las clientas por video (decisión B3.2b); la guía escrita del Studio se eliminó.
- **Services:** IA nueva (INTRO / BRAND CONSULTATION / 01 ESSENTIALS / 02 UNIVERSE / + ADD-ONS), sidebar sticky centrado con flecha scroll-spy y click-scroll, indicador de scroll en lugar del botón DISCOVER, LATEST PROJECTS (4 portadas + links), retiro completo del stack viejo (acordeón, ScrollTriggers, slideshows). El intro se conserva con copy nuevo.
- **Sprints aprox.:** FG 3 · Services 3–4. **Depende de:** B1 (regla de schema derogada) y B2 (las páginas nuevas se construyen y verifican contra el chrome final).

### B4 — Idioma EN/ES · PENDIENTE (último)
- **Objetivo:** toggle funcional con el sitio completo en dos idiomas.
- **Alcance:** control EN/ES en el header · detección + persistencia + `lang` por escritura al DOM · diccionario (cromo de UI + catálogo nuevo de Services + países ES + footer nuevo + FG) · queries y render bilingüe de Sanity con fallback cruzado · adaptación ES de cortes de línea (Valentino, sobre la tipografía final) · convertir a `lines.length` los conteos literales que sobrevivan · aceptaciones escritas (recarga sin cortina; metadata EN).
- **Sprints aprox.:** 3. **Depende de:** B2 y B3.

## Fuera de esta ronda

Adaptación mobile (ronda aparte con skill dedicada) · `error.tsx` / `not-found.tsx` · `<main>` anidados · instalación del harness ECC en el repo.
