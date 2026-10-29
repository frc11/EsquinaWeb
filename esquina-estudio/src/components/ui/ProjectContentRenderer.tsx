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

/* ── La caja de cada imagen (R5) ────────────────────────────── */
/*
  La caja toma la proporción de la foto y la foto nunca se recorta. Hasta R4 la
  caja era un `aspect-[4/3]` (una fila entera, o cada mitad del par) con
  `object-cover`: una foto que no fuera 4:3 (2:3 en cada mitad) perdía los
  bordes. Peor: con un `max-h` en unidades de viewport, cuando el tope mordía la
  caja dejaba de ser 4:3 y pasaba a ser ancho / alto-topado, o sea que lo que se
  veía de la foto cambiaba al redimensionar la ventana.

  La trampa de CSS: `aspect-ratio` con `width: 100%` y `max-height` reproduce el
  defecto —el ancho queda definido, el alto se topa y la razón se rompe—. Acá el
  tope es sobre el ANCHO: `min(100%, 88svh × razón)`. El alto sale de la razón y
  por construcción no pasa de 88svh; si el tope muerde, la foto se angosta y se
  centra, con el fondo de la página a los lados.

  Un solo helper (`mediaFrame`) arma el marco para los tres caminos —`next/image`,
  el `<img>` del GIF y las dos mitades del par—. Si no se conocen las dimensiones
  de una foto, el marco usa la proporción de respaldo del hueco y la imagen va
  con `object-contain`: nunca `object-cover`.

  `sizes` describe el ancho que ocupa la imagen PINTADA, que ahora es el ancho del
  marco: el menor entre el de la columna (o el de la mitad) y `88vh × razón`.
  La geometría de la columna es la de `ProjectDetailClient`: debajo de 768 mide
  `100vw − 48` (`px-6` por lado); de 768 para arriba le restan los dos gutters
  de 48 (`px-12`), el aside de 240 y el gap de 96 → `100vw − 432`. Si esas
  clases cambian, estos números cambian. El par la parte en dos con 2 px de aire.

  El alto del viewport entra en la cuenta, y `sizes` lo puede expresar: admite
  `vh`, `min()` y `max()` (verificado en Chrome). Se escribe en `vh` y no en
  `svh`: en un teléfono `vh` es el mayor de los dos, o sea que se equivoca
  pidiendo de más. Un navegador que no entienda la expresión cae a `100vw`,
  que también es pedir de más: nunca estirar.

  Los términos van dentro de `min()` también por la nota de `sizes` de
  `src/lib/mobile-layout.ts`: un `vw` suelto le borra a `next/image` los cortes
  chicos del `srcset`.
*/
type MediaSlot = "single" | "half";

const MOBILE_QUERY = "(max-width: 767.98px)";
const ROW_INSET = { mobile: 48, desktop: 432 } as const;
const PAIR_GAP = 2;
const ROW_HEIGHT_RATIO = 3 / 4;
const ROW_MAX_VH = 88;

interface AssetDimensions {
  width: number;
  height: number;
}

// La proporción del hueco cuando no se conocen las dimensiones de la foto. El
// marco la toma y la imagen se contiene dentro: no se recorta.
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

const round4 = (n: number) => Number(n.toFixed(4));

/** El ancho que ocupa la imagen pintada, para `sizes`: el del hueco o el que deja el tope de alto. */
function paintedWidth(slot: MediaSlot, inset: number, aspect: number): string {
  const slotWidth =
    slot === "single" ? `100vw - ${inset}px` : `50vw - ${(inset + PAIR_GAP) / 2}px`;
  return `min(${slotWidth}, ${ROW_MAX_VH}vh * ${round4(aspect)})`;
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
  const aspect = width / height;
  return {
    style: {
      aspectRatio: `${width} / ${height}`,
      width: `min(100%, ${ROW_MAX_VH}svh * ${round4(aspect)})`,
    },
    sizes: `${MOBILE_QUERY} ${paintedWidth(slot, ROW_INSET.mobile, aspect)}, ${paintedWidth(slot, ROW_INSET.desktop, aspect)}`,
  };
}

/*
  El par (R5.1). El tope de alto es de la FILA, no de cada foto: si cada mitad
  se topara sola, la foto se angostaría dentro de su mitad (que sigue midiendo
  el 50 % de la fila) y el sobrante saldría como aire horizontal, doble en el
  medio. Acá la fila toma su alto natural de la foto más alta a media fila
  —`(W − 2) / (2 × razón menor)`—, lo topa a 88svh y deja que su ANCHO se achique
  en proporción, centrada, igual que una foto sola. Las mitades son 50/50 de lo
  que mida la fila y cada foto llena la suya: ningún aire horizontal.

  La razón menor es la de la foto más alta (la más angosta). Con ella, el ancho
  de cada mitad pintada es `min((columna − 2) / 2, 88vh × razón menor)`, que es
  lo que `paintedWidth` ya calcula para `half`.
*/
interface PairSpec {
  rowStyle: CSSProperties;
  halfFrame: (image: SanityImageLike | undefined) => MediaFrameSpec;
}

function pairFrame(
  left: SanityImageLike | undefined,
  right: SanityImageLike | undefined,
): PairSpec {
  const ratio = (image: SanityImageLike | undefined) => {
    const { width, height } = assetDimensions(image) ?? FALLBACK_DIMENSIONS.half;
    return width / height;
  };
  const narrowest = Math.min(ratio(left), ratio(right));
  const sizes = `${MOBILE_QUERY} ${paintedWidth("half", ROW_INSET.mobile, narrowest)}, ${paintedWidth("half", ROW_INSET.desktop, narrowest)}`;
  return {
    rowStyle: {
      width: `min(100%, ${ROW_MAX_VH}svh * ${round4(2 * narrowest)} + ${PAIR_GAP}px)`,
    },
    halfFrame: (image) => {
      const { width, height } = assetDimensions(image) ?? FALLBACK_DIMENSIONS.half;
      return { style: { aspectRatio: `${width} / ${height}` }, sizes };
    },
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
      className="relative mx-auto text-off-black"
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

  R5: sin `object-cover` ya no hay desborde, así que el ancho pintado nunca pasa
  del hueco (`slotWidth`) y el segundo término de `Math.max` quedó de más. No se
  tocó: sigue siendo una cota superior, nunca pide de menos, y el tope no es lo
  que limita la nitidez (la medición está en `research/R5-ASPECTO.md`).

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
  const fallback = FALLBACK_DIMENSIONS[slot];
  const aspect = dimensions
    ? dimensions.width / dimensions.height
    : fallback.width / fallback.height;
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

// El GIF va como `<img>` nativo y no pasa por el optimizador (así conserva la
// animación): su tope es peso directo para el visitante. R4 no lo sube.
const GIF_WIDTH = 1200;

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
  // and below. If only one image is set it takes the whole row.
  // The height cap belongs to the row (see `pairFrame`), not to each image.
  const pair = slotHint === "half" ? pairFrame(left, right) : null;
  const leftFrame = pair ? pair.halfFrame(left) : mediaFrame(slotHint, left);
  const rightFrame = pair ? pair.halfFrame(right) : mediaFrame(slotHint, right);

  return (
    <div
      className="relative mx-auto flex w-full items-center gap-[2px] mb-[2px]"
      style={pair?.rowStyle}
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
