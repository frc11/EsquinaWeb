"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const BRAND_TEXT = "ESQUINA ESTUDIO™";
const PROGRESS_DURATION = 1.5; // seconds
const EXIT_DELAY = 1800; // ms after mount to begin exit
const HIDE_DELAY = 2600; // ms after mount to fully remove

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.04,
      duration: 0.4,
      ease: EASE_OUT_EXPO,
    },
  }),
};

export default function LoadingScreen() {
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // SSR-safe: check sessionStorage inside useEffect only
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("esquina-loading-shown");
    if (alreadyShown) {
      setShouldRender(false);
      setIsVisible(false);
      return;
    }

    setShouldRender(true);
    sessionStorage.setItem("esquina-loading-shown", "true");

    const exitTimer = setTimeout(() => setIsExiting(true), EXIT_DELAY);
    const hideTimer = setTimeout(() => setIsVisible(false), HIDE_DELAY);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!shouldRender || !isVisible) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key="loading-screen"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: EASE_EXIT }}
          className="fixed inset-0 z-[9998] bg-off-black flex flex-col items-center justify-center gap-8"
        >
          {/* Staggered letter animation */}
          <div className="flex overflow-hidden" aria-hidden="true">
            {BRAND_TEXT.split("").map((char, i) => (
              <motion.span
                key={`${char}-${i}`}
                custom={i}
                variants={letterVariants}
                initial="hidden"
                animate="visible"
                className="font-display text-off-white text-5xl md:text-7xl lg:text-8xl uppercase tracking-tight"
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-48 md:w-64 h-[1px] bg-off-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-off-white origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: PROGRESS_DURATION,
                ease: EASE_OUT_EXPO,
                delay: 0.2,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
