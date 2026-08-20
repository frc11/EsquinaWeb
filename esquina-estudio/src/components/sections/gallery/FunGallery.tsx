"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouteTransition } from "@/components/layout/RouteTransitionProvider";
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
        L3  cursor          x/y  → style con motion values (spring)
          L4  inclinación   rotate (constante) + opacity del fade de carga
            <Image object-contain />

  Ningún par de capas escribe la misma propiedad del mismo elemento: L1 y L3
  mueven x/y, pero cada una sobre un div distinto. La rotación va por dentro de
  las traslaciones para que éstas ocurran en el espacio de la página y no en el
  marco inclinado del objeto. (El flotado permanente entra como L2, entre el
  despliegue y el cursor.)

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
  aparenta llegar, y el rebote chico cae después. Con el desfase por índice el
  último objeto llega a los 0,85 + 7 × 0,07 = 1,34 s.
*/
const DEPLOY_VISUAL_DURATION = 0.85;
const DEPLOY_BOUNCE = 0.18;
const DEPLOY_STAGGER = 0.07;
const CAPTION_FADE_DURATION = 0.4;

// ── Reacción al cursor ───────────────────────────────────────────────────────

const ITEM_PARALLAX_MIN = 2;
const ITEM_PARALLAX_MAX = 3;
const ITEM_PARALLAX_STRENGTH_X = 40;
const ITEM_PARALLAX_STRENGTH_Y = 40;

const ITEM_PARALLAX_SPRING = {
  stiffness: 500,
  damping: 100,
  mass: 1.5,
};

const HOVER_SCALE = 1.2;
const HOVER_DURATION = 0.5;
const HOVER_Z_INDEX = 999;

const IMAGE_FADE_DURATION = 1.2;
const IMAGE_FADE_STAGGER = 0.3;
const IMAGE_FADE_STAGGER_BUCKET = 6;

const EAGER_IMAGE_COUNT = 6;
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const TITLE_LINES = ["HAVE FUN EXPLORING", "OUR PROJECTS!"] as const;

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
  parallaxFactor: number;
};

type Composition = {
  /** Alto de la composición dividido su ancho. */
  aspect: number;
  /** Alto del cartel «(click to view)», en fracción del ancho. */
  captionY: number;
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
 * El motor determinista de siempre —un LCG sembrado con el contenido alimenta
 * el shuffle de celdas y, por ítem, lado, dos jitters por eje, rotación, zIndex
 * y factor de reacción al cursor— pero resolviendo una página normal en vez de
 * un mapa sobredimensionado: la grilla ocupa el ancho disponible y el alto sale
 * de las filas que pida la cantidad de imágenes.
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
      parallaxFactor: randomBetween(
        random,
        ITEM_PARALLAX_MIN,
        ITEM_PARALLAX_MAX,
      ),
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

  return {
    aspect,
    captionY: pileCenterY + PILE_CAPTION_GAP,
    items: scattered.map((entry) => {
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
        parallaxFactor: entry.parallaxFactor,
      };
    }),
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
  const itemParallaxX = useTransform(
    pointerX,
    (value) => value * ITEM_PARALLAX_STRENGTH_X * item.parallaxFactor,
  );
  const itemParallaxY = useTransform(
    pointerY,
    (value) => value * ITEM_PARALLAX_STRENGTH_Y * item.parallaxFactor,
  );
  // Mientras están amontonados los objetos no son interactivos: el click que
  // despliega lo recibe el botón que los cubre, así que nunca compite con el
  // click que navega a un proyecto.
  const interactive = spread && Boolean(item.href);

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
                delay: spread ? index * DEPLOY_STAGGER : 0,
              }
        }
      >
        {/* L3 — reacción al cursor. */}
        <motion.div
          className="h-full w-full transform-gpu will-change-transform"
          style={{ x: itemParallaxX, y: itemParallaxY }}
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
  );
}

export default function FunGallery({
  images,
  randomSeed,
}: {
  images: FunGalleryImage[];
  randomSeed: string;
}) {
  // `useReducedMotion` devuelve `null` hasta que resuelve la media query.
  const reduceMotion = useReducedMotion() === true;
  const [deployed, setDeployed] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springPointerX = useSpring(pointerX, ITEM_PARALLAX_SPRING);
  const springPointerY = useSpring(pointerY, ITEM_PARALLAX_SPRING);
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
  }, [pointerX, pointerY]);

  return (
    <section
      className="relative overflow-x-clip bg-off-white px-12 pb-32 pt-[72px] text-off-black lg:px-16"
      aria-label="Fun Gallery"
    >
      <h1 className="text-center font-display text-[40px] uppercase leading-[48px] tracking-normal">
        {TITLE_LINES.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>

      <div
        className="relative mx-auto mt-10 w-full"
        style={{
          maxWidth: COMPOSITION_MAX_WIDTH,
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
            pointerX={springPointerX}
            pointerY={springPointerY}
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
