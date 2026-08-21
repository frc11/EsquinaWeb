"use client";

import { motion, type Variants } from "framer-motion";
import SpySentinel from "@/components/sections/services/SpySentinel";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { getServicesCopy } from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";

/**
 * Intro de `/services`: la frase centrada y, debajo, el indicador de scroll.
 *
 * No hay máquina de estados ni scroll-jack (B3.4/F1): esto es una sección de una
 * pantalla de alto sin más comportamiento que su entrada. El gatillo de un
 * scroll hacia Branding Packs lo agrega un componente hermano y no toca este
 * árbol.
 *
 * # La entrada (B3.4b/F2)
 *
 * El desmontaje de B3.4 se llevó la aparición de la frase junto con la máquina
 * vieja. Se restituye acá, y es **solo opacidad**: un desvanecimiento largo, sin
 * desplazamiento, porque la frase ya está centrada en la pantalla y cualquier
 * `y` la haría aterrizar en vez de aparecer.
 *
 * El lenguaje es el mismo que el de las otras dos entradas artesanales del sitio
 * —el Hero y el formulario de Contact— y no un sistema nuevo: variantes de
 * Framer con orquestación por `staggerChildren`, la curva del Hero, y el gateo
 * por preloader, que es lo que hace que la entrada se vea **después** de la
 * cortina y no detrás de ella. Con `prefers-reduced-motion` no hay variantes ni
 * `initial`: el texto ya está.
 *
 * `↓ DISCOVER OUR SERVICES ↓` **no es un botón**: es una señal de que hay que
 * scrollear. Por eso es un `<p>` y no un link ni un `HoverButton`, no cambia con
 * el hover y no tiene `cursor: pointer`. Las flechas van como texto decorativo,
 * fuera del árbol de accesibilidad, para que un lector de pantalla anuncie la
 * frase y no dos flechas sueltas.
 *
 * El alto es una pantalla **descontando el header fijo**, así que Branding Packs
 * empieza exactamente en el pliegue: el `<main>` del layout ya aporta el
 * `pt-[var(--header-height)]`.
 */

/** La curva del Hero. Suave en las dos puntas: lo que pide un fundido largo. */
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
/** Largo del fundido. Es el doble de la entrada del Hero, y a propósito. */
const FADE_DURATION = 1.1;
const FADE_DELAY = 0.12;
/** El indicador entra detrás de la frase, no junto con ella. */
const FADE_STAGGER = 0.22;

const introVariants: Variants = {
  hidden: {},
  visible: {
    transition: { delayChildren: FADE_DELAY, staggerChildren: FADE_STAGGER },
  },
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: FADE_DURATION, ease: EASE },
  },
};

export default function ServicesIntro() {
  const { locale, t } = useLocale();
  const { phrase, scrollHint } = getServicesCopy(locale).intro;
  const { isPreloaderDone } = usePreloader();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      id="intro"
      aria-label={t.services.introLabel}
      className="relative flex min-h-[calc(100vh-var(--header-height))] w-full flex-col items-center justify-center scroll-mt-[var(--header-height)] text-center"
    >
      <SpySentinel id="intro" />

      <motion.div
        className="flex w-full flex-col items-center"
        initial={reduceMotion ? false : "hidden"}
        animate={isPreloaderDone ? "visible" : "hidden"}
        variants={reduceMotion ? undefined : introVariants}
      >
        <motion.p
          className="max-w-[1000px] font-display text-[40px] uppercase leading-[48px] tracking-normal text-off-black"
          variants={reduceMotion ? undefined : fadeVariants}
        >
          {phrase.map((line, index) => (
            // `key` por índice: el texto cambia con el idioma y las líneas son
            // siempre tres, garantizado por el tipo.
            <span key={index} className="block">
              {line}
            </span>
          ))}
        </motion.p>

        <motion.p
          className="mt-[48px] flex items-center gap-3 font-body text-[17px] uppercase leading-[20px] text-off-black"
          variants={reduceMotion ? undefined : fadeVariants}
        >
          <span aria-hidden="true">&darr;</span>
          {scrollHint}
          <span aria-hidden="true">&darr;</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
