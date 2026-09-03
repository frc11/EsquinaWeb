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
 * # El botón sube con el footer (R3.1)
 *
 * El botón **no se apaga nunca** —pedido de Valentino en la revisión en teléfono
 * de R3— y **no le tapa nada al footer**. Las dos cosas juntas solo salen
 * moviéndolo: mientras el footer está fuera del viewport el botón se apoya en su
 * gutter de siempre, y a medida que el borde superior del footer entra, el botón
 * se corre hacia arriba **la misma cantidad que el footer entró**, así que queda
 * apoyado sobre el footer con el mismo aire que tenía contra el borde de la
 * pantalla. Es continuo y no un umbral: la cuenta está en el efecto y el número
 * en `EDGE_GAP`.
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
 * # Por qué quedó en dos, después de probarlo en una (R2.1/F1 → R3/F0)
 *
 * Con **dos** hace falta un documento de más de tres viewports de alto, y medido
 * a 390 × 844 solo lo cumplen `/services` (7499 px de recorrido) y `/team`
 * (3438). En las otras cuatro el botón queda inerte.
 *
 * Se bajó a **una** por ese motivo, y se volvió a dos con los recorridos
 * medidos en ese sprint: hay dos rutas largas y cuatro que son poco más que una
 * pantalla. En una página de 1,2 pantallas la ausencia del botón no se percibe
 * —estás a un flick del pulgar—, pero una ventana útil de 109 px en `/work` o de
 * 148–193 en `/contact` sí se percibe, y como parpadeo. «Inerte en cuatro de
 * seis» era el comportamiento correcto, no un defecto.
 *
 * Esas ventanas se midieron cuando el botón tenía **dos** condiciones —haber
 * pasado el umbral y no estar tapando el footer— y la segunda ya no existe (ver
 * el efecto de abajo). Hoy la ventana es
 * `(innerHeight × APPEAR_AFTER_VIEWPORTS, docHeight − innerHeight]` y la única
 * condición para que el botón aparezca es que el documento mida más de tres
 * pantallas. A 390 × 844 y después de R3 —que acortó el footer de mobile 67
 * px, sacó la frase de la banda clara y le dio aire a la galería y al pie de
 * contacto—, en recorrido EN / ES: `/services` 7238 / 7398 y `/team`
 * 3177 / 3201 lo cumplen; `/work` 1309 / 1309, `/contact` 1314 / 1269,
 * `/fun-gallery` 862 / 888 y `/work/matsu` 567 / 675 no llegan a 1688.
 *
 * Lo que la regla del footer evitaba lo resuelve hoy el corrimiento, no la
 * visibilidad: ver `EDGE_GAP` y el efecto de abajo. Dicho con números, el
 * pisado que dejó R3 y que R3.1 cierra: al llegar al pie, la caja del botón
 * cubría los **21 px enteros** de `LINKEDIN` y de `develOP` en las doce
 * combinaciones donde el botón aparece —`/services` y `/team` a 390, y esas
 * dos más `/work` y `/contact` a 320, en los dos idiomas—, y le comía además
 * 11,1–12,1 px de la banda táctil de `INSTAGRAM`. `elementFromPoint` sobre el
 * centro de tinta devolvía el botón en veinticuatro de esos treinta y seis
 * puntos.
 *
 * Cuando el portfolio crezca y `/work` pase las dos pantallas, el botón entra
 * solo. Y ahí conviene revisar algo que hoy no se nota: el umbral está atado al
 * scroll, no al largo del documento. Lo correcto semánticamente es «esta página
 * es larga, mostrá el botón», no «scrolleaste mucho».
 */
const APPEAR_AFTER_VIEWPORTS = 2;

/**
 * Aire del botón, en píxeles. Es el mismo gutter de 24 px que usa el cromo en
 * mobile, y **es el espejo en JavaScript del `bottom-6 right-6` de abajo**: si
 * uno cambia, cambia el otro. Va como número porque el corrimiento se calcula,
 * y Tailwind necesita la clase escrita entera.
 *
 * # Gobierna dos distancias, y son la misma
 *
 * 1. **Contra el borde de la pantalla**, en reposo: el borde inferior del botón
 *    queda en `innerHeight − EDGE_GAP`.
 * 2. **Contra el tope del footer**, cuando el footer entra en el viewport: el
 *    botón no puede bajar de `footerTop − EDGE_GAP`.
 *
 * El corrimiento es la diferencia entre las dos, acotada a cero, y por eso el
 * aire que el botón conserva sobre el footer es **el mismo** que tenía contra
 * el borde: no hay un valor nuevo, hay un techo que se mueve.
 *
 * # No es la constante vieja
 *
 * Hasta R3 existía un `EDGE_GAP` con este mismo valor, pero al servicio de una
 * **regla de visibilidad**: decidía a partir de qué punto el botón se apagaba
 * para no taparle nada al footer. Esa regla se fue en R3 —un botón que
 * desaparece al llegar al final se lee como falla— y se llevó la constante con
 * ella. Vuelve en R3.1 para lo contrario: el botón no se apaga, se corre.
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
  /** El botón, para escribirle el corrimiento sin pasar por el estado de React. */
  const buttonRef = useRef<HTMLButtonElement>(null);

  const enabled = !SINGLE_SCREEN_ROUTES.has(pathname);

  useEffect(() => {
    // En las rutas de una pantalla el componente ni siquiera se renderiza, así
    // que no hace falta apagar el estado: alcanza con no escuchar nada. Al
    // volver a una ruta larga, el `measure()` de abajo lo recalcula.
    if (!enabled) return;

    /*
      Una sola lectura por cuadro, y de ella salen las dos cosas que dependen del
      scroll: si el botón se ve y cuánto sube.

      # La visibilidad

      Una sola condición: haber bajado más de `APPEAR_AFTER_VIEWPORTS` pantallas.
      Hasta R3 había una segunda —apagarse en cuanto el borde superior del footer
      subía por encima de la banda del botón—, escrita para que el botón no le
      tapara nada al footer. En la revisión en teléfono (R3/F0) Valentino la
      sacó: un botón que desaparece justo cuando se llega al final se lee como
      falla, no como cortesía. **No se restituye**, y lo que ella evitaba lo
      resuelve el corrimiento de acá abajo.

      # El corrimiento

      El botón se apoya en `innerHeight − EDGE_GAP` y no puede bajar de
      `footerTop − EDGE_GAP`; sube la diferencia, acotada a cero. Con el footer
      fuera del viewport `footerTop ≥ innerHeight` y la diferencia es negativa,
      así que el botón queda donde está. Como `footerTop` baja un píxel por cada
      píxel de scroll, el corrimiento **acompaña al footer de forma continua**:
      no hay umbral y no hay tirón.

      Va como `transform` y no como `bottom` a propósito: `translateY` no
      dispara layout, y **no se anima**, así que sigue al scroll cuadro a cuadro
      en vez de arrastrarse detrás de él. Por lo mismo `prefers-reduced-motion`
      no lo toca: es una posición, no una animación —lo que se apaga ahí es la
      transición de opacidad, con `motion-reduce:transition-none`—.

      La escritura va directo al nodo y no por estado: un `setState` por cuadro
      de scroll re-renderizaría el árbol entero del botón. Es el mismo patrón de
      `CustomCursor` —un `requestAnimationFrame` amortiguando el evento, con la
      referencia del cuadro como candado para no encolar dos—.

      `resize` sigue escuchándose porque las dos cuentas dependen de
      `innerHeight`.
    */
    let frame: number | null = null;

    const measure = () => {
      frame = null;
      setVisible(window.scrollY > window.innerHeight * APPEAR_AFTER_VIEWPORTS);

      const button = buttonRef.current;
      if (!button) return;

      const restingBottom = window.innerHeight - EDGE_GAP;
      const footer = document.querySelector("footer");
      const ceiling = footer
        ? footer.getBoundingClientRect().top - EDGE_GAP
        : restingBottom;
      const lift = Math.max(0, restingBottom - ceiling);

      button.style.transform = lift > 0 ? `translateY(${-lift}px)` : "";
    };

    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
      resto del cromo en mobile, y esos 24 son los de `EDGE_GAP`: el efecto de
      arriba lo levanta desde acá con un `translateY` cuando el footer entra.

      **La `transition` es de opacidad y solo de opacidad** (`transition-opacity`,
      no `transition-all`): si alcanzara al `transform`, el corrimiento se
      arrastraría 300 ms detrás del scroll en vez de acompañarlo.
    */
    <button
      ref={buttonRef}
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
