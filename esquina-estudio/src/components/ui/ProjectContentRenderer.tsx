"use client";

import Image from "next/image";
import { PortableText, PortableTextComponents } from "@portabletext/react";
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
  const { file, video, caption } = block;

  // Video URL (Vimeo / YouTube / direct .mp4)
  if (video) {
    const isEmbed = video.includes("vimeo") || video.includes("youtube");

    if (isEmbed) {
      return (
        <figure className="w-full mb-16 relative bg-gray-brand/10">
          <div className="relative w-full aspect-video overflow-hidden">
            <iframe
              src={video}
              title={caption || "Project video"}
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
      <figure className="w-full mb-16 relative bg-gray-brand/10">
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto"
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
        <figure className="w-full mb-16 relative bg-gray-brand/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={caption || "Project media"}
            className="w-full h-auto"
          />
          {caption && (
            <figcaption className="mt-2 text-[13px] text-gray-brand font-body">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    return (
      <figure className="w-full mb-16 relative bg-gray-brand/10">
        <Image
          src={imageUrl}
          alt={caption || "Project media"}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 800px"
          className="w-full h-auto"
        />
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

/* ── Dual media block (two vertical images side by side) ────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DualMedia({ block }: { block: any }) {
  const { left, right } = block;
  const leftUrl = left ? urlFor(left).width(600).url() : null;
  const rightUrl = right ? urlFor(right).width(600).url() : null;

  if (!leftUrl && !rightUrl) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
      {leftUrl && (
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={leftUrl}
            alt="Project media"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
      {rightUrl && (
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={rightUrl}
            alt="Project media"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  );
}

/* ── Main renderer ──────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectContentRenderer({ content }: { content: any[] }) {
  if (!content || content.length === 0) {
    return (
      <p className="font-body text-[30px] leading-[1.3] text-gray-brand italic">
        Project content coming soon.
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
