"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * # El indicador de carga de imágenes (M3/F5, puntos 7 y 11)
 *
 * Es **uno solo** y lo comparten los tres lugares que lo piden —la grilla de
 * Work, las fichas de proyecto y Team—, que es la regla 10 de `CLAUDE.md`: si
 * hace falta una capacidad nueva se construye una y se documenta, no se escriben
 * tres parecidas.
 *
 * ## Por qué un retardo y no mostrarlo siempre
 *
 * Una imagen que ya está en caché aparece en el primer o segundo cuadro. Si el
 * indicador se montara con la imagen, en esos casos se vería un parpadeo de un
 * par de cuadros: aparece y desaparece antes de que el ojo lo registre como
 * información, y lo único que queda es el temblor. Es peor que no tener nada.
 *
 * Así que el indicador **no se muestra hasta pasados 120 ms sin carga**. El
 * número tiene los dos lados medidos: una imagen en caché resuelve muy por
 * debajo (ver la medición del sprint), y 120 ms sigue estando por debajo de los
 * ~200 ms en que una espera empieza a percibirse como espera. Entre esos dos
 * bordes hay margen de sobra en las dos direcciones, que es lo que se busca de
 * un umbral: que no dependa de acertarle fino.
 *
 * ## Por qué nunca se queda puesto
 *
 * Mismo criterio que la cortina de entrada (`LoadingScreen`): el estado de
 * «listo» lo pueden dar tres cosas —`onLoad`, `onError` o el tope de tiempo—, y
 * las tres son independientes entre sí. Si `next/image` no emitiera `onLoad`
 * para una imagen ya cacheada —es un caso conocido según la versión—, el tope lo
 * cubre igual. No hay ninguna rama en la que el indicador sobreviva a la imagen.
 *
 * ## Identidad
 *
 * Monocromo y de una sola pieza: un anillo fino de 1,5 px en `currentColor`, con
 * la pista al 18 % y un arco de un cuarto al 70 %. Lo pinta el color de texto
 * del contenedor, así que cada lugar elige su tono sin que el componente tenga
 * que saber sobre qué fondo cae. Nada de esqueletos con gradiente ni de barras
 * de progreso falsas: no hay progreso real que informar.
 */

/**
 * Lo que se espera antes de mostrar nada. Ver arriba: por debajo de esto, lo
 * único que aporta el indicador es parpadeo.
 */
const INDICATOR_DELAY_MS = 120;

/**
 * Tope duro. Si a los 15 s no llegó ni `onLoad` ni `onError`, se retira igual:
 * el indicador no puede quedar girando sobre una imagen que ya está.
 */
const INDICATOR_MAX_MS = 15000;

type ImageLoadState = {
  /** Si corresponde pintar el indicador **ahora**. */
  showIndicator: boolean;
  /** Va al `onLoad` de la imagen. */
  onLoad: () => void;
  /** Va al `onError`: una imagen rota tampoco deja el indicador puesto. */
  onError: () => void;
};

export function useImageLoad(): ImageLoadState {
  // Los dos arrancan igual en el servidor y en el cliente: el primer render
  // tiene que coincidir o se rompe la hidratación.
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPastDelay, setIsPastDelay] = useState(false);

  useEffect(() => {
    if (isLoaded) return;

    const delayTimer = window.setTimeout(() => {
      setIsPastDelay(true);
    }, INDICATOR_DELAY_MS);

    const capTimer = window.setTimeout(() => {
      setIsLoaded(true);
    }, INDICATOR_MAX_MS);

    return () => {
      window.clearTimeout(delayTimer);
      window.clearTimeout(capTimer);
    };
  }, [isLoaded]);

  const markDone = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    showIndicator: isPastDelay && !isLoaded,
    onLoad: markDone,
    onError: markDone,
  };
}

/**
 * El indicador. Va superpuesto y **no tapa nada cuando se apaga**: se desvanece
 * en 300 ms y queda con `opacity: 0`, sin `pointer-events` en ningún momento.
 *
 * El contenedor tiene que ser `position: relative` — los tres consumidores ya lo
 * son, porque todos alojan un `next/image` con `fill`.
 */
export default function ImageLoadIndicator({ show }: { show: boolean }) {
  return (
    <div
      aria-hidden
      // El atributo es el asidero de la medición: permite muestrear la opacidad
      // del anillo cuadro a cuadro y probar que en una imagen cacheada **nunca
      // llega a verse**, que es la condición del punto 7. No pinta nada.
      data-image-indicator=""
      className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/*
        `animate-spin` es de Tailwind, así que no entra ninguna dependencia. Y
        `motion-reduce:animate-none` resuelve `prefers-reduced-motion` **en el
        CSS**: el anillo queda quieto, sin que haya que preguntarle nada a
        JavaScript y por lo tanto sin riesgo de hidratación (es el precedente que
        `use-media-query.ts` deja escrito: el hook sirve para apagar
        comportamiento, no para decidir lo que se pinta).
      */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="h-6 w-6 animate-spin motion-reduce:animate-none"
      >
        <circle
          cx="12"
          cy="12"
          r="10.25"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.18"
        />
        <path
          d="M12 1.75A10.25 10.25 0 0 1 22.25 12"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
