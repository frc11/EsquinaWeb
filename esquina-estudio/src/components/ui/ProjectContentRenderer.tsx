"use client";

import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useLocale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity";
import type { SanityImageLike } from "@/types/project";
import ImageLoadIndicator, {
  useImageLoad,
} from "@/components/ui/ImageLoadIndicator";

/* ── La caja de cada imagen (R5.2) ──────────────────────────── */
/*
  Todo bloque de contenido ocupa el ancho entero de la columna: el párrafo, la
  foto sola, el GIF y la fila del par comparten borde izquierdo y derecho.

  La caja toma la proporción de la foto y la foto nunca se recorta. Hasta R4 la
  caja era un `aspect-[4/3]` con `object-cover`: una foto que no fuera 4:3 perdía
  los bordes. R5 le dio a la caja la proporción de la foto; R5.1 hizo que el
  tope de alto fuera el de la fila del par. R5.2 quita el tope: era lo que
  angostaba y centraba las fotos altas, y con él un bloque nunca podía medir lo
  mismo que el texto. Decisión del cliente, sabiendo el costo: una foto muy alta
  ya no entra en una pantalla y se recorre con scroll. Nada lo frena; si algún
  día se sube una vertical enorme, es esto y no un error.

  Un solo helper (`mediaFrame`) arma la caja para los tres caminos —`next/image`,
  el `<img>` del GIF y las dos mitades del par—. Si no se conocen las dimensiones
  de una foto, la caja usa la proporción de respaldo del hueco y la imagen va
  con `object-contain`: nunca `object-cover`.

  `sizes` describe el ancho de la imagen PINTADA, que es el de su hueco. La
  geometría de la columna es la de `ProjectDetailClient`: debajo de 768 mide
  `100vw − 48` (`px-6` por lado); de 768 para arriba le restan los dos gutters
  de 48 (`px-12`), el aside de 240 y el gap de 96 → `100vw − 432`. Si esas
  clases cambian, estos números cambian. El par la parte en dos con 2 px de aire.
  Un navegador que no entienda la expresión cae a `100vw`, que es pedir de más:
  nunca estirar. Los términos van dentro de `calc()` por la nota de `sizes` de
  `src/lib/mobile-layout.ts`: un `vw` suelto le borra a `next/image` los cortes
  chicos del `srcset`.

  El par: la fila es el ancho de la columna, las mitades son 50/50 de ella
  (`flex-1` desde base cero, 2 px de aire) y cada foto llena su mitad. La fila
  mide lo que pida la foto más alta a media fila; la más baja se centra.
*/
type MediaSlot = "single" | "half";

const MOBILE_QUERY = "(max-width: 767.98px)";
const ROW_INSET = { mobile: 48, desktop: 432 } as const;
const PAIR_GAP = 2;

interface AssetDimensions {
  width: number;
  height: number;
}

// La proporción del hueco cuando no se conocen las dimensiones de la foto. La
// caja la toma y la imagen se contiene dentro: no se recorta.
const FALLBACK_DIMENSIONS: Record<MediaSlot, AssetDimensions> = {
  single: { width: 4, height: 3 },
  half: { width: 2, height: 3 },
};

// El `_ref` de un asset de Sanity lleva las dimensiones del original:
// `image-<hash>-2400x1800-png`. Sin `_ref` (contenido de respaldo) no se sabe.
const ASSET_REF_RE = /^image-[a-f0-9]+-(\d+)x(\d+)-[a-z]+$/;

function assetDimensions(
  image: SanityImageLike | undefined,
): AssetDimensions | null {
  const ref = image?.asset?._ref ?? image?.asset?._id;
  const match = ref ? ASSET_REF_RE.exec(ref) : null;
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

/** El ancho que ocupa la imagen pintada, para `sizes`: el de su hueco. */
function slotWidth(slot: MediaSlot, inset: number): string {
  return slot === "single"
    ? `calc(100vw - ${inset}px)`
    : `calc((100vw - ${inset + PAIR_GAP}px) / 2)`;
}

interface MediaFrameSpec {
  style: CSSProperties;
  sizes: string;
}

/** El único lugar donde se decide la caja de una imagen de proyecto. */
function mediaFrame(
  slot: MediaSlot,
  image: SanityImageLike | undefined,
): MediaFrameSpec {
  const { width, height } = assetDimensions(image) ?? FALLBACK_DIMENSIONS[slot];
  return {
    style: { aspectRatio: `${width} / ${height}` },
    sizes: `${MOBILE_QUERY} ${slotWidth(slot, ROW_INSET.mobile)}, ${slotWidth(slot, ROW_INSET.desktop)}`,
  };
}

function MediaFrame({
  frame,
  children,
}: {
  frame: MediaFrameSpec;
  children: ReactNode;
}) {
  return (
    <div
      data-media-frame
      className="relative w-full text-off-black"
      style={frame.style}
    >
      {children}
    </div>
  );
}

/*
  El tope que se le pide a Sanity (R4). Es lo que viaja al optimizador de
  `next/image`, así que es el techo de todo lo que puede llegar a pantalla:
  hasta R4 era 1200 la foto sola y 800 cada mitad del par, contra un hueco de
  1488 × 2 = 2976 px a 1920 en Retina.

  La cuenta (R5.2, sin tope de alto): el peor caso de la vara es un viewport de
  **1920 de ancho a DPR 2**. Ahí la fila mide 1920 − 432 = **1488** y la foto
  pintada ocupa exactamente su hueco —1488 sola, 743 cada mitad—, sea cual sea
  su proporción y el alto de la ventana. Por 2:
    · foto sola       → 2976
    · mitad del par   → 1486
  Medido a 1920 × 1080 (`research/R5.2-SIN-TOPE.md`, A9): ningún tope muerde
  salvo donde el original es más chico que eso, y ahí el límite es el archivo.

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
  const rowWidth = WORST_VIEWPORT_WIDTH - ROW_INSET.desktop;
  const needed =
    Math.ceil(slot === "single" ? rowWidth : (rowWidth - PAIR_GAP) / 2) *
    WORST_DPR;
  return Math.min(
    needed,
    OPTIMIZER_MAX_WIDTH,
    assetDimensions(image)?.width ?? needed,
  );
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

/*
  La calidad con que el optimizador codifica (R4), elegida midiendo 75, 82 y 90
  en el ancho del peor caso. Ojo: para AVIF, que es lo que reciben los
  navegadores actuales, `next/image` le pasa a sharp `q − 20`; 82 es 62 de
  codificador. Bytes y SSIM de luminancia contra el original:
    · Tukumi, 2400 (papel con grano): 54,0 / 84,5 / 141,4 kB — ,9288 / ,9329 / ,9378
    · foto del par, 1488:             79,8 / 106,0 / 134,1 kB — ,9634 / ,9668 / ,9698
    · Matsu, 2976 (render con ruido): 380 / 661 / 963 kB    — ,7887 / ,8527 / ,8952
  En las tres, el paso de 82 a 90 compra entre 18 y 38 % menos SSIM por kB que
  el de 75 a 82: ahí la mejora deja de pagar su peso. A 75 el grano del papel de
  Tukumi desaparece; a 82 vuelve. Va como prop y no como default global para
  que la galería y las portadas de `/work` sigan en 75.
*/
const PROJECT_IMAGE_QUALITY = 82;

/* ── Portable Text overrides ────────────────────────────────── */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p data-content-text className="mb-10 font-body text-[20px] leading-[1.3] text-off-black md:mb-16 md:text-[30px]">
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
    // El GIF va como `<img>` nativo y no pasa por el optimizador (así conserva la
    // animación), así que su tope es peso directo para el visitante. Hasta R5.1
    // era 1200 fijo; medido en R5.2 (A9), mordía: la foto pintada mide 1488 px
    // a 1920 y el original de Tukumi 2400, el de Akasha 1400 (que ya es menor
    // que el ancho pintado: ahí el límite es el archivo, no el código). Va al
    // mismo ancho que una foto sola.
    const gifUrl = urlFor(file).width(sanityWidth("single", file)).url();
    if (!gifUrl) return null;

    // Check if it's a GIF — use native <img> to preserve animation
    const isGif =
      gifUrl.includes(".gif") ||
      (file?.asset?._ref && file.asset._ref.includes("-gif"));

    const frame = mediaFrame("single", file);

    if (isGif) {
      return (
        <figure className="w-full mb-[2px]">
          <MediaFrame frame={frame}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl}
              alt={caption || t.work.mediaAlt}
              className="absolute inset-0 h-full w-full object-contain"
            />
          </MediaFrame>
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
        <MediaFrame frame={frame}>
          <Image
            src={imageUrl}
            alt={caption || t.work.mediaAlt}
            fill
            sizes={frame.sizes}
            quality={PROJECT_IMAGE_QUALITY}
            className="object-contain"
            onLoad={single.onLoad}
            onError={single.onError}
          />
          <ImageLoadIndicator show={single.showIndicator} />
        </MediaFrame>
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
  const slotHint: MediaSlot = left && right ? "half" : "single";
  const leftUrl = left ? projectImageUrl(slotHint, left) : null;
  const rightUrl = right ? projectImageUrl(slotHint, right) : null;

  if (!leftUrl && !rightUrl) return null;

  // Each half keeps exactly half the row (flex-1 from a zero basis, 2px gap) and
  // its image takes its own ratio inside it. The row is as tall as the taller
  // image; the shorter one is centred vertically with the page background above
  // and below. If only one image is set it takes the whole row. No height cap.
  const leftFrame = mediaFrame(slotHint, left);
  const rightFrame = mediaFrame(slotHint, right);

  return (
    <div
      className="relative flex w-full items-center gap-[2px] mb-[2px]"
      data-media-row
    >
      {leftUrl && (
        <figure className="relative m-0 min-w-0 flex-1" data-media-half>
          <MediaFrame frame={leftFrame}>
            <Image
              src={leftUrl}
              alt={t.work.mediaAlt}
              fill
              sizes={leftFrame.sizes}
              quality={PROJECT_IMAGE_QUALITY}
              className="object-contain"
              onLoad={leftImage.onLoad}
              onError={leftImage.onError}
            />
            <ImageLoadIndicator show={leftImage.showIndicator} />
          </MediaFrame>
        </figure>
      )}
      {rightUrl && (
        <figure className="relative m-0 min-w-0 flex-1" data-media-half>
          <MediaFrame frame={rightFrame}>
            <Image
              src={rightUrl}
              alt={t.work.mediaAlt}
              fill
              sizes={rightFrame.sizes}
              quality={PROJECT_IMAGE_QUALITY}
              className="object-contain"
              onLoad={rightImage.onLoad}
              onError={rightImage.onError}
            />
            <ImageLoadIndicator show={rightImage.showIndicator} />
          </MediaFrame>
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
