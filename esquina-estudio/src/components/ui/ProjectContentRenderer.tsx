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

function assetAspect(image: SanityImageLike | undefined): number | null {
  const ref = image?.asset?._ref ?? image?.asset?._id;
  const match = ref ? ASSET_REF_RE.exec(ref) : null;
  return match ? Number(match[1]) / Number(match[2]) : null;
}

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
    const imageUrl = urlFor(file).width(1200).url();
    if (!imageUrl) return null;

    // Check if it's a GIF — use native <img> to preserve animation
    const isGif =
      imageUrl.includes(".gif") ||
      (file?.asset?._ref && file.asset._ref.includes("-gif"));

    if (isGif) {
      return (
        <figure className="w-full mb-[2px]">
          <div className="relative w-full aspect-[4/3] max-h-[88svh] mx-auto overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
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
  const leftUrl = left ? urlFor(left).width(800).url() : null;
  const rightUrl = right ? urlFor(right).width(800).url() : null;

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
