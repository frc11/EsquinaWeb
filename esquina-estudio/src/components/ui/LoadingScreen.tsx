"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { clearPreloaderGate } from "@/lib/preloader-gate";

const SESSION_KEY = "esquina:preloaderShown";

/**
 * # La cortina de entrada (M3/F1, puntos 1 y 2)
 *
 * Reemplaza al preloader de partículas por la animación que pasaron las
 * clientas: el logo script dibujándose en blanco sobre negro.
 *
 * ## El defecto que arregla (punto 1)
 *
 * Hasta M2 **la página aparecía antes que la cortina**, y no era un problema de
 * duración sino de orden de montaje. El componente arrancaba en
 * `shouldRender = false` y recién se prendía dentro de un `requestAnimationFrame`
 * disparado desde un `useEffect`, o sea **después** de la hidratación. El HTML
 * del servidor no traía cortina ninguna. Y como `Navbar` y `Footer` viven en el
 * layout —fuera del `template.tsx`, que es el único que apagaba el contenido con
 * `isPreloaderDone`— el primer cuadro pintado era la página clara con el header
 * y el pie puestos, y la cortina caía encima uno o dos cuadros más tarde.
 *
 * Se arregla de raíz y no con un retardo: **la cortina se sirve en el HTML del
 * servidor**, así que existe en el primer pintado. El estado inicial es «cortina
 * puesta», no «cortina que se pone».
 *
 * ## Cómo convive con la hidratación
 *
 * La regla de `sessionStorage` —el preloader corre **una sola vez por pestaña**—
 * no se puede resolver en el servidor, y resolverla en el primer render del
 * cliente es exactamente lo que rompió la hidratación en el precedente de la
 * media query. Así que no se resuelve en React:
 *
 * 1. El servidor y el **primer render del cliente** son idénticos y siempre
 *    traen la cortina. No hay nada que React pueda desacordar.
 * 2. El script bloqueante de `layout.tsx` lee `sessionStorage` y
 *    `prefers-reduced-motion` **antes de que el navegador pinte**, e inyecta un
 *    `<style>` propio en `<head>`: con «skip» esconde la cortina con
 *    `display: none`; con «on» pinta el lienzo de negro, que es lo que cubre los
 *    milisegundos entre el primer pintado y la llegada del nodo de la cortina.
 *    Es CSS, no React: no participa de la hidratación. **Y desde M5 no escribe
 *    nada sobre `<html>`**, que es lo que sí participaba — ver
 *    `src/lib/preloader-gate.ts`.
 * 3. Ya hidratado, el `useEffect` de acá lee lo mismo y desmonta la cortina de
 *    verdad. El usuario nunca la vio, porque el paso 2 la tapó desde el cuadro
 *    cero.
 *
 * ## El failsafe (obligatorio)
 *
 * La salida la manda un `setTimeout` que **no depende del video**: ni de que
 * cargue, ni de que arranque, ni de que termine. Si el archivo no está, si el
 * decodificador falla o si el navegador bloquea la reproducción, el temporizador
 * corre igual y la cortina se levanta. No hay ninguna rama en la que quede
 * puesta. El `onError` es un extra que la levanta **antes** —no un requisito
 * para que se levante—.
 */

/**
 * Duración de la cortina. Es la del video, medida con `ffprobe` sobre el archivo
 * final: 36 cuadros a 12 fps = 3,000000 s exactos. Antes eran 2700 ms de reloj
 * inventado (1000 de barra + 700 de espera + 1000 de salida).
 */
const VIDEO_DURATION_MS = 3000;

/** El deslizamiento de salida que ya existía, en segundos. No cambia. */
const EXIT_DURATION = 1;

const HIDE_DELAY = VIDEO_DURATION_MS + EXIT_DURATION * 1000;

const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];

/**
 * El negro de la cortina, **medido y no elegido**.
 *
 * El video no tiene canal alfa: trae su propio fondo pintado. Con `object-contain`
 * quedan bandas de cortina arriba y abajo (o a los costados), así que si los dos
 * negros no coinciden se ve el rectángulo del video recortado contra el fondo.
 *
 * `ffprobe` sobre el cuadro 0 da `YMIN = YMAX = YAVG = 16` con `U = V = 128`, o
 * sea negro de referencia de rango limitado, y el cuadro decodificado a RGB da
 * `#000000` en **todos** sus píxeles (un único color en el histograma del cuadro
 * entero). El negro del video es negro puro, **no** el `#0F0F0F` de la marca:
 * con `off-black` la cortina habría quedado 15 puntos más clara que el video y
 * el borde se vería.
 */
const CURTAIN_BLACK = "#000000";

/**
 * Ancho del video, **declarado y no heredado del viewport** (M11).
 *
 * El pedido de las clientas es un ancho de logo: 37 % del ancho del viewport
 * debajo de 1024 y 19 % de ahí para arriba. El logo ocupa el 58,281 % del ancho
 * del cuadro —medido sobre los 36 cuadros del archivo—, así que el ancho del
 * video sale de dividir uno por el otro. Esa aritmética, la constante medida y
 * el porqué de declarar el ancho en vez de dejarlo en `100%` están en
 * `globals.css`, donde vive `--preloader-logo-share`, que es lo único que se
 * toca para cambiar el tamaño.
 *
 * Va como variable de CSS y no como estado de React porque el corte de 1024 es
 * una media query, y resolver una media query en el primer render del cliente
 * es exactamente lo que rompió la hidratación en el precedente que documenta
 * `preloader-gate.ts`. En CSS no hay nada que React pueda desacordar.
 *
 * El respaldo del `var()` es el más chico de los dos —el de escritorio— por si
 * la hoja de Next todavía no se aplicó: sin él, un ancho inválido cae en `auto`
 * y el elemento tomaría los 1920 px intrínsecos del video. Sigue al valor de
 * escritorio cuando ese cambia, para que no quede nombrando un ancho que ya no
 * existe en ningún rango.
 */
const VIDEO_WIDTH = "var(--preloader-video-width, 32.60vw)";

export default function LoadingScreen() {
  const { markPreloaderDone } = usePreloader();

  // Los tres arrancan en el mismo valor en el servidor y en el cliente: el
  // primer render tiene que coincidir exactamente o se rompe la hidratación.
  const [isSkipped, setIsSkipped] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  /**
   * Falla del video: se levanta la cortina en el acto en vez de esperar los
   * 3000 ms mirando un rectángulo negro. El temporizador de abajo la levantaría
   * igual; esto solo adelanta.
   */
  const handleVideoError = useCallback(() => {
    clearPreloaderGate();
    setIsExiting(true);
    markPreloaderDone();
  }, [markPreloaderDone]);

  useEffect(() => {
    let alreadyShown = false;
    try {
      alreadyShown = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // Navegación privada o almacenamiento bloqueado: se muestra la cortina.
      // Es el lado seguro del error — siempre se levanta por temporizador.
    }

    const prefersReducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    /*
      `prefers-reduced-motion`: **sin video y sin cortina**. La animación es la
      pieza entera, no un adorno que se pueda apagar dejando el resto; una
      cortina negra estática de tres segundos sobre un sitio claro es peor que
      no tenerla. El sitio aparece directamente.
    */
    if (alreadyShown || prefersReducedMotion) {
      // Sincronización con el almacenamiento externo en el montaje, igual que
      // en `PreloaderProvider`.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSkipped(true);
      markPreloaderDone();
      return;
    }

    /*
      El contenido entra **cuando la cortina empieza a irse**, no cuando terminó.

      Es el punto que obliga el cambio de off-white a negro. `isPreloaderDone`
      gobierna la entrada de nueve componentes (`template`, `Hero`, `WorkGrid`,
      `ServicesIntro`, `ContactForm`, `ContactSuccess`, `RevealOnScroll`,
      `ProjectDetailClient`, `IntroScrollTrigger`): hasta M2 se prendía al final
      del deslizamiento. Con la cortina clara sobre página clara eso no se veía,
      porque lo que asomaba detrás era del mismo color. Con la cortina negra, ese
      segundo de deslizamiento habría descubierto **la página vacía en off-white**
      antes de que el contenido empezara a aparecer: el destello que el sprint
      manda evitar.

      Prendiéndolo al empezar la salida, los 500 ms del fundido del contenido
      caen dentro de los 1000 ms del deslizamiento: cuando la cortina va por la
      mitad, lo de atrás ya está opaco.
    */
    const exitTimer = window.setTimeout(() => {
      clearPreloaderGate();
      setIsExiting(true);
      markPreloaderDone();
    }, VIDEO_DURATION_MS);

    // Respaldo duro: si por lo que fuera la animación de salida no desmontara el
    // nodo, esto lo saca igual.
    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(hideTimer);
      // Si el efecto se limpia sin haber llegado a la salida —una navegación
      // temprana, un desmontaje— el lienzo no puede quedarse negro.
      clearPreloaderGate();
    };
  }, [markPreloaderDone]);

  if (isSkipped || !isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="loading-screen"
          // Lo lee el CSS de `globals.css` para esconder la cortina antes del
          // primer pintado cuando el script bloqueante marcó `skip`.
          data-preloader-curtain=""
          exit={{ y: "-100%" }}
          transition={{ duration: EXIT_DURATION, ease: EASE_EXIT }}
          /*
            Va en `style` y no en clases de Tailwind a propósito. El requisito es
            que **nada del sitio se vea antes que la cortina**, y una clase
            depende de que la hoja de estilos ya esté aplicada. El estilo en
            línea viaja en el mismo HTML que el nodo: no hay ningún momento, ni
            siquiera teórico, en que este div exista sin tapar la pantalla.
          */
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            backgroundColor: CURTAIN_BLACK,
            /*
              El video ya no llena la cortina, así que hay que centrarlo: es
              flex y no un `transform` de centrado porque un transform con
              desplazamiento fraccionario deja los artefactos sub-pixel que
              documenta §7.5 de `CLAUDE.md`.

              `overflow: hidden` cubre el caso extremo de una ventana mucho más
              ancha que 16/9 y muy baja, donde la caja del video —16/9 sobre un
              ancho fijo— sobresale por arriba y por abajo. Lo que sobresale es
              negro sobre negro y no se ve, pero recortarlo garantiza que no
              aparezca scroll. Acotar el alto en cambio NO sirve: haría que
              `object-contain` volviera a achicar el logo y el porcentaje pedido
              dejaría de cumplirse.
            */
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <video
            /*
              `autoPlay` + `muted` + `playsInline` es el trío que hace que el
              navegador reproduzca solo: sin `muted` ningún navegador
              autorreproduce, y sin `playsInline` iOS se lleva el video a
              pantalla completa. Y como los tres son atributos de HTML, **el
              video arranca con el parseo del documento**, sin esperar a que
              React hidrate: es la otra mitad del arreglo del punto 1.
            */
            autoPlay
            muted
            playsInline
            preload="auto"
            poster="/preloader-poster.png"
            src="/preloader-logo.mp4"
            aria-hidden
            onError={handleVideoError}
            /*
              `object-contain` y no `cover`: el video no tiene alfa, así que
              `cover` recortaría el logo en vertical. Desde M11 la caja del
              elemento ya es de 16/9, así que no quedan bandas dentro del video;
              las que quedan son de la cortina, alrededor, y son invisibles
              porque su fondo es el mismo negro puro del video (ver
              `CURTAIN_BLACK`) y porque el borde del cuadro da luma 0 en los 36
              cuadros. El `backgroundColor` del propio elemento cubre el hueco
              entre que se monta y llega el primer cuadro, junto con el póster.
            */
            style={{
              display: "block",
              width: VIDEO_WIDTH,
              /*
                La relación se fija a mano en vez de dejar `height: auto` con la
                intrínseca: hasta que llegan los metadatos, un `<video>` mide
                300 × 150 por defecto, y la caja daría un salto. Declarada, el
                alto es el correcto desde el primer cuadro pintado.
              */
              aspectRatio: "16 / 9",
              /*
                `object-contain` se conserva por lo que dice el comentario del
                elemento, pero con la caja ya en 16/9 —la del video y la del
                póster— no tiene nada que recortar ni que rellenar.
              */
              objectFit: "contain",
              backgroundColor: CURTAIN_BLACK,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
