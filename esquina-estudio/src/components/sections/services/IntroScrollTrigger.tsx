"use client";

import { useEffect } from "react";
import {
  SCROLL_KEYS,
  getHeaderOffset,
} from "@/components/sections/services/services-layout";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";

/**
 * Gatillo del intro: estando arriba de todo, **un solo scroll hacia abajo** baja
 * hasta Branding Packs. **Se dispara una sola vez por visita**: al volver arriba
 * el scroll es normal y no se re-arma (B3.4b/F1 revierte lo que pedía B3.4).
 *
 * No renderiza nada. Vive aparte del intro justamente para eso: el intro es una
 * sección sin comportamiento y este es el único pedazo de Services que escucha
 * eventos de scroll.
 *
 * # El lock, y por qué el `preventDefault` de B3.4 no alcanzaba
 *
 * El síntoma verificado a mano era que scrolleando varias veces seguidas la
 * página **vibraba y se trababa**. La causa es una regla de Chrome que hay que
 * conocer para no volver a caer: de una secuencia de scroll, **solo el primer
 * evento `wheel` llega como cancelable**; si ese primero no se cancela, todos
 * los que siguen llegan con `cancelable: false` y `preventDefault()` no hace
 * nada. B3.4 escuchaba en modo pasivo mientras juntaba delta, así que para
 * cuando cruzaba el umbral ya había perdido el derecho a cancelar: el scroll
 * nativo seguía empujando y le peleaba cuadro a cuadro a la animación. Eso es
 * la vibración.
 *
 * Por eso acá el listener es **no pasivo desde el montaje** y cancela **desde el
 * primer evento** mientras el gatillo está armado. Dos consecuencias, las dos
 * buscadas:
 *
 * 1. La secuencia se mantiene cancelable, así que cuando el umbral se cruza el
 *    desplazamiento es **inmune al gesto** —inercia de trackpad incluida— hasta
 *    llegar a Branding Packs.
 * 2. Arriba de todo la página no se mueve hasta cruzar el umbral. No es un
 *    efecto colateral: es el gesto que pide el mockup («con un solo scroll ya se
 *    va al branding packs»), y un roce que no llega al umbral no deja a nadie a
 *    mitad de camino.
 *
 * ## Por qué no `overflow: hidden` en `body`
 *
 * Es el mecanismo de mayor alcance y el único con una falla catastrófica: si el
 * estilo sobrevive, **el sitio entero se queda sin scroll**. Acá el lock son
 * listeners: lo peor que puede pasar si algo falla es una animación cortada.
 * **Este componente no toca `document.body` nunca** —ni `overflow` ni
 * `paddingRight`—, así que esa clase de residuo no existe. (La compensación de
 * scrollbar del sprint sería además inocua: `globals.css` las oculta en todo el
 * sitio, así que no ocupan ancho.)
 *
 * ## Las tres salvaguardas, en una sola función
 *
 * `release()` es la **única** salida: cancela el cuadro pendiente, limpia el
 * temporizador y da de baja todos los listeners. Se la llama desde los tres
 * lados obligatorios:
 *
 * 1. **Al terminar la animación**, cualquiera sea la vía por la que termine.
 * 2. **En el cleanup del efecto**, que es también el desmontaje: si alguien
 *    navega a otra ruta a mitad del desplazamiento, el lock se va con él.
 * 3. **Por temporizador** (`MAX_LOCK_MS`), con margen sobre la duración de la
 *    animación, pase lo que pase.
 *
 * Como no hay estado fuera de los listeners, `release()` es idempotente y
 * después de correr no queda nada que limpiar.
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
 * # Lo que el lock **no** toca
 *
 * `ctrl + rueda` es el zoom del navegador y nunca se cancela. Y estando armado
 * tampoco se bloquean el teclado ni el arrastre de la barra: quien scrollee así
 * baja normal y el gatillo simplemente no dispara. Las teclas de scroll se
 * bloquean **solo** durante el desplazamiento, que es cuando pelearían con la
 * animación.
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
/** Techo del lock: nunca dura más que esto, pase lo que pase. */
const MAX_LOCK_MS = SCROLL_DURATION_MS + 400;

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
    // Con la preferencia activa no hay gatillo ni lock: scroll normal desde el
    // arranque.
    if (reduceMotion) return;
    // Detrás de la cortina del preloader tampoco: el gesto sería a ciegas.
    if (!isPreloaderDone) return;

    /** `armed` junta delta · `locked` desplaza · `spent` ya no escucha nada. */
    let phase: "armed" | "locked" | "spent" = "armed";
    let accumulated = 0;
    let lastEventAt = 0;
    let touchStartY = 0;
    let frame = 0;
    let failsafe = 0;

    const prevent = (event: Event) => {
      if (event.cancelable) event.preventDefault();
    };

    const blockKeys = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) prevent(event);
    };

    // Única salida del lock. Idempotente: después de correr no queda nada vivo.
    const release = () => {
      phase = "spent";

      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      if (failsafe) window.clearTimeout(failsafe);
      failsafe = 0;

      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", blockKeys);
    };

    const runScroll = () => {
      const target = document.getElementById(targetId);
      if (!target) return; // Sin destino no se dispara nada: el gatillo sigue armado.

      const startY = window.scrollY;
      const endY = Math.max(
        0,
        target.getBoundingClientRect().top + startY - getHeaderOffset(),
      );
      // Sin recorrido no hay animación, pero el gatillo se gasta igual: ya se
      // usó y no se re-arma.
      if (endY <= startY) {
        release();
        return;
      }

      phase = "locked";
      window.addEventListener("keydown", blockKeys, { passive: false });
      failsafe = window.setTimeout(release, MAX_LOCK_MS);

      let startedAt = 0;
      const step = (now: number) => {
        if (!startedAt) startedAt = now;
        const progress = Math.min(1, (now - startedAt) / SCROLL_DURATION_MS);
        window.scrollTo(0, startY + (endY - startY) * easeInOutCubic(progress));

        if (progress < 1) {
          frame = window.requestAnimationFrame(step);
          return;
        }
        release();
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
      if (accumulated < TRIGGER_THRESHOLD_PX) return;

      accumulated = 0;
      runScroll();
    };

    function handleWheel(event: WheelEvent) {
      // El zoom del navegador no se toca nunca.
      if (event.ctrlKey || event.metaKey) return;

      // Desplazándose: inmune al gesto hasta llegar.
      if (phase === "locked") {
        prevent(event);
        return;
      }
      if (phase === "spent") return;

      // Fuera del tope el gatillo no está armado: scroll normal.
      if (window.scrollY > TOP_TOLERANCE_PX) {
        accumulated = 0;
        return;
      }

      // Armado: se cancela desde el primer evento del gesto para no perder el
      // derecho a cancelar los que siguen (ver el comentario de arriba).
      prevent(event);
      accumulate(normalizeDelta(event, window.innerHeight), event.timeStamp);
    }

    function handleTouchStart(event: TouchEvent) {
      touchStartY = event.touches[0]?.clientY ?? 0;
      accumulated = 0;
    }

    function handleTouchMove(event: TouchEvent) {
      if (phase === "locked") {
        prevent(event);
        return;
      }
      if (phase === "spent") return;

      const currentY = event.touches[0]?.clientY ?? touchStartY;
      const delta = touchStartY - currentY;
      touchStartY = currentY;

      if (window.scrollY > TOP_TOLERANCE_PX) {
        accumulated = 0;
        return;
      }

      prevent(event);
      accumulate(delta, event.timeStamp);
    }

    // Los tres van **no pasivos** por la misma razón: si el navegador arranca a
    // scrollear antes de que corra el handler, los eventos que siguen llegan sin
    // poder cancelarse y el lock se queda sin dientes.
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return release;
  }, [isPreloaderDone, reduceMotion, targetId]);

  return null;
}
