"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRouteTransition } from "@/components/layout/RouteTransitionProvider";
import { urlFor } from "@/lib/sanity";
import { FunGalleryImage } from "@/types/fun-gallery-image";

const MAP_WIDTH_FEW_IMAGES = 2550;
const MAP_HEIGHT_FEW_IMAGES = 1450;

const MAP_WIDTH_MANY_IMAGES = 3100;
const MAP_HEIGHT_MANY_IMAGES = 1750;

const MAP_SIZE_PER_IMAGE = 20;

const MAP_MOVE_X = 900;
const MAP_MOVE_Y = 700;
const MAP_EDGE_GUTTER = 24;

const GRID_CELL_DENSITY = 1.15;

const ITEM_PARALLAX_MIN = 2;
const ITEM_PARALLAX_MAX = 3;
const ITEM_PARALLAX_STRENGTH_X = 40;
const ITEM_PARALLAX_STRENGTH_Y = 40;

const SPRING_STIFFNESS = 500;
const SPRING_DAMPING = 100;
const SPRING_MASS = 1;
const SPRING = {
  stiffness: SPRING_STIFFNESS,
  damping: SPRING_DAMPING,
  mass: SPRING_MASS,
};

const ITEM_PARALLAX_SPRING = {
  stiffness: 500,
  damping: 100,
  mass: 1.5,
};

const MIN_IMAGE_WIDTH_FEW_IMAGES = 380;
const MAX_IMAGE_WIDTH_FEW_IMAGES = 680;

const MIN_IMAGE_WIDTH_MANY_IMAGES = 320;
const MAX_IMAGE_WIDTH_MANY_IMAGES = 560;

const ROTATION_RANGE = 0;
const EDGE_BLEED = -180;

const IMAGE_FADE_DURATION = 1.2;
const IMAGE_FADE_STAGGER = 0.3;
const IMAGE_FADE_STAGGER_BUCKET = 6;

const HOVER_SCALE = 1.2;
const HOVER_DURATION = 0.5;
const HOVER_Z_INDEX = 999;

const EAGER_IMAGE_COUNT = 6;
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

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

type MapItem = GalleryItem & {
  x: number;
  y: number;
  width: number;
  height: number;
  rotate: number;
  zIndex: number;
  parallaxFactor: number;
};

type MapLayout = {
  width: number;
  height: number;
  items: MapItem[];
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

function buildMapLayout(items: GalleryItem[], randomSeed: string): MapLayout {
  const count = Math.max(items.length, 1);
  const density = clamp((count - 6) / 18, 0, 1);
  const width =
    lerp(MAP_WIDTH_FEW_IMAGES, MAP_WIDTH_MANY_IMAGES, density) +
    count * MAP_SIZE_PER_IMAGE;
  const height =
    lerp(MAP_HEIGHT_FEW_IMAGES, MAP_HEIGHT_MANY_IMAGES, density) +
    count * MAP_SIZE_PER_IMAGE * 0.58;
  const minImageWidth = lerp(
    MIN_IMAGE_WIDTH_FEW_IMAGES,
    MIN_IMAGE_WIDTH_MANY_IMAGES,
    density,
  );
  const maxImageWidth = lerp(
    MAX_IMAGE_WIDTH_FEW_IMAGES,
    MAX_IMAGE_WIDTH_MANY_IMAGES,
    density,
  );
  const random = createRandom(randomSeed);
  const columns = Math.ceil(Math.sqrt(count * GRID_CELL_DENSITY));
  const rows = Math.ceil(count / columns);
  const cellWidth = width / columns;
  const cellHeight = height / rows;
  const cells = shuffle(
    Array.from({ length: columns * rows }).map((_, index) => index),
    random,
  );

  return {
    width,
    height,
    items: items.map((item, index) => {
      const cell = cells[index] ?? index;
      const column = cell % columns;
      const row = Math.floor(cell / columns);
      const itemWidth = randomBetween(random, minImageWidth, maxImageWidth);
      const itemHeight = itemWidth * randomBetween(random, 0.68, 1.16);
      const x =
        column * cellWidth +
        randomBetween(random, 0.25, 0.75) * cellWidth -
        itemWidth / 2 +
        randomBetween(random, -cellWidth * 0.18, cellWidth * 0.18);
      const y =
        row * cellHeight +
        randomBetween(random, 0.25, 0.75) * cellHeight -
        itemHeight / 2 +
        randomBetween(random, -cellHeight * 0.18, cellHeight * 0.18);

      return {
        ...item,
        x: clamp(x, -EDGE_BLEED, width - itemWidth + EDGE_BLEED),
        y: clamp(y, -EDGE_BLEED, height - itemHeight + EDGE_BLEED),
        width: itemWidth,
        height: itemHeight,
        rotate: randomBetween(random, -ROTATION_RANGE, ROTATION_RANGE),
        zIndex: 10 + Math.round(random() * 24),
        parallaxFactor: randomBetween(
          random,
          ITEM_PARALLAX_MIN,
          ITEM_PARALLAX_MAX,
        ),
      };
    }),
  };
}

function GalleryCard({
  item,
  index,
  pointerX,
  pointerY,
}: {
  item: MapItem;
  index: number;
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

  const content = (
    <motion.div
      className="relative h-full w-full"
      initial={false}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{
        duration: IMAGE_FADE_DURATION,
        delay: (index % IMAGE_FADE_STAGGER_BUCKET) * IMAGE_FADE_STAGGER,
        ease: EASE,
      }}
    >
      {/*
        Overscan y encuadre, derivados del desplazamiento máximo del parallax
        (`ITEM_PARALLAX_STRENGTH * ITEM_PARALLAX_MAX` = 120 px por eje, sin
        overshoot porque los dos springs son sobreamortiguados).

        Con `object-cover` el overscan negativo tenía sentido: agrandaba la caja
        para que al desplazarse no quedara hueco. Con `object-contain` se
        invierte, porque `contain` escala la imagen *a la caja*: agrandar la
        caja agranda el dibujo y lo recorta contra la tarjeta. Medido sobre los
        ocho recortes reales, el `-inset-[8%]` de antes dejaba apenas 1–2 px de
        aire; para garantizar cero recorte a 120 px de desplazamiento haría
        falta un inset *positivo* de 85–120 px, más que el lado corto de las
        tarjetas chicas. No hay constante que lo resuelva.

        La caja pasa entonces a medir exactamente la tarjeta —el único tamaño
        con el que `contain` dibuja la imagen al tamaño previsto— y se le quita
        el recorte a la capa de fade: son recortes sobre transparencia, no hay
        borde de tarjeta visible que respetar, así que la imagen puede salirse
        sin que se vea el límite. El viewport la sigue recortando (`<main>` y
        `<section>` son `overflow-hidden`).
      */}
      <motion.div
        className="absolute inset-0 transform-gpu will-change-transform"
        style={{ x: itemParallaxX, y: itemParallaxY }}
      >
        <Image
          src={item.imageUrl}
          alt={item.alt}
          fill
          sizes="(max-width: 768px) 78vw, 26vw"
          priority={index < EAGER_IMAGE_COUNT}
          onLoadingComplete={() => setIsLoaded(true)}
          className="object-contain"
        />
      </motion.div>
    </motion.div>
  );

  return (
    <motion.div
      className={`absolute transform-gpu will-change-transform ${
        item.href ? "cursor-pointer" : ""
      }`}
      style={{
        left: item.x,
        top: item.y,
        width: item.width,
        height: item.height,
        rotate: item.rotate,
        zIndex: item.zIndex,
      }}
      whileHover={{ scale: HOVER_SCALE, zIndex: HOVER_Z_INDEX }}
      transition={{ duration: HOVER_DURATION, ease: EASE }}
      role={item.href ? "link" : undefined}
      tabIndex={item.href ? 0 : undefined}
      aria-label={item.href ? `View ${item.title}` : undefined}
      // Sin proyecto vinculado el ítem no es interactivo: tampoco se le cuelgan
      // los handlers. Antes se colgaban siempre y salían por un early return.
      onClick={item.href ? handleNavigate : undefined}
      onKeyDown={item.href ? handleKeyDown : undefined}
    >
      {content}
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const springPointerX = useSpring(pointerX, ITEM_PARALLAX_SPRING);
  const springPointerY = useSpring(pointerY, ITEM_PARALLAX_SPRING);
  const galleryItems = useMemo(() => toGalleryItems(images), [images]);
  const mapLayout = useMemo(
    () => buildMapLayout(galleryItems, randomSeed),
    [galleryItems, randomSeed],
  );

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const viewportWidth = window.innerWidth || 1;
      const viewportHeight = window.innerHeight || 1;
      const normalizedX = clamp(
        (event.clientX / viewportWidth - 0.5) * 2,
        -1,
        1,
      );
      const normalizedY = clamp(
        (event.clientY / viewportHeight - 0.5) * 2,
        -1,
        1,
      );
      const maxX = Math.max(
        0,
        (mapLayout.width - viewportWidth) / 2 - MAP_EDGE_GUTTER,
      );
      const maxY = Math.max(
        0,
        (mapLayout.height - viewportHeight) / 2 - MAP_EDGE_GUTTER,
      );
      const moveX = Math.min(MAP_MOVE_X, maxX);
      const moveY = Math.min(MAP_MOVE_Y, maxY);

      pointerX.set(normalizedX);
      pointerY.set(normalizedY);
      x.set(-normalizedX * moveX);
      y.set(-normalizedY * moveY);
    };

    const resetMapPosition = () => {
      pointerX.set(0);
      pointerY.set(0);
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("blur", resetMapPosition);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", resetMapPosition);
    };
  }, [mapLayout.height, mapLayout.width, pointerX, pointerY, x, y]);

  return (
    <main className="fixed inset-0 h-[100svh] w-screen overflow-hidden overscroll-none bg-off-white text-off-black">
      <section
        className="relative h-full w-full overflow-hidden bg-off-white"
        aria-label="Fun Gallery"
      >
        <motion.div
          className="absolute left-1/2 top-1/2 transform-gpu will-change-transform"
          style={{
            width: mapLayout.width,
            height: mapLayout.height,
            x: springX,
            y: springY,
            marginLeft: -mapLayout.width / 2,
            marginTop: -mapLayout.height / 2,
          }}
        >
          {mapLayout.items.map((item, index) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={index}
              pointerX={springPointerX}
              pointerY={springPointerY}
            />
          ))}
        </motion.div>
      </section>
    </main>
  );
}
