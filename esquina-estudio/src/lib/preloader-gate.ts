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
 * ## Precedencia
 *
 * El `<style>` se agrega al final de `<head>`, o sea **después** de la hoja de
 * Next, así que le gana por orden a las reglas de misma especificidad. El
 * `!important` se conserva igual porque el fondo del `<body>` lo pone una
 * utility de Tailwind (`bg-off-white`), que es una clase y le ganaría por
 * especificidad a un selector de elemento.
 */

/** Identidad del nodo. Es lo único que los dos archivos tienen que compartir. */
export const PRELOADER_GATE_ID = "preloader-gate";

/**
 * Script bloqueante de la compuerta.
 *
 * Va **primero dentro de `<body>` y sin `async`/`defer`**, así que el navegador
 * lo ejecuta mientras parsea el documento: después de `<head>` —por eso
 * `document.head` existe— y antes de leer el nodo de la cortina.
 *
 * Todo va dentro de `try`: si `sessionStorage` tira (navegación privada,
 * almacenamiento bloqueado) no se inyecta nada y la cortina se muestra. Es el
 * lado seguro del error, porque la cortina **siempre** se levanta por
 * temporizador (ver el failsafe de `LoadingScreen`).
 */
export const PRELOADER_GATE_SCRIPT = `(function(){try{var s=false;try{s=window.sessionStorage.getItem("esquina:preloaderShown")==="1"}catch(e){}if(!s&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){s=true}var g=document.createElement("style");g.id="${PRELOADER_GATE_ID}";g.textContent=s?"[data-preloader-curtain]{display:none!important}":"html,body{background-color:#000000!important}";document.head.appendChild(g)}catch(e){}})();`;

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
