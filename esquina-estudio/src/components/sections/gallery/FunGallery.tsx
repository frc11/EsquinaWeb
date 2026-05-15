"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { urlFor } from "@/lib/sanity";

export interface FunGalleryImage {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  alt?: string;
}

const positions = [
  { top: "5%", left: "10%", width: "25vw", rotate: "-2deg", depth: -90 },
  { top: "12%", left: "45%", width: "30vw", rotate: "1deg", depth: 55 },
  { top: "8%", left: "70%", width: "20vw", rotate: "3deg", depth: -45 },
  { top: "25%", left: "5%", width: "28vw", rotate: "-1deg", depth: 80 },
  { top: "31%", left: "34%", width: "23vw", rotate: "2deg", depth: -60 },
  { top: "28%", left: "62%", width: "31vw", rotate: "-3deg", depth: 105 },
  { top: "44%", left: "14%", width: "21vw", rotate: "2.5deg", depth: -75 },
  { top: "48%", left: "47%", width: "26vw", rotate: "-1.5deg", depth: 65 },
  { top: "55%", left: "73%", width: "18vw", rotate: "1deg", depth: -50 },
  { top: "66%", left: "3%", width: "32vw", rotate: "-2.5deg", depth: 95 },
  { top: "72%", left: "38%", width: "24vw", rotate: "3deg", depth: -85 },
  { top: "70%", left: "66%", width: "29vw", rotate: "-1deg", depth: 70 },
  { top: "86%", left: "11%", width: "22vw", rotate: "1.5deg", depth: -40 },
  { top: "89%", left: "44%", width: "30vw", rotate: "-2deg", depth: 100 },
  { top: "92%", left: "76%", width: "19vw", rotate: "2deg", depth: -65 },
] as const;

const zLayers = [8, 18, 11, 25, 14, 22, 10, 28, 16, 20, 12, 30, 15, 24, 13];
const PLACEHOLDER_COUNT = 15;

function ParallaxItem({
  children,
  index,
  scrollYProgress,
}: {
  children: React.ReactNode;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const position = positions[index % positions.length];
  const y = useTransform(scrollYProgress, [0, 1], [0, position.depth]);

  return (
    <motion.div
      className="absolute overflow-hidden bg-gray-brand/20"
      style={{
        top: position.top,
        left: position.left,
        width: `clamp(150px, ${position.width}, 460px)`,
        rotate: position.rotate,
        zIndex: zLayers[index % zLayers.length],
        y,
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.65, delay: (index % 5) * 0.05 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
    >
      {children}
    </motion.div>
  );
}

function PlaceholderCollage({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <>
      {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
        <ParallaxItem
          key={index}
          index={index}
          scrollYProgress={scrollYProgress}
        >
          <div className="flex aspect-[4/5] items-center justify-center border border-off-black/15 bg-gray-brand/10">
            <span className="font-display text-[48px] leading-none text-gray-brand">
              +
            </span>
          </div>
        </ParallaxItem>
      ))}
    </>
  );
}

function ImageCollage({
  images,
  scrollYProgress,
}: {
  images: FunGalleryImage[];
  scrollYProgress: MotionValue<number>;
}) {
  return (
    <>
      {images.map((img, index) => {
        const imageUrl = img.image ? urlFor(img.image).width(1100).url() : "";

        if (!imageUrl) return null;

        return (
          <ParallaxItem
            key={img._id}
            index={index}
            scrollYProgress={scrollYProgress}
          >
            <Image
              src={imageUrl}
              alt={img.alt || ""}
              width={1100}
              height={1375}
              sizes="(max-width: 768px) 58vw, 30vw"
              className="block h-auto w-full object-cover"
            />
          </ParallaxItem>
        );
      })}
    </>
  );
}

export default function FunGallery({ images }: { images: FunGalleryImage[] }) {
  const collageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: collageRef,
    offset: ["start end", "end start"],
  });
  const hasImages = images.length > 0;

  return (
    <main className="bg-off-white px-6 py-8 text-off-black md:px-12 md:py-16">
      <h1 className="font-body text-[13px] uppercase tracking-wider text-gray-brand">
        FUN GALLERY
      </h1>

      <section
        ref={collageRef}
        className="relative mt-8 min-h-[220vh] overflow-hidden"
        aria-label="Fun Gallery"
      >
        {hasImages ? (
          <ImageCollage
            images={images}
            scrollYProgress={scrollYProgress}
          />
        ) : (
          <PlaceholderCollage scrollYProgress={scrollYProgress} />
        )}
      </section>
    </main>
  );
}
