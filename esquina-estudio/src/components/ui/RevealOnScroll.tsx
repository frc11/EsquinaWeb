"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export function RevealOnScroll({
  children,
  delay = 0,
  duration = 0.6,
  initialX = 0,
  initialY = 24,
  className = "",
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  initialX?: number;
  initialY?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: initialX, y: initialY }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: initialX, y: initialY }
      }
      transition={{ duration, delay, ease: EASE }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
