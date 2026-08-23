"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";

/**
 * El indicador del cromo: la línea de 1 px que marca lo activo en la barra.
 *
 * # Por qué es un módulo y no código adentro del Navbar
 *
 * Nació en B2.2 para el menú de escritorio y hasta B4b vivía entero dentro de
 * `Navbar.tsx`. B4b le pidió el mismo gesto a la barrita del toggle `EN / ES`,
 * que es un componente aparte y se renderiza dos veces —el bloque de escritorio
 * y el bloque de mobile del header—.
 * `CLAUDE.md` §8.10 prohíbe el sistema paralelo, así que la lógica —medición,
 * redondeo, morfología de la animación y el elemento pintado— se extrajo acá y
 * la consumen los dos. Nadie copia números del otro.
 *
 * # Las tres reglas que salieron de medir, no de razonar
 *
 * 1. **La referencia es la caja del fill del hover, no el texto.** El indicador
 *    se lee como el pie de ese fill (ver `measureFillBox`).
 * 2. **Los bordes se redondean en coordenadas de viewport**, y recién después se
 *    restan del origen del contenedor. Lo que tiene que caer en un píxel entero
 *    es *la línea pintada*: un elemento de 1 px apoyado en una coordenada
 *    fraccionaria se reparte entre dos filas de píxeles, y eso es el hairline
 *    sucio que se vio a DPR 1 en B2.2. Para el menú da exactamente lo mismo que
 *    la fórmula vieja —su contenedor arranca en (0, 0), porque es el hijo de un
 *    `fixed left-0 right-0 top-0`—, y para el toggle es la única forma de que la
 *    línea sea nítida: su contenedor cae en coordenadas fraccionarias.
 * 3. **El ancho sale de la resta de los dos bordes ya redondeados**, para que
 *    ninguno de los dos caiga en medio de un píxel.
 *
 * # La morfología de la animación
 *
 * El indicador no se estira de una posición a la otra: se contrae hasta un punto
 * de `NAV_INDICATOR_DOT_WIDTH`, viaja como punto y se vuelve a abrir en el
 * destino. Los `times` reparten esas tres etapas dentro de la misma duración, y
 * el punto sale por el borde de avance (el derecho si va a la derecha, el
 * izquierdo si va a la izquierda). La raíz es el caso especial: ahí el indicador
 * **es** el punto, y aparece o desaparece en los extremos del viaje.
 */

export const NAV_INDICATOR_DURATION = 0.62;
export const NAV_INDICATOR_DOT_WIDTH = 5;
export const NAV_INDICATOR_EASE: [number, number, number, number] = [
  0.65, 0, 0.15, 1,
];
export const NAV_INDICATOR_TIMES = [0, 0.28, 0.72, 1];

/** Lo que se mide: dónde va la línea y de qué largo, ya en píxeles enteros. */
export type IndicatorMeasure = {
  /** `home` es el punto de la raíz, que no marca ningún rótulo. */
  kind: "home" | "tab";
  x: number;
  width: number;
  top: number;
};

/** Lo que se pinta: valores o series de cuadros clave, más su duración. */
export type IndicatorAnimation = {
  opacity: number | number[];
  x: number | number[];
  width: number | number[];
  top: number;
  duration: number;
};

export type FillBox = {
  left: number;
  right: number;
  bottom: number;
};

/**
 * Mide la caja que cubre el fill del hover de `HoverButton`, no el texto.
 *
 * El indicador se lee como el pie de ese fill, así que su referencia es la
 * misma caja que el fill pinta. El fill es un `absolute top-0 left-0 right-0
 * h-full` — con `balancedPadding`, que es lo que porta el Navbar en los cinco
 * tabs — de modo que ocupa exactamente su bloque contenedor. En reposo no
 * sirve medirlo a él: está desplazado `y: 120%` fuera de la caja. Lo que se
 * mide es el contenedor, y ese es el mismo elemento posicionado del que cuelga
 * el texto: de ahí el recorrido hasta el nodo de texto y el salto a su
 * `offsetParent`. Tampoco sirve el `<span>` que referencia el Navbar: envuelve
 * un `<a>` que hereda los 16 px del body y agrega por debajo del fill un hueco
 * de descendentes que no escala con el tamaño del tab.
 *
 * El toggle `EN / ES` no usa `HoverButton`, pero cumple el mismo contrato a
 * propósito: su `<button>` es el elemento posicionado y el rótulo cuelga de un
 * `<span>` sin posición adentro. Así los dos consumidores miden «la caja del
 * anfitrión posicionado del texto» y no hay dos definiciones de caja.
 */
export function measureFillBox(host: HTMLElement): FillBox | null {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node && !node.nodeValue?.trim()) {
    node = walker.nextNode();
  }

  const container = node?.parentElement?.offsetParent;

  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const rect = container.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return {
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
}

/**
 * Alto del subrayado relativo al contenedor: su borde superior se apoya en el
 * borde inferior del fill, sin hueco. Se redondea el borde **en coordenadas de
 * viewport** y recién después se descuenta el origen del contenedor (regla 2).
 */
export function indicatorTop(box: FillBox, hostTop: number) {
  return Math.round(box.bottom) - hostTop;
}

/**
 * La medición de un rótulo: posición, ancho y alto de la línea, relativos al
 * contenedor posicionado que la va a alojar.
 */
export function measureTabIndicator(
  host: HTMLElement,
  hostRect: DOMRect,
): IndicatorMeasure | null {
  const box = measureFillBox(host);

  if (!box) {
    return null;
  }

  const left = Math.round(box.left) - hostRect.left;
  const right = Math.round(box.right) - hostRect.left;

  return {
    kind: "tab",
    x: left,
    width: right - left,
    top: indicatorTop(box, hostRect.top),
  };
}

/**
 * Arma los cuadros clave del viaje entre dos mediciones. Sin medición previa
 * —primer render— o con `animateMove` en falso —resize, cambio de idioma,
 * `prefers-reduced-motion`— la línea se planta en su lugar sin viajar.
 */
export function buildIndicatorAnimation(
  previous: IndicatorMeasure | null,
  next: IndicatorMeasure,
  animateMove: boolean,
): IndicatorAnimation {
  const restOpacity = next.kind === "home" ? 0 : 1;

  if (!animateMove || !previous) {
    return {
      opacity: restOpacity,
      x: next.x,
      width: next.width,
      top: next.top,
      duration: 0,
    };
  }

  if (next.kind === "home") {
    if (previous.kind === "home") {
      return {
        opacity: 0,
        x: next.x,
        width: next.width,
        top: next.top,
        duration: 0,
      };
    }

    return {
      opacity: [1, 1, 1, 0],
      x: [previous.x, previous.x, next.x, next.x],
      width: [
        previous.width,
        NAV_INDICATOR_DOT_WIDTH,
        NAV_INDICATOR_DOT_WIDTH,
        NAV_INDICATOR_DOT_WIDTH,
      ],
      top: next.top,
      duration: NAV_INDICATOR_DURATION,
    };
  }

  if (next.x === previous.x && next.width === previous.width) {
    return {
      opacity: 1,
      x: next.x,
      width: next.width,
      top: next.top,
      duration: 0,
    };
  }

  const movingRight = next.x > previous.x;

  return {
    opacity: previous.kind === "home" ? [0, 1, 1, 1] : 1,
    x: movingRight
      ? [
          previous.x,
          previous.x + previous.width - NAV_INDICATOR_DOT_WIDTH,
          next.x,
          next.x,
        ]
      : [
          previous.x,
          previous.x,
          next.x + next.width - NAV_INDICATOR_DOT_WIDTH,
          next.x,
        ],
    width: [
      previous.width,
      NAV_INDICATOR_DOT_WIDTH,
      NAV_INDICATOR_DOT_WIDTH,
      next.width,
    ],
    top: next.top,
    duration: NAV_INDICATOR_DURATION,
  };
}

type UseIndicatorOptions = {
  /**
   * Devuelve la medición del objetivo actual, o `null` si no hay nada que
   * marcar. Tiene que ser estable (`useCallback`): su identidad es lo que
   * dispara la remedición **con** viaje.
   */
  measureTarget: () => IndicatorMeasure | null;
  /**
   * Los elementos cuya caja gobierna la medición. Se observan con
   * `ResizeObserver`, que es lo que hace que la línea se remida sola cuando el
   * rótulo cambia de ancho sin que cambie la ruta: **cambio de idioma** y
   * también la aplicación tardía de la tipografía. Estable (`useCallback`).
   */
  hosts: () => ReadonlyArray<HTMLElement | null | undefined>;
  /** En falso la línea nunca viaja: se planta. Es la puerta de reduced motion. */
  animate?: boolean;
};

/**
 * El ciclo completo del indicador: mide, recuerda la medición anterior, arma la
 * animación y se vuelve a medir cuando algo de lo que mide cambió.
 *
 * Los tres disparadores, y por qué cada uno anima o no:
 *
 * - **Identidad de `measureTarget`** (ruta activa, idioma elegido en el toggle):
 *   remide **con** viaje en el cuadro siguiente. El `requestAnimationFrame` no
 *   es decorativo: la medición tiene que ocurrir con el DOM ya pintado con el
 *   rótulo nuevo, no en el mismo tick del cambio de estado, o se mide lo viejo.
 * - **`resize` de la ventana**: sin viaje.
 * - **`ResizeObserver` sobre los anfitriones**: sin viaje. Es el disparador del
 *   cambio de idioma —los rótulos del menú cambian de ancho sin que cambie la
 *   ruta— y el de la tipografía que se aplica tarde. Sus notificaciones se
 *   entregan **después del layout y antes del pintado**, así que la línea nunca
 *   llega a verse en la posición vieja.
 *
 * (Había un cuarto, `measureKey`, que remedía sin viaje cuando el contenedor
 * terminaba de moverse sin cambiar de tamaño. Su único llamador era el toggle
 * adentro del menú de mobile, que entraba con un `y` animado; M2/F1 sacó el
 * toggle del menú y lo puso en la fila del header, que no se mueve, así que el
 * disparador quedó sin consumidores y se borró.)
 */
export function useIndicator({
  measureTarget,
  hosts,
  animate = true,
}: UseIndicatorOptions) {
  const previousRef = useRef<IndicatorMeasure | null>(null);
  const [animation, setAnimation] = useState<IndicatorAnimation | null>(null);

  const remeasure = useCallback(
    (animateMove: boolean) => {
      const next = measureTarget();

      if (!next) {
        previousRef.current = null;
        setAnimation(null);
        return;
      }

      setAnimation(
        buildIndicatorAnimation(
          previousRef.current,
          next,
          animateMove && animate,
        ),
      );
      previousRef.current = next;
    },
    [animate, measureTarget],
  );

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => remeasure(true));

    return () => window.cancelAnimationFrame(frame);
  }, [remeasure]);

  useEffect(() => {
    const handleResize = () => remeasure(false);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [remeasure]);

  // El observador se suscribe **una sola vez** y llega a la medición vigente por
  // referencia. No es un gusto: `observe()` entrega una notificación inicial por
  // cada elemento, y esa notificación cae en el mismo cuadro en que el
  // disparador de arriba acaba de armar el viaje —los `ResizeObserver` se
  // entregan después de los `requestAnimationFrame`—, así que un observador que
  // se volviera a suscribir cada vez que cambia `remeasure` **pisaría la
  // animación con una medición sin viaje**. Con esto, la única notificación que
  // llega en una navegación o en un click del toggle es la de un cambio de
  // tamaño real, que es justo cuando no se quiere viaje.
  const remeasureRef = useRef(remeasure);

  useEffect(() => {
    remeasureRef.current = remeasure;
  });

  useEffect(() => {
    const observed = hosts().filter(
      (host): host is HTMLElement => host instanceof HTMLElement,
    );

    if (observed.length === 0) return;

    const observer = new ResizeObserver(() => remeasureRef.current(false));

    observed.forEach((host) => observer.observe(host));

    return () => observer.disconnect();
  }, [hosts]);

  return animation;
}

/**
 * El elemento pintado. Cuelga de un contenedor posicionado y se coloca con
 * `top` en CSS y `x` en transform, que es lo que permite interpolar el viaje
 * sin volver a hacer layout.
 */
export function NavIndicator({
  animation,
  className = "",
}: {
  animation: IndicatorAnimation | null;
  className?: string;
}) {
  if (!animation) return null;

  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute left-0 z-10 h-px bg-current ${className}`}
      style={{ top: animation.top }}
      initial={false}
      animate={{
        opacity: animation.opacity,
        x: animation.x,
        width: animation.width,
      }}
      transition={{
        duration: animation.duration,
        ease: NAV_INDICATOR_EASE,
        times: NAV_INDICATOR_TIMES,
      }}
    />
  );
}
