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
  tightUnderline?: boolean;
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
  tightUnderline = false,
  balancedPadding = false,
  onClick,
}: HoverButtonProps) {
  const fillClass = tone === "dark" ? "bg-off-white" : "bg-off-black";
  const underlineColorClass = tone === "dark" ? "bg-off-white" : "bg-off-black";
  const textClass =
    tone === "dark"
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
      className={`group relative inline-block overflow-hidden ${className}`}
      initial="idle"
      whileHover="hover"
    >
      <motion.span
        className={`absolute top-0 ${fillInset} h-full ${fillClass}`}
        variants={{
     idle: { y: "120%", opacity: 0 },
     hover: { y: "0%", opacity: 1 },
   }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-hidden
      />

      <span
        className={`relative block transition-colors duration-200 ${textPaddingClass}${balancedPadding ? "" : " pt-[0.5px]"} ${textClass}`}
      >
        {children}
      </span>

      {underline && (
        <span
          className={`absolute bottom-0 -left-[1px] -right-[1px] h-[1px] ${underlineColorClass}`}
          aria-hidden="true"
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
