"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  const { isPreloaderDone } = usePreloader();

  return (
    <div className="min-h-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderDone ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
