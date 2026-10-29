# R5-ASPECTO — las imágenes de proyecto conservan su proporción

Rama `run/R5-aspecto`, un commit, sin merge. Paths del brief (`tools/bench/`, `research/`, `docs/bitacora.md`) interpretados relativos a `esquina-estudio/`, que es donde vive `tools/bench/` (la raíz del repo no tiene `tools/`).

## Antes de construir

### Implicancias
- La caja deja de ser la fila 4:3: dependen de ella el `sizes` (ancho pintado = ancho del marco), el tope de ancho a Sanity (`sanityWidth`) y la geometría de columna de `ProjectDetailClient` (`100vw−48` / `100vw−432`).
- Queda vieja la documentación: el comentario de R4 sobre `object-cover`/desborde (reescrito) y la bitácora de R4 (entrada nueva).
- El tope de alto (88svh) rige también el par (A4): cuando muerde, la foto se angosta y se centra dentro de su mitad; la mitad sigue midiendo el 50 %.
- Par con una sola imagen: ocupa la fila entera (como antes); su `sizes` y su tope usan el hueco `single`.
- Opcional/ajeno: hotspots, GIF (tope 1200), portadas, FunGallery, video, schema.
- Decisión que no es mía: ninguna; el brief las dejó cerradas.

### Premortem
Fallaría si el `max-height` + `aspect-ratio` + `width:100%` reproducía el defecto, si el gate medía el nodo equivocado y pasaba sin medir, si el `sizes` quedaba con el hueco viejo, o si un `vw` suelto borraba los cortes chicos del `srcset`. Plan: el tope va sobre el ANCHO (`min(100%, 88svh × razón)`) con `aspect-ratio: w / h` exacto; el gate usa marcas propias (`data-media-frame`, `data-media-half`) y la verdad sale de la API de Sanity, no del helper; se probó con defectos plantados y mutación; los términos de `sizes` van dentro de `min()`.

### Gate y comandos
`node tools/bench/r5-aspecto.mjs` (A1–A9 + alcance S) sobre `npm run build` + servidor en 3010; `npm run lint`; `git diff --stat main`.

## Qué cambié
Solo `ProjectContentRenderer.tsx` (+ gate, informe, screenshots, bitácora).
- Un helper, `mediaFrame(slot, image)`, y un componente `MediaFrame`, usados por `next/image` single, el `<img>` del GIF y las dos mitades. Marco: `aspect-ratio: <w> / <h>` y `width: min(100%, 88svh × razón)`, centrado con `mx-auto`. La imagen va `object-contain` (nunca `cover`).
- Par: fila `flex items-center`, cada mitad `flex-1 min-w-0` (50/50 exacto, gap 2 px); la más baja queda centrada vertical.
- Fallback sin dimensiones: razón del hueco (4:3 / 2:3) + `object-contain`. En este dataset no se ejercitó (las 11 imágenes medidas tienen dimensiones).
- Se eliminó `coverWidth`/`mediaSizes`/`assetAspect`/`SLOT_MIN_ASPECT`.
- Verificado contra el dataset real: el id lleva las dimensiones (`image-<hash>-6000x4500-jpg`, en `asset._ref`).

## Gate (código final, 40 combinaciones × idiomas; salida completa en `research/R5-gate-salida.txt`)
Resultado: **63/64 en verde; el 1 rojo es S** por un archivo suelto mío (`C:/EsquinaWeb/.lint.out`, sin trackear) que el permiso me impidió borrar. Con ese archivo borrado el chequeo debe dar verde; **pendiente que lo borres y reejecutes**. Todas las aserciones de medición pasan. Ejemplos:
- A1 akasha img#1: foto 1,9997 · caja desvío ≤0,5 % en 20 muestras (el resto de las 11 imágenes, igual; ver archivo).
- A2: dispersión de la razón ≤0,5 % entre las 10 combinaciones × 2 idiomas, todas las imágenes.
- A3: `object-fit:cover` en 0 muestras; llenado mínimo ≥99,5 %.
- A4: alto/tope máximo 1,0000 (el tope muerde exactamente en 88svh, nunca pasa).
- A5: `|izq − der|` máx 0,000 px (akasha) / 0,000 px (pepe); mitad típica 170,0 px a 390.
- A6: scrollWidth − clientWidth = 0 en 20/20 muestras por ruta.
- A7: pepe (razones 0,562 y 0,667) aire arriba − abajo máx 0,016 px.
- A8: `sizes` declarado − ancho pintado = 0,00..0,00 px en 20 muestras por imagen.

## Defectos plantados y mutación
- `object-cover` en un contenedor → **rojo**: `FAIL A3 ... akasha img#1 ... object-fit:cover en 20/20 muestras` (7 rojas en total: 6 A3 + S). 
- Cambio fuera del lote (`src/lib/sanity.ts`) → **rojo**: `FAIL S alcance ... 2 fuera de lo permitido: esquina-estudio/src/lib/sanity.ts, .lint.out`. Revertido con `git checkout`.
- Mutación (helper con razón constante 4:3) → **rojo**: `FAIL A1 ... img#2 (3456x5184, half) ... caja 1.3333 (desvío 100.000%)`, y lo mismo en todas las imágenes.
- No medí el código viejo de `main` con el gate: no tiene las marcas `data-media-*`.

## `sizes`
- Antes: `(max-width: 767.98px) calc(100vw - 48px), calc(100vw - 432px)` para fotos ≤4:3 (mitad: `50vw - …`), y `max(hueco, min((100vw - inset) × 0,75·razón, 88vh × razón))` para fotos más apaisadas (que declaraban ancho desbordado).
- Ahora: `(max-width: 767.98px) min(100vw - 48px, 88vh * R), min(100vw - 432px, 88vh * R)`; mitad: `min(50vw - 25px | 217px, 88vh * R)`.
- Medido: declarado − pintado = 0,00 px a 390/768/1024/1366/1920 × 720/1080 (ej.: single 336 px a 390; 1488 px a 1920; mitades 167–170 px a 390).

## Tope de Sanity
No muerde para las fotos con `next/image`: tope pedido ≥ pintada × 2 o igual al original (ej. 2976 pedido vs 2976 necesario; 1488 vs 1268). Se dejó el cálculo (sigue siendo cota superior; se anotó en el comentario). **Excepción previa a R5:** el GIF de akasha va a `w=1200` con 1488 px pintados (original 1400): muerde, pero es el tope de peso de R4 que el brief deja fuera; no lo toqué.

## Hotspot
El schema marca `hotspot: true` en estas imágenes; el código los ignoraba y ahora, sin recorte, son irrelevantes para estos bloques. No se construyó nada.

## Discrepancias doc/código
CLAUDE.md y R4 describen la caja `aspect-[4/3]`+`object-cover`; el código la reemplaza ahora.

## Verificación humana
Los screenshots (`research/R5-aspecto/`: `single-390`, `single-1366`, `pair-390`, `pair-1920`, akasha-blends) son para comparar a ojo con el sitio vivo. El single capturado es la primera imagen del contenido (el GIF 2:1), no necesariamente la de «logo variants».

## Supuestos y descartes:
- Supuse que los paths del brief son relativos a `esquina-estudio/`.
- Supuse que el tope de alto aplica también al par (A4 lo exige), aunque la mitad ya no se llene a lo ancho cuando muerde.
- Supuse DPR 1 en el gate (el banco usa DPR 1); la comparación con Sanity es contra ancho×2.
- No verifiqué el fallback sin dimensiones en navegador (ninguna imagen real lo ejerce).
- Descarté medir el código viejo con el gate (sin marcas).
- Descarté cambiar `sanityWidth` y el tope de 1200 del GIF: no muerden por R5 / fuera de alcance.
- Descarté `svh` en `sizes`: `vh` pide de más en teléfonos, nunca de menos.
- Descarté usar `min-h`/`max-h` en el marco: reproduce el defecto (la trampa del brief).
