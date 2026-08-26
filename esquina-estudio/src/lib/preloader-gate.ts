/**
 * # La compuerta de la cortina de entrada (M3/F1, rehecha en M5)
 *
 * Vive acá y no dentro de un componente por la misma razón que
 * `mobile-layout.ts`: son **dos** archivos los que tienen que coincidir —
 * `layout.tsx`, que emite el script bloqueante, y `LoadingScreen.tsx`, que
 * levanta la compuerta cuando la cortina empieza a irse—. Si uno cambia el
 * nombre del nodo y el otro no, la compuerta queda puesta para siempre y el
 * sitio se queda negro, en silencio.
 *
 * ## Qué resuelve la compuerta
 *
 * La cortina se sirve en el HTML del servidor y **siempre** está en el marcado:
 * esa es la condición para que la hidratación no se rompa (ver `LoadingScreen`).
 * Lo que varía entre visitas —que la cortina corresponda o no— se resuelve
 * **fuera de React**, antes del primer pintado, con dos reglas de CSS:
 *
 * - **`skip`** — la cortina no corresponde (ya se vio en esta pestaña, o el
 *   visitante pidió menos movimiento): se esconde con `display: none`.
 * - **`on`** — la cortina va a correr, y entonces **el lienzo se pinta de
 *   negro**. No es redundante con la cortina: el nodo de la cortina es lo
 *   segundo que hay dentro de `<body>`, pero el navegador puede pintar **antes**
 *   de haberlo parseado, y lo que pinta entonces es el `bg-off-white` del body.
 *   Medido en M3 sobre un arranque lento: primer pintado a los 2198 ms con la
 *   pantalla en blanco y la cortina recién a los 2337, o sea ~140 ms de destello
 *   claro antes del negro.
 *
 * ## Por qué es un `<style>` y ya no un atributo en `<html>` (M5)
 *
 * Hasta M4 el script marcaba `data-preloader` sobre `document.documentElement`.
 * Funcionaba, pero **rompía la hidratación en desarrollo**: el HTML servido no
 * trae ese atributo —verificado con `curl` en las nueve rutas— y el script lo
 * agrega antes de que React hidrate, así que React encuentra en el DOM un
 * atributo que no rindió. `react-dom` recorre **todos** los atributos del nodo,
 * descuenta los que rindió y avisa por los que sobran
 * (`diffHydratedProperties` → `warnForExtraAttributes`), y `<html>` entra en ese
 * chequeo como cualquier otro elemento: es un *singleton*, no una excepción.
 *
 * ```
 *   <html
 *     lang="en"
 *     className="manrope antialiased"
 *   - data-preloader="on"
 *   >
 * ```
 *
 * El aviso es **solo de desarrollo** —el texto existe únicamente en
 * `react-dom-client.development.js` y no aparece ni una vez en el build de
 * producción, y medido en producción da 0 avisos en nueve rutas por dos
 * idiomas—, pero es ruido permanente en la consola de quien trabaja, y la salida
 * documentada para taparlo (`suppressHydrationWarning` sobre `<html>`) también
 * ciega a React ante un desacuerdo **real** en `lang` o en `class`.
 *
 * Así que el arreglo es de raíz y no de silenciado: **no se escribe nada sobre
 * `<html>`**. El script inyecta un `<style>` propio en `<head>`, que es donde
 * React tolera nodos ajenos por diseño —`<head>` es singleton justamente para
 * convivir con lo que inyectan extensiones y terceros—. Servidor y cliente
 * coinciden porque no hay nada que comparar.
 *
 * Verificado en un banco aislado con **el mismo `react-dom` que instala el
 * proyecto**, en su build de desarrollo, hidratando el documento entero: con el
 * atributo, el aviso sale y nombra `data-preloader`; con el `<style>`, no sale
 * ninguno y el nodo sobrevive a la hidratación intacto.
 *
 * ## Por qué `/studio` queda afuera (M6/F1)
 *
 * La compuerta la **pone** este script, que vive en el layout raíz y corre en
 * todas las rutas, y la **levanta** `LoadingScreen`. Pero `RootClientShell`
 * hace un early-return en `/studio` —esa ruta es la interfaz de Sanity y no
 * lleva nada del cromo del sitio—, así que ahí `LoadingScreen` no se monta
 * nunca y **nadie levanta la compuerta**: en la primera visita de la pestaña
 * `html` y `body` quedan en `#000000` **para siempre**.
 *
 * Medido antes del arreglo, sobre el build de producción, en pestaña limpia:
 * `/studio` da `rgb(0, 0, 0)` en los dos elementos al cargar **y a los 5,5 s**,
 * con el nodo de la compuerta todavía en `<head>`; `/`, en la misma corrida,
 * pasa a `rgb(243, 243, 243)` cuando la cortina se va. Hoy pasa desapercibido
 * porque el tema del Studio es oscuro y lo tapa, pero es la herramienta que usan
 * las clientas: con un tema claro quedaría inutilizable.
 *
 * El arreglo es **excluir `/studio` del mecanismo entero**, no levantar la
 * compuerta más tarde: en esa ruta no hay cortina que cubrir, así que tampoco
 * hay lienzo que pintar. El script sale antes de tocar nada y `sessionStorage`
 * queda intacto — entrar al Studio no consume la primera visita de la pestaña.
 *
 * ## El test de ruta se escribe una sola vez
 *
 * Son **dos** los que tienen que coincidir: este script, que corre antes de que
 * React exista y solo puede mirar `location.pathname`, y `RootClientShell`, que
 * mira el `pathname` del router. Si uno excluyera `/studio` y el otro no,
 * volvería exactamente el defecto de arriba.
 *
 * Así que no hay dos tests: hay **una** expresión regular, `STUDIO_PATH_RE`.
 * `isStudioPath` la usa desde TypeScript y el script la interpola como fuente
 * —el `toString()` de un literal de regex es JavaScript válido—, así que los dos
 * consumidores evalúan el mismo patrón, byte por byte. Es la regla §8.10 de
 * `CLAUDE.md` aplicada al caso: no se duplica el sistema, se reusa.
 *
 * ## Precedencia
 *
 * El `<style>` se agrega al final de `<head>`, o sea **después** de la hoja de
 * Next, así que le gana por orden a las reglas de misma especificidad. El
 * `!important` se conserva igual porque el fondo del `<body>` lo pone una
 * utility de Tailwind (`bg-off-white`), que es una clase y le ganaría por
 * especificidad a un selector de elemento.
 */

/**
 * El criterio de ruta del Studio, escrito **una sola vez** (M6/F1).
 *
 * `/studio` y todo lo que cuelgue de él —el catch-all `[[...tool]]` sirve
 * `/studio/structure/...`, `/studio/vision`, etc.—; `/studios` **no**, que es
 * para lo que está el grupo con la barra o el fin de cadena.
 *
 * Va como regex y no como par de comparaciones porque tiene que servir en los
 * dos lados: `isStudioPath` la evalúa desde TypeScript y `PRELOADER_GATE_SCRIPT`
 * la interpola como **fuente** dentro del script bloqueante, que corre antes de
 * que exista React. Un literal de regex es lo único que se puede escribir una
 * vez y usar de las dos maneras sin copiar la lógica.
 */
export const STUDIO_PATH_RE = /^\/studio(?:\/|$)/;

/**
 * ¿Esta ruta es el Studio de Sanity?
 *
 * Lo consume `RootClientShell` para su early-return —el Studio no lleva ni el
 * cromo del sitio, ni el cursor propio, ni la cortina— y por eso mismo el
 * preloader tiene que quedar afuera acá también. Ver el bloque de arriba.
 */
export function isStudioPath(pathname: string): boolean {
  return STUDIO_PATH_RE.test(pathname);
}

/** Identidad del nodo. Es lo único que los dos archivos tienen que compartir. */
export const PRELOADER_GATE_ID = "preloader-gate";

/**
 * Script bloqueante de la compuerta.
 *
 * Va **primero dentro de `<body>` y sin `async`/`defer`**, así que el navegador
 * lo ejecuta mientras parsea el documento: después de `<head>` —por eso
 * `document.head` existe— y antes de leer el nodo de la cortina.
 *
 * **Lo primero que hace es salir si la ruta es el Studio** (M6/F1): ahí no se
 * monta `LoadingScreen`, así que una compuerta puesta no se levantaría nunca.
 * Sale antes de leer `sessionStorage`, así que entrar al Studio tampoco consume
 * la primera visita de la pestaña.
 *
 * Todo va dentro de `try`: si `sessionStorage` tira (navegación privada,
 * almacenamiento bloqueado) no se inyecta nada y la cortina se muestra. Es el
 * lado seguro del error, porque la cortina **siempre** se levanta por
 * temporizador (ver el failsafe de `LoadingScreen`).
 */
export const PRELOADER_GATE_SCRIPT = `(function(){try{if(${STUDIO_PATH_RE}.test(location.pathname))return;var s=false;try{s=window.sessionStorage.getItem("esquina:preloaderShown")==="1"}catch(e){}if(!s&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){s=true}var g=document.createElement("style");g.id="${PRELOADER_GATE_ID}";g.textContent=s?"[data-preloader-curtain]{display:none!important}":"html,body{background-color:#000000!important}";document.head.appendChild(g)}catch(e){}})();`;

/**
 * Levanta la compuerta: devuelve el lienzo al off-white del sitio.
 *
 * Hay que llamarla **cuando la cortina empieza a irse**, no cuando terminó: si
 * no, lo que el deslizamiento descubre es negro.
 *
 * Es idempotente y no falla si el nodo no está.
 */
export function clearPreloaderGate() {
  document.getElementById(PRELOADER_GATE_ID)?.remove();
}
