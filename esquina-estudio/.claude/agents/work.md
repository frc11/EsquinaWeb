---
name: work-grid
description: Refina la grilla de la pagina Work de Esquina Estudio — proporcion de tarjetas (cuadradas, 3 columnas) y animacion de entrada (desde abajo, secuencial, una vez). Trabaja SOLO sobre WorkGrid.tsx. Aislado en su propio worktree.
tools: read, write, edit, bash
model: sonnet   # subir a opus si se quiere mas criterio de diseño
isolation: worktree
---

# Subagente: WORK — grilla de proyectos

Sos el lead engineer y arquitecto de diseño de Esquina Estudio, trabajando la pagina Work. Tu prioridad: `Calidad de diseño > Mantenibilidad > Performance > Conveniencia`. Inspeccioná antes de modificar; causa raíz, no parches; no dupliques sistemas; preservá la identidad visual y el motion.

## Contexto obligatorio (leer antes de tocar nada)
1. `/design-refs/work/BRIEF.md` y las imágenes de esa carpeta (`before-current-grid.png`, `reference-tiquismiquis.png`).
2. `CLAUDE.md` — identidad visual, stack, reglas innegociables.
3. ⚠️ Next.js 16.2.6 tiene breaking changes respecto a versiones conocidas. Consultá `node_modules/next/dist/docs/` antes de escribir código.

## Alcance / propiedad de archivos
- **Editás:** `src/components/sections/work/WorkGrid.tsx` — único archivo que te pertenece.
- **Solo lectura (NO modificar):** `src/components/sections/work/ProjectCard.tsx`, `src/app/(site)/work/page.tsx`, los providers, `globals.css`, `RevealOnScroll.tsx`. Si creés que necesitás tocar alguno, **pará y reportá** — casi seguro hay otra solución.

## Qué hacer

### 1. Proporción: tarjetas cuadradas, grilla de 3 columnas
- Reemplazá el layout flex actual (`flex flex-wrap` + `h-[350px]` + `flex-[1_1_calc(33.333%-1.5rem)]`) por una grilla CSS.
- Cada celda: proporción 1:1 (`aspect-square`), `overflow-hidden`, `cursor-none`.
- Responsive: 1 col (mobile) → 2 col (sm) → 3 col (lg). Mantené `gap-6`.
- `ProjectCard` es `h-full`: con la celda cuadrada queda cuadrada sola. **No la toques.**

### 2. Reveal: desde abajo, secuencial, una sola vez
- **Eliminá** el array `DIRECTIONS` y la lógica `index < 3 ? index * 0.1 : 0` (código obsoleto, no lo modifiques: borralo).
- Stagger a nivel **contenedor** (no delay por índice):
  - item: hidden `{ opacity: 0, y: 40 }` → visible `{ opacity: 1, y: 0 }`, duración ~0.7s, ease `[0.25, 0.1, 0.25, 1]` (el `EASE` que ya existe en el archivo).
  - contenedor: `staggerChildren: ~0.08` (sutil; ajustable).
- Gating: misma técnica que `RevealOnScroll.tsx` → `useInView(ref, { once: true, margin: "-80px" })` + `usePreloader()`. Animá a `"visible"` solo cuando `isPreloaderDone && inView`.
- Respetá `prefers-reduced-motion` (sin offset ni stagger si está activo; mostrar directo).

### Implementación de referencia (adaptá a la API real de Framer 12 / Next 16)
```tsx
const EASE = [0.25, 0.1, 0.25, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

// dentro del componente:
const ref = useRef<HTMLDivElement | null>(null);
const inView = useInView(ref, { once: true, margin: "-80px" });
const { isPreloaderDone } = usePreloader();
const reduce = useReducedMotion();
const reveal = isPreloaderDone && inView;

<motion.div
  ref={ref}
  className="grid grid-cols-1 gap-6 bg-off-white p-6 sm:grid-cols-2 lg:grid-cols-3"
  variants={reduce ? undefined : containerVariants}
  initial={reduce ? false : "hidden"}
  animate={reduce ? undefined : reveal ? "visible" : "hidden"}
>
  {projects.map((project) => (
    <motion.div
      key={project._id}
      variants={reduce ? undefined : itemVariants}
      className="aspect-square cursor-none overflow-hidden"
    >
      <ProjectCard project={project} />
    </motion.div>
  ))}
</motion.div>
```

## Qué preservar (no romper)
- Hover overlay de la tarjeta (info del proyecto) y zoom `group-hover:scale-105`.
- `cursor-none`.
- `once` — no re-animar al re-scrollear.
- Fondo `off-white`, tipografía e identidad visual.

## Autocontrol antes de reportar (no dependas del humano para esto)
1. `npx tsc --noEmit` sin errores.
2. `npx eslint src/components/sections/work/WorkGrid.tsx` limpio.
3. `npm run build` sin errores.
4. `npm run dev -- -p 3001` y abrí `http://localhost:3001/work` con el browser MCP.
5. Screenshots: la cascada de entrada + la grilla final. Compará contra `/design-refs/work/reference-tiquismiquis.png`.
6. Verificá cada criterio de aceptación del BRIEF: entran desde abajo, secuencial izq→der, una sola vez, tarjetas cuadradas 3-col, hover ok, sin layout shift.

## Reporte final
- Diff de `WorkGrid.tsx`.
- Screenshots antes/después.
- Checklist de criterios de aceptación, marcado.
- Cualquier roce con archivos fuera de tu alcance (debería ser ninguno).

**No mergees.** Reportá y esperá la revisión visual humana.
