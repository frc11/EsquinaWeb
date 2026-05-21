"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ContactSuccess() {
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotion);

  return (
    <section
      className="fixed inset-0 z-[90]"
      aria-label="Inquiry sent confirmation"
    >
      {/* ── Dark panel that rises from below ── */}
      <motion.div
        className="absolute inset-0 bg-off-black"
        initial={
          shouldReduceMotion
            ? { y: "0%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            : { y: "100%", borderTopLeftRadius: "2rem", borderTopRightRadius: "2rem" }
        }
        animate={{ y: "0%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                y: {
                  type: "spring",
                  stiffness: 120,
                  damping: 18,
                  mass: 0.9,
                },
                borderTopLeftRadius: { delay: 0.6, duration: 0.35, ease: EASE },
                borderTopRightRadius: { delay: 0.6, duration: 0.35, ease: EASE },
              }
        }
      />

      {/* ── Centered text content ── */}
      <motion.div
        className="relative flex h-full w-full items-center justify-center px-6 text-center md:px-12"
        initial={
          shouldReduceMotion
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 16, filter: "blur(4px)" }
        }
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                delay: 0.75,
                duration: 0.72,
                ease: EASE,
              }
        }
      >
        <div className="max-w-4xl">
          <h1 className="font-display text-[clamp(40px,5vw,64px)] uppercase leading-[1.05] text-off-white">
            YOUR INQUIRY WAS SENT
            <br />
            SUCCESSFULLY!
          </h1>

          <p className="mx-auto mt-8 max-w-3xl font-body text-[17px] uppercase leading-[1.45] text-off-white/80">
            WE APPRECIATE YOU TAKING THE TIME TO SHARE YOUR VISION WITH US. OUR
            TEAM WILL REVIEW YOUR SUBMISSION AND GET BACK TO YOU AS SOON AS
            POSSIBLE.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
