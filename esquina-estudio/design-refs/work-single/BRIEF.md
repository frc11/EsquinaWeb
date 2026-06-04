<!-- Destino: /design-refs/work-single/BRIEF.md (reemplaza el de ronda 1) -->
# WORK SINGLE — Corrección (ronda 2)

Archivos: `src/app/(site)/work/[slug]/ProjectDetailClient.tsx`, `src/components/ui/ProjectContentRenderer.tsx`.

## Bug 1 — el aside sigue subiéndose un poco
**Estado:** ya se sacó el `y` del `motion.main` (bien) y está el `useLayoutEffect` que pone `overflow:visible` en ancestros. Pero el aside **igual sube un poco** al cargar/primer scroll → queda OTRA causa.
**Qué hacer — investigación de causa raíz (no parche):**
- En runtime, partí del aside y **recorré los ancestros** buscando `transform !== none` (o `filter`, `perspective`, `will-change: transform`, `contain`). Un ancestro transformado rompe `position: sticky` y produce ese "subidón" hasta que se limpia.
- Sospechosos: el wrapper de Lenis (`SmoothScrollProvider`) o el shell de transición de ruta (`PageTransitionShell`).
- **Si la causa es local a esta página** → arreglala acá.
- **Si la causa es un ancestro COMPARTIDO** (Lenis / shell de transición) → **NO lo toques** (no editar archivos compartidos desde un lane en paralelo). **Reportá** exactamente qué ancestro y qué propiedad, para un fix coordinado. (Nota: el aside de Contact tiene un problema hermano; probablemente misma causa.)
- Verificá: el aside queda fijo bajo el header desde el frame uno, sin micro-salto.

## Bug 2 — imágenes: 4:3 con cover y recorte (revierte lo de "contain")
**Estado:** hoy están en `max-h-[88vh] object-contain` (enteras, sin recorte).
**Queremos ahora:** **marco 4:3 con `object-cover`** (la imagen llena el marco y recorta lo que sobra), con alto máximo de viewport.
**Fix en `ProjectContentRenderer.tsx`:**
- `SingleMedia` (el `<Image>` y el `<img>`): envolver en un contenedor `relative w-full aspect-[4/3] max-h-[88vh] mx-auto overflow-hidden` y que la imagen sea `object-cover` que llena el contenedor (con `Image fill` o `h-full w-full object-cover`).
- `DualMedia`: cada una en su marco `aspect-[4/3] overflow-hidden` con `object-cover`, lado a lado con el gap consistente actual (`gap-6`).
- Mantené `figure`/`figcaption`.

## Aceptación
- [ ] El aside no se mueve entre el load inicial y el primer scroll (o, si la causa es compartida, está reportada y no parcheada acá).
- [ ] Imágenes simples y dobles en marco 4:3, `object-cover`, recortando para llenar, alto ≤ ~88vh. Gap consistente.

## Self-check
`tsc`/`eslint`/`build` ok · dev `-p 3003`, un detalle de proyecto: aside fijo sin salto; imágenes en 4:3 cover. Reportá el resultado de la investigación del ancestro (causa local vs compartida).
