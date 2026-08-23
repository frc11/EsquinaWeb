"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import HoverButton from "@/components/ui/HoverButton";
import { useLocale } from "@/lib/i18n";
import { HOME_FOOTER_CLEARANCE, TOUCH_LINKS } from "@/lib/mobile-layout";

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
        /*
          Los dos rellenos son las dos franjas que este panel tapa: arriba la del
          header —la sección sube con un margen negativo para cubrirla, así que
          el contenido tiene que bajar de nuevo— y abajo la del footer, que desde
          M2/F3 va superpuesto sobre este mismo panel. Sin ellos el bloque se
          centra en la pantalla entera y se mete debajo del cromo: a 320 × 640 el
          título quedaba encima del logo.
        */
        className={`relative flex h-full w-full flex-col overflow-y-auto px-6 pt-[var(--header-height)] text-center md:px-12 ${HOME_FOOTER_CLEARANCE}`}
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
        {/*
          `my-auto` y no `justify-center`: centra igual cuando hay lugar y **no
          recorta por arriba** cuando no lo hay. La sección es `overflow-hidden`
          —lo necesita el panel que sube—, así que un bloque más alto que la caja
          se perdería sin más; con esta combinación, en un viewport
          extremadamente bajo el contenido se desplaza dentro del panel y la ruta
          sigue midiendo exactamente una pantalla.
        */}
        <div className="mx-auto my-auto w-full max-w-4xl">
          {/* El piso del `clamp` baja de 40 a 26 px: a 320 la caja util es de 272
              y el titulo va en dos lineas fijas. El termino que manda de 800 px
              para arriba sigue siendo `5vw` con el mismo techo de 64, asi que
              de 1024 en adelante no cambia nada. */}
          <h1 className="font-display text-[clamp(26px,5vw,64px)] uppercase leading-[1.05] text-off-white">
            {t.success.title[0]}
            <br />
            {t.success.title[1]}
          </h1>

          {/*
            La bajada y los dos huecos ceden escala en mobile, y es lo que hace
            que la pantalla entre entera en un teléfono bajo.

            **Los dos huecos van en `clamp(12px, 2.5svh, 20px)` desde M3/F3**, y
            el término del medio es el que importa. Con los 20 px fijos de M2 la
            cuenta a 320 × 640 daba justo: entre el header (128) y el footer
            (236) quedaban 276 px útiles y el bloque pedía 271. Cuando M3/F2
            llevó el footer a 244 —cada red pasó a tener su propia fila, con su
            piso táctil de 44— esos 276 bajaron a 268 y el bloque **se pasó por
            3 px**, que la sección absorbía scrolleando por dentro.

            A 640 de alto el término medio da 16 px y los dos huecos devuelven
            los 8 que hacían falta; de 800 para arriba el `clamp` toca el techo y
            los huecos vuelven a medir 20, así que en los teléfonos de la matriz
            —844 y 932 de alto— **no cambia nada**. Es el mismo recurso que ya
            usa `TeamSection` para su ritmo vertical, no un patrón nuevo.
          */}
          <p className="mx-auto mt-[clamp(12px,2.5svh,20px)] max-w-3xl font-body text-[15px] uppercase leading-[1.4] text-off-white/80 md:mt-8 md:text-[17px] md:leading-[1.45]">
            {t.success.body}
          </p>

          {/*
            La salida (M2/F3, punto 10). Es un link del sitio y nada más: la
            misma escala de cuerpo del párrafo, el subrayado fijo de siempre y el
            relleno del hover en tono oscuro. No es un botón con caja —el sitio
            no tiene ninguno— y no repite lo que ya hace el menú: está para que
            no haga falta abrirlo.
          */}
          <div className={`mt-[clamp(12px,2.5svh,20px)] md:mt-10 ${TOUCH_LINKS}`}>
            <HoverButton
              href="/"
              tone="dark"
              underline
              tightUnderline
              className="font-body text-[17px] font-medium uppercase tracking-normal"
            >
              {t.success.backHome}
            </HoverButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
