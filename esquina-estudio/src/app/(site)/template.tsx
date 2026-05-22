"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  const { isPreloaderDone } = usePreloader();

  return (
    <div className="min-h-0 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={
          isPreloaderDone
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 20 }
        }
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
