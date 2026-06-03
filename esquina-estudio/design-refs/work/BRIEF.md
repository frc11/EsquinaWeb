<!-- Destino en el repo: /design-refs/work/BRIEF.md -->
# WORK — Brief de cambios

## Imágenes de referencia (en esta misma carpeta)
- `before-current-grid.png` — Estado actual: tarjetas anchas (paisaje), alturas dispares, reveal desde distintas direcciones.
- `reference-tiquismiquis.png` — Objetivo de grilla: 3 columnas, tarjetas (casi) cuadradas, gaps consistentes.

---

## Request 1 — Animación de entrada de los proyectos

**Ahora:** los trabajos aparecen ~todos a la vez, con entrada direccional desde distintos lados (izquierda, derecha, abajo, alternado).

**Queremos:** que entren **todos desde abajo** (fade + leve subida), de forma **secuencial**, en orden de **izquierda a derecha** (y de arriba hacia abajo), con un **ligero delay entre cada uno**. Sensación de galería curada, no de bloque que aparece de golpe.

**Mantener:** el gating del preloader (la animación arranca cuando el preloader terminó), que se reproduzca **una sola vez** (no re-animar al volver a scrollear), el ease actual, el hover overlay de la tarjeta y el cursor custom.

## Request 2 — Relación de aspecto de las tarjetas

**Ahora:** tarjetas con altura fija, proporción apaisada.

**Queremos:** tarjetas **(casi) cuadradas** como en `reference-tiquismiquis.png`, en grilla de **3 columnas** en desktop. Default: **1:1**.

---

## Criterios de aceptación
- [ ] Todos los proyectos entran desde abajo (ningún offset horizontal).
- [ ] La entrada es secuencial izq→der / arriba→abajo, con delay perceptible pero sutil (no todos juntos).
- [ ] No re-anima al volver a scrollear (`once`).
- [ ] Arranca recién cuando el preloader terminó.
- [ ] Tarjetas cuadradas (1:1), grilla 3 col desktop, responsive en mobile, gaps consistentes.
- [ ] El hover overlay (info del proyecto) y el zoom de imagen al hover siguen funcionando igual.
- [ ] Sin layout shift; sin cambios de tamaño/peso en hover.
- [ ] Respeta `prefers-reduced-motion` (sin offset ni stagger si está activo).

## Notas de causa raíz (del análisis previo — para no apilar parches)
- Los **dos cambios viven solo en `WorkGrid.tsx`**. `ProjectCard.tsx` es `h-full` + `object-cover` + `fill`: la proporción la define el contenedor padre → **no se toca la tarjeta**.
- El array `DIRECTIONS` (entrada desde distintas direcciones) es código a **eliminar**, no a modificar.
- El delay actual `index < 3 ? index * 0.1 : 0` es el motivo de "casi todos juntos": solo escalona los 3 primeros. Reemplazar por **stagger de contenedor**.
- Un `delay: index * x` global se rompe con muchos proyectos (delays enormes en los últimos). Por eso stagger a nivel contenedor. Si algún día hay > ~9 proyectos (más de 3 filas), pasar a stagger por fila.
- Opcional (no obligatorio): el cover se pide a Sanity como 3:4 (`.width(1200).height(1600)`). Para celdas cuadradas se podría pedir 1:1, pero eso toca `ProjectCard.tsx` → dejarlo, `object-cover` ya resuelve el recorte.
