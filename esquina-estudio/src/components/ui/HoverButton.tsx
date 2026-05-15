"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HoverButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
}

export default function HoverButton({
  children,
  href,
  className = "",
  external = false,
}: HoverButtonProps) {
  const content = (
    <motion.span
      className={`relative inline-block overflow-hidden border-b border-off-black ${className}`}
      initial="idle"
      whileHover="hover"
    >
      {/* Fill rectangle — grows from bottom to top */}
      <motion.span
        className="absolute inset-0 bg-off-black origin-bottom"
        variants={{
          idle: { scaleY: 0 },
          hover: { scaleY: 1 },
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
      />

      {/* Text — uses mix-blend-difference for automatic color inversion */}
      <span className="relative block mix-blend-difference text-off-white py-[2px] px-[1px]">
        {children}
      </span>
    </motion.span>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <button type="button">{content}</button>;
}
