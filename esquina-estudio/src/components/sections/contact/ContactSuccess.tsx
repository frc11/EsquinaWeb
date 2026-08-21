"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { useLocale } from "@/lib/i18n";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function ContactSuccess() {
  const reduceMotion = useReducedMotion();
  const { isPreloaderDone } = usePreloader();
  const { t } = useLocale();
  const shouldReduceMotion = Boolean(reduceMotion);

  // La pantalla de éxito ocupa una pantalla completa **en flujo normal** (antes
  // era `fixed inset-0`): así el footer nuevo, que en esta ruta ya no es fijo,
  // se apila debajo y se alcanza scrolleando. El margen negativo cancela el
  // `pt-[--header-height]` del <main> para que el panel oscuro siga cubriendo la
  // franja del header igual que cuando era fijo, y `overflow-hidden` lo recorta
  // a esa pantalla mientras sube (si no, barrería el footer al animar).
  return (
    <section
      className="relative z-[90] -mt-[var(--header-height)] h-[100svh] overflow-hidden"
      aria-label={t.success.sectionLabel}
    >
      {/* ── Dark panel that rises from below ── */}
      <motion.div
        className="absolute inset-0 bg-off-black"
        initial={
          shouldReduceMotion
            ? { y: "0%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            : { y: "100%", borderTopLeftRadius: "2rem", borderTopRightRadius: "2rem" }
        }
        animate={
          isPreloaderDone
            ? { y: "0%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }
            : shouldReduceMotion
              ? { y: "0%", borderTopLeftRadius: 0, borderTopRightRadius: 0 }
              : {
                  y: "100%",
                  borderTopLeftRadius: "2rem",
                  borderTopRightRadius: "2rem",
                }
        }
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
        animate={
          isPreloaderDone || shouldReduceMotion
            ? { opacity: 1, y: 0, filter: "blur(0px)" }
            : { opacity: 0, y: 16, filter: "blur(4px)" }
        }
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
            {t.success.title[0]}
            <br />
            {t.success.title[1]}
          </h1>

          <p className="mx-auto mt-8 max-w-3xl font-body text-[17px] uppercase leading-[1.45] text-off-white/80">
            {t.success.body}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
