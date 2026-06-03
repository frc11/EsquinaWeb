<!-- Destino en el repo: /design-refs/contact/BRIEF.md -->
# CONTACT — Brief de cambios

## Imágenes de referencia (en esta carpeta)
1. `before-life-underline.png` — LIFE con subrayado (closeup).
2. `before-select-double-arrow.png` — Select cerrado con DOS flechas (una al lado de OPTION, otra abajo-derecha).
3. `before-select-open-x.png` — Select abierto con X y dropdown.
4. `before-selection-in-input-invisible.png` — Texto seleccionado dentro de un input en focus: no se ve (mismo color que el fondo del focus).
5. `reference-page-selection-and-life.png` — Selección de texto normal de la página (negro/blanco) + LIFE en bold.
6. `before-country-input-flag-mono.png` — Input de país con bandera monocromática.
7. `before-country-dropdown-flags-mono.png` — Dropdown de países con banderas monocromáticas + buscador.
8. `before-contact-layout-full.png` — Layout actual completo (form a la derecha, línea "SCROLL", scroll interno).
9. `reference-contact-fields-annotated.png` — Campos del form anotados (opciones de cada select).

> Archivos involucrados: `ContactForm.tsx`, `MonochromeCountryFlag.tsx`, `contact/page.tsx`. (Todos del lane Contact.)

---

## Request 1 — Palabra "LIFE"
**Ahora:** el componente `AnimatedLife` dibuja un subrayado animado (`scaleX`) y "engrosa" la letra (revela una versión `font-medium` sobre `font-normal` con clip-path).
**Queremos:** sacar el subrayado y el engrosamiento. Dejar **LIFE en bold, estático, desde el inicio** (sin animación). El resto del heading igual.
**Implementación:** reemplazar `<AnimatedLife/>` por `<span className="font-semibold">LIFE</span>` (ajustar el peso al de la referencia). Borrar el componente `AnimatedLife` (queda muerto). Mantener el reveal del título completo (`contactTitleVariants`).

## Request 2 — El label se mueve al abrir un select
**Ahora:** al abrir un select, el label se reubica (en `before-select-open-x.png` se ve centrado contra TODA la altura del select abierto → el dropdown empuja el alto de la fila y `items-center` recentra el label).
**Queremos:** el label se queda donde está, siempre alineado a su campo, abra o no el select.
**Implementación:** que el dropdown quede **fuera de flujo** (absolute, overlay) para que no cambie el alto de la fila, y/o que el label no dependa del estado abierto del select (alinearlo de forma estable). Verificar abriendo cada select.

## Request 3 — Flechas del select
**Ahora:** dos flechas (una al lado de "OPTION", otra en la esquina abajo-derecha) + una X cuando abre.
**Queremos:** sacar la flecha de abajo-derecha **y** la X. Dejar **una sola flecha** (la de al lado de OPTION) que **rota 90° en sentido horario al abrir**, con transición suave y sin layout shift.
**Ojo:** la `>` al lado de OPTION hoy es **texto** dentro del placeholder (`"SELECT OPTION >"`). Para que rote suave hay que convertirla en un **elemento real** (svg/span) y sacar la `>` del string del placeholder/valor.

## Request 4 — Selección de texto dentro de los inputs
**Ahora:** al marcar texto en un input, el `::selection` global (negro/blanco) coincide con el fondo negro del focus → no se ve (imagen 4).
**Queremos:** que la selección **dentro de los inputs** use el **color contrario** (fondo blanco, texto negro) y que tenga la **altura de la palabra, no del input** (que no se salga, que se note adentro).
**Implementación:** usar la variante `selection:` de Tailwind en los inputs (`selection:bg-off-white selection:text-off-black`). **NO tocar `globals.css`** (la selección global de la página se mantiene como está). Verificar que el highlight abraza el texto y no parece un bloque de alto completo (revisar `leading`/padding de `CONTROL_TEXT_CLASS` si hiciera falta).

## Request 5 — Banderas de países coloreadas (line-art coloreado)
**Decisión tomada:** opción 1 — **colorear los patrones line-art existentes** con los colores reales del país, manteniendo las MISMAS formas. (Sin librerías nuevas, sin emojis.)
**Comportamiento:** en **hover** de un país (dropdown) y en el país **seleccionado** (input), la bandera se ve **coloreada** con los colores del país. El resto (opciones no-hover del dropdown, estado por defecto) sigue **monocromático** como ahora.
**Implementación (`MonochromeCountryFlag.tsx`):**
- Agregar prop `colored?: boolean` (default `false` → comportamiento monocromático actual **intacto**).
- Refactorizar cada función de patrón para aceptar un array **ordenado** de colores y, en modo `colored`, rellenar las regiones con esos colores manteniendo la geometría exacta. El orden lo define la geometría del patrón (ej. `horizontal-tricolor` → [arriba, medio, abajo]; `vertical-tricolor` → [izq, centro, der]; `nordic` → [campo, cruz]; etc.). **Documentar el orden por patrón.**
- Crear un mapa estático `COUNTRY_FLAG_COLORS: Record<string, string[]>` (en este archivo o uno hermano), con los colores de cada país en el orden que consume su patrón. **Fallback:** país sin entrada → render monocromático (nunca roto).
**Triggers (`ContactForm.tsx`, select de país):** `renderValueMeta` pasa `colored` **siempre** (el seleccionado va coloreado); `renderOptionMeta` pasa `colored` **en hover** de esa opción (preferir `group-hover` por CSS, sin estado JS por opción).
**Avisos honestos:**
- El **mapa de colores por país es la parte de más esfuerzo y más riesgo de exactitud.** Sourcear de una referencia confiable, NO a ojo. Revisión humana sobre una muestra.
- Patrones con emblema / cuarteados / complejos quedarán **aproximados** por naturaleza (son line-art estilizado). Aceptado.
- Interpretación de "coloreada": se rellenan las regiones con los colores reales (lee como una mini-bandera en el mismo estilo compacto). Si en review se prefiere solo colorear trazos, es ajuste menor.

## Request 6 — Layout: izquierda sticky + scroll de página + SEND debajo del form
**Ahora:** `contact/page.tsx` tiene `<main>` con `h-[calc(100svh-var(--header-height))] overflow-hidden` (no scrollea la página). El form tiene scroll interno (`overflow-y-auto`, `data-lenis-prevent`), una barra de progreso "SCROLL" arriba y un gradiente abajo. El botón SEND está en el aside izquierdo.
**Queremos:**
- Sacar la línea/barra "SCROLL" de arriba del form.
- Que **scrollee la página entera** (sacar el alto fijo + `overflow-hidden` del `<main>` y el scroll interno del form).
- La **mitad izquierda** (heading "LET'S BRING YOUR IDEAS…" + texto) queda **sticky** en su lugar; la **derecha** (el form, que es largo) scrollea con la página.
- El form puede quedar **centrado horizontalmente** en su sección derecha y un poco más grande.
- El botón **SEND QUESTIONNAIRE va DEBAJO del form** (al final), no en el lado izquierdo.
**Dependencia importante:** el `CustomSelect` usa `scrollContainerRef={formScrollRef}` (el scroll interno) para auto-scrollear el dropdown cuando se sale de vista. Al eliminar ese scroll, hay que **reapuntar esa lógica al scroll de la página** (window) o usar `scrollIntoView`.
**Limpieza:** borrar el código muerto resultante (`formScrollProgress`, `updateFormScrollProgress`, barra de progreso, gradiente, `data-lenis-prevent`). Opcional: el `<main>` de `contact/page.tsx` anida con el `<main>` del layout del sitio → convertirlo en `<div>`/`<section>` (evita `<main>` anidado).

---

## Criterios de aceptación
- [ ] LIFE: bold estático, sin subrayado ni animación; `AnimatedLife` borrado.
- [ ] Al abrir un select, el label NO se mueve.
- [ ] Select: una sola flecha que rota 90° horario al abrir; sin flecha abajo-derecha ni X; sin layout shift.
- [ ] Selección dentro de inputs: fondo blanco / texto negro, contenida al alto del texto; `globals.css` intacto.
- [ ] Banderas: en hover (dropdown) y en seleccionado (input) se ven coloreadas; el resto monocromático. Países sin datos → mono (no roto).
- [ ] Layout: sin línea "SCROLL"; página scrollea; izquierda sticky; form a la derecha scrolleando; SEND debajo del form.
- [ ] El dropdown del select sigue auto-revelándose al abrir cerca del borde (con el nuevo scroll de página).
- [ ] Footer aparece naturalmente al final; sin código muerto del scroll interno.
- [ ] `prefers-reduced-motion` respetado en lo que aplique.

## Notas de causa raíz (no apilar parches)
- Selección invisible = `::selection` global negro/negro en focus. Fix scopeado con `selection:` (sin tocar globals).
- Label que salta = dropdown en flujo + `items-center`. Fix: dropdown fuera de flujo.
- Flecha que no rota = es texto, no ícono. Convertir a elemento.
- Scroll interno = consecuencia del `<main>` de alto fijo. Quitar la causa (alto fijo) en vez de parchear el scroll.
