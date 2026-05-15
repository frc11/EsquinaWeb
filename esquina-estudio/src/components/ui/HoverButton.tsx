"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HoverButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
  as?: "button" | "a" | "span";
  tone?: "light" | "dark";
  onClick?: () => void;
}

export default function HoverButton({
  children,
  href,
  className = "",
  external = false,
  as,
  tone = "light",
  onClick,
}: HoverButtonProps) {
  const borderClass = tone === "dark" ? "border-off-white" : "border-off-black";
  const fillClass = tone === "dark" ? "bg-off-white" : "bg-off-black";

  const content = (
    <motion.span
      className={`relative inline-block overflow-hidden border-b ${borderClass} ${className}`}
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className={`absolute inset-0 origin-bottom ${fillClass}`}
        variants={{
          idle: { scaleY: 0 },
          hover: { scaleY: 1 },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-hidden
      />

      <span className="relative block mix-blend-difference text-off-white py-[2px] px-[1px]">
        {children}
      </span>
    </motion.span>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={onClick}>
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} onClick={onClick}>
        {content}
      </Link>
    );
  }

  if (as === "span") {
    return <span onClick={onClick}>{content}</span>;
  }

  return (
    <button type="button" onClick={onClick}>
      {content}
    </button>
  );
}
