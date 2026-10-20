"use client";

import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useLocale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity";
import type { SanityImageLike } from "@/types/project";
import ImageLoadIndicator, {
  useImageLoad,
} from "@/components/ui/ImageLoadIndicator";

/* ── El hueco real de cada imagen (R4) ──────────────────────── */
/*
  `sizes` describe el ancho que ocupa la imagen PINTADA, no el de su caja. Con
  `object-cover`, una foto más apaisada que la caja se escala hasta llenar el
  alto y desborda a los costados: lo que hay que pedir es ese ancho escalado.
  Hasta R4 la foto sola declaraba 800 px para una caja de 1488 a 1920, y el
  navegador pedía la variante chica y la estiraba.

  La geometría es la de `ProjectDetailClient`: debajo de 768 la columna mide
  `100vw − 48` (`px-6` por lado); de 768 para arriba le restan los dos gutters
  de 48 (`px-12`), el aside de 240 y el gap de 96 → `100vw − 432`. Si esas
  clases cambian, estos números cambian. La fila es `aspect-[4/3]` con tope de
  `88svh`, y el par la parte en dos con 2 px de aire.

  El alto del viewport entra en la cuenta —una fila topada por `88svh` es más
  apaisada, y la foto apaisada desborda menos—, y `sizes` lo puede expresar:
  admite `vh`, `min()` y `max()` (verificado en Chrome). Se escribe en `vh` y no
  en `svh`: en un teléfono `vh` es el mayor de los dos, o sea que se equivoca
  pidiendo de más. Un navegador que no entienda la expresión cae a `100vw`,
  que también es pedir de más: nunca estirar.

  Los términos van dentro de `calc()`/`max()` también por la nota de `sizes` de
  `src/lib/mobile-layout.ts`: un `vw` suelto le borra a `next/image` los cortes
  chicos del `srcset`.
*/
type MediaSlot = "single" | "half";

const MOBILE_QUERY = "(max-width: 767.98px)";
const ROW_INSET = { mobile: 48, desktop: 432 } as const;
const PAIR_GAP = 2;
const ROW_HEIGHT_RATIO = 3 / 4;
const ROW_MAX_VH = 88;
// La proporción más angosta que puede tener la caja (la fila sin topar por
// alto). Una imagen igual o más angosta la llena a lo ancho y no desborda.
const SLOT_MIN_ASPECT: Record<MediaSlot, number> = { single: 4 / 3, half: 2 / 3 };

// El `_ref` de un asset de Sanity lleva las dimensiones del original:
// `image-<hash>-2400x1800-png`. Sin `_ref` (contenido de respaldo) no se sabe.
const ASSET_REF_RE = /^image-[a-f0-9]+-(\d+)x(\d+)-[a-z]+$/;

interface AssetDimensions {
  width: number;
  height: number;
}

function assetDimensions(
  image: SanityImageLike | undefined,
): AssetDimensions | null {
  const ref = image?.asset?._ref ?? image?.asset?._id;
  const match = ref ? ASSET_REF_RE.exec(ref) : null;
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

function assetAspect(image: SanityImageLike | undefined): number | null {
  const dimensions = assetDimensions(image);
  return dimensions ? dimensions.width / dimensions.height : null;
}

/*
  El tope que se le pide a Sanity (R4). Es lo que viaja al optimizador de
  `next/image`, así que es el techo de todo lo que puede llegar a pantalla:
  hasta R4 era 1200 la foto sola y 800 cada mitad del par, contra un hueco de
  1488 × 2 = 2976 px a 1920 en Retina.

  La cuenta: el peor caso de la vara es un viewport de **1920 de ancho a DPR 2**.
  Ahí la fila mide 1920 − 432 = **1488** y, con cualquier alto de ventana, como
  mucho 3/4 de eso = **1116** de alto (el tope de `88svh` solo puede bajarlo).
  El ancho pintado es el mayor entre el del hueco —1488 sola, 743 cada mitad— y
  la proporción del original por ese alto. Por 2:
    · foto sola 4:3 o más angosta → 2976
    · foto sola 2:1               → 4464, que el techo de abajo deja en 3840
    · mitad del par 2:3           → 1488
    · mitad del par 4:5           → 1786
  Tomar el alto máximo estructural (1116) y no el de una ventana de 1080 (950)
  es el margen: cubre cualquier monitor de 1920 por alto que sea.

  Dos techos más, los dos medidos:
    · **3840**, el `deviceSizes` más grande de `next/image`: el optimizador nunca
      sirve más, así que pedirle más a Sanity es viaje que se tira.
    · **el ancho del original.** Sanity agranda sin avisar: `w=2976` sobre un
      original de 2400 devuelve 2976 px interpolados —y `w=8000`, 8000×6000 y
      53 MB—. Agrandar no agrega detalle y engorda el viaje.

  Ni el tope ni el formato cambian lo que pesa la página: eso lo decide el
  optimizador, que recodifica al ancho que pidió el navegador. Por eso el
  formato del viaje no se toca: convertir los PNG a JPG o WebP en Sanity lo
  aliviana 3 a 4 veces pero le cuesta 1,1 dB de PSNR a la salida final (Sanity
  submuestrea el color aun a q=100).

  Lo que sí se toca es la calidad del viaje en los JPG: al redimensionar,
  Sanity los recodifica a **q=75** por defecto, y el optimizador los vuelve a
  comprimir encima. Con **q=90** la salida final gana 0,84 dB y pesa *menos*
  (79,4 contra 81,0 kB en la foto de prueba: hay menos artefactos que
  codificar); q=100 solo suma 0,18 dB más y cuadruplica el viaje. En PNG el
  parámetro no hace nada.
*/
const WORST_VIEWPORT_WIDTH = 1920;
const WORST_DPR = 2;
const OPTIMIZER_MAX_WIDTH = 3840;
const SANITY_JPEG_QUALITY = 90;

function sanityWidth(slot: MediaSlot, image: SanityImageLike | undefined): number {
  const dimensions = assetDimensions(image);
  const rowWidth = WORST_VIEWPORT_WIDTH - ROW_INSET.desktop;
  const slotWidth = slot === "single" ? rowWidth : (rowWidth - PAIR_GAP) / 2;
  const aspect = dimensions
    ? dimensions.width / dimensions.height
    : SLOT_MIN_ASPECT[slot];
  const needed = Math.ceil(
    Math.max(slotWidth, aspect * rowWidth * ROW_HEIGHT_RATIO) * WORST_DPR,
  );
  return Math.min(needed, OPTIMIZER_MAX_WIDTH, dimensions?.width ?? needed);
}

function projectImageUrl(
  slot: MediaSlot,
  image: SanityImageLike | undefined,
): string {
  return urlFor(image)
    .width(sanityWidth(slot, image))
    .quality(SANITY_JPEG_QUALITY)
    .url();
}

// El GIF va como `<img>` nativo y no pasa por el optimizador (así conserva la
// animación): su tope es peso directo para el visitante. R4 no lo sube.
const GIF_WIDTH = 1200;

function coverWidth(slot: MediaSlot, inset: number, aspect: number): string {
  const slotWidth =
    slot === "single" ? `100vw - ${inset}px` : `50vw - ${(inset + PAIR_GAP) / 2}px`;
  if (aspect <= SLOT_MIN_ASPECT[slot]) return `calc(${slotWidth})`;
  // Desborda: el ancho pintado es la proporción por el alto de la fila, que es
  // el menor entre 3/4 del ancho y el tope de 88vh.
  const k = (n: number) => Number(n.toFixed(4));
  return `max(${slotWidth}, min((100vw - ${inset}px) * ${k(ROW_HEIGHT_RATIO * aspect)}, ${ROW_MAX_VH}vh * ${k(aspect)}))`;
}

/** Sin proporción conocida se asume la de la caja: no desborda. */
function mediaSizes(slot: MediaSlot, aspect: number | null): string {
  const a = aspect ?? SLOT_MIN_ASPECT[slot];
  return `${MOBILE_QUERY} ${coverWidth(slot, ROW_INSET.mobile, a)}, ${coverWidth(slot, ROW_INSET.desktop, a)}`;
}

/* ── Portable Text overrides ────────────────────────────────── */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-10 font-body text-[20px] leading-[1.3] text-off-black md:mb-16 md:text-[30px]">
        {children}
      </p>
    ),
  },
};

/* ── Single media block (image, gif, or video) ──────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SingleMedia({ block }: { block: any }) {
  const { t } = useLocale();
  // Antes de cualquier retorno temprano: este bloque sale por video, por
  // GIF o por imagen, y un hook no puede quedar detrás de una rama.
  const single = useImageLoad();
  const { file, video, caption } = block;

  // Video URL (Vimeo / YouTube / direct .mp4)
  if (video) {
    const isEmbed = video.includes("vimeo") || video.includes("youtube");

    if (isEmbed) {
      return (
        <figure className="w-full mb-[2px] relative bg-gray-brand/10">
          <div className="relative w-full aspect-video overflow-hidden">
            <iframe
              src={video}
              title={caption || t.work.videoTitle}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-[13px] text-gray-brand font-body">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    // Direct .mp4 file
    return (
      <figure className="w-full mb-[2px] relative bg-gray-brand/10">
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-h-[88svh] object-contain"
        />
        {caption && (
          <figcaption className="mt-2 text-[13px] text-gray-brand font-body">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  // Image / GIF
  if (file) {
    const gifUrl = urlFor(file).width(GIF_WIDTH).url();
    if (!gifUrl) return null;

    // Check if it's a GIF — use native <img> to preserve animation
    const isGif =
      gifUrl.includes(".gif") ||
      (file?.asset?._ref && file.asset._ref.includes("-gif"));

    if (isGif) {
      return (
        <figure className="w-full mb-[2px]">
          <div className="relative w-full aspect-[4/3] max-h-[88svh] mx-auto overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl}
              alt={caption || t.work.mediaAlt}
              className="h-full w-full object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-[13px] text-gray-brand font-body">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    const imageUrl = projectImageUrl("single", file);

    return (
      <figure className="w-full mb-[2px]">
        <div className="relative w-full aspect-[4/3] max-h-[88svh] mx-auto overflow-hidden text-off-black">
          <Image
            src={imageUrl}
            alt={caption || t.work.mediaAlt}
            fill
            sizes={mediaSizes("single", assetAspect(file))}
            className="object-cover"
            onLoad={single.onLoad}
            onError={single.onError}
          />
          <ImageLoadIndicator show={single.showIndicator} />
        </div>
        {caption && (
          <figcaption className="mt-2 text-[13px] text-gray-brand font-body">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}

/* ── Dual media block (two images side by side, single-height) ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DualMedia({ block }: { block: any }) {
  const { t } = useLocale();
  // Uno por imagen: las dos del par cargan por su cuenta y cada anillo se
  // retira cuando llega la suya.
  const leftImage = useImageLoad();
  const rightImage = useImageLoad();
  const { left, right } = block;
  const leftUrl = left ? projectImageUrl("half", left) : null;
  const rightUrl = right ? projectImageUrl("half", right) : null;

  if (!leftUrl && !rightUrl) return null;

  // Same effective height as SingleMedia (full-width 4:3, capped at 88svh):
  // the row owns the height; each image fills half the width with object-cover.
  // Thin (2px) horizontal gap between the pair, thin vertical gap below.
  return (
    <div className="relative flex w-full gap-[2px] aspect-[4/3] max-h-[88svh] mb-[2px]">
      {leftUrl && (
        <figure className="relative m-0 h-full flex-1 overflow-hidden text-off-black">
          <Image
            src={leftUrl}
            alt={t.work.mediaAlt}
            fill
            sizes={mediaSizes("half", assetAspect(left))}
            className="object-cover"
            onLoad={leftImage.onLoad}
            onError={leftImage.onError}
          />
          <ImageLoadIndicator show={leftImage.showIndicator} />
        </figure>
      )}
      {rightUrl && (
        <figure className="relative m-0 h-full flex-1 overflow-hidden text-off-black">
          <Image
            src={rightUrl}
            alt={t.work.mediaAlt}
            fill
            sizes={mediaSizes("half", assetAspect(right))}
            className="object-cover"
            onLoad={rightImage.onLoad}
            onError={rightImage.onError}
          />
          <ImageLoadIndicator show={rightImage.showIndicator} />
        </figure>
      )}
    </div>
  );
}

/* ── Main renderer ──────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectContentRenderer({ content }: { content: any[] }) {
  const { t } = useLocale();

  if (!content || content.length === 0) {
    return (
      <p className="font-body text-[20px] leading-[1.3] text-gray-brand italic md:text-[30px]">
        {t.work.contentSoon}
      </p>
    );
  }

  return (
    <>
      {content.map((block, i) => {
        if (block._type === "block") {
          return (
            <PortableText
              key={block._key || i}
              value={[block]}
              components={ptComponents}
            />
          );
        }

        if (block._type === "mediaItem") {
          return <SingleMedia key={block._key || i} block={block} />;
        }

        if (block._type === "dualMedia") {
          return <DualMedia key={block._key || i} block={block} />;
        }

        return null;
      })}
    </>
  );
}
