"use client";

import { motion } from "framer-motion";
import {
  PAGE_EXIT_EASE,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";

export default function PageTransitionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { exitDuration, isLeaving } = useRouteTransition();

  return (
    <div className="relative">
      <motion.div
        initial={false}
        animate={{ opacity: isLeaving ? 0 : 1 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="will-change-opacity"
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isLeaving ? 1 : 0 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="pointer-events-none absolute inset-0 z-20 bg-off-white"
      />
    </div>
  );
}
