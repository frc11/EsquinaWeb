"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const latestPositionRef = useRef({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;

    if (isTouchDevice) return;

    document.body.dataset.customCursor = "true";

    const updateCursor = () => {
      const cursor = cursorRef.current;
      if (!cursor) return;

      const { x, y } = latestPositionRef.current;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      frameRef.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      latestPositionRef.current = {
        x: event.clientX,
        y: event.clientY,
      };

      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateCursor);
      }

      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      delete document.body.dataset.customCursor;
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-4 w-4 rounded-full bg-white mix-blend-difference transition-opacity duration-[120ms] [@media(pointer:fine)]:block"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: "translate3d(-100px, -100px, 0) translate(-50%, -50%)",
        willChange: "transform, opacity",
      }}
    />
  );
}
