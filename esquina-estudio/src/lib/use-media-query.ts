"use client";

import { useEffect, useState } from "react";

/**
 * El hook de media queries del repo. **Es uno solo** (`CLAUDE.md` §8.10): todo
 * lo que necesite preguntar por el ancho o por las preferencias del sistema
 * desde JavaScript se cuelga de acá.
 *
 * # Por qué hace falta uno, si Tailwind ya tiene breakpoints
 *
 * Porque hay cosas que **no son CSS**: un `addEventListener` no se apaga con una
 * clase. La adaptación mobile (M1) tiene dos de esas y las dos son gestos de
 * escritorio que en un teléfono estorban:
 *
 * - el **gatillo del intro de Services**, que cancela `wheel` y `touchmove`
 *   mientras está armado y en mobile dejaría la pantalla sin scroll hasta
 *   cruzar su umbral;
 * - el **hover de las portadas de LATEST PROJECTS**, que en Framer Motion vive
 *   en `whileHover` y en touch se dispara con el tap y se queda pegado.
 *
 * # El contrato, y por qué arranca en `false`
 *
 * En el servidor no hay ventana, así que la primera respuesta es siempre
 * `false` —en el servidor y **también en el primer render del cliente**— y el
 * valor real se resuelve en un efecto. Es el mismo patrón que ya usan
 * `PreloaderProvider` (que lee `sessionStorage`) y el idioma
 * (`LocaleProvider`), y por la misma razón: resolver cualquiera de esas cosas
 * *durante* el primer render rompe la hidratación (precedente registrado en
 * B3.3).
 *
 * La consecuencia hay que tenerla presente al usarlo: **el valor de mobile
 * llega un cuadro tarde**. Sirve para apagar comportamiento —un listener que se
 * registra un cuadro después y se da de baja enseguida no se nota— y no sirve
 * para decidir *layout*, que tiene que salir correcto del servidor. El layout
 * se resuelve con las variantes de Tailwind, que son CSS y llegan a tiempo.
 *
 * El hook además **reacciona** si la consulta cambia de valor (girar el
 * teléfono, redimensionar la ventana): se suscribe al evento `change`.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/**
 * Debajo de 1024 px. **Es el mismo corte que usa el cromo** y el mismo que
 * separa «tablet» de «desktop» en la instrucción de M1, así que el sitio tiene
 * una sola frontera: de 1024 para arriba nada cambia, y debajo de eso mandan
 * las soluciones de mobile, sean CSS o JavaScript.
 *
 * Se escribe con el `.98` de siempre para no dejar un hueco de medio píxel con
 * el `lg:` de Tailwind, que arranca exactamente en 1024.
 */
export const BELOW_DESKTOP_QUERY = "(max-width: 1023.98px)";

/** Azúcar sobre lo anterior, para que los consumidores no repitan la cadena. */
export function useIsBelowDesktop(): boolean {
  return useMediaQuery(BELOW_DESKTOP_QUERY);
}
