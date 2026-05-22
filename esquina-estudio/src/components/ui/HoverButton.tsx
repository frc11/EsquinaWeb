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
  underline?: boolean;
  underlineDraw?: boolean;
  underlineDrawDelay?: number;
  tightUnderline?: boolean;
  blend?: boolean;
  onClick?: () => void;
}

export default function HoverButton({
  children,
  href,
  className = "",
  external = false,
  as,
  tone = "light",
  underline = true,
  underlineDraw = false,
  underlineDrawDelay = 0,
  tightUnderline = false,
  blend = false,
  onClick,
}: HoverButtonProps) {
  const borderClass = blend
    ? "border-current"
    : tone === "dark"
      ? "border-off-white"
      : "border-off-black";
  const fillClass = blend
    ? "bg-current"
    : tone === "dark"
      ? "bg-off-white"
      : "bg-off-black";
  const underlineColorClass = blend
    ? "bg-current"
    : tone === "dark"
      ? "bg-off-white"
      : "bg-off-black";
  const textClass =
    blend
      ? "text-current group-hover:text-off-black"
      : tone === "dark"
      ? "text-off-white group-hover:text-off-black"
      : "text-off-black group-hover:text-off-white";
  const underlineClass = underline && !underlineDraw
    ? `border-b ${borderClass}`
    : "border-b border-transparent";
  const textPaddingClass = tightUnderline
    ? "px-[1px] pb-0 pt-[1px]"
    : "py-[2px] px-[1px]";

  const content = (
    <motion.span
      className={`group relative inline-block overflow-hidden ${underlineClass} ${className}`}
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

      <span
  className={`relative block transition-[color,font-weight] duration-200 ${textPaddingClass} pt-[0.5px] ${textClass} ${
    blend ? "group-hover:font-bold" : ""
  }`}
>
  {children}
</span>

      {underline && underlineDraw && (
        <motion.span
          className={`absolute bottom-0 left-0 h-px w-full origin-left ${underlineColorClass}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{ transformOrigin: "left" }}
          transition={{
            delay: underlineDrawDelay,
            duration: 2.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          aria-hidden
        />
      )}
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
