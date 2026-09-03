"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { useLocale } from "@/lib/i18n";

/**
 * # Volver arriba — solo en mobile (R2/F12.3)
 *
 * «Estaría bueno que las páginas en mobile tengan el botón back to top»
 * (`docs/archivo/mockups/r2-mob-05.jpg`).
 *
 * # Un solo sumidero de scroll para las ocho rutas, y está medido
 *
 * El sprint proponía elegir el sumidero según la ruta —`window.lenis.scrollTo`
 * donde Lenis corre y `window.scrollTo` donde no—. **No hace falta y sería
 * peor**, y las dos mitades salen de leer el código de Lenis 1.0.42 en
 * `node_modules`:
 *
 * 1. **Lenis en reposo no escribe scroll.** Su `raf` llama a `animate.advance`,
 *    que retorna en la primera línea si `isRunning` es `false`, y ese flag solo
 *    se enciende dentro de `Lenis.scrollTo`. Además su `onNativeScroll`
 *    resincroniza `animatedScroll = targetScroll = actualScroll` en cada evento
 *    de scroll ajeno, así que Lenis **se deja arrastrar** por nuestro
 *    `window.scrollTo` y queda coherente cuadro a cuadro.
 * 2. **`lenis.scrollTo(y)` no es una escritura de posición sino el arranque de
 *    una animación propia** de 1,2 s con su easing. Llamarla en cada `onUpdate`
 *    reiniciaría esa animación sesenta veces por segundo hacia un objetivo que se
 *    mueve: daría un arrastre, no el resorte de acá.
 *
 * O sea que `window.scrollTo` sirve para las ocho rutas, es el sumidero que el
 * repo ya usa (`ServicesSidebar`) y —lo que importa— hace que **el gesto se
 * sienta igual en todas**, en vez de tener el resorte propio en cinco rutas y el
 * easing de Lenis en tres.
 *
 * El único escenario de pelea real es que Lenis esté animando **al mismo tiempo**
 * —la persona rueda a mitad del viaje—, y de eso se ocupan los tres listeners de
 * interrupción, que son los mismos de `ServicesSidebar`: al primer gesto el
 * viaje se detiene y suelta el scroll.
 *
 * # Qué NO hace
 *
 * No existe de 1024 px para arriba (`lg:hidden`), ni en `/` ni en
 * `/contact/success`, que entran en una pantalla y no tienen a dónde volver.
 */

/**
 * Cuántas pantallas hay que bajar para que el botón aparezca.
 *
 * **Es la constante que hay que mirar si el botón «no aparece nunca».**
 *
 * # Por qué quedó en dos, después de probarlo en una (R2.1/F1)
 *
 * Con **dos** hace falta un documento de más de tres viewports de alto, y medido
 * a 390 × 844 solo lo cumplen `/services` (7499 px de recorrido) y `/team`
 * (3438). En las otras cuatro el botón queda inerte.
 *
 * Se bajó a **una** por ese motivo, y se volvió a dos con los recorridos
 * medidos adelante: hay dos rutas largas y cuatro que son poco más que una
 * pantalla. En una página de 1,2 pantallas la ausencia del botón no se percibe
 * —estás a un flick del pulgar—, pero una ventana útil de 109 px en `/work` o de
 * 148–193 en `/contact` sí se percibe, y como parpadeo. «Inerte en cuatro de
 * seis» era el comportamiento correcto, no un defecto.
 *
 * El docblock anterior afirmaba que con una pantalla el botón aparecería en las
 * seis rutas. **Era falso y nunca se había medido.** Llega a cuatro; las dos que
 * faltan no las deja afuera este número.
 *
 * # La medición que lo decidió
 *
 * Sobre el sitio servido a 390 × 844, en los dos idiomas. El botón se enciende
 * en la intersección de sus **dos** condiciones —haber pasado el umbral y no
 * estar tapando el footer—, así que la ventana útil es
 * `(innerHeight × APPEAR_AFTER_VIEWPORTS, footerTop − innerHeight + EDGE_GAP]`.
 * La tabla es de la prueba con umbral 1; con umbral 2 el borde inferior no
 * cambia y el superior pasa a 1688:
 *
 * 1. **`/fun-gallery`.** Su footer arranca en 1247 px de documento (1273 en
 *    castellano), así que el borde superior entra en la banda del botón a partir
 *    de `scrollY` 427 (453). El umbral pide `scrollY > 844`: los dos rangos no
 *    se cruzan.
 * 2. **`/work/[slug]`.** `/work/matsu` mide 1672 px en inglés —828 de recorrido,
 *    o sea **menos de una pantalla**, que ningún umbral positivo alcanza— y 1718
 *    en castellano, donde el umbral sí se cruza pero el footer arranca en 1139 y
 *    cierra la ventana en 319.
 *
  * Las dos reglas son deliberadas y ninguna se toca. Esas dos rutas se quedan sin
 * botón **por la geometría de su pie, no por descuido**, y con umbral 2 se le
 * suman `/work` y `/contact` por la misma razón: su ventana es demasiado corta
 * para que el botón se lea como función.
 *
 * Cuando el portfolio crezca y `/work` pase las dos pantallas, el botón entra
 * solo. Y ahí conviene revisar algo que hoy no se nota: el umbral está atado al
 * scroll, no al largo del documento. Lo correcto semánticamente es «esta página
 * es larga, mostrá el botón», no «scrolleaste mucho».
 */
const APPEAR_AFTER_VIEWPORTS = 2;

/**
 * Aire entre el botón y el borde de la pantalla, en píxeles. Es el mismo gutter
 * de 24 px que usa el cromo en mobile (`bottom-6 right-6`), y se necesita como
 * número porque decide dónde empieza a taparse con el footer.
 */
const EDGE_GAP = 24;

/** Duración del viaje. Es la del salto del sidebar de Services, no un número nuevo. */
const TRIP_VISUAL_DURATION = 0.7;
const TRIP_BOUNCE = 0;

/** Las mismas teclas que ya interrumpen el salto de Services. */
const SCROLL_KEYS: ReadonlySet<string> = new Set([
  " ",
  "PageDown",
  "PageUp",
  "ArrowDown",
  "ArrowUp",
  "Home",
  "End",
]);

/**
 * Las dos rutas que entran en una pantalla. Se comparan enteras y no por
 * prefijo: `/contact` sí lleva botón y `/contact/success` no.
 */
const SINGLE_SCREEN_ROUTES = new Set(["/", "/contact/success"]);

export default function BackToTop() {
  const { t } = useLocale();
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  /** Detiene el viaje en curso y da de baja sus listeners. Idempotente. */
  const stopRef = useRef<(() => void) | null>(null);

  const enabled = !SINGLE_SCREEN_ROUTES.has(pathname);

  useEffect(() => {
    // En las rutas de una pantalla el componente ni siquiera se renderiza, así
    // que no hace falta apagar el estado: alcanza con no escuchar nada. Al
    // volver a una ruta larga, el `update()` de abajo lo recalcula.
    if (!enabled) return;

    /*
      Dos condiciones, y la segunda es un requisito escrito del sprint: **el
      botón no puede taparle nada al footer**. Medido antes de agregarla, al
      llegar al pie del documento el botón quedaba justo encima del enlace del
      crédito (`HECHO POR develOP`) en las tres anchuras de prueba.

      La regla es geométrica y no una lista de rutas: el botón ocupa la banda
      `[innerHeight − EDGE_GAP − alto, innerHeight − EDGE_GAP]`, así que se
      superpone con el footer en cuanto el borde superior del footer sube por
      encima de `innerHeight − EDGE_GAP`. Ahí se apaga, y vuelve apenas se sube
      un poco.
    */
    const update = () => {
      const pasoElUmbral =
        window.scrollY > window.innerHeight * APPEAR_AFTER_VIEWPORTS;
      const footer = document.querySelector("footer");
      const footerALaVista = footer
        ? footer.getBoundingClientRect().top < window.innerHeight - EDGE_GAP
        : false;

      setVisible(pasoElUmbral && !footerALaVista);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [enabled, pathname]);

  /*
    El viaje se suelta en el desmontaje además de al terminar y al primer gesto.
    Son las tres liberaciones que §7.4 declara obligatorias para cualquier lock:
    sin la del desmontaje, navegar a mitad de camino dejaría un `animate` vivo
    escribiendo `scrollTo` sobre la página siguiente.
  */
  useEffect(() => () => stopRef.current?.(), []);

  const goTop = useCallback(() => {
    stopRef.current?.();

    if (reduceMotion) {
      window.scrollTo(0, 0);
      return;
    }

    const stop = () => {
      controls.stop();
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("keydown", interruptByKey);
      stopRef.current = null;
    };
    const interrupt = () => stop();
    const interruptByKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) stop();
    };

    const controls = animate(window.scrollY, 0, {
      type: "spring",
      visualDuration: TRIP_VISUAL_DURATION,
      bounce: TRIP_BOUNCE,
      onUpdate: (value) => window.scrollTo(0, value),
      onComplete: () => stop(),
    });

    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("keydown", interruptByKey);

    stopRef.current = stop;
  }, [reduceMotion]);

  if (!enabled) return null;

  return (
    /*
      Fijo abajo a la derecha, sobre el gutter del cromo. Cae por encima del
      contenido y del footer —de ahí el `z-[60]`, por debajo del panel del menú—
      y con `pointer-events-none` mientras está apagado, así que no intercepta el
      toque de nada que quede debajo.

      La caja es de 44 × 44, que es el piso de área táctil de §2b, y el rótulo va
      dentro. `bottom-6 right-6` lo apoya en el mismo gutter de 24 px que usa el
      resto del cromo en mobile.
    */
    <button
      type="button"
      onClick={goTop}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-[60] flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 border border-off-black bg-off-white px-3 font-body text-[13px] uppercase leading-none tracking-normal text-off-black transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span aria-hidden="true">&uarr;</span>
      {t.nav.backToTop}
    </button>
  );
}
