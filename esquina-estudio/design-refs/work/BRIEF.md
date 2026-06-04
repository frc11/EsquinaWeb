<!-- Destino: /design-refs/work/BRIEF.md (reemplaza el de ronda 1) -->
# WORK — Corrección (ronda 2)

Archivo: `src/components/sections/work/WorkGrid.tsx`.

## Bug — el delay entre proyectos es muy corto
**Estado actual:** `containerVariants` usa `staggerChildren: 0.08`. Entran casi encimados.
**Queremos:** que cada proyecto **empiece su animación cuando termina la del anterior**. Como cada item dura `0.7s`, subí `staggerChildren` a `0.7` (≈ la duración del item). Probamos así; queda fácilmente ajustable.

## Aceptación
- [ ] Cada proyecto arranca su entrada al terminar el anterior (cascada marcada, no encimada).
- [ ] Se mantiene: desde abajo, una sola vez (`once`), gating de preloader, tarjetas cuadradas 3-col, hover y `cursor-none`.

## Self-check
`tsc --noEmit` ok · `eslint` ok · `next build` ok · dev `-p 3001`, `/work`: la cascada es secuencial (cada uno tras el anterior).
