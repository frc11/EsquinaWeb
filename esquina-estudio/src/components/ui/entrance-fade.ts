import type { Variants } from "framer-motion";

/**
 * # La entrada por opacidad del sitio. Es una sola y no se duplica.
 *
 * Nació en el intro de `/services` (B3.4b/F2) como constantes privadas de ese
 * archivo. **R2/F10 la extrajo acá porque las clientas pidieron que la entrada
 * del formulario de contacto sea «la animación del texto de la sección de
 * servicios»** (`docs/archivo/mockups/r2-trad-14.jpg`), y copiar cuatro números
 * de un componente a otro es exactamente lo que §8.10 de `CLAUDE.md` prohíbe.
 *
 * **Esto reemplazó un sistema, no agregó uno.** Con el cambio, Contact dejó de
 * tener su propio juego: se fueron `CONTACT_EASE` y las cuatro variantes que
 * animaban `clipPath` + `filter: blur` + `opacity`. Los sistemas de «aparecer»
 * del repo pasan de cuatro a tres: este (Services + Contact), el del Hero —que
 * anima `y` además de la opacidad y por eso no es el mismo— y `RevealOnScroll`,
 * que reacciona al scroll y solo lo usa Team.
 *
 * ## Qué define el patrón
 *
 * **Solo opacidad.** Sin desplazamiento, sin recorte y sin desenfoque: el
 * contenido ya está en su lugar y lo único que hace es aparecer. Un `y` lo haría
 * aterrizar y un `clipPath` lo barrería, que son otros dos gestos distintos.
 *
 * ## Qué NO define
 *
 * **La cadencia del grupo**, y por eso `entranceGroup` es una fábrica. El intro
 * de Services orquesta dos hijos y puede permitirse 0,22 s entre uno y otro; el
 * formulario orquesta diez por columna, y a 0,22 el último arrancaría a los
 * 2,1 s. Cada consumidor declara su ritmo; lo que comparten es **cómo aparece
 * cada elemento**, que es lo que se ve.
 */

/** La curva del Hero. Suave en las dos puntas: lo que pide un fundido largo. */
export const ENTRANCE_EASE: [number, number, number, number] = [
  0.25, 0.1, 0.25, 1,
];

/** Largo del fundido. Es el doble de la entrada del Hero, y a propósito. */
export const ENTRANCE_FADE_DURATION = 1.1;

/** Aire antes de que arranque el primer hijo. */
export const ENTRANCE_FADE_DELAY = 0.12;

/** Cadencia por defecto: la de Services, pensada para dos hijos. */
export const ENTRANCE_FADE_STAGGER = 0.22;

/** El elemento que aparece. Lo comparten todos los consumidores tal cual. */
export const entranceFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: ENTRANCE_FADE_DURATION, ease: ENTRANCE_EASE },
  },
};

/**
 * El contenedor que orquesta. Sin argumentos da el ritmo del intro de Services.
 *
 * Devuelve un objeto nuevo en cada llamada, así que se declara **a nivel de
 * módulo** en el consumidor —nunca dentro del render—: una identidad nueva por
 * render haría que Framer reevalúe la orquestación en cada uno.
 */
export function entranceGroup(
  staggerChildren: number = ENTRANCE_FADE_STAGGER,
  delayChildren: number = ENTRANCE_FADE_DELAY,
): Variants {
  return {
    hidden: {},
    visible: { transition: { delayChildren, staggerChildren } },
  };
}
