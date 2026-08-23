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
 * # El alto del bloque del hero de home en mobile (M2/F2, punto 4)
 *
 * `/` tiene que entrar en **una pantalla**: header + hero + footer = `100svh`,
 * sin scroll, igual que en escritorio. Como el footer no se puede medir desde
 * el bloque —son dos archivos hermanos y el layout tiene que salir correcto del
 * servidor, sin JavaScript—, el alto del footer se **resta**, igual que hace el
 * escritorio con sus 164 px desde B2.
 *
 * **El número es 236 y está medido**, no estimado: el `HomeFooter` de mobile
 * mide 236,00 px en los cinco anchos de prueba (320, 360, 390, 414, 430) y en
 * los dos idiomas. Se compone de `py-10` (40 + 40) más los tres renglones de la
 * grilla del punto 7: 40 del primer par de lugar, 16 de hueco, 40 del segundo,
 * 16 de hueco y 44 de la línea del copyright —los 44 los pone el piso de área
 * táctil sobre el link del crédito—. 80 + 156 = 236.
 *
 * **Si el footer cambia, este número cambia.** La verificación es directa: medir
 * `document.querySelector("footer").getBoundingClientRect().height` en los cinco
 * anchos y los dos idiomas y confirmar que `docH === viewH` en `/`.
 *
 * Va escrito **entero** y no compuesto: Tailwind v4 busca los nombres de clase
 * como literales en el código, y una clase armada con una plantilla no llega
 * nunca al CSS. Es exactamente lo que le pasó a la variante de escritorio en M1
 * y lo que quedó documentado como el punto 13 de este sprint.
 */
export const HOME_BLOCK_HEIGHT_MOBILE =
  "max-lg:h-[calc(100svh-var(--header-height)-236px)]";

/**
 * El hueco que ocupa el footer de home, como relleno inferior (M2/F3, punto 9).
 *
 * Lo consume `/contact/success`, donde el footer va **superpuesto** al panel
 * oscuro en vez de apilado debajo: el contenido de la pantalla se centra en lo
 * que queda por encima de esa franja y no en la pantalla entera, o a 320 × 640
 * el párrafo terminaba 46 px por debajo del borde superior del footer.
 *
 * Los dos números son los mismos altos de siempre —236 en mobile (ver arriba) y
 * 164 en escritorio, los `40 + 84 + 40` que `page.tsx` publica desde B2— y van
 * escritos enteros por la misma razón: Tailwind busca literales.
 */
export const HOME_FOOTER_CLEARANCE = "pb-[236px] lg:pb-[164px]";

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
