"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/*
  EL CAMINO DE VUELTA DE LA FUN GALLERY
  ─────────────────────────────────────
  Cuando alguien entra a un proyecto DESDE la galería, dos pantallas tienen que
  saberlo: el proyecto, para ofrecer el link de vuelta, y la galería, para
  aparecer ya desplegada en vez de volver a armar el montón. Alcanza con una
  sola anotación: el proyecto que se abrió desde la galería.

  Vive en `sessionStorage` y no en `localStorage` a propósito: es un dato de
  este paseo por el sitio, no del visitante. Muere con la pestaña, y una pestaña
  nueva —o la misma mañana— arranca viendo el montón, que es lo que la pantalla
  quiere mostrar la primera vez.

  La anotación se borra en cuanto el visitante sale del par galería↔proyecto:
  volver a la galería desde Work o desde el menú tiene que mostrar el montón
  otra vez. De eso se ocupa un vigía que se engancha UNA vez por documento, en
  cuanto aparece una anotación, y que no se desengancha nunca.

  Que viva fuera de React no es una comodidad: es el único lugar donde funciona.
  Un listener de `popstate` colgado por la galería no llega a ver el «atrás» del
  navegador, porque Next intercepta el recorrido del historial y desmonta la
  página vieja —y con ella su listener— antes de que el evento se despache. El
  vigía sobrevive al desmontaje y sí lo ve. Los clicks en links se miran en
  captura y sin filtrar por `defaultPrevented`, porque el provider de
  transiciones cancela TODOS los links internos para poder animar la salida.
*/

export const FUN_GALLERY_PATH = "/fun-gallery";

const RETURN_KEY = "esquina:fun-gallery-return";

/*
  Las tres puertas al almacenamiento fallan en silencio. `sessionStorage` no
  existe en el servidor y en el navegador tira si el sitio tiene el
  almacenamiento bloqueado, y ninguno de los dos casos merece romper la
  pantalla: sin anotación, la galería se ve amontonada y el proyecto no ofrece
  la vuelta, que es exactamente el comportamiento de quien llega de otro lado.
*/
function readReturn(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.sessionStorage.getItem(RETURN_KEY);
  } catch {
    // Almacenamiento bloqueado: no hay camino de vuelta que recordar.
    return null;
  }
}

/*
  La anotación tiene que estar leída ANTES del primer pintado: la galería que
  vuelve de un proyecto nace desplegada, y con `useEffect` —que corre después de
  pintar— se vería un cuadro con el montón antes del salto. `useLayoutEffect`
  corre antes, y React vuelve a renderizar de forma síncrona cuando el efecto
  cambia estado. En el servidor no hay pintado que adelantar y React avisa si se
  lo usa igual, así que ahí se cae a `useEffect`, que nunca llega a correr.
*/
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * El proyecto que se abrió desde la galería en esta pestaña, leído una sola vez
 * al montar y RETENIDO desde entonces.
 *
 * Retenerlo no es un detalle: el propio visitante borra la anotación al hacer
 * click en un link que sale del par, y esa navegación tarda 0,65 s en irse
 * mientras la pantalla que se va sigue montada. Con un valor reactivo, en esos
 * 0,65 s la galería volvería a armar el montón y el proyecto escondería el link
 * de vuelta, los dos justo arriba de la animación de salida.
 */
export function useFunGalleryReturnOnMount(): string | null {
  const [remembered, setRemembered] = useState<string | null>(null);

  useIsomorphicLayoutEffect(() => {
    const stored = readReturn();
    if (stored === null) return;

    watchExitFromPair();
    setRemembered(stored);
  }, []);

  return remembered;
}

/**
 * Anota el proyecto al que se está yendo el visitante desde la galería. Guarda
 * el `pathname` y no el href crudo para poder compararlo después contra
 * `usePathname()` y contra `window.location.pathname` sin normalizar nada.
 */
export function rememberFunGalleryReturn(projectHref: string) {
  if (typeof window === "undefined") return;

  try {
    const { pathname } = new URL(projectHref, window.location.href);
    window.sessionStorage.setItem(RETURN_KEY, pathname);
    watchExitFromPair();
  } catch {
    // URL inválida o almacenamiento bloqueado: se sigue sin anotar.
  }
}

function clearFunGalleryReturn() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(RETURN_KEY);
  } catch {
    // Nada que borrar si nunca se pudo escribir.
  }
}

/** La galería y el proyecto anotado son las dos rutas que conservan la vuelta. */
function staysInPair(pathname: string) {
  return pathname === FUN_GALLERY_PATH || pathname === readReturn();
}

function leaveIfOutsidePair(pathname: string) {
  if (staysInPair(pathname)) return;

  clearFunGalleryReturn();
}

function isModifiedClick(event: MouseEvent) {
  return (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function handleExitClick(event: MouseEvent) {
  // Los clicks con modificador abren en otra pestaña: ésta no se va a ningún
  // lado y la anotación tiene que quedarse donde está.
  if (isModifiedClick(event)) return;
  if (!(event.target instanceof Element)) return;

  const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!anchor) return;
  if (anchor.target && anchor.target !== "_self") return;

  let destination: URL;

  try {
    destination = new URL(anchor.href, window.location.href);
  } catch {
    return;
  }

  if (destination.origin !== window.location.origin) return;

  leaveIfOutsidePair(destination.pathname);
}

// En `popstate` la URL ya es la del destino: se lee de ahí y no del router.
function handleExitPopState() {
  leaveIfOutsidePair(window.location.pathname);
}

let watchingExit = false;

/**
 * Engancha el vigía. Es idempotente y no tiene contraparte: los dos listeners
 * se quedan hasta que se cierre el documento. Lo llaman tanto el que escribe la
 * anotación como el que la lee, para que también quede enganchado después de
 * una recarga, donde el módulo arranca de cero pero la anotación sigue viva.
 */
function watchExitFromPair() {
  if (watchingExit || typeof window === "undefined") return;

  watchingExit = true;
  document.addEventListener("click", handleExitClick, true);
  window.addEventListener("popstate", handleExitPopState);
}
