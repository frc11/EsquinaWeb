"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot follows near-instantly
  const dotX = useSpring(mouseX, { stiffness: 1000, damping: 50, mass: 0.1 });
  const dotY = useSpring(mouseY, { stiffness: 1000, damping: 50, mass: 0.1 });

  // Ring follows with a visible lag
  const ringX = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const ringY = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const ringXVal = useSpring(mouseX, { stiffness: 120, damping: 20, mass: 0.5 });
  const ringYVal = useSpring(mouseY, { stiffness: 120, damping: 20, mass: 0.5 });

  const checkHoverable = useCallback((target: HTMLElement): boolean => {
    if (target.dataset?.cursor === "hover") return true;
    if (target.tagName === "A" || target.tagName === "BUTTON") return true;
    if (target.closest("a") || target.closest("button")) return true;
    if (target.closest("[data-cursor='hover']")) return true;
    return false;
  }, []);

  useEffect(() => {
    // Detect touch device
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      setIsHovering(checkHoverable(e.target as HTMLElement));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible, checkHoverable]);

  if (isTouchDevice) return null;

  const dotSize = 12;
  const ringSize = isHovering ? 64 : 40;

  return (
    <>
      {/* Dot — small filled circle */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-off-black"
        style={{
          width: dotSize,
          height: dotSize,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Ring — larger circle outline, follows with lag */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-off-black"
        animate={{
          width: ringSize,
          height: ringSize,
          backgroundColor: isHovering
            ? "rgba(15, 15, 15, 0.08)"
            : "rgba(15, 15, 15, 0)",
          borderWidth: isHovering ? 1.5 : 1,
        }}
        transition={{
          width: { duration: 0.25, ease: "easeOut" },
          height: { duration: 0.25, ease: "easeOut" },
          backgroundColor: { duration: 0.2 },
          borderWidth: { duration: 0.15 },
        }}
        style={{
          x: ringXVal,
          y: ringYVal,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />
    </>
  );
}
