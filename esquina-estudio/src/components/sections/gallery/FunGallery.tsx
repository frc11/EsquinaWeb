"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  usePrefersReducedMotion,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";
import { urlFor } from "@/lib/sanity";
import { FunGalleryImage } from "@/types/fun-gallery-image";

/*
  ARQUITECTURA DE CAPAS
  ─────────────────────
  Sobre cada objeto conviven varios movimientos y casi todos mueven x/y. En
  Framer Motion un `animate` con keyframes y un motion value con spring no
  pueden compartir propiedad —se pisan—, así que cada movimiento vive en su
  propio elemento y el navegador compone las matrices al bajar por el árbol:

    L0  posición + hover   left/top/width (CSS) · scale (whileHover) · zIndex
      L1  despliegue        x/y  → animate, una sola vez, al click
        L2  flotado         x/y  → animate con keyframes, loop infinito
          L3  seguimiento   x/y  → style con motion values (spring)
            L4  inclinación rotate (constante) + opacity del fade de carga
              <Image object-contain />

  Ningún par de capas escribe la misma propiedad del mismo elemento: L1, L2 y
  L3 mueven x/y, pero cada una sobre un div distinto. La rotación va por dentro
  de las tres traslaciones para que éstas ocurran en el espacio de la página y
  no en el marco inclinado del objeto.

  UNIDADES
  ────────
  Todo el layout se expresa en fracciones del ANCHO de la composición. El
  contenedor no se mide en JS: `left`, `top` y `width` salen en porcentaje y el
  alto lo fija un `aspect-ratio`, así que la composición escala con la página,
  sobrevive al resize sin listeners y es idéntica en servidor y cliente.
*/

// ── Composición ──────────────────────────────────────────────────────────────

/**
 * Tope de ancho de la composición. A 1920 deja 128 px de margen a cada lado,
 * que es la caja medida en `docs/mockups/15-fun-gallery-hover.jpg`; por debajo
 * manda el gutter de la sección y por encima el bloque deja de crecer, para que
 * en pantallas muy anchas los objetos no se vuelvan gigantes.
 */
const COMPOSITION_MAX_WIDTH = 1664;

/*
  ENCUADRE — la escena entera se resuelve en la primera pantalla.

  El alto de la composición no se elige: sale de `ancho × aspecto`. Así que lo
  que se ajusta es el ANCHO y el alto lo sigue. El ancho que entra se despeja
  del espacio que queda debajo del título:

    disponible = 100svh − header − padding del bloque − título − aire del título
    ancho × aspecto + desborde ≤ disponible

  El desborde son los píxeles que el objeto más bajo se sale de la caja de la
  composición —sus cajas tocan el borde por construcción—: el flotado, que son
  16 px fijos, más la mitad de lo que crece el hover, que es el 4 % del lado del
  objeto mayor y sí escala con el ancho. Ese término que escala pasa al divisor
  y el ancho queda despejado en una sola cuenta:

    ancho = (disponible − 16) / (aspecto + ladoMayor × 0,04)

  El seguimiento del cursor queda afuera del cálculo a propósito: es transitorio
  y simétrico —arriba y abajo—, y los assets tienen entre 6 y 12 % de alto
  transparente de cada lado, más que suficiente para absorberlo.

  Todo se expresa en CSS —`min()`, `max()` y `calc()` sobre `100svh`— y no
  midiendo en JS: la composición se sigue armando igual en el servidor y en el
  cliente, y sigue reaccionando al resize sin listeners.
*/

/** Interlineado del título. Es el `line-height` real del `<h1>`. */
const TITLE_LINE_HEIGHT = 48;

/*
  Padding del bloque y aire entre el título y la composición: ceden alto en
  pantallas bajas, donde cada píxel decide si la escena entra, y se quedan en el
  valor de siempre —72 px y 40 px— en cuanto la pantalla da para tenerlo. A 1080
  el padding queda en 70 px y el aire en los 40 completos.

  El aire del título es además el margen de arriba: el objeto más alto se sale
  de la caja lo mismo que el más bajo se sale por abajo. A 1080 ese desborde es
  de 30 px contra 40 px de aire, y a 768 de 25 px contra 28: entra por los dos
  lados.
*/
const SECTION_PAD_TOP = "clamp(32px, 6.5svh, 72px)";
const TITLE_GAP = "clamp(24px, 3.7svh, 40px)";

/**
 * Piso del encuadre, en fracción del ancho disponible. Con más imágenes el
 * aspecto crece y meter todo en una pantalla dejaría objetos ilegibles: a
 * partir de acá la composición deja de achicarse, los que sobran quedan más
 * abajo y se alcanzan scrolleando. Con ocho imágenes no llega a tocar —a
 * 1920×1080 la composición pide el 78 % del ancho disponible y a 1366×768 el
 * 70 %—, así que la escena entra completa en las dos.
 */
const COMPOSITION_MIN_WIDTH_SHARE = 0.6;

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
 * ancho de la composición, que son los 288–404 px medidos en el mockup.
 */
const MIN_ITEM_WIDTH_FEW_IMAGES = 0.19;
const MAX_ITEM_WIDTH_FEW_IMAGES = 0.26;
const MIN_ITEM_WIDTH_MANY_IMAGES = 0.14;
const MAX_ITEM_WIDTH_MANY_IMAGES = 0.2;

/** Inclinación en grados: cada objeto queda entre -3 y +3, apenas fuera de plomo. */
const ROTATION_RANGE = 3;

// ── Montón ───────────────────────────────────────────────────────────────────

/*
  Las ocho imágenes son cuadrados de 2250×2250 con el producto recortado
  adentro, y ese recorte ocupa 76–88 % del alto pero solo 31–84 % del ancho
  (medido sobre el alfa de los ocho assets). Apilados concéntricos, los anchos
  taparían a los angostos y el montón se leería como un choque, así que cada
  objeto sale del centro en abanico: el ángulo avanza con el ángulo áureo —que
  reparte direcciones parejas para cualquier cantidad de imágenes— y el radio
  lo dicta el zIndex, de modo que el objeto de adelante queda centrado y los de
  atrás se corren lo suficiente para asomar.
*/
const PILE_CENTER_X = 0.5;
const PILE_CENTER_Y = 0.17;
const PILE_RADIUS_MIN = 0.02;
const PILE_RADIUS_MAX = 0.05;
const PILE_GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const PILE_ANGLE_JITTER = 0.45;

/** Distancia del cartel «(click to view)» al centro del montón, en fracción del ancho. */
const PILE_CAPTION_GAP = 0.18;

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
  El objeto ACOMPAÑA al cursor. En `ServicesIntro` (`:151-191`) las imágenes se
  apartan de él; acá el signo va al derecho: el cursor a la derecha del centro
  corre los objetos a la derecha. Se reusa su spring —sobreamortiguado, ζ = 1,5,
  no hay rebote, solo arrastre.

  La amplitud es `FOLLOW_STRENGTH × factor` con el cursor en el borde del
  viewport, y el factor sorteado por objeto (2 a 3) es lo que hace que no se
  muevan todos igual. Estaba en 6–9 px y era imperceptible: contra los 11/16 px
  del flotado, el seguimiento quedaba escondido debajo de la deriva. Ahora
  llega a 20–30 px, que es 1,3 a 1,9 veces el flotado vertical: se nota que los
  objetos acompañan al cursor y sigue siendo del mismo orden que la deriva, así
  que ninguno de los dos se come al otro. Y son 20–30 px solo con el cursor
  pegado al borde: en el grueso de la pantalla el desplazamiento es bastante
  menor, porque el motion value es la posición normalizada del cursor.
*/
const FOLLOW_MIN = 2;
const FOLLOW_MAX = 3;
const FOLLOW_STRENGTH = 10;
const FOLLOW_SPRING = { stiffness: 50, damping: 15, mass: 0.5 };

// ── Hover ────────────────────────────────────────────────────────────────────

/*
  1,2 agrandaba el objeto 80 px y competía con el despliegue; 1,08 son 32 px
  sobre una tarjeta de 400 px, que es «un poco». El zIndex de hover pasa de 999
  a 50 porque ahora la página scrollea: 999 dejaba al objeto por encima del
  Navbar (z-100) al pasarle por debajo.
*/
const HOVER_SCALE = 1.08;
const HOVER_DURATION = 0.5;
const HOVER_Z_INDEX = 50;

const IMAGE_FADE_DURATION = 1.2;
const IMAGE_FADE_STAGGER = 0.3;
const IMAGE_FADE_STAGGER_BUCKET = 6;

const EAGER_IMAGE_COUNT = 6;
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const TITLE_LINES = ["HAVE FUN EXPLORING", "OUR PROJECTS!"] as const;

/**
 * Tope de ancho de la composición, resuelto por CSS. Los tres términos del
 * `min`/`max` son, en orden: el tope de siempre, el piso del encuadre y el
 * ancho que entra en la pantalla. Ver el bloque ENCUADRE.
 */
function getCompositionMaxWidth(aspect: number, maxItemSize: number) {
  const hoverOverflowShare = (maxItemSize * (HOVER_SCALE - 1)) / 2;
  const titleBlock = TITLE_LINES.length * TITLE_LINE_HEIGHT;
  const available = `100svh - var(--header-height) - ${SECTION_PAD_TOP} - ${titleBlock}px - ${TITLE_GAP} - ${FLOAT_Y}px`;
  const fitted = `calc((${available}) / ${aspect + hoverOverflowShare})`;

  return `min(${COMPOSITION_MAX_WIDTH}px, max(${COMPOSITION_MIN_WIDTH_SHARE * 100}%, ${fitted}))`;
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
      zIndex: 10 + Math.round(random() * 24),
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
      clamp((entry.zIndex - 10) / 24, 0, 1),
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

function GalleryCard({
  item,
  index,
  aspect,
  spread,
  reduceMotion,
  pointerX,
  pointerY,
}: {
  item: LayoutItem;
  index: number;
  aspect: number;
  spread: boolean;
  reduceMotion: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}) {
  const { navigateWithTransition } = useRouteTransition();
  const [isLoaded, setIsLoaded] = useState(false);
  const followX = useTransform(
    pointerX,
    (value) => value * FOLLOW_STRENGTH * item.followFactor,
  );
  const followY = useTransform(
    pointerY,
    (value) => value * FOLLOW_STRENGTH * item.followFactor,
  );
  // Mientras están amontonados los objetos no son interactivos: el click que
  // despliega lo recibe el botón que los cubre, así que nunca compite con el
  // click que navega a un proyecto.
  const interactive = spread && Boolean(item.href);
  // Media vuelta de fase entre pares e impares: con ocho períodos distintos por
  // eje alcanza para que no arranquen todos en el mismo sentido.
  const driftX = index % 2 === 0 ? FLOAT_X : -FLOAT_X;

  const handleNavigate = () => {
    if (!item.href) return;
    navigateWithTransition(item.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!item.href) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    handleNavigate();
  };

  return (
    <motion.div
      className={`absolute ${interactive ? "cursor-pointer" : ""}`}
      style={{
        left: `${item.x * 100}%`,
        // `top` se mide contra el alto de la composición y las coordenadas
        // están en unidades de ancho: de ahí la división por el aspecto.
        top: `${(item.y / aspect) * 100}%`,
        width: `${item.size * 100}%`,
        aspectRatio: "1",
        zIndex: item.zIndex,
      }}
      whileHover={{ scale: HOVER_SCALE, zIndex: HOVER_Z_INDEX }}
      transition={{
        duration: HOVER_DURATION,
        ease: EASE,
        zIndex: { duration: 0 },
      }}
      role={interactive ? "link" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `View ${item.title}` : undefined}
      // Sin proyecto vinculado el ítem no es interactivo: tampoco se le cuelgan
      // los handlers. Antes se colgaban siempre y salían por un early return.
      onClick={interactive ? handleNavigate : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
    >
      {/* L1 — despliegue: corre una sola vez, del montón a su lugar. */}
      <motion.div
        className="h-full w-full"
        initial={false}
        animate={{
          x: spread ? "0%" : `${item.pileOffsetX}%`,
          y: spread ? "0%" : `${item.pileOffsetY}%`,
        }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                type: "spring",
                visualDuration: DEPLOY_VISUAL_DURATION,
                bounce: DEPLOY_BOUNCE,
                delay: spread ? item.deployOrder * DEPLOY_STAGGER : 0,
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
          {/* L3 — seguimiento del cursor. */}
          <motion.div
            className="h-full w-full"
            style={{ x: followX, y: followY }}
          >
            {/*
              L4 — inclinación constante y fade de carga. `rotate` es un valor
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
                sizes="(max-width: 768px) 30vw, 22vw"
                priority={index < EAGER_IMAGE_COUNT}
                onLoadingComplete={() => setIsLoaded(true)}
                className="object-contain"
              />
            </motion.div>
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
  const [deployed, setDeployed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const followPointerX = useSpring(pointerX, FOLLOW_SPRING);
  const followPointerY = useSpring(pointerY, FOLLOW_SPRING);
  const galleryItems = useMemo(() => toGalleryItems(images), [images]);
  const composition = useMemo(
    () => buildComposition(galleryItems, randomSeed),
    [galleryItems, randomSeed],
  );
  // El estado vive en el componente y `template.tsx` lo remonta en cada
  // navegación: el montón se rearma solo, sin nada que recordar entre visitas.
  // Con `prefers-reduced-motion` no hay montón: la pantalla nace acomodada.
  const spread = deployed || reduceMotion;

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;

      pointerX.set(clamp((event.clientX / viewportWidth - 0.5) * 2, -1, 1));
      pointerY.set(clamp((event.clientY / viewportHeight - 0.5) * 2, -1, 1));
    };

    const resetPointer = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", resetPointer);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetPointer);
    };
  }, [pointerX, pointerY, reduceMotion]);

  return (
    <section
      className="relative overflow-x-clip bg-off-white px-12 pb-32 text-off-black lg:px-16"
      style={{ paddingTop: SECTION_PAD_TOP }}
      aria-label="Fun Gallery"
    >
      {/*
        El interlineado va inline y no en una clase: el encuadre necesita saber
        cuánto mide el bloque del título, y con dos fuentes de verdad el día que
        alguien toque una la cuenta queda mal sin que nada avise.
      */}
      <h1
        className="text-center font-display text-[40px] uppercase tracking-normal"
        style={{ lineHeight: `${TITLE_LINE_HEIGHT}px` }}
      >
        {TITLE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div
        className="relative mx-auto w-full"
        style={{
          marginTop: TITLE_GAP,
          maxWidth: getCompositionMaxWidth(
            composition.aspect,
            composition.maxItemSize,
          ),
          aspectRatio: `1 / ${composition.aspect}`,
        }}
      >
        {composition.items.map((item, index) => (
          <GalleryCard
            key={item.id}
            item={item}
            index={index}
            aspect={composition.aspect}
            spread={spread}
            reduceMotion={reduceMotion}
            pointerX={followPointerX}
            pointerY={followPointerY}
          />
        ))}

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
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-[17px] leading-none text-off-black"
                style={{
                  top: `${(composition.captionY / composition.aspect) * 100}%`,
                }}
              >
                (click to view)
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
