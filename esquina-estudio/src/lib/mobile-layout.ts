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
 * **El número es 113 y está medido**, no estimado: el `HomeFooter` de mobile
 * mide 113,00 px a 320, 390 y 430 en los dos idiomas (R3/F4). Se compone de
 * `py-6` (24 + 24) más las **tres** filas de la grilla, que desde R3/F2 miden
 * lo que mide un renglón —21 de INSTAGRAM, 21 de LINKEDIN y 23 del crédito, que
 * lleva el logo de develOP de 22 px—: 48 + 65 = 113. El logo script no suma
 * alto porque desde R2/F11.3 vive en la columna del medio y no en una cuarta
 * fila, y con 48 px entra en los 65 de la grilla.
 *
 * **Era 180 hasta R3/F2**, cuando cada fila medía 44 por el piso táctil de
 * `TOUCH_LINKS` (48 + 132). La compresión al paso del mockup se llevó 67 px, y
 * medido bloque contra footer antes de recalibrar la holgura muerta era
 * exactamente esa: **67,00 px** en las seis combinaciones.
 *
 * **Era 304 hasta R2/F11.3**, cuando la grilla tenía cinco filas: las tres de
 * arriba más 16 de aire, 44 del crédito, 16 de aire y 48 del logo script.
 *
 * **Eran 244 hasta M3, y los 60 px de diferencia son de M4/F3.** El copyright se
 * mudó a la columna derecha, así que la última línea de antes —copyright y
 * crédito juntos— se partió en dos filas; y el logo script, que M2 había sacado
 * del footer de mobile, volvió en una fila propia al pie. Contra eso juegan tres
 * ajustes medidos: el hueco entre filas pasó de 16 a 0 (el piso táctil de 44 ya
 * deja 24 px de aire entre renglones), el relleno vertical del footer bajó de 40
 * a 24 y el logo bajó de 80 a 48 px de alto. Sin ellos la fila habría pedido 400
 * px y `/` no entraría en una pantalla a 320 × 640.
 *
 * **Eran 236 hasta M2, y los 8 px hasta 244 fueron de M3/F2:** cada red pasó a
 * ser su propia celda, así que el piso de área táctil de 44 empezó a aplicarse
 * por fila en vez de una sola vez sobre la celda entera.
 *
 * **Y en R2/F11.3 el footer cambió: son 180, no 304.** La reorganización de
 * mobile —`WORKING WORLDWIDE` afuera, el crédito sin prefijo, el copyright a la
 * izquierda y el logo script a la columna del medio en vez de a una cuarta fila—
 * se llevó 124 px. Medido sobre el sitio servido: el `<footer>` de `/` mide
 * **180 px** en 320 × 640, 390 × 844, 430 × 932 y 768 × 1024, y 164 en 1920 (el
 * escritorio no se movió).
 *
 * **Este es el número que ningún alto de documento delata**, y por eso hay que
 * medirlo aparte: `/` mide una pantalla exacta pase lo que pase, porque el
 * `mt-auto` del footer absorbe la diferencia. Con el 304 viejo contra un footer
 * de 180 quedaban **124 px de holgura muerta** entre el bloque del hero y el
 * footer —medidos, idénticos en los cuatro anchos de mobile—, o sea la frase
 * centrada en un bloque más corto que el espacio disponible. Es la misma clase de
 * defecto que el punto 13 de M2 y la trampa 2 de §7.1: `scrollHeight` nunca baja
 * del alto del viewport, así que los 48 altos salen idénticos con el defecto
 * puesto.
 *
 * **Si el footer cambia, este número cambia.** La verificación es directa: medir
 * `document.querySelector("footer").getBoundingClientRect().height` en los cinco
 * anchos y los dos idiomas, confirmar que `docH === viewH` en `/` **y** que el
 * borde inferior del bloque del hero toca el borde superior del footer.
 *
 * Va escrito **entero** y no compuesto: Tailwind v4 busca los nombres de clase
 * como literales en el código, y una clase armada con una plantilla no llega
 * nunca al CSS. Es exactamente lo que le pasó a la variante de escritorio en M1
 * y lo que quedó documentado como el punto 13 de este sprint.
 */
export const HOME_BLOCK_HEIGHT_MOBILE =
  "max-lg:h-[calc(100svh-var(--header-height)-113px)]";

/**
 * El hueco que ocupa el footer de home, como relleno inferior (M2/F3, punto 9).
 *
 * Lo consume `/contact/success`, donde el footer va **superpuesto** al panel
 * oscuro en vez de apilado debajo: el contenido de la pantalla se centra en lo
 * que queda por encima de esa franja y no en la pantalla entera, o a 320 × 640
 * el párrafo terminaba 46 px por debajo del borde superior del footer.
 *
 * Los dos números son los altos reales del footer: **113** en mobile desde
 * R3/F4 (eran 180 desde R2/F11.3, 304 desde M4/F3 y 244 antes; ver arriba) y
 * 164 en escritorio, los `40 + 84 + 40` que `page.tsx` publica desde B2 y que
 * ni R2 ni R3 tocaron. Van escritos enteros por la misma razón: Tailwind busca
 * literales. Se recalibra junto con `HOME_BLOCK_HEIGHT_MOBILE`, siempre: son la
 * misma medida en dos consumidores.
 */
export const HOME_FOOTER_CLEARANCE = "pb-[113px] lg:pb-[164px]";

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
 * La misma área táctil de 44 px, pero **sin ocupar lugar** (R3/F2).
 *
 * `TOUCH_LINKS` engorda el `<a>` a 44 px, y donde el enlace es una celda de
 * grilla eso hace que la fila mida 44. En el footer de mobile las clientas
 * pidieron los renglones al paso del mockup —21 px—, así que el alto tocable
 * sale de un pseudo-elemento absoluto de 44 px centrado en el enlace, que no
 * participa del layout. El ancho es el del propio enlace (los tres del footer
 * pasan de 66 px).
 *
 * **A 21 px de paso las cajas de dos enlaces vecinos se pisan**, y en la zona
 * compartida gana el que se pinta último. Por eso el texto de cada enlace —el
 * `<span>` que emite `HoverButton`, que ya es `relative`— sube a `z-index: 1`:
 * un toque sobre la palabra va siempre a su propio enlace, y solo el aire
 * entre renglones queda repartido por orden. El área **exclusiva** de cada
 * enlace es su renglón; es la decisión de R3 y está registrada en
 * `MOBILE_PLACE_CELL` de `Footer.tsx`.
 *
 * El `<a>` no debe volverse contexto de apilamiento (sin `z-index` propio):
 * los pseudo-elementos y los textos de los tres enlaces tienen que convivir en
 * el mismo contexto para que el `z-index: 1` del texto le gane al pseudo del
 * vecino.
 */
export const TOUCH_LINKS_OVERLAY = [
  "max-lg:[&_a]:relative max-lg:[&_a]:inline-flex max-lg:[&_a]:items-center",
  "max-lg:[&_a]:after:absolute max-lg:[&_a]:after:inset-x-0 max-lg:[&_a]:after:top-1/2 max-lg:[&_a]:after:h-[44px] max-lg:[&_a]:after:-translate-y-1/2 max-lg:[&_a]:after:content-['']",
  "max-lg:[&_a>span]:z-[1]",
].join(" ");

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
