<!-- Destino: /design-refs/contact/BRIEF.md (reemplaza el de ronda 1) -->
# CONTACT — Corrección (ronda 2)

Archivos: `src/components/sections/contact/ContactForm.tsx`, `src/app/(site)/contact/page.tsx`, `src/components/layout/Footer.tsx` (solo rama contact).

## Bug 1 — la selección de texto sigue sin verse en los inputs
**Importante:** las clases `selection:bg-off-white selection:text-off-black` **YA están** en `CONTROL_TEXT_CLASS`, `SELECT_BUTTON_CLASS` y `SELECT_SEARCH_CLASS`. No es que falten — **algo las pisa**.
**Qué hacer — diagnóstico de specificity (no re-agregar la clase):**
- En devtools, seleccioná texto dentro de un input en focus e inspeccioná qué regla `::selection` gana. Sospechoso #1: la `::selection` global de `globals.css` (mismo/mayor peso, o `!important`).
- Hacé ganar a la regla scopeada **sin tocar `globals.css`** (subiendo specificity del selector scopeado; p. ej. un selector más específico para los inputs de contacto, o `[data-contact] ... ::selection`). `globals.css` NO se toca (es compartido).
- Resultado: con el input en focus (fondo negro), el texto seleccionado se ve **fondo off-white / letra off-black**, abrazando los glifos (no un bloque del alto del input).

## Bug 2 — el footer en Contact es transparente, debería ser sólido
**Causa:** en `Footer.tsx`, la rama `isContactForm || isDarkRoute → "fixed bottom-0 ... bg-transparent"` (herencia del layout viejo, cuando contact no scrolleaba).
**Fix:** sacá `isContactForm` de esa rama → que Contact caiga al `bg-off-white` sólido normal, en flujo (no fixed). Dejá `isDarkRoute` (la página `/contact/success`) como está. No rompas el resto del footer.

## Bug 3 — "LET'S BRING YOUR IDEAS" no queda sticky y arranca muy abajo
**Estado:** el aside ya es `lg:sticky lg:top-[calc(var(--header-height)+clamp(2.5rem,5vh,5rem))]` pero **no pega** y **empieza demasiado abajo**.
**Qué hacer:**
- **Posición:** reducí el offset superior (sacá el `+clamp(2.5rem,5vh,5rem)` o bajalo bastante) para que arranque alto, alineado cerca del primer campo del form.
- **Sticky roto:** mismo diagnóstico que el aside de Work Single — **recorré ancestros en runtime buscando `transform !== none`** (Lenis / shell de transición) o un `overflow` que cree contenedor de scroll. 
  - Si la causa es **local** (en `contact/page.tsx` o el grid) → arreglala acá (p. ej. asegurar que el contenedor del grid no tenga overflow/transform y tenga altura suficiente).
  - Si es un **ancestro compartido** → **reportala, no la toques** (probable causa común con Work Single; un solo fix coordinado en la capa compartida).
- Verificá: la columna izquierda queda fija mientras scrollea el form; el footer sólido aparece al final.

## Aceptación
- [ ] Selección visible (off-white/off-black) dentro de los inputs en focus, sin tocar `globals.css`.
- [ ] Footer sólido (`bg-off-white`, en flujo) en `/contact`.
- [ ] Aside izquierdo sticky de verdad y arrancando alto (o causa compartida reportada).
- [ ] Se mantiene: el form scrollea con la página, SEND debajo del form, reveals, validación y submit.

## Self-check
`tsc`/`eslint`/`build` ok · dev `-p 3004`, `/contact`: marcar texto en un input (se ve el highlight), footer sólido, scrollear y verificar que la izquierda queda fija. Reportá si el sticky era causa local o compartida.
