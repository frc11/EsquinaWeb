/**
 * Medidas compartidas de la adaptación mobile (M1).
 *
 * Viven acá y no dentro de un componente por la misma razón que
 * `services-layout.ts`: el cromo son **dos** archivos —`Navbar` y `Footer`— que
 * tienen que cortar en el mismo ancho y con el mismo gutter. Si uno cambia sin
 * el otro, el header y el footer dejan de alinearse.
 *
 * Las clases van escritas **enteras** y se exportan como literales: Tailwind v4
 * busca los nombres de clase como texto en el código, así que una clase armada
 * en runtime (con plantillas, con `replace`) no llega nunca al CSS. Es el mismo
 * precedente que `services-layout.ts` y la razón por la que `Footer` recibe sus
 * alineaciones como literales completos en vez de componerlas con un prefijo.
 *
 * # Los tres cortes
 *
 * | rango | nombre | qué pasa |
 * |---|---|---|
 * | < 768 | mobile | una columna, gutter de 24 px, menú hamburguesa |
 * | 768–1023 | tablet | una columna, gutter de 48 px, menú hamburguesa |
 * | ≥ 1024 | desktop | lo aprobado en los bloques 2, 3 y 4. **Intocable.** |
 *
 * El corte del cromo es `lg` y **no** `md`, y eso salió de medir, no de gusto:
 * el menú de escritorio está centrado en absoluto y con los rótulos en
 * castellano pide 403 px, con el logo ocupando hasta 244 y el bloque de la
 * derecha 217. A 768 el logo se le monta encima (el menú arrancaría en 182); a
 * 1024 entra con holgura. Lo mismo el `InfoRow` del footer, que pide 789 px de
 * ancho y con el gutter de 64 entra recién a partir de 1024.
 */

/**
 * Gutter horizontal del cromo. Alinea Navbar y Footer entre sí y con el resto
 * de las páginas: los 24 px de mobile son el `px-6` que ya usaban Contact,
 * Team, la grilla de Work y las pantallas de aviso de la galería, así que no es
 * una medida nueva.
 */
export const CHROME_GUTTER = "px-6 md:px-12 lg:px-16";

/**
 * Piso de área táctil, en píxeles (§3.4.3 de la instrucción M1; es también el
 * mínimo de WCAG 2.5.5).
 */
export const TOUCH_TARGET_MIN = 44;

/**
 * Le da los 44 px de alto tocable al `<a>` que emite `HoverButton`, **sin tocar
 * el primitivo** (`CLAUDE.md` §4.2 lo prohíbe) y sin despegar su subrayado.
 *
 * `HoverButton` no expone la clase de su `<a>`: el `className` que recibe va al
 * `<span>` de adentro, y engordar ese span con relleno arrastraría al subrayado
 * —que está anclado a su borde inferior— dejándolo flotando debajo del texto.
 * Desde afuera, en cambio, se puede alcanzar el ancla con una variante
 * arbitraria: se vuelve un `inline-flex` de 44 px de alto con el span centrado,
 * así que el área crece y la línea se queda pegada al texto.
 *
 * Va acotado a `max-lg` a propósito: **de 1024 para arriba el cromo no cambia**
 * ni un píxel, que es la regla dura del sprint.
 */
export const TOUCH_LINKS =
  "max-lg:[&_a]:inline-flex max-lg:[&_a]:min-h-[44px] max-lg:[&_a]:items-center";
