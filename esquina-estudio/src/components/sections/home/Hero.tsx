"use client";

import { Fragment } from "react";
import { motion, type Variants } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { getHeroLines } from "@/lib/site-copy";
import { useLocale } from "@/lib/i18n";

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TITLE_DELAY = 0.12;
const TITLE_STAGGER = 0.08;
const TITLE_LINE_DURATION = 0.42;

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

/**
 * Hero de home: la frase de la marca, centrada, 40/48/0. El texto sale de
 * `site-copy` (fuente única compartida con el footer de las rutas internas), y
 * el espacio entre fragmentos se emite fuera del `<span>` que aplica la negrita
 * — contrato documentado en `site-copy.ts` — para que su avance no dependa del
 * peso de la Manrope variable. La entrada es por línea, con stagger, gateada por
 * el preloader.
 */
export default function Hero() {
  const { isPreloaderDone } = usePreloader();
  const { locale } = useLocale();

  return (
    <section className="flex h-full min-h-0 flex-col items-center justify-center overflow-hidden px-6 py-4 text-center md:px-12">
      <motion.div
        key={isPreloaderDone ? "home-ready" : "home-waiting"}
        initial={{ opacity: 0 }}
        animate={{ opacity: isPreloaderDone ? 1 : 0 }}
        transition={{ duration: 0 }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isPreloaderDone ? "visible" : "hidden"}
          className="font-display text-[26px] uppercase leading-[31px] tracking-normal text-off-black md:text-[40px] md:leading-[48px]"
        >
          {getHeroLines(locale).map((line, lineIndex) => (
            // `key` por índice y no por texto: con el texto, cambiar de idioma
            // desmontaría y volvería a montar estos `<p>`, y como tienen
            // animación de entrada la frase se reanimaría en cada cambio. Las
            // dos variantes tienen tres líneas —lo garantiza `ThreeLines`—, así
            // que el índice es estable.
            <motion.p key={lineIndex} variants={lineVariants}>
              {line.map((fragment, index) => (
                <Fragment key={index}>
                  {index > 0 && " "}
                  <span className={fragment.bold ? "font-semibold" : undefined}>
                    {fragment.text}
                  </span>
                </Fragment>
              ))}
            </motion.p>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
