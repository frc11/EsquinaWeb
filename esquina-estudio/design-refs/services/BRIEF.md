<!-- Destino en el repo: /design-refs/services/BRIEF.md -->
# SERVICES — Brief de cambios

> Sin imágenes: el comportamiento se entiende del texto. Referencia viva del efecto a replicar: `src/components/sections/home/Hero.tsx`.

## Contexto del estado actual
El intro de Services (`ServicesIntro.tsx`) es **scroll-jacking real**, no un simple fade:
- Contenedor `h-[120vh] -mt-[var(--header-height)]` con un `sticky top-0 h-screen` adentro.
- Dos `motion.div` **absolutos superpuestos** que hacen crossfade por opacidad:
  - **Texto 1:** "WE TRANSLATE IDEAS INTO LIVING IDENTITIES…" + botón "DISCOVER OUR BRANDING SERVICES".
  - **Texto 2:** "Whether we're shaping a brand from scratch…" + imágenes flotantes.
- Máquina de estados: `isPreloaderDone`, `isInitialLoadComplete`, `hasInteracted`, `isIntroComplete`, `isJumping`. Listeners globales de `wheel`/`touch` con `preventDefault`.
- El `body` queda con `overflow: hidden` hasta que el intro termina.

---

## Request 1 — Reveal estilo Home en los dos textos
**Replicar el efecto de aparición del home** (`Hero.tsx`) en el intro:
- **Texto 1 + su botón:** las líneas entran con el reveal del home (stagger, `opacity:0, y:30 → 0`), y el botón hace el **mismo efecto de subrayado animado** que el CTA del home (props `underline` / `underlineDraw` / `underlineDrawDelay` de `HoverButton`).
- **Texto 2:** mismo reveal de aparición (solo aparición, sin botón).
- **Mantener** el efecto de **desaparición por opacidad** (el texto 1 se desvanece para dar paso al texto 2).

## Request 2 — Sin replay al volver arriba
**Ahora:** una vez pasados los dos textos y desbloqueado el scroll, si volvés arriba, el intro **se reproduce al revés** (texto 2 → texto 1).
**Queremos:** que una vez que pasaron **ambos** efectos, al volver arriba **no se repitan**. Los dos textos se ven como **dos secciones normales, una arriba de la otra** (texto 1 arriba, texto 2 abajo, mismo orden), estáticas, como una página común.
**Restricción clave:** ese cambio de estado **no debe alterar el tamaño / la posición de lo que está debajo** (`ServicesStack`). Nada de saltos en la lista de servicios.

---

## Criterios de aceptación
- [ ] Texto 1 entra con el reveal del home (líneas con stagger + fade-up).
- [ ] El botón del texto 1 hace el subrayado animado igual que el CTA del home.
- [ ] Texto 2 entra con el mismo reveal de aparición (sin botón).
- [ ] Se mantiene la desaparición por opacidad del texto 1 al pasar al 2.
- [ ] Al volver arriba después del intro: **no se repite** ninguna animación.
- [ ] En reposo (después del intro) los dos textos quedan apilados, en orden, como secciones normales.
- [ ] `ServicesStack` (la lista de servicios de abajo) **no se desplaza** al cambiar de modo.
- [ ] El switch a modo estático no produce un "pop" perceptible (verificar visualmente).
- [ ] Respeta `prefers-reduced-motion` (textos visibles sin reveal).

## Notas de causa raíz (no apilar parches)
- El replay viene de la rama del handler de scroll que, en `scrollY === 0` y scroll hacia arriba, hace `setHasInteracted(false)` + `setIsIntroComplete(false)`. **Eliminar esa rama.**
- Latchear el "intro terminado" en un estado/ref que **nunca se reinicie** dentro del mismo montaje.
- Una vez latcheado: render condicional → modo estático apilado (flow normal, sin `absolute`, sin `sticky`, sin animación, sin listeners de scroll-jack).
- "No afecte al tamaño de abajo": mantener la **misma altura exterior** (`h-[120vh]`) en ambos modos, así el offset de `ServicesStack` no cambia.
- Re-montaje en navegación (`ServicesStack` usa `key={pathname}`): el reveal vuelve a jugar al entrar de nuevo a la página (correcto). El latch evita el replay solo dentro de la misma vista. (Si se quisiera persistir entre navegaciones, sería un flag en `sessionStorage` — no requerido por ahora.)
- Reusar el patrón de `Hero.tsx`: `containerVariants` (staggerChildren/delayChildren) + `lineVariants` (`opacity:0,y:30 → 0`). No inventar un sistema nuevo de reveal.
