"use client";

import { motion, type Variants } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import HoverButton from "@/components/ui/HoverButton";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TITLE_DELAY = 0.12;
const TITLE_STAGGER = 0.08;
const TITLE_LINE_DURATION = 0.42;
const TITLE_LINE_COUNT = 3;
const CTA_DURATION = 0.45;
const CTA_DELAY =
  TITLE_DELAY + TITLE_STAGGER * (TITLE_LINE_COUNT - 1) + TITLE_LINE_DURATION;
const CTA_UNDERLINE_DELAY = CTA_DELAY + CTA_DURATION;

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TITLE_STAGGER,
      delayChildren: TITLE_DELAY,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TITLE_LINE_DURATION, ease: EASE },
  },
};

export default function Hero() {
  const { isPreloaderDone } = usePreloader();

  return (
    <section className="flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-6 py-4 text-center md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderDone ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isPreloaderDone ? "visible" : "hidden"}
        >
          <motion.p
            variants={lineVariants}
            className="font-display text-[40px] uppercase leading-[1.05] text-off-black"
          >
            IN A WORLD FULL OF NOISE
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-1 font-display text-[40px] uppercase font-semibold leading-[1.05] text-off-black"
          >
            MAKE YOUR BRAND STAND OUT.
          </motion.p>
          <motion.p
            variants={lineVariants}
            className="mt-1 font-display text-[40px] uppercase leading-[1.05] text-off-black"
          >
            WITH INTENTION. WITH IMPACT.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={
            isPreloaderDone
              ? { y: 0, opacity: 1 }
              : { y: 30, opacity: 0 }
          }
          transition={{ delay: CTA_DELAY, duration: CTA_DURATION, ease: EASE }}
          className="mt-8"
        >
          <HoverButton
            href="/contact"
            underline={isPreloaderDone}
            underlineDraw={isPreloaderDone}
            underlineDrawDelay={CTA_UNDERLINE_DELAY}
            className="font-display text-[24px] uppercase tracking-wider"
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
