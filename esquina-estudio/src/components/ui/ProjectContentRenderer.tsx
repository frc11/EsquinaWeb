"use client";

import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { useLocale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity";

/* ── Portable Text overrides ────────────────────────────────── */
const ptComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="font-body text-[30px] leading-[1.3] text-off-black mb-16">
        {children}
      </p>
    ),
  },
};

/* ── Single media block (image, gif, or video) ──────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SingleMedia({ block }: { block: any }) {
  const { t } = useLocale();
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
          className="w-full max-h-[88vh] object-contain"
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
          <div className="relative w-full aspect-[4/3] max-h-[88vh] mx-auto overflow-hidden">
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
        <div className="relative w-full aspect-[4/3] max-h-[88vh] mx-auto overflow-hidden">
          <Image
            src={imageUrl}
            alt={caption || t.work.mediaAlt}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
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

  return null;
}

/* ── Dual media block (two images side by side, single-height) ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DualMedia({ block }: { block: any }) {
  const { t } = useLocale();
  const { left, right } = block;
  const leftUrl = left ? urlFor(left).width(800).url() : null;
  const rightUrl = right ? urlFor(right).width(800).url() : null;

  if (!leftUrl && !rightUrl) return null;

  // Same effective height as SingleMedia (full-width 4:3, capped at 88vh):
  // the row owns the height; each image fills half the width with object-cover.
  // Thin (2px) horizontal gap between the pair, thin vertical gap below.
  return (
    <div className="relative flex w-full gap-[2px] aspect-[4/3] max-h-[88vh] mb-[2px]">
      {leftUrl && (
        <figure className="relative m-0 h-full flex-1 overflow-hidden">
          <Image
            src={leftUrl}
            alt={t.work.mediaAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </figure>
      )}
      {rightUrl && (
        <figure className="relative m-0 h-full flex-1 overflow-hidden">
          <Image
            src={rightUrl}
            alt={t.work.mediaAlt}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
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
      <p className="font-body text-[30px] leading-[1.3] text-gray-brand italic">
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
