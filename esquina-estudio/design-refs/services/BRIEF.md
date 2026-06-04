<!-- Destino: /design-refs/services/BRIEF.md (reemplaza el de ronda 1) -->
# SERVICES — Corrección (ronda 2)

Archivo: `src/components/sections/services/ServicesIntro.tsx`.
⚠️ Es el cambio más delicado de la tanda (todo es continuidad visual). Verificá a ojo.

## Bug A — el texto-1 sale "hacia abajo" y el botón no se desvanece
**Causa:** al pasar al texto-2, `Text1Lines` revierte a su estado `hidden` (`y:30`) → las líneas bajan mientras el contenedor recién hace opacidad. El botón además queda fuera del fade.
**Fix:**
- Una vez revelado el texto-1, **congelá `Text1Lines` en `visible`** (que NO vuelva a `hidden`/`y:30`). El "irse" debe ser **solo opacidad del contenedor**, en el lugar, sin movimiento.
- Asegurá que el **botón DISCOVER esté dentro de la misma capa que hace la opacidad** (o dale su propio fade de opacidad), para que se desvanezca junto con el texto.
- El texto-2 mantiene su entrada actual por líneas (eso ya está bien).

## Bug B — no puedo volver hacia arriba + las secciones se reacomodan/superponen
**Causa:** el modo estático usa bloques `h-[60vh]` que NO coinciden con el intro (viewport completo) → al volver arriba todo reacomoda y las imágenes flotantes (posicionadas absolutas) caen en otros lugares y se superponen. Y el switch a estático recién pasa tras scrollear un viewport, así que apenas aparece el texto-2 no se puede subir.
**Fix — flujo ideal:**
1. **Bloques estáticos idénticos al intro:** en modo estático, texto-1 y texto-2 cada uno en un bloque **`h-screen`** centrado (no `h-[60vh]`), con la misma `FloatingMediaLayer` y posiciones que el intro → así se ven EXACTAMENTE igual (mismos espacios, imágenes en el mismo lugar). Contenedor exterior `h-[200vh]`.
2. **Switch durante la ventana bloqueada + compensación de scroll:** cuando termina el reveal del texto-2 (y el scroll todavía está bloqueado), hacé el switch a estático y **en el mismo frame** `window.scrollTo(0, window.innerHeight)` (sin smooth), de modo que el viewport quede sobre el bloque del texto-2 (visualmente idéntico al frame anterior). Recién ahí desbloqueá el scroll.
3. Resultado: sin "pop", sin replay; **scroll arriba → texto-1**, scroll abajo → `ServicesStack`, con scroll normal (sin repetir efectos).
- Mantené el `-mt-[var(--header-height)]` consistente para que `ServicesStack` no salte visiblemente (el switch ocurre fuera de vista).

## Detalle del gating inicial
El lock inicial (`isInitialLoadComplete`) debe durar **hasta que el subrayado del botón termina de dibujarse** (no solo las líneas). Ajustá el timer de unlock a la duración real del underline-draw del botón.

## Aceptación
- [ ] Texto-1 + botón se van por **opacidad en el lugar** (sin bajar).
- [ ] Texto-2 entra con su reveal (ya ok).
- [ ] Tras aparecer el texto-2 puedo **subir** y veo el texto-1 (scroll normal), y bajar a `ServicesStack`. Sin replay.
- [ ] Texto-1 y texto-2 se ven **idénticos** al principio y después de bajar/subir (mismos espacios, imágenes sin superponerse).
- [ ] `getBoundingClientRect().top` de `ServicesStack` no salta perceptiblemente.
- [ ] No se puede scrollear hasta que el underline del botón se completa.

## Self-check
`tsc`/`eslint`/`build` ok · dev `-p 3002`, `/services`: grabá el flujo completo (carga → scroll → texto-2 → subir → bajar) y verificá cada punto. **Aviso: "sin pop" es visual → marcá para revisión humana en el gate.**
