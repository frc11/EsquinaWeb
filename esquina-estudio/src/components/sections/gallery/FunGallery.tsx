"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  usePrefersReducedMotion,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";
import {
  rememberFunGalleryReturn,
  useFunGalleryReturnOnMount,
} from "@/lib/fun-gallery-return";
import { useLocale } from "@/lib/i18n";
import { CHROME_GUTTER } from "@/lib/mobile-layout";
import { urlFor } from "@/lib/sanity";
import { useIsBelowDesktop } from "@/lib/use-media-query";
import { FunGalleryImage } from "@/types/fun-gallery-image";

/*
  ARQUITECTURA DE CAPAS
  ─────────────────────
  Sobre cada objeto conviven varios movimientos y casi todos mueven x/y. En
  Framer Motion un `animate` con keyframes y un motion value con spring no
  pueden compartir propiedad —se pisan—, así que cada movimiento vive en su
  propio elemento y el navegador compone las matrices al bajar por el árbol:

    L0  posición + hover + seguimiento
        left/top/width (CSS) · scale (whileHover) · zIndex · x/y (motion values)
      L1  despliegue      x/y  → animate, una sola vez, al click
        L2  flotado       x/y  → animate con keyframes, loop infinito
          L3  inclinación rotate (constante) + opacity del fade de carga
            <Image object-contain />

  Ningún par de capas escribe la misma propiedad del mismo elemento. L0 lleva
  x/y y scale a la vez, que son propiedades distintas y sistemas distintos —los
  motion values del seguimiento contra el `whileHover` de la escala—, así que no
  compiten: el seguimiento vivía en una capa propia mientras se aplicaba a los
  ocho objetos con un motion value compartido, y al pasar a ser un gesto del
  objeto con hover se consolidó en la capa que ya resuelve ese hover (B3.3c/F2).
  La rotación va por dentro de las traslaciones para que éstas ocurran en el
  espacio de la página y no en el marco inclinado del objeto.

  UNIDADES
  ────────
  Todo el layout se expresa en fracciones del ANCHO de la composición. El
  contenedor no se mide en JS: `left`, `top` y `width` salen en porcentaje y el
  alto lo fija un `aspect-ratio`, así que la composición escala con la página,
  sobrevive al resize sin listeners y es idéntica en servidor y cliente.
*/

// ── Composición ──────────────────────────────────────────────────────────────

/**
 * Tope de ancho de la composición: la caja medida en
 * `docs/mockups/15-fun-gallery-hover.jpg`, 1664 px con 128 px de margen a cada
 * lado de un viewport de 1920. Es el techo, no la medida de todos los días: con
 * el tamaño derivado del ancho (ver TAMAÑO) la composición pide 1539 px a 1920 y
 * solo llega al tope a partir de 2078 px de pantalla, que es donde el bloque
 * deja de crecer para que los objetos no se vuelvan gigantes.
 */
const COMPOSITION_MAX_WIDTH = 1664;

/*
  TAMAÑO — el objeto sale del ANCHO del viewport, no del alto disponible.

  El criterio anterior despejaba el ancho de la composición del alto que quedaba
  libre debajo del título, para que la escena desplegada entrara entera en la
  primera pantalla. El costo era que el objeto encogía con el alto: a 1920×1080
  el mayor medía 351 px —el 18,3 % del ancho— y a 1366×768 apenas 216 px, que es
  el 15,8 %. En el mockup `15-fun-gallery-hover.jpg` las bandas de los objetos
  miden 219 y 279 px sobre 1271 de ancho de lienzo: entre el 17 % y el 22 % del
  ancho, sin relación con el alto de la pantalla.

  Así que el ancho de la composición se despeja de una sola condición:

    ladoMayor = objetivo × 100vw   con   ladoMayor = ancho × ladoMayorRelativo
    ancho     = 100vw × objetivo / ladoMayorRelativo

  `ladoMayorRelativo` es el lado del objeto más grande en fracción del ancho de
  la composición, que el motor ya calcula. El resultado es que el objeto mayor
  mide el mismo porcentaje del viewport en todas las resoluciones —20 %, o sea
  384 px a 1920 y 273 px a 1366— hasta que manda el tope de 1664 px, a partir de
  2078 px de ancho de pantalla.

  LO QUE SE SACRIFICA. La composición desplegada ya no cabe forzosamente en la
  primera pantalla: a 1920×1080 el objeto más bajo termina en y = 1118 y a
  1366×768 en y = 860, así que el final se alcanza scrolleando. Es lo que muestra
  el mockup y está autorizado.

  LO QUE NO SE SACRIFICA. La escena de ENTRADA —título, montón y el cartel
  `(click to view)`— sigue entrando completa: el montón vive en el tercio de
  arriba de la composición (su borde inferior cae en 0,275 del ancho y el cartel
  en 0,35), así que su alto crece con el ancho pero muy por debajo del alto
  total. Medido: el borde inferior del cartel cae en y = 890 sobre 1080 y en
  y = 703 sobre 768. **No hizo falta darle al montón una escala propia.**

  Todo se sigue expresando en CSS —`min()` y `calc()` sobre `100vw`— y no
  midiendo en JS: la composición se arma igual en el servidor y en el cliente, y
  reacciona al resize sin listeners.
*/

/**
 * Lado del objeto mayor en fracción del ancho del VIEWPORT. El 20 % es el centro
 * del 18–22 % medido en el mockup.
 */
const TARGET_MAX_ITEM_VIEWPORT_SHARE = 0.2;

/**
 * Escala del título. Bajó a clases en M1/F6: en mobile el título va a 26/31,
 * que es la escala de display del sitio en teléfonos, y el interlineado tiene
 * que acompañar. Vivía como constante de JS desde B3.3b porque el encuadre de
 * entonces necesitaba el número; B3.3c cambió el criterio de tamaño —el objeto
 * sale del ANCHO y no del alto disponible— y desde ahí el único consumidor era
 * el propio `style` del `<h1>`. Sin segundo consumidor, no hay dos fuentes de
 * verdad que puedan separarse.
 */
const TITLE_SCALE =
  "text-[26px] leading-[31px] md:text-[40px] md:leading-[48px]";

/*
  Padding del bloque y aire entre el título y la composición: ceden alto en
  pantallas bajas, donde cada píxel decide si la escena de entrada entra, y se
  quedan en el valor de siempre —72 px y 40 px— en cuanto la pantalla da para
  tenerlo. A 1080 el padding queda en 70 px y el aire en los 40 completos; a 768,
  en 50 y 28. Es lo que le da al cartel los 65 px de aire que tiene a 1366×768.
*/
const SECTION_PAD_TOP = "clamp(32px, 6.5svh, 72px)";
const TITLE_GAP = "clamp(24px, 3.7svh, 40px)";

const GRID_CELL_DENSITY = 1.15;

/** Alto de celda / ancho de celda. Medido en el mockup: 404 px sobre 416 px. */
const ROW_PITCH = 0.97;

/** Centro del ítem dentro de su celda, y jitter extra, los dos en fracción de celda. */
const CELL_PLACE_MIN = 0.4;
const CELL_PLACE_MAX = 0.6;
const CELL_JITTER = 0.05;

/**
 * Lado del objeto en fracción del ancho de la grilla, antes del ajuste a la
 * caja. Los dos pares se interpolan por densidad igual que antes: pocas
 * imágenes = objetos grandes. Con 8 imágenes el lado final cae en 0,19–0,25 del
 * ancho de la composición: a 1920×1080 son 294–384 px, contra los 288–404 px
 * medidos en el mockup.
 */
const MIN_ITEM_WIDTH_FEW_IMAGES = 0.19;
const MAX_ITEM_WIDTH_FEW_IMAGES = 0.26;
const MIN_ITEM_WIDTH_MANY_IMAGES = 0.14;
const MAX_ITEM_WIDTH_MANY_IMAGES = 0.2;

/** Inclinación en grados: cada objeto queda entre -3 y +3, apenas fuera de plomo. */
const ROTATION_RANGE = 3;

/**
 * zIndex sorteado por el motor: base y rango. Manda en el estado desplegado
 * —donde lo único que decide es qué objeto pasa por encima en el hover— y
 * reparte a los objetos entre el centro y el borde del abanico del montón. El
 * apilado del montón, en cambio, sale del tamaño visible (ver APILADO).
 */
const ITEM_Z_BASE = 10;
const ITEM_Z_RANGE = 24;

// ── Montón ───────────────────────────────────────────────────────────────────

/*
  Las ocho imágenes son cuadrados de 2250×2250 con el producto recortado
  adentro, y ese recorte ocupa 76–88 % del alto pero solo 31–84 % del ancho
  (medido sobre el alfa de los ocho assets). Apilados concéntricos, los anchos
  taparían a los angostos y el montón se leería como un choque, así que cada
  objeto sale del centro en abanico: el ángulo avanza con el ángulo áureo —que
  reparte direcciones parejas para cualquier cantidad de imágenes— y el radio
  lo dicta el rango del motor, que reparte a los objetos entre el centro y el
  borde del abanico.
*/
const PILE_CENTER_X = 0.5;
const PILE_CENTER_Y = 0.17;
const PILE_RADIUS_MIN = 0.02;
const PILE_RADIUS_MAX = 0.05;
const PILE_GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const PILE_ANGLE_JITTER = 0.45;

/*
  APILADO DEL MONTÓN — por tamaño visible, no por el sorteo.

  El zIndex del motor es un sorteo, así que en el montón cualquiera podía quedar
  arriba: un objeto grande adelante tapaba a los chicos y el montón perdía
  objetos. Ahora, mientras están amontonados, los objetos se apilan por TAMAÑO
  VISIBLE —los de más tinta al fondo, los de menos adelante—, que es lo que hace
  que los ocho se distingan: un recorte angosto adelante deja ver por sus
  costados a los anchos de atrás.

  «Tamaño visible» es el del DIBUJO, no el de la caja. Los assets son cuadrados
  con hasta 34 % de margen transparente por lado —Tukumi ocupa el 31 % del ancho
  de su cuadrado—, así que ordenar por el lado de la tarjeta daría el criterio
  invertido justo para los recortes angostos. Se usa `lado² × cobertura de
  tinta`, que es el área que el objeto realmente pinta en pantalla.

  La cobertura se mide sobre la imagen ya decodificada, en un canvas de 48×48:
  el alfa promedio del muestreo es el área cubierta. No se hornean números por
  imagen porque el contenido lo cargan las clientas desde Sanity y una tabla
  fija quedaría vieja a la primera imagen nueva. Y no se puede medir en el
  servidor: el CDN de Sanity responde 403 a cualquier pedido con `Origin`, así
  que la única fuente sin CORS es la copia que sirve el optimizador de Next, que
  es del mismo origen. Hasta que están las ocho medidas manda el zIndex del
  motor; el orden llega mientras los objetos todavía están en su fundido de
  entrada.

  Rige SOLO para el montón: desplegados, el zIndex vuelve a ser el del motor,
  donde lo único que decide es qué objeto pasa por encima en el hover.
*/
const INK_SAMPLE_SIZE = 48;

/** Distancia del cartel «(click to view)» al centro del montón, en fracción del ancho. */
const PILE_CAPTION_GAP = 0.18;

/*
  LA GRILLA DE MOBILE (M2/F3, punto 5)
  ────────────────────────────────────
  Debajo de 1024 la composición desplegada **no** es la dispersión de
  escritorio: es una grilla de dos columnas en teléfono y tres en tablet, con el
  objeto ocupando la celda entera. Las dos razones son la misma: a 390 el
  criterio de escritorio —el objeto mayor al 20 % del ancho del viewport,
  repartido en una grilla de cuatro columnas— dejaba objetos de 59 a 81 px, o
  sea entre el 15 y el 21 % del ancho de la pantalla. Con dos columnas el objeto
  pasa a medir la mitad del ancho útil: 136 px a 320, 171 a 390 y 191 a 430,
  **más del doble**.

  # Cómo conviven los dos repartos sin JavaScript

  El layout tiene que salir correcto del servidor (`CLAUDE.md` §2b: el hook de
  media queries sirve para apagar comportamiento, no para decidir layout), así
  que los tres repartos —dos columnas, tres columnas y la dispersión— se
  calculan **todos** al renderizar y viajan como **variables CSS** en el `style`
  de cada objeto. Las clases que las consumen son literales enteros
  (`lg:left-[var(--d-x)]`, `md:[--pile-x:var(--b-px)]`, …), que es la única
  forma de que Tailwind v4 las genere. El que manda lo decide el `@media`, no el
  cliente: no hay parpadeo ni salto al hidratar.

  En mobile los objetos son celdas de una grilla real —`position: relative`— y
  el `left`/`top`/`width` absoluto queda acotado a `lg:`. El viaje del montón,
  en cambio, no es CSS sino una animación de Framer, así que se resuelve con una
  variable intermedia: cada capa declara `--pile-x` / `--pile-y` apuntando al
  juego que corresponde a su rango, y la animación anima **hacia
  `var(--pile-x)`** —Framer resuelve variables CSS en sus destinos, leyendo el
  valor ya computado del elemento—.

  El abanico del montón es el mismo en los tres: mismo ángulo por objeto y
  mismo radio, escalado por el tamaño de celda para que la apertura relativa al
  objeto no cambie.
*/
const MOBILE_COLUMNS = 2;
const TABLET_COLUMNS = 3;

// ── Despliegue ───────────────────────────────────────────────────────────────

/*
  Spring por duración visual: `visualDuration` es el tiempo en el que el objeto
  aparenta llegar, y el rebote chico cae después. Con el desfase por posición el
  último objeto llega a los 0,85 + 7 × 0,07 = 1,34 s.
*/
const DEPLOY_VISUAL_DURATION = 0.85;
const DEPLOY_BOUNCE = 0.18;
const DEPLOY_STAGGER = 0.07;
const CAPTION_FADE_DURATION = 0.4;

/*
  El desfase se reparte en ORDEN DE LECTURA sobre la composición terminada, no
  sobre el índice del dato: el shuffle de celdas reparte a los ítems por la
  pantalla sin ninguna relación con el orden en que llegan de Sanity, así que
  cobrar el retraso por índice hacía salir el segundo objeto antes que el
  primero y la secuencia se leía desordenada.

  «Arriba primero, y a igual altura de izquierda a derecha» necesita decidir
  qué es «igual altura»: dos objetos separados por unos píxeles tienen que
  contar como la misma fila, o se invierten. Se agrupa por cercanía —se abre
  banda nueva cuando el salto en altura contra el objeto anterior pasa el
  umbral— y no por cortes fijos, que parten una fila si cae justo en el borde.
  El umbral es medio objeto: dos cajas que se superponen verticalmente en más
  de la mitad se leen a la misma altura. Con la composición de ocho imágenes el
  mayor salto dentro de una fila es 0,036 y el que hay entre filas 0,225,
  contra un umbral de 0,110: la separación es holgada por los dos lados.
*/
const DEPLOY_BAND_SHARE = 0.5;

// ── Flotado ──────────────────────────────────────────────────────────────────

/*
  Mismo patrón que `ServicesIntro` (`:196-198`): keyframes de x/y en loop, con
  el período desfasado por índice para que los objetos no vayan todos juntos.
  Dos diferencias, las dos para que se lea deriva y no vaivén: los keyframes son
  simétricos —el objeto se va para los dos lados, no siempre para el mismo— y
  cada eje tiene su propio período, así que la trayectoria nunca cierra igual y
  no se percibe el ciclo. La amplitud está calibrada a estos objetos: 16 px de
  vertical sobre una tarjeta de ~400 px es un 4 %, deriva y no vibración.
*/
const FLOAT_X = 11;
const FLOAT_Y = 16;
const FLOAT_PERIOD_X = 11.5;
const FLOAT_PERIOD_Y = 9;
const FLOAT_PERIOD_STEP = 1.2;

// ── Seguimiento del cursor ───────────────────────────────────────────────────

/*
  SOLO EL OBJETO CON HOVER ACOMPAÑA AL CURSOR.

  Hasta B3.3b el seguimiento era un parallax global: un único motion value con
  la posición normalizada del cursor en el VIEWPORT movía a los ocho objetos a
  la vez. No era lo pedido, y además repartía mal el gesto —el desplazamiento
  dependía de dónde estaba el objeto en la pantalla, no de dónde estaba el
  cursor respecto del objeto—, así que un objeto cerca del centro casi no se
  movía por más que el cursor lo recorriera entero.

  Ahora el gesto es del objeto, como en `ServicesIntro` (`:151-191`), que
  también mide el cursor contra el centro de CADA imagen. Dos diferencias con
  ese precedente: el signo va al derecho —el objeto ACOMPAÑA al cursor en vez de
  apartarse— y el radio de disparo no es un círculo de 100 px sino la propia
  caja del objeto, que es la que ya define el hover. Se reusa su spring:
  sobreamortiguado, ζ = 1,5, sin rebote, solo arrastre.

  La amplitud es `FOLLOW_STRENGTH × factor` con el cursor en el borde de la
  caja, o sea 12 a 18 px, y el factor sorteado por objeto (2 a 3) es lo que hace
  que no todos acompañen igual. Contra los ±11/±16 px del flotado es del mismo
  orden —«ligeramente», que es lo pedido—, y ahora se lee porque es el único
  objeto que se mueve respecto de sus vecinos.
*/
const FOLLOW_MIN = 2;
const FOLLOW_MAX = 3;
const FOLLOW_STRENGTH = 6;
const FOLLOW_SPRING = { stiffness: 50, damping: 15, mass: 0.5 };

// ── Hover ────────────────────────────────────────────────────────────────────

/*
  1,2 agrandaba el objeto 80 px y competía con el despliegue; 1,08 quedó corto y
  el gesto no se leía. 1,13 son 50 px sobre una tarjeta de 384 px: se nota sin
  competir. Medido contra el par más cerrado, el costo es asumible (ver el
  bloque de choques del reporte B3.3c). El zIndex de hover pasa de 999 a 50
  porque ahora la página scrollea: 999 dejaba al objeto por encima del Navbar
  (z-100) al pasarle por debajo.
*/
const HOVER_SCALE = 1.13;
const HOVER_DURATION = 0.5;
const HOVER_Z_INDEX = 50;

const IMAGE_FADE_DURATION = 1.2;
const IMAGE_FADE_STAGGER = 0.3;
const IMAGE_FADE_STAGGER_BUCKET = 6;

const EAGER_IMAGE_COUNT = 6;
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

/**
 * Ancho de la composición, resuelto por CSS: el ancho que le da al objeto mayor
 * su porcentaje del viewport, con el tope de siempre por encima. Ver el bloque
 * TAMAÑO. El `w-full` del contenedor pone el otro techo —el gutter de la
 * sección—, que con ocho imágenes nunca llega a mandar.
 */
function getCompositionMaxWidth(maxItemSize: number) {
  const widthShare = TARGET_MAX_ITEM_VIEWPORT_SHARE / maxItemSize;

  return `min(${COMPOSITION_MAX_WIDTH}px, calc(100vw * ${widthShare}))`;
}

// Pedido al CDN de Sanity, medido en la sonda B3.1: `w=1200&fm=webp` conserva
// el alpha y pesa 94,9 KB contra los 534,6 KB del PNG que se pedía antes.
// `fm=webp` es determinista; `auto=format` depende del header `Accept`, que en
// un fetch de servidor no está garantizado. La calidad queda en el default (75)
// a propósito: pedirle 90 al optimizador devuelve HTTP 400 mientras
// `next.config.ts` no declare `qualities`, y a 75 la diferencia medida en el
// borde fue de 2,4/255 sobre el peor de los ocho recortes.
const GALLERY_IMAGE_CDN_WIDTH = 1200;
const GALLERY_IMAGE_CDN_FORMAT = "webp" as const;

type GalleryItem = {
  id: string;
  // El nombre de la imagen: es lo que anuncia el link ("View ...").
  title: string;
  // El texto alternativo, que el schema guarda aparte del nombre.
  alt: string;
  href?: string;
  imageUrl: string;
};

type LayoutItem = GalleryItem & {
  /** Esquina superior izquierda y lado del objeto, en fracción del ancho. */
  x: number;
  y: number;
  size: number;
  /** Viaje del montón al lugar, en porcentaje del propio lado del objeto. */
  pileOffsetX: number;
  pileOffsetY: number;
  /**
   * El abanico del montón, en crudo: el ángulo sorteado del objeto y su radio
   * en fracción del ancho de la composición. Los publica el motor para que la
   * grilla de mobile arme **el mismo** montón sin volver a sortear nada.
   */
  pileAngle: number;
  pileRadius: number;
  rotate: number;
  zIndex: number;
  followFactor: number;
  /** Turno en el despliegue: 0 es el primero en salir del montón. */
  deployOrder: number;
};

type Composition = {
  /** Alto de la composición dividido su ancho. */
  aspect: number;
  /** Alto del cartel «(click to view)», en fracción del ancho. */
  captionY: number;
  /** Lado del objeto más grande, en fracción del ancho de la composición. */
  maxItemSize: number;
  items: LayoutItem[];
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
}

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed: string) {
  let state = hashString(seed) || 1;

  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function randomBetween(random: () => number, min: number, max: number) {
  return min + random() * (max - min);
}

function shuffle<T>(items: T[], random: () => number) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

/**
 * La galería ya no deriva sus imágenes de los proyectos: cada `funGalleryImage`
 * es un ítem, en el orden que devuelve la query. Se descarta el que no logre
 * URL (documento sin asset), que es también el caso que filtra la query.
 *
 * `href` sale del proyecto vinculado y es opcional: sin vínculo el ítem se ve
 * pero no es clickeable.
 */
function toGalleryItems(images: FunGalleryImage[]): GalleryItem[] {
  return images.flatMap((image) => {
    const imageUrl = urlFor(image.image)
      .width(GALLERY_IMAGE_CDN_WIDTH)
      .format(GALLERY_IMAGE_CDN_FORMAT)
      .url();

    if (!imageUrl) return [];

    return [
      {
        id: image._id,
        title: image.title,
        alt: image.altText || image.title,
        href: image.projectSlug ? `/work/${image.projectSlug}` : undefined,
        imageUrl,
      },
    ];
  });
}

/**
 * Turno de despliegue de cada objeto, en orden de lectura sobre la composición
 * ya resuelta: bandas de altura de arriba hacia abajo y, dentro de cada banda,
 * de izquierda a derecha. Devuelve el turno indexado como `placed`, para que el
 * llamador no tenga que reordenar nada.
 *
 * Se compara por el CENTRO de cada caja y no por su borde superior: los objetos
 * no miden todos igual, y con el borde un objeto grande parecería estar más
 * arriba que uno chico que en realidad tiene la misma altura visual.
 */
function assignDeployOrder(
  placed: { x: number; y: number; size: number }[],
): number[] {
  if (placed.length === 0) return [];

  const meanSize =
    placed.reduce((total, entry) => total + entry.size, 0) / placed.length;
  const bandThreshold = meanSize * DEPLOY_BAND_SHARE;
  const centers = placed
    .map((entry, index) => ({
      index,
      centerX: entry.x + entry.size / 2,
      centerY: entry.y + entry.size / 2,
    }))
    .sort((left, right) => left.centerY - right.centerY);

  const bands: (typeof centers)[] = [];

  for (const entry of centers) {
    const band = bands[bands.length - 1];
    const previous = band?.[band.length - 1];

    if (
      !band ||
      !previous ||
      entry.centerY - previous.centerY > bandThreshold
    ) {
      bands.push([entry]);
      continue;
    }

    band.push(entry);
  }

  const deployOrder = new Array<number>(placed.length).fill(0);
  let turn = 0;

  for (const band of bands) {
    for (const entry of [...band].sort(
      (left, right) => left.centerX - right.centerX,
    )) {
      deployOrder[entry.index] = turn;
      turn += 1;
    }
  }

  return deployOrder;
}

/**
 * El motor determinista de siempre —un LCG sembrado con el contenido alimenta
 * el shuffle de celdas y, por ítem, lado, dos jitters por eje, rotación, zIndex
 * y factor de seguimiento— pero resolviendo una página normal en vez de un mapa
 * sobredimensionado: la grilla ocupa el ancho disponible y el alto sale de las
 * filas que pida la cantidad de imágenes.
 *
 * La caja del objeto es CUADRADA. El sorteo de aspecto que había antes no
 * agregaba variedad: los ocho assets son cuadrados y con `object-contain` una
 * caja no cuadrada solo achica el dibujo contra el lado corto y deja el resto
 * como aire muerto, que además desalinea el área de hover del producto.
 */
function buildComposition(
  items: GalleryItem[],
  randomSeed: string,
): Composition {
  const count = Math.max(items.length, 1);
  const density = clamp((count - 6) / 18, 0, 1);
  const minItemWidth = lerp(
    MIN_ITEM_WIDTH_FEW_IMAGES,
    MIN_ITEM_WIDTH_MANY_IMAGES,
    density,
  );
  const maxItemWidth = lerp(
    MAX_ITEM_WIDTH_FEW_IMAGES,
    MAX_ITEM_WIDTH_MANY_IMAGES,
    density,
  );
  const random = createRandom(randomSeed);
  const columns = Math.ceil(Math.sqrt(count * GRID_CELL_DENSITY));
  const rows = Math.ceil(count / columns);
  const cellWidth = 1 / columns;
  const cellHeight = cellWidth * ROW_PITCH;
  const cells = shuffle(
    Array.from({ length: columns * rows }).map((_, index) => index),
    random,
  );

  const scattered = items.map((item, index) => {
    const cell = cells[index] ?? index;
    const column = cell % columns;
    const row = Math.floor(cell / columns);
    const size = randomBetween(random, minItemWidth, maxItemWidth);
    const centerX =
      (column + randomBetween(random, CELL_PLACE_MIN, CELL_PLACE_MAX)) *
        cellWidth +
      randomBetween(random, -CELL_JITTER, CELL_JITTER) * cellWidth;
    const centerY =
      (row + randomBetween(random, CELL_PLACE_MIN, CELL_PLACE_MAX)) *
        cellHeight +
      randomBetween(random, -CELL_JITTER, CELL_JITTER) * cellHeight;

    return {
      item,
      index,
      size,
      centerX,
      centerY,
      rotate: randomBetween(random, -ROTATION_RANGE, ROTATION_RANGE),
      zIndex: ITEM_Z_BASE + Math.round(random() * ITEM_Z_RANGE),
      followFactor: randomBetween(random, FOLLOW_MIN, FOLLOW_MAX),
      angle:
        index * PILE_GOLDEN_ANGLE +
        randomBetween(random, -PILE_ANGLE_JITTER, PILE_ANGLE_JITTER),
    };
  });

  /*
    La grilla sortea celdas de tamaño fijo, pero los objetos son casi tan
    grandes como su celda: recortarlos contra la caja los pegaría al borde y se
    comerían justo el jitter que los saca de la grilla. En vez de recortar se
    mide la caja envolvente del sorteo y se la lleva a ocupar exactamente el
    ancho disponible. El resultado no puede desbordar —el ancho es el ancho, por
    construcción— y el alto es el que pide la composición, que es lo que la
    página scrollea.
  */
  const bounds = scattered.reduce(
    (box, entry) => ({
      minX: Math.min(box.minX, entry.centerX - entry.size / 2),
      maxX: Math.max(box.maxX, entry.centerX + entry.size / 2),
      minY: Math.min(box.minY, entry.centerY - entry.size / 2),
      maxY: Math.max(box.maxY, entry.centerY + entry.size / 2),
    }),
    {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    },
  );
  const fit = 1 / Math.max(bounds.maxX - bounds.minX, Number.EPSILON);
  const aspect = (bounds.maxY - bounds.minY) * fit;
  const halfMaxItem = (maxItemWidth * fit) / 2;
  const pileCenterY = clamp(
    PILE_CENTER_Y,
    halfMaxItem,
    Math.max(halfMaxItem, aspect - halfMaxItem),
  );

  const placed = scattered.map((entry) => {
    const size = entry.size * fit;
    const x = (entry.centerX - entry.size / 2 - bounds.minX) * fit;
    const y = (entry.centerY - entry.size / 2 - bounds.minY) * fit;
    const radius = lerp(
      PILE_RADIUS_MAX,
      PILE_RADIUS_MIN,
      clamp((entry.zIndex - ITEM_Z_BASE) / ITEM_Z_RANGE, 0, 1),
    );
    const pileX = PILE_CENTER_X + Math.cos(entry.angle) * radius - size / 2;
    const pileY = pileCenterY + Math.sin(entry.angle) * radius - size / 2;

    return {
      ...entry.item,
      x,
      y,
      size,
      pileOffsetX: ((pileX - x) / size) * 100,
      pileOffsetY: ((pileY - y) / size) * 100,
      pileAngle: entry.angle,
      pileRadius: radius,
      rotate: entry.rotate,
      zIndex: entry.zIndex,
      followFactor: entry.followFactor,
    };
  });
  // El turno de despliegue se resuelve recién acá: necesita las posiciones ya
  // llevadas a la caja, que es lo que se ve en pantalla.
  const deployOrder = assignDeployOrder(placed);

  return {
    aspect,
    captionY: pileCenterY + PILE_CAPTION_GAP,
    maxItemSize: placed.reduce(
      (largest, item) => Math.max(largest, item.size),
      0,
    ),
    items: placed.map((item, index) => ({
      ...item,
      deployOrder: deployOrder[index] ?? index,
    })),
  };
}

type GridLayout = {
  columns: number;
  /** Alto de la composición dividido su ancho. */
  aspect: number;
  /** Alto del cartel, como porcentaje del alto de la composición. */
  captionTop: string;
  /** Viaje del montón por objeto, en porcentaje del lado del objeto. */
  pile: { x: string; y: string }[];
};

/**
 * El reparto en grilla de mobile: celdas cuadradas del ancho de la composición
 * dividido las columnas, sin hueco —el aire lo ponen los propios recortes, que
 * ocupan entre el 31 y el 88 % de su cuadrado— y el objeto llenando la celda.
 *
 * Devuelve, por objeto, el viaje desde el montón hasta su celda **en porcentaje
 * del lado del objeto**, que es la unidad en la que Framer anima la capa del
 * despliegue. El montón se centra en la primera fila y conserva el abanico del
 * motor: mismo ángulo por objeto y el mismo radio, escalado por `celda /
 * ladoMayorDeEscritorio` para que la apertura **relativa al objeto** sea la
 * misma que arriba de 1024.
 */
function buildGridLayout(
  items: LayoutItem[],
  columns: number,
  maxItemSize: number,
): GridLayout {
  const cell = 1 / columns;
  const rows = Math.max(1, Math.ceil(items.length / columns));
  const aspect = rows * cell;
  const pileCenterY = cell / 2;
  const radiusScale = cell / Math.max(maxItemSize, Number.EPSILON);

  const pile = items.map((item, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const centerX = (column + 0.5) * cell;
    const centerY = (row + 0.5) * cell;
    const radius = item.pileRadius * radiusScale;
    const pileX = PILE_CENTER_X + Math.cos(item.pileAngle) * radius;
    const pileY = pileCenterY + Math.sin(item.pileAngle) * radius;

    return {
      x: `${((pileX - centerX) / cell) * 100}%`,
      y: `${((pileY - centerY) / cell) * 100}%`,
    };
  });

  // El cartel cuelga del montón a la misma distancia relativa que en
  // escritorio, y se expresa contra el ALTO de la composición porque es ahí
  // donde se posiciona.
  const captionY = pileCenterY + PILE_CAPTION_GAP * radiusScale;

  return {
    columns,
    aspect,
    captionTop: `${(captionY / aspect) * 100}%`,
    pile,
  };
}

/**
 * Fracción del cuadrado que el dibujo cubre de verdad, medida sobre la imagen ya
 * decodificada. Se promedia el alfa de un muestreo de 48×48 —el canal completo,
 * no un umbral—, así que un borde a medio cubrir cuenta por lo que cubre. Ver el
 * bloque APILADO. Devuelve `null` si el navegador no deja leer el canvas, y en
 * ese caso el objeto conserva el zIndex del motor.
 */
function measureInkCoverage(image: HTMLImageElement): number | null {
  const canvas = document.createElement("canvas");
  canvas.width = INK_SAMPLE_SIZE;
  canvas.height = INK_SAMPLE_SIZE;

  const context = canvas.getContext("2d");
  if (!context) return null;

  context.drawImage(image, 0, 0, INK_SAMPLE_SIZE, INK_SAMPLE_SIZE);

  try {
    const { data } = context.getImageData(
      0,
      0,
      INK_SAMPLE_SIZE,
      INK_SAMPLE_SIZE,
    );
    let coverage = 0;

    for (let index = 3; index < data.length; index += 4) {
      coverage += data[index];
    }

    return coverage / (255 * INK_SAMPLE_SIZE * INK_SAMPLE_SIZE);
  } catch {
    // Canvas contaminado: no debería pasar —las imágenes las sirve el
    // optimizador de Next, que es del mismo origen— pero no vale romper por eso.
    return null;
  }
}

/**
 * Apilado del montón: los objetos de más tinta al fondo y los de menos adelante.
 * El área que cada uno pinta es `lado² × cobertura`, o sea el tamaño del dibujo
 * y no el de la caja. Devuelve `null` mientras falte alguna medición, y ahí
 * manda el zIndex del motor.
 */
function buildPileStack(
  items: LayoutItem[],
  inkCoverage: Record<string, number>,
  /**
   * En la grilla de mobile **todos los objetos miden lo mismo** —la celda—, así
   * que el área pintada la decide sólo la cobertura de tinta. Usar los lados de
   * la dispersión de escritorio daría un orden que en esa pantalla no
   * corresponde a lo que se ve.
   */
  scatteredSizes: boolean,
): Record<string, number> | null {
  if (items.some((item) => inkCoverage[item.id] === undefined)) return null;

  const stack: Record<string, number> = {};
  const area = (item: LayoutItem) =>
    (scatteredSizes ? item.size * item.size : 1) * inkCoverage[item.id];

  [...items]
    .sort((left, right) => area(right) - area(left))
    .forEach((item, rank) => {
      stack[item.id] = ITEM_Z_BASE + rank;
    });

  return stack;
}

function GalleryCard({
  item,
  index,
  aspect,
  mobilePile,
  tabletPile,
  deployTurn,
  spread,
  instant,
  reduceMotion,
  hoverEnabled,
  pileZIndex,
  onInkMeasured,
}: {
  item: LayoutItem;
  index: number;
  aspect: number;
  /** Viaje del montón en la grilla de dos columnas y en la de tres (M2/F3). */
  mobilePile: { x: string; y: string };
  tabletPile: { x: string; y: string };
  /**
   * Turno en el despliegue. En escritorio lo decide el orden de lectura sobre
   * la dispersión (`deployOrder`); en la grilla de mobile el orden de lectura
   * **es** el orden del DOM, así que alcanza con el índice. Lo resuelve el
   * padre porque es lo único de la tarjeta que depende del rango y no puede
   * salir de una variable CSS: es un retraso de animación, no una medida.
   */
  deployTurn: number;
  spread: boolean;
  /** El objeto nace en su lugar, sin animar el despliegue. */
  instant: boolean;
  reduceMotion: boolean;
  /**
   * Hover y seguimiento del cursor, los dos gestos de escritorio de esta
   * pantalla. En falso —debajo de 1024 px— el objeto no crece con el puntero y
   * no acompaña al cursor: en touch el hover no existe y el `whileHover` de
   * Framer se dispara con el tap y **se queda pegado**, así que un objeto
   * tocado quedaría agrandado y por encima de los demás hasta tocar otra cosa.
   * El flotado y el despliegue no dependen de esto: siguen corriendo (§3.3 de
   * M1: se conserva el concepto).
   */
  hoverEnabled: boolean;
  /** Apilado del montón. Ausente mientras no estén las mediciones. */
  pileZIndex?: number;
  onInkMeasured: (id: string, coverage: number) => void;
}) {
  const { navigateWithTransition } = useRouteTransition();
  const { t } = useLocale();
  const viewLabel = t.gallery.viewItem;
  const [isLoaded, setIsLoaded] = useState(false);
  const followTargetX = useMotionValue(0);
  const followTargetY = useMotionValue(0);
  const followX = useSpring(followTargetX, FOLLOW_SPRING);
  const followY = useSpring(followTargetY, FOLLOW_SPRING);
  // Mientras están amontonados los objetos no son interactivos: el click que
  // despliega lo recibe el botón que los cubre, así que nunca compite con el
  // click que navega a un proyecto.
  const interactive = spread && Boolean(item.href);
  // Media vuelta de fase entre pares e impares: con ocho períodos distintos por
  // eje alcanza para que no arranquen todos en el mismo sentido.
  const driftX = index % 2 === 0 ? FLOAT_X : -FLOAT_X;

  const handleNavigate = () => {
    if (!item.href) return;
    // Se anota antes de arrancar la transición: el proyecto y la vuelta a la
    // galería leen esto para ofrecer el link de vuelta y para nacer desplegada.
    rememberFunGalleryReturn(item.href);
    navigateWithTransition(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!item.href) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleNavigate();
  };

  /*
    El cursor se mide contra el centro de ESTA caja y se normaliza por su
    semilado, así que el gesto es el mismo en cualquier objeto y en cualquier
    resolución: en el centro no hay desplazamiento y en el borde está el máximo.
    El rectángulo se lee en cada movimiento —igual que en `ServicesIntro`—
    porque el objeto está flotando y creciendo por el hover: cualquier medida
    guardada quedaría vieja al cuadro siguiente.
  */
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const amplitude = FOLLOW_STRENGTH * item.followFactor;
    const offsetX =
      (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const offsetY =
      (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

    followTargetX.set(clamp(offsetX, -1, 1) * amplitude);
    followTargetY.set(clamp(offsetY, -1, 1) * amplitude);
  };

  const handlePointerLeave = () => {
    followTargetX.set(0);
    followTargetY.set(0);
  };

  return (
    <motion.div
      /*
        En mobile el objeto es una **celda de la grilla** y ocupa su ancho
        entero; de 1024 para arriba vuelve a ser un absoluto colocado por el
        motor de dispersión. Las tres medidas de escritorio viajan como
        variables y las consumen clases literales acotadas a `lg:`, así que el
        reparto de arriba de 1024 no cambia ni un píxel.
      */
      className={`relative aspect-square w-full lg:absolute lg:left-[var(--d-x)] lg:top-[var(--d-y)] lg:w-[var(--d-w)] ${
        interactive ? "cursor-pointer" : ""
      }`}
      style={{
        ...({
          "--d-x": `${item.x * 100}%`,
          // `top` se mide contra el alto de la composición y las coordenadas
          // están en unidades de ancho: de ahí la división por el aspecto.
          "--d-y": `${(item.y / aspect) * 100}%`,
          "--d-w": `${item.size * 100}%`,
          "--a-px": mobilePile.x,
          "--a-py": mobilePile.y,
          "--b-px": tabletPile.x,
          "--b-py": tabletPile.y,
          "--c-px": `${item.pileOffsetX}%`,
          "--c-py": `${item.pileOffsetY}%`,
        } as React.CSSProperties),
        zIndex: spread ? item.zIndex : (pileZIndex ?? item.zIndex),
        x: followX,
        y: followY,
      }}
      whileHover={
        hoverEnabled ? { scale: HOVER_SCALE, zIndex: HOVER_Z_INDEX } : undefined
      }
      transition={{
        duration: HOVER_DURATION,
        ease: EASE,
        zIndex: { duration: 0 },
      }}
      // Con `prefers-reduced-motion` no se cuelga el seguimiento: los motion
      // values se quedan en 0 y el hover conserva solo su escala. Debajo de
      // 1024 tampoco se cuelga: ahí no hay ni hover ni seguimiento.
      onPointerMove={
        reduceMotion || !hoverEnabled ? undefined : handlePointerMove
      }
      onPointerLeave={
        reduceMotion || !hoverEnabled ? undefined : handlePointerLeave
      }
      role={interactive ? "link" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `${viewLabel} ${item.title}` : undefined}
      // Sin proyecto vinculado el ítem no es interactivo: tampoco se le cuelgan
      // los handlers. Antes se colgaban siempre y salían por un early return.
      onClick={interactive ? handleNavigate : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {/*
        L1 — despliegue: corre una sola vez, del montón a su lugar.

        El destino se nombra con una variable intermedia y no con el número:
        `--pile-x` apunta al juego de coordenadas del rango activo, y el `@media`
        elige cuál. Framer resuelve `var(--…)` en sus destinos leyendo el valor
        **ya computado** del elemento, así que el viaje sale con las coordenadas
        del reparto que se está viendo y sin que el componente pregunte nada.
      */}
      <motion.div
        className="h-full w-full [--pile-x:var(--a-px)] [--pile-y:var(--a-py)] md:[--pile-x:var(--b-px)] md:[--pile-y:var(--b-py)] lg:[--pile-x:var(--c-px)] lg:[--pile-y:var(--c-py)]"
        initial={false}
        animate={{
          x: spread ? "0%" : "var(--pile-x)",
          y: spread ? "0%" : "var(--pile-y)",
        }}
        transition={
          instant
            ? { duration: 0 }
            : {
                type: "spring",
                visualDuration: DEPLOY_VISUAL_DURATION,
                bounce: DEPLOY_BOUNCE,
                delay: spread ? deployTurn * DEPLOY_STAGGER : 0,
              }
        }
      >
        {/* L2 — flotado: loop permanente, un período por eje y por índice. */}
        <motion.div
          className="h-full w-full transform-gpu will-change-transform"
          animate={
            reduceMotion
              ? { x: 0, y: 0 }
              : {
                  x: [0, driftX, 0, -driftX, 0],
                  y: [0, -FLOAT_Y, 0, FLOAT_Y, 0],
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  x: {
                    duration: FLOAT_PERIOD_X + index * FLOAT_PERIOD_STEP,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  y: {
                    duration: FLOAT_PERIOD_Y + index * FLOAT_PERIOD_STEP,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
          }
        >
          {/*
            L3 — inclinación constante y fade de carga. `rotate` es un valor
            estático y `opacity` no es transform: no se pisan.

            La caja mide exactamente la tarjeta, que es el único tamaño con el
            que `object-contain` dibuja la imagen al tamaño previsto: agrandar
            la caja agranda el dibujo y lo recorta contra la tarjeta.
          */}
          <motion.div
            className="relative h-full w-full"
            style={{ rotate: item.rotate }}
            initial={false}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{
              duration: IMAGE_FADE_DURATION,
              delay: (index % IMAGE_FADE_STAGGER_BUCKET) * IMAGE_FADE_STAGGER,
              ease: EASE,
            }}
          >
            <Image
              src={item.imageUrl}
              alt={item.alt}
              fill
              // El objeto mayor mide el 20 % del ancho del viewport en TODAS
              // las resoluciones —es el criterio de B3.3c— asi que el 22vw de
              // desktop vale tambien en mobile y con margen. Los 30vw que habia
              // pedian un corte mas grande del necesario (M1/F7).
              // Tres escalones, uno por reparto: media pantalla en la grilla
              // de dos columnas, un tercio en la de tres y el 22 % de siempre
              // en la dispersión de escritorio. Los `vw` van adentro de
              // `calc()` a propósito (ver la nota de `mobile-layout.ts`): así
              // `next/image` conserva los cortes chicos del `srcset`.
              sizes="(min-width: 1024px) calc(22vw), (min-width: 768px) calc(34vw), calc(51vw)"
              priority={index < EAGER_IMAGE_COUNT}
              // El callback llega con el `<img>` ya decodificado, que es el
              // único momento en que se puede leer su alfa.
              onLoadingComplete={(image) => {
                setIsLoaded(true);

                const coverage = measureInkCoverage(image);
                if (coverage !== null) onInkMeasured(item.id, coverage);
              }}
              className="object-contain"
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function FunGallery({
  images,
  randomSeed,
}: {
  images: FunGalleryImage[];
  randomSeed: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  // Los dos gestos de puntero de esta pantalla —la escala del hover y el
  // seguimiento del cursor— son de escritorio y se apagan debajo de 1024.
  const hoverEnabled = !useIsBelowDesktop();
  const { t } = useLocale();
  const [deployed, setDeployed] = useState(false);
  // Hay vuelta cuando esta pestaña tiene anotado un proyecto abierto desde acá.
  const returning = useFunGalleryReturnOnMount() !== null;
  const [inkCoverage, setInkCoverage] = useState<Record<string, number>>({});
  const galleryItems = useMemo(() => toGalleryItems(images), [images]);
  const composition = useMemo(
    () => buildComposition(galleryItems, randomSeed),
    [galleryItems, randomSeed],
  );
  // Cada objeto se mide una sola vez: la cobertura es del asset, no del render.
  const handleInkMeasured = useCallback((id: string, coverage: number) => {
    setInkCoverage((measured) =>
      measured[id] === undefined ? { ...measured, [id]: coverage } : measured,
    );
  }, []);
  const pileStack = useMemo(
    () => buildPileStack(composition.items, inkCoverage, hoverEnabled),
    [composition.items, inkCoverage, hoverEnabled],
  );
  // Los dos repartos de mobile se calculan siempre y viajan como variables CSS:
  // el `@media` elige, no el cliente (ver el bloque LA GRILLA DE MOBILE).
  const mobileGrid = useMemo(
    () =>
      buildGridLayout(
        composition.items,
        MOBILE_COLUMNS,
        composition.maxItemSize,
      ),
    [composition.items, composition.maxItemSize],
  );
  const tabletGrid = useMemo(
    () =>
      buildGridLayout(
        composition.items,
        TABLET_COLUMNS,
        composition.maxItemSize,
      ),
    [composition.items, composition.maxItemSize],
  );
  /*
    El estado vive en el componente y `template.tsx` lo remonta en cada
    navegación: el montón se rearma solo, sin nada que recordar entre visitas.
    La única excepción es la vuelta desde un proyecto que se abrió DESDE acá,
    que sí deja anotación en la pestaña: esa visita nace desplegada.

    `instantSpread` separa las dos formas de estar desplegado. Al click el
    despliegue se anima, que es toda la gracia de la pantalla; en la vuelta y
    con `prefers-reduced-motion` los objetos nacen en su lugar. El flotado corre
    igual en los tres casos —lo apaga `reduceMotion` y nada más—, así que la
    galería de vuelta aparece quieta en su sitio pero ya derivando.
  */
  const spread = deployed || returning || reduceMotion;
  const instantSpread = returning || reduceMotion;

  return (
    <section
      className={`relative overflow-x-clip bg-off-white pb-20 text-off-black md:pb-32 ${CHROME_GUTTER}`}
      style={{ paddingTop: SECTION_PAD_TOP }}
      aria-label={t.gallery.sectionLabel}
    >
      <h1
        className={`text-center font-display uppercase tracking-normal ${TITLE_SCALE}`}
      >
        {t.gallery.title.map((line, index) => (
          // `key` por índice: el texto cambia con el idioma y las líneas son
          // siempre dos, garantizado por el tipo.
          <span key={index} className="block">
            {line}
          </span>
        ))}
      </h1>

      {/*
        La caja de la composición. En mobile es una **grilla real** de dos
        columnas (tres de `md` para arriba) y su alto lo dan las filas; de `lg`
        para arriba vuelve a ser el bloque de siempre, con su tope de ancho y su
        relación de aspecto. Las dos medidas de escritorio van como variables
        para que las clases sigan siendo literales.
      */}
      <div
        className="relative mx-auto grid w-full grid-cols-2 md:grid-cols-3 lg:block lg:aspect-[var(--d-aspect)] lg:max-w-[var(--d-max-width)]"
        style={
          {
            marginTop: TITLE_GAP,
            "--d-max-width": getCompositionMaxWidth(composition.maxItemSize),
            "--d-aspect": `1 / ${composition.aspect}`,
          } as React.CSSProperties
        }
      >
        {composition.items.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={index}
            aspect={composition.aspect}
            mobilePile={mobileGrid.pile[index]}
            tabletPile={tabletGrid.pile[index]}
            deployTurn={hoverEnabled ? item.deployOrder : index}
            spread={spread}
            instant={instantSpread}
            reduceMotion={reduceMotion}
            hoverEnabled={hoverEnabled}
            pileZIndex={pileStack?.[item.id]}
            onInkMeasured={handleInkMeasured}
          />
        ))}

        {/*
          El `AnimatePresence` entero desaparece cuando el despliegue es
          instantáneo. Sacar solo al botón lo dejaría despidiéndose con su fade
          de 0,4 s por encima de una galería que ya está desplegada: los hijos
          que salen se animan con los props del último render, y en ese render
          el fade todavía estaba puesto. Desmontando al `AnimatePresence` no hay
          quien retenga al botón y se va en el acto.
        */}
        {!instantSpread && (
          <AnimatePresence>
            {!spread && (
              <motion.button
                key="deploy"
                type="button"
                className="absolute inset-0 z-40 cursor-pointer"
                onClick={() => setDeployed(true)}
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: CAPTION_FADE_DURATION, ease: EASE }}
              >
                {/*
                  El cartel cuelga del montón, y el montón está en un lugar
                  distinto en cada reparto: su altura viaja como tres variables y
                  la elige el `@media`, igual que todo lo demás.
                */}
                <span
                  className="absolute left-1/2 top-[var(--a-cap)] -translate-x-1/2 whitespace-nowrap font-body text-[17px] leading-none text-off-black md:top-[var(--b-cap)] lg:top-[var(--c-cap)]"
                  style={
                    {
                      "--a-cap": mobileGrid.captionTop,
                      "--b-cap": tabletGrid.captionTop,
                      "--c-cap": `${(composition.captionY / composition.aspect) * 100}%`,
                    } as React.CSSProperties
                  }
                >
                  {t.gallery.hint}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}
