<!-- Destino en el repo: /design-refs/work-single/BRIEF.md -->
# WORK SINGLE — Brief de cambios

## Imágenes de referencia (en esta carpeta)
- `before-aside-initial.png` — Aside en su posición inicial (antes de scrollear).
- `before-aside-after-scroll.png` — Tras scrollear: el aside "pegó un subidón" antes de quedar sticky. Esa diferencia de posición es el bug.
- `reference-image-fit-viewport.png` — Objetivo de imágenes: la imagen entra entera en pantalla, sin recorte, con aire.
- `reference-image-gap-to-content.png` — Muestra el espacio/gap entre imagen y el bloque de contenido.

---

## Request 1 — Aside sticky sin salto
**Ahora:** el aside (columna de texto: categoría / servicios / año / título) arranca en una posición y, al scrollear un poco, **se sube** antes de quedar sticky.
**Queremos:** que quede **sticky desde siempre**, ya posicionado correctamente. **Sin subidón, sin transición, sin shift visual.**

## Request 2 — Imágenes que entran enteras + gaps
**Ahora:** las imágenes simples van a ancho completo con alto automático (una imagen alta se vuelve gigante y excede la pantalla). Las dobles (`dualMedia`, dos imágenes pegadas horizontalmente) se recortan a 3:4 con `object-cover`.
**Queremos:** como en `reference-image-fit-viewport.png`:
- **Altura máxima ≈ la pantalla** (un poco menos está bien, ~88–90vh).
- La imagen **entra entera, sin recorte** (priorizar ver la imagen completa por sobre llenar el espacio).
- **Gap ligero y consistente** entre imágenes adyacentes: tanto apiladas (una encima de otra) como lado a lado (el caso de 2 imágenes horizontales).

> Nota: esto **reemplaza** la idea previa de "forzar 4:3". 4:3 recortaría; el pedido actual + la referencia piden imagen completa con max-height ≈ viewport.

---

## Criterios de aceptación
- [ ] El aside no se mueve entre el estado inicial y el primer scroll (sin salto).
- [ ] El aside queda sticky correctamente bajo el header (`top-32`).
- [ ] El fade-in de la página se mantiene (la opacidad), pero sin transform en el ancestro del sticky.
- [ ] Imágenes simples: max-height ≈ 88–90vh, `object-contain`, sin recorte, centradas.
- [ ] Imágenes dobles (lado a lado): mismo criterio, sin recorte (sin `aspect-[3/4]`/`object-cover`), con gap entre ambas.
- [ ] Gap consistente entre imágenes apiladas y entre imágenes lado a lado.
- [ ] Sin layout shift; captions y nav inferior intactos.

## Notas de causa raíz (no apilar parches)
- **Salto del aside:** `motion.main` entra con `initial={{opacity:0, y:20}}`. Ese `transform` (mientras está activo y al limpiarse) convierte a `main` en el *containing block* del `position: sticky` del aside → rompe el sticky hasta que el transform desaparece. **Fix limpio:** quitar el transform del ancestro del sticky (entrada de `main` solo `opacity`). Si se quisiera conservar un slide, aplicarlo a la **columna derecha**, nunca al ancestro del aside.
- **No remover** el `useLayoutEffect` que recorre ancestros y pone `overflow: visible`: resuelve OTRO rompedor de sticky (ancestros con `overflow:hidden`). El fix real de eso tocaría el layout compartido (fuera de este lane), así que el workaround se queda.
- **Imágenes:** el recorte de `dualMedia` viene de `aspect-[3/4]` + `object-cover`. Reemplazar por `object-contain` + max-height. Aplica también al path `<img>` (no solo al `<Image>` de next).
- Antes de tratar `ProjectContentRenderer.tsx` como exclusivo de este lane: confirmar con un grep que no lo importa otra página. (Debería ser solo Work Single.)
