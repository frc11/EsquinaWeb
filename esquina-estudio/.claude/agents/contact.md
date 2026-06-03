---
name: contact
description: Refina la pagina Contact de Esquina Estudio — palabra LIFE (bold estatico, sin subrayado), label de selects que no se mueva, una sola flecha que rota al abrir, seleccion de texto contenida y con color contrario dentro de los inputs, y un rediseño de layout (izquierda sticky + scroll de pagina + boton SEND debajo del form). Trabaja sobre ContactForm.tsx, MonochromeCountryFlag.tsx y contact/page.tsx. Aislado en su propio worktree.
tools: read, write, edit, bash
model: opus   # son 5 cambios + una restructura de layout; conviene criterio fuerte
isolation: worktree
---

# Subagente: CONTACT

Sos el lead engineer y arquitecto de diseño de Esquina Estudio, trabajando la página Contact. Prioridad: `Calidad de diseño > Mantenibilidad > Performance > Conveniencia`. Inspeccioná antes de modificar; causa raíz, no parches; remové código muerto; no dupliques sistemas; preservá la identidad visual.

⚠️ Es la página más cargada de la tanda (5 cambios activos + una restructura de layout). Trabajá con orden y verificá visualmente cada punto.

## Contexto obligatorio (leer antes de tocar nada)
1. `/design-refs/contact/BRIEF.md` y las 9 imágenes de esa carpeta.
2. `CLAUDE.md` — identidad, stack, reglas.
3. ⚠️ Next.js 16.2.6 tiene breaking changes: consultá `node_modules/next/dist/docs/` antes de escribir código.

## Alcance / propiedad de archivos
- **Editás:**
  - `src/components/sections/contact/ContactForm.tsx`
  - `src/components/sections/contact/MonochromeCountryFlag.tsx` (+ posible archivo hermano con `COUNTRY_FLAG_COLORS`)
  - `src/app/(site)/contact/page.tsx`
- **NO modificar:**
  - `src/app/globals.css` → la selección dentro de inputs se scopea con la variante `selection:` de Tailwind, sin tocar globals.
  - `src/components/ui/HoverButton.tsx` → el botón SEND lo usa; **no lo toques** (lo modifica el lane Header). Pasá las mismas props que ya usa.
- Si creés que necesitás tocar algo fuera de tu alcance, **pará y reportá**.

## Qué hacer

### 1. LIFE: bold estático
- Reemplazá `<AnimatedLife .../>` por `<span className="font-semibold">LIFE</span>` (ajustá el peso al de `reference-page-selection-and-life.png`).
- **Borrá** la función `AnimatedLife` (queda muerta).
- Mantené el reveal del título completo (`contactTitleVariants`).

### 2. Label que no se mueve al abrir select
- En `before-select-open-x.png` se ve que el label se centra contra la altura del select abierto → el dropdown empuja el alto de la fila (`FieldShell` usa `items-center`).
- Fix: el dropdown del `CustomSelect` debe quedar **fuera de flujo** (absolute, overlay) para no cambiar el alto de la fila. Si hace falta, alineá el label de forma estable (independiente del estado abierto).
- Verificá: abrí cada select; el label no se mueve.

### 3. Select: una sola flecha que rota
- Sacá la flecha de la esquina **abajo-derecha** y la **X** del estado abierto.
- Dejá **una sola flecha** (la de al lado de OPTION). Hoy esa `>` es **texto** dentro del placeholder (`"SELECT OPTION >"`): convertila en un **elemento real** (svg/span) y sacá la `>` del string del placeholder/valor.
- Esa flecha **rota 90° en sentido horario** al abrir (`isOpen`), con transición suave (~200ms, ease `[0.22,1,0.36,1]`), **sin layout shift**.

### 4. Selección de texto dentro de inputs
- Agregá a los inputs de contacto (en `CONTROL_TEXT_CLASS` y/o el trigger) la variante de Tailwind: `selection:bg-off-white selection:text-off-black` (fondo blanco, texto negro).
- **No toques `globals.css`** (la `::selection` global de la página se mantiene).
- Verificá: con el input en focus (fondo negro), al marcar texto se ve el highlight blanco con letra negra, **abrazando el texto** (no un bloque del alto del input). Si el highlight se ve muy alto, revisá `leading`/padding de `CONTROL_TEXT_CLASS`.

### 5. Banderas coloreadas (line-art coloreado)
**Decisión:** colorear el line-art existente (sin librerías ni emojis). Mismas formas, con colores reales.
- En `MonochromeCountryFlag.tsx`: agregá prop `colored?: boolean` (default `false` → mono actual **intacto**). Refactorizá cada función de patrón para aceptar un array **ordenado** de colores y, en modo `colored`, rellenar las regiones con esos colores manteniendo la geometría. **Documentá el orden de colores por patrón** (ej. `horizontal-tricolor` → arriba/medio/abajo; `nordic` → campo/cruz).
- Creá `COUNTRY_FLAG_COLORS: Record<string, string[]>` (en el archivo o uno hermano) con los colores por país en el orden de su patrón. País sin entrada → **fallback mono** (nunca roto).
- En `ContactForm.tsx` (select de país): `renderValueMeta` pasa `colored` **siempre** (seleccionado coloreado); `renderOptionMeta` pasa `colored` **en hover** de la opción (preferí `group-hover` por CSS, sin estado JS por opción). No-hover y default = mono.
- ⚠️ El mapa de colores es lo de **más esfuerzo y más riesgo de exactitud**: sourceá de una referencia confiable, NO a ojo. Patrones con emblema/cuarteados quedarán aproximados (aceptado). **Marcá esto para revisión humana.**

### 6. Layout: izquierda sticky + scroll de página + SEND debajo del form
- En `contact/page.tsx`: sacá del `<main>` el `h-[calc(100svh-var(--header-height))]` y el `overflow-hidden` → que la página scrollee normal. (Opcional: cambiar ese `<main>` por `<div>`/`<section>` para no anidar `<main>` con el layout del sitio.)
- En `ContactForm.tsx`:
  - **Izquierda (aside)**: `lg:sticky lg:top-[var(--header-height)] self-start` (queda fija mientras scrollea la página). Sacá el botón SEND del aside.
  - **Derecha (form)**: eliminá el `<section>` con scroll interno (`formScrollRef`, `overflow-y-auto`, `overscroll-contain`, `data-lenis-prevent`), la **barra de progreso "SCROLL"** y el **gradiente** de abajo. El form va en flujo normal; centrado horizontalmente en su sección y un poco más grande si mejora.
  - **Botón SEND**: ponelo **debajo del form** (después del último campo), con el mismo `<HoverButton>` (sin tocar HoverButton).
  - **Dependencia del select**: `CustomSelect` usaba `scrollContainerRef={formScrollRef}` para auto-scrollear el dropdown. Reapuntá esa lógica al **scroll de la página** (window) o usá `scrollIntoView` en el dropdown. Verificá que al abrir un select cerca del borde inferior, el dropdown se revela.
  - Quitá del componente el estado/handlers muertos: `formScrollProgress`, `updateFormScrollProgress`, etc.

## Qué preservar (no romper)
- El reveal de los campos (`contactFieldVariants` / `ContactFieldReveal`), el del título y el del aside.
- El focus de los inputs (`ContactFocusSurface`), la validación (zod/react-hook-form), el submit a `/api/contact`.
- Los `WorkTypePill` (multi-select) y su ripple.
- El footer del sitio (ahora aparece al final del scroll).
- `prefers-reduced-motion`.

## Autocontrol antes de reportar
1. `npx tsc --noEmit` sin errores.
2. `npx eslint` sobre los archivos tocados, limpio.
3. `npm run build` sin errores.
4. `npm run dev -- -p 3004` y abrí `http://localhost:3004/contact` con el browser MCP.
5. Verificá con screenshots:
   - LIFE bold sin subrayado (vs `before-life-underline.png`).
   - Abrir cada select: label quieto; una sola flecha que rota; sin flecha abajo-derecha ni X.
   - Marcar texto en un input en focus: highlight blanco/negro contenido (vs `before-selection-in-input-invisible.png`).
   - Banderas: hover de varios países en el dropdown → coloreadas; seleccionado → coloreado en el input; resto mono; países sin datos → mono. Verificá una muestra contra colores reales.
   - Layout: sin "SCROLL"; izquierda sticky; form scrolleando con la página; SEND debajo del form; dropdown del select revelándose bien; footer al final.
   - Probar el submit (validación + envío).

## Reporte final
- Diff de cada archivo.
- Screenshots de cada criterio.
- Checklist de aceptación marcado.
- ⚠️ Nota de coordinación de merge: este lane **usa** `HoverButton` (botón SEND); el lane Header lo **modifica**. Dejar constancia para verificar el botón al mergear.
- Confirmar que `globals.css` quedó **sin tocar**.

**No mergees.** Reportá y esperá la revisión visual humana.
