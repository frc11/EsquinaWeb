"use client";

import { motion, type Variants } from "framer-motion";
import HoverButton from "@/components/ui/HoverButton";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 2.8,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 py-24">
      {/* Hero text — stagger-revealed */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <motion.p
          variants={lineVariants}
          className="font-display text-[clamp(32px,5vw,40px)] uppercase leading-[1.05] tracking-tight text-off-black"
        >
          IN A WORLD FULL OF NOISE
        </motion.p>
        <motion.p
          variants={lineVariants}
          className="font-display text-[clamp(40px,6.5vw,52px)] uppercase leading-[1.05] tracking-tight text-off-black mt-1"
        >
          MAKE YOUR BRAND STAND OUT.
        </motion.p>
        <motion.p
          variants={lineVariants}
          className="font-display text-[clamp(32px,5vw,40px)] uppercase leading-[1.05] tracking-tight text-off-black mt-1"
        >
          WITH INTENTION. WITH IMPACT.
        </motion.p>
      </motion.div>

      {/* CTA button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.4, duration: 0.6, ease: EASE }}
        className="mt-12"
      >
        <HoverButton
          href="/contact"
          className="font-display text-[24px] uppercase tracking-wider"
        >
          LET&apos;S WORK TOGETHER!
        </HoverButton>
      </motion.div>
    </section>
  );
}
