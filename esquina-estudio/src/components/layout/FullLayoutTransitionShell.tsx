"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  FULL_LAYOUT_ENTER_DURATION,
  FULL_LAYOUT_EXIT_DURATION,
  PAGE_EXIT_EASE,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";

const REDUCED_LAYOUT_DURATION = 0.06;

export default function FullLayoutTransitionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const {
    finishFullLayoutTransition,
    isFullLayoutEntering,
    isFullLayoutLeaving,
    isFullLayoutTransition,
  } = useRouteTransition();
  const exitDuration = reduceMotion
    ? REDUCED_LAYOUT_DURATION
    : FULL_LAYOUT_EXIT_DURATION;
  const enterDuration = reduceMotion
    ? REDUCED_LAYOUT_DURATION
    : FULL_LAYOUT_ENTER_DURATION;

  return (
    <>
      <motion.div
        initial={false}
        animate={
          isFullLayoutLeaving
            ? { filter: "blur(6px)", opacity: 0 }
            : {
                filter: isFullLayoutTransition ? "blur(0px)" : "none",
                opacity: 1,
              }
        }
        transition={{
          duration: isFullLayoutLeaving ? exitDuration : enterDuration,
          ease: PAGE_EXIT_EASE,
        }}
        onAnimationComplete={() => {
          if (isFullLayoutEntering) finishFullLayoutTransition();
        }}
        className={isFullLayoutTransition ? "will-change-[filter,opacity]" : ""}
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isFullLayoutLeaving ? 1 : 0 }}
        transition={{
          duration: isFullLayoutLeaving ? exitDuration : enterDuration,
          ease: PAGE_EXIT_EASE,
        }}
        className="pointer-events-none fixed inset-0 z-[9990] bg-off-white"
      />
    </>
  );
}
