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

/**
 * # Nota sobre `sizes` en mobile — por qué algunos van dentro de `calc()`
 *
 * Los anchos de teléfono de este sprint (320 a 430) están **por debajo del
 * corte más chico que `next/image` considera**. Su `deviceSizes` por defecto
 * arranca en 640 y `next.config.ts` no lo cambia (y no se toca: `CLAUDE.md`
 * §4.2). El detalle que decide el peso servido está en `getWidths`
 * (`node_modules/next/dist/shared/lib/get-img-props.js:51-70` en la 16.2.6):
 *
 * ```js
 * const viewportWidthRe = /(^|\s)(1?\d?\d)vw/g;   // vw precedido por inicio o espacio
 * if (percentSizes.length) {
 *   const smallestRatio = Math.min(...percentSizes) * 0.01;
 *   return { widths: allSizes.filter(s => s >= deviceSizes[0] * smallestRatio) };
 * }
 * return { widths: allSizes };
 * ```
 *
 * O sea: **si el `sizes` contiene un `vw` suelto, el candidato más chico del
 * `srcset` es `640 × el vw más chico`**, y todo lo que hay debajo —96, 128,
 * 256, 384— desaparece de la lista. Con `100vw` el piso es 640: en un teléfono
 * se sirve un archivo de 640 px para una caja de 342. Y como el regex pide que
 * el número esté precedido por un espacio o por el inicio de la cadena, un `vw`
 * escrito **dentro de un `calc()`** no lo dispara y la lista vuelve a tener
 * todos los cortes.
 *
 * Por eso varios `sizes` de este repo escriben su término de escritorio como
 * `calc(80vw)` en vez de `80vw`: **no cambia lo que el navegador calcula** —es
 * la misma medida— pero le devuelve los cortes chicos, que es lo único que hace
 * falta para que un teléfono no descargue el archivo de 640. En desktop el
 * resultado es idéntico, y está verificado corte por corte.
 *
 * Si una versión futura de Next cambiara ese regex, lo peor que puede pasar es
 * volver al comportamiento de hoy: se sirve un archivo más grande de lo
 * necesario. No rompe nada.
 */
