"use client";

import { useEffect } from "react";
import { getHeaderOffset } from "@/components/sections/services/services-layout";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";

/**
 * Gatillo del intro: estando arriba de todo, **un solo scroll hacia abajo** baja
 * suave hasta Branding Packs. De ahí en adelante el scroll es libre en las dos
 * direcciones; volviendo al tope, el gatillo se re-arma.
 *
 * No renderiza nada. Vive aparte del intro justamente para eso: el intro es un
 * componente de servidor sin estado y este es el único pedazo de Services que
 * escucha eventos.
 *
 * # Por qué no alcanza un booleano
 *
 * Un trackpad no manda «un scroll»: manda **decenas de eventos `wheel` por
 * gesto**, con inercia que sigue llegando después de levantar los dedos. Un
 * booleano se dispara con un roce y se vuelve a disparar con la inercia. Van
 * tres defensas y las tres hacen falta:
 *
 * 1. **Umbral acumulado** (`TRIGGER_THRESHOLD_PX`): no dispara hasta juntar
 *    delta suficiente.
 * 2. **Bloqueo mientras dura el desplazamiento**: la inercia no puede
 *    re-dispararlo ni pelearle a la animación.
 * 3. **Desarme al llegar**: la única condición para volver a disparar es estar
 *    otra vez arriba de todo.
 *
 * # El umbral, y por qué ese número
 *
 * Los `deltaY` no son comparables entre navegadores: Chrome manda píxeles
 * (`deltaMode 0`) y Firefox manda **líneas** (`deltaMode 1`), tres por muesca de
 * rueda. Se normaliza con `LINE_PX = 100/3` para que una muesca valga 100 px en
 * los dos —la misma constante que usa Lenis— y una página valga el alto de la
 * ventana.
 *
 * Con eso, **60 px**:
 * - una muesca de rueda (100 px normalizados) lo cruza en el **primer** evento,
 *   así que con mouse «un scroll» es literalmente un scroll;
 * - un roce de trackpad, que junta unos pocos píxeles en todo el gesto, **no
 *   llega**;
 * - un gesto deliberado de trackpad, de 20 a 40 px por evento, lo cruza en dos o
 *   tres eventos, o sea dentro de los primeros 50 ms.
 *
 * La cuenta se reinicia si pasan más de `GESTURE_GAP_MS` sin eventos, así que
 * dos roces separados en el tiempo no se suman entre sí; y un evento hacia
 * arriba la borra, porque el gesto cambió de idea.
 *
 * # Estar arriba de todo es la única condición
 *
 * No hay un booleano «armado» aparte: cada evento pregunta por `window.scrollY`.
 * Eso resuelve de una las tres reglas del sprint —no dispara si se llegó con el
 * scroll ya avanzado, no se re-dispara con la inercia después de llegar (que
 * deja la página a una pantalla del tope), y se re-arma solo al volver arriba—
 * y ahorra un listener de `scroll` que correría en cada cuadro para mantener una
 * copia del mismo dato.
 *
 * # Lo único que se previene
 *
 * El acumulador escucha en **modo pasivo**: mientras junta delta, la página
 * scrollea normal. Nada se traba, y si el gesto no llega al umbral el usuario
 * scrolleó y listo.
 *
 * El `preventDefault` aparece **solo cuando el gatillo ya disparó**, y solo
 * mientras dura el desplazamiento: se registra un segundo listener en ese
 * momento y se da de baja apenas termina. **No se toca `document.body`** —ni
 * `overflow` ni `paddingRight`—, así que no existe la clase de residuo que
 * dejaba la máquina vieja. Sin eso el gesto no se puede hacer robusto: la
 * inercia del trackpad sigue empujando el scroll nativo durante toda la
 * animación y la deja en cualquier lado. Un `scrollTo` suave nativo tampoco
 * sirve, porque el navegador **cancela** el desplazamiento programado ante el
 * primer evento del usuario, y los de inercia son eventos del usuario.
 *
 * Y no atrapa a nadie: un `wheel` hacia arriba lo suficientemente claro, o un
 * dedo nuevo en la pantalla, abortan la animación y devuelven el control en el
 * acto. Un temporizador de seguridad garantiza que el bloqueo no sobreviva a la
 * animación pase lo que pase.
 */

/** Delta normalizado que hay que juntar para disparar. */
const TRIGGER_THRESHOLD_PX = 60;
/** Sin eventos por más de esto, la cuenta arranca de cero: es otro gesto. */
const GESTURE_GAP_MS = 250;
/** Una muesca de rueda son 3 líneas; 3 × 100/3 = 100 px, como en Chrome. */
const LINE_PX = 100 / 3;
/** Margen para considerar que estamos «arriba de todo». */
const TOP_TOLERANCE_PX = 8;
/** Duración del desplazamiento programado. */
const SCROLL_DURATION_MS = 900;
/** Delta acumulado hacia arriba que aborta la animación. */
const ABORT_UP_DELTA_PX = 40;
/** Techo del bloqueo: nunca dura más que esto, pase lo que pase. */
const MAX_BLOCK_MS = SCROLL_DURATION_MS + 400;

function normalizeDelta(event: WheelEvent, viewportHeight: number) {
  if (event.deltaMode === 1) return event.deltaY * LINE_PX;
  if (event.deltaMode === 2) return event.deltaY * viewportHeight;
  return event.deltaY;
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function IntroScrollTrigger({ targetId }: { targetId: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const { isPreloaderDone } = usePreloader();

  useEffect(() => {
    // Con la preferencia activa no hay gatillo: scroll normal desde el arranque.
    if (reduceMotion) return;
    // Detrás de la cortina del preloader tampoco: el gesto sería a ciegas.
    if (!isPreloaderDone) return;

    let accumulated = 0;
    let lastEventAt = 0;
    let frame = 0;
    let releaseTimer = 0;
    let blocking = false;
    let abortUpDelta = 0;

    const blockGesture = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };

    const stopScroll = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (releaseTimer) window.clearTimeout(releaseTimer);
      releaseTimer = 0;
      if (blocking) {
        window.removeEventListener("wheel", blockGesture);
        window.removeEventListener("touchmove", blockGesture);
        blocking = false;
      }
      accumulated = 0;
      abortUpDelta = 0;
    };

    const runScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return; // Sin destino no se dispara nada.

      const startY = window.scrollY;
      const endY = Math.max(
        0,
        target.getBoundingClientRect().top + startY - getHeaderOffset(),
      );
      if (endY <= startY) return;

      blocking = true;
      window.addEventListener("wheel", blockGesture, { passive: false });
      window.addEventListener("touchmove", blockGesture, { passive: false });
      releaseTimer = window.setTimeout(stopScroll, MAX_BLOCK_MS);

      let startedAt = 0;
      const step = (now: number) => {
        if (!startedAt) startedAt = now;
        const progress = Math.min(1, (now - startedAt) / SCROLL_DURATION_MS);
        window.scrollTo(0, startY + (endY - startY) * easeInOutCubic(progress));

        if (progress < 1) {
          frame = window.requestAnimationFrame(step);
          return;
        }
        stopScroll();
      };

      frame = window.requestAnimationFrame(step);
    };

    const accumulate = (delta: number, now: number) => {
      if (now - lastEventAt > GESTURE_GAP_MS) accumulated = 0;
      lastEventAt = now;

      if (delta <= 0) {
        accumulated = 0;
        return;
      }

      accumulated += delta;
      if (accumulated >= TRIGGER_THRESHOLD_PX) runScroll();
    };

    const handleWheel = (event: WheelEvent) => {
      const delta = normalizeDelta(event, window.innerHeight);

      // Durante el desplazamiento la inercia no re-dispara, pero un gesto hacia
      // arriba lo bastante claro devuelve el control enseguida.
      if (blocking) {
        if (delta < 0) {
          abortUpDelta += -delta;
          if (abortUpDelta >= ABORT_UP_DELTA_PX) stopScroll();
        } else {
          abortUpDelta = 0;
        }
        return;
      }

      if (window.scrollY > TOP_TOLERANCE_PX) {
        accumulated = 0;
        return;
      }

      accumulate(delta, event.timeStamp);
    };

    let touchStartY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      // Un dedo nuevo durante el desplazamiento lo cancela: manda el usuario.
      if (blocking) stopScroll();
      touchStartY = event.touches[0]?.clientY ?? 0;
      accumulated = 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (blocking) return;

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      if (window.scrollY > TOP_TOLERANCE_PX) {
        accumulated = 0;
        return;
      }

      accumulate(delta, event.timeStamp);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      stopScroll();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isPreloaderDone, reduceMotion, targetId]);

  return null;
}
