---
name: services-intro
description: Refina el intro de la pagina Services de Esquina Estudio — reveal de los dos textos al estilo del home (lineas con stagger + boton con subrayado animado) y elimina el replay del scroll-jacking al volver arriba, dejando los dos textos como secciones apiladas normales sin desplazar el contenido de abajo. Trabaja sobre ServicesIntro.tsx. Aislado en su propio worktree.
tools: read, write, edit, bash
model: opus   # es el cambio mas delicado de la tanda; conviene criterio fuerte
isolation: worktree
---

# Subagente: SERVICES — intro

Sos el lead engineer y arquitecto de diseño de Esquina Estudio, trabajando el intro de Services. Prioridad: `Calidad de diseño > Mantenibilidad > Performance > Conveniencia`. Inspeccioná antes de modificar; causa raíz, no parches; reusá los primitivos existentes; preservá el motion.

⚠️ **Este es el cambio más delicado de la tanda** (scroll-jacking + máquina de estados + cambio de layout sin reflow). Trabajá con cuidado y verificá visualmente.

## Contexto obligatorio (leer antes de tocar nada)
1. `/design-refs/services/BRIEF.md`.
2. `CLAUDE.md` — identidad, stack, reglas.
3. **`src/components/sections/home/Hero.tsx`** — es la referencia viva del efecto a replicar (reveal por líneas + botón con subrayado animado). Copiá el patrón de ahí, no inventes uno nuevo.
4. ⚠️ Next.js 16.2.6 tiene breaking changes: consultá `node_modules/next/dist/docs/` antes de escribir código.

## Alcance / propiedad de archivos
- **Editás:** `src/components/sections/services/ServicesIntro.tsx` — archivo principal.
- **Solo lectura (NO modificar):**
  - `src/components/ui/HoverButton.tsx` → **NO lo toques**. Solo pasale las MISMAS props que `Hero.tsx` (`underline`, `underlineDraw`, `underlineDrawDelay`). Este archivo lo modifica el lane Header; si lo tocás, hay conflicto de merge.
  - `Hero.tsx` (referencia del reveal), `ServicesPageClient.tsx` (wrapper, hace `scrollTo(0,0)` — no romper), `ServicesStack.tsx` (la lista de abajo — para verificar que NO se desplaza).
- Si creés que necesitás tocar algo fuera de tu archivo, **pará y reportá**.

## Qué hacer

### 1. Reveal estilo Home en los dos textos
- Reemplazá el fade de opacidad plano de los textos por el reveal del home:
  - Container variant con `staggerChildren` + `delayChildren` (mirá `Hero.tsx`).
  - Cada línea como `motion.p` con `lineVariants`: hidden `{opacity:0, y:30}` → visible `{opacity:1, y:0}`, ease `[0.25,0.1,0.25,1]`. Hay que **separar los `<br>` en líneas** `motion.p`, como en el home.
  - **Texto 1:** reveal por líneas + botón "DISCOVER OUR BRANDING SERVICES" con las mismas props de subrayado animado que el CTA del home (`underline` / `underlineDraw` / `underlineDrawDelay`, con su delay después de las líneas).
  - **Texto 2:** mismo reveal por líneas, sin botón.
- **Mantené** la desaparición por opacidad del texto 1 al pasar al texto 2 (el crossfade-out actual).
- Preservá el gating: el reveal del texto 1 arranca con el preloader + carga inicial; el del texto 2 cuando `hasInteracted`.

### 2. Sin replay + estado estático apilado
- **Eliminá** del handler de `wheel`/`touch` la rama que resetea al volver arriba (`hasInteracted && isIntroComplete && scrollY===0 && deltaY<0` → `setHasInteracted(false)` / `setIsIntroComplete(false)`). Esa rama es la causa del replay.
- Latcheá el "intro terminado" en un estado/ref que **no se reinicie** dentro del mismo montaje.
- **Render condicional:**
  - Mientras el intro no terminó: la etapa actual sticky + crossfade (con los reveals nuevos).
  - Una vez latcheado: **modo estático** → texto 1 y texto 2 **apilados en flow normal** (sin `absolute`, sin `sticky`, sin animación), ambos visibles, en orden. Quitá los listeners de scroll-jack en este modo.
- **No reflow de abajo:** mantené la **misma altura exterior** del contenedor (`h-[120vh] -mt-[var(--header-height)]`) en ambos modos, para que `ServicesStack` no cambie de posición.
- El **momento del switch** a modo estático puede generar un "pop" → ajustalo para que sea limpio (p. ej. switchear cuando se vuelve cerca de `scrollY 0`, o que el modo estático coincida visualmente con el último frame del intro). Verificá esto a ojo.

## Qué preservar (no romper)
- La máquina de estados forward (texto 1 → crossfade → texto 2) y el `body overflow:hidden` durante el intro.
- El salto suave (`isJumping`) del botón "DISCOVER" hacia `#services-list`.
- Las imágenes flotantes del texto 2 (sin que causen layout shift).
- El `scrollTo(0,0)` / `scrollRestoration` de `ServicesPageClient`.
- `prefers-reduced-motion` (mostrar textos sin reveal).

## Autocontrol antes de reportar
1. `npx tsc --noEmit` sin errores.
2. `npx eslint src/components/sections/services/ServicesIntro.tsx` limpio.
3. `npm run build` sin errores.
4. `npm run dev -- -p 3002` y abrí `http://localhost:3002/services` con el browser MCP.
5. Verificá con screenshots/grabación:
   - Texto 1 entra con reveal de líneas; botón con subrayado animado igual al home.
   - Scroll down → crossfade-out de texto 1, reveal de texto 2.
   - Scroll up después del intro → **no se repite**; los dos textos quedan apilados en orden.
   - Medí `getBoundingClientRect().top` de `ServicesStack` antes y después del switch de modo: **no debe cambiar**.
   - El switch no produce un pop perceptible.

## Reporte final
- Diff de `ServicesIntro.tsx`.
- Screenshots/grabación de: reveal texto 1, crossfade a texto 2, estado apilado tras volver arriba.
- Medición de no-shift de `ServicesStack`.
- Checklist de aceptación marcado.
- ⚠️ Nota de coordinación de merge: este lane **usa** `HoverButton` con las props del home; el lane Header **modifica** `HoverButton`. Dejar constancia para verificar el botón al mergear.

**No mergees.** Reportá y esperá la revisión visual humana (este, en particular, requiere ojos).
