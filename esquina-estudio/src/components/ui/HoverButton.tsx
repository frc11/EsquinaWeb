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
  /** When true, hover fill and text padding use equal spacing on all four sides.
   *  Default false = existing behaviour preserved exactly. */
  balancedPadding?: boolean;
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
  balancedPadding = false,
  onClick,
}: HoverButtonProps) {
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
  const textPaddingClass = balancedPadding
    ? "p-[6px]"
    : tightUnderline
      ? "px-[1px] pb-0 pt-[1px]"
      : "py-[2px] px-[1px]";

  const fillInset = balancedPadding
    ? "left-0 right-0"
    : "-left-[1px] -right-[1px]";

  const content = (
    <motion.span
      className={`group relative inline-block overflow-hidden transform-gpu ${className}`}
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className={`absolute top-0 ${fillInset} h-full ${fillClass}`}
        variants={{
          idle: { y: "110%" },
          hover: { y: "0%" },
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-hidden
      />

      <span
        className={`relative block transition-colors duration-200 ${textPaddingClass}${balancedPadding ? "" : " pt-[0.5px]"} ${textClass}`}
      >
        {children}
      </span>

      {underline && !underlineDraw && (
        <span
          className={`absolute bottom-0 -left-[1px] -right-[1px] h-[1px] ${underlineColorClass}`}
          aria-hidden="true"
        />
      )}

      {underline && underlineDraw && (
        <motion.span
          className={`absolute bottom-0 -left-[1px] -right-[1px] h-px origin-left ${underlineColorClass}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          style={{
            transformOrigin: "left",
          }}
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
