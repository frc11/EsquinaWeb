"use client";

import { motion } from "framer-motion";
import SpySentinel from "@/components/sections/services/SpySentinel";
import {
  entranceFadeVariants,
  entranceGroup,
} from "@/components/ui/entrance-fade";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { SERVICES_DISPLAY_40 } from "@/components/sections/services/services-layout";
import { getServicesCopy } from "@/lib/services-content";
import { cn } from "@/lib/utils";
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
 * **Desde R2/F10 el patrón no vive acá**: se extrajo a
 * `@/components/ui/entrance-fade` porque el formulario de Contact pasó a usar el
 * mismo, por pedido de las clientas. Este componente es ahora uno de sus dos
 * consumidores y no dueño de ningún número. El gateo por preloader sí es de acá,
 * y es lo que hace que la entrada se vea **después** de la cortina y no detrás
 * de ella. Con `prefers-reduced-motion` no hay variantes ni `initial`: el texto
 * ya está.
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
 *
 * # Por qué `lvh` y no `svh` (M3/F6, punto 9)
 *
 * El reporte es que al entrar a `/services` **se asoma «BRANDING PACKS»**. En
 * el banco no reproduce: medido en 21 combinaciones —1920, 1366 y 390 de
 * ancho por siete u ocho altos cada uno— el borde inferior del intro cae
 * **exactamente** en el alto del viewport en todas, y el rótulo queda 160 px
 * por debajo en escritorio y 80 en mobile. La geometría es exacta y no depende
 * del tamaño de la pantalla.
 *
 * Solo queda un mecanismo que pueda producirlo, y es el mismo que estaba
 * detrás del punto 4: **la barra del navegador en un teléfono**. `svh` es el
 * viewport chico, o sea el que queda **con la barra puesta**; cuando la barra
 * se retrae, lo que se ve pasa a ser `lvh`, entre 60 y 110 px más alto según
 * el navegador. El intro seguía midiendo `svh` y esa diferencia —mayor que los
 * 80 px de aire que tiene el rótulo en mobile— es justo lo que se asoma.
 *
 * Con `lvh` el intro mide **lo más alto que el viewport puede llegar a ser**,
 * así que no hay estado de la barra en que algo de abajo entre en la primera
 * pantalla. No contradice la regla «nada de `100vh`: `100svh`»: esa regla es
 * para lo que tiene que **entrar** en la pantalla, y acá se pide lo contrario
 * —una sección que nunca sea **más baja** que lo que se ve—, y para eso el
 * máximo es la unidad correcta. En escritorio las tres unidades valen lo
 * mismo, así que ≥1024 no cambia ni un píxel (verificado).
 *
 * El costo, acotado: con la barra puesta la sección es `lvh − svh` más alta
 * que lo visible, y como el contenido va centrado se corre hacia abajo la
 * mitad de esa diferencia, unos 40 px. Debajo del indicador de scroll hay
 * entre 137 y 283 px de aire medidos en los altos de mobile, así que la frase
 * y el indicador siguen entrando con holgura.
 */

/**
 * Dos hijos —la frase y el indicador de scroll—, con la cadencia por defecto del
 * módulo: el indicador entra detrás de la frase, no junto con ella. Se declara a
 * nivel de módulo porque `entranceGroup` devuelve un objeto nuevo por llamada.
 */
const introVariants = entranceGroup();

export default function ServicesIntro() {
  const { locale, t } = useLocale();
  const { phrase, scrollHint } = getServicesCopy(locale).intro;
  const { isPreloaderDone } = usePreloader();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      id="intro"
      aria-label={t.services.introLabel}
      className="relative flex min-h-[calc(100lvh-var(--header-height))] w-full flex-col items-center justify-center scroll-mt-[var(--header-height)] text-center"
    >
      <SpySentinel id="intro" />

      <motion.div
        className="flex w-full flex-col items-center"
        initial={reduceMotion ? false : "hidden"}
        animate={isPreloaderDone ? "visible" : "hidden"}
        variants={reduceMotion ? undefined : introVariants}
      >
        <motion.p
          className={cn(
            "max-w-[1000px] font-display uppercase tracking-normal text-off-black",
            SERVICES_DISPLAY_40,
          )}
          variants={reduceMotion ? undefined : entranceFadeVariants}
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
          className="mt-8 flex items-center gap-3 font-body text-[17px] uppercase leading-[20px] text-off-black md:mt-[48px]"
          variants={reduceMotion ? undefined : entranceFadeVariants}
        >
          <span aria-hidden="true">&darr;</span>
          {scrollHint}
          <span aria-hidden="true">&darr;</span>
        </motion.p>
      </motion.div>
    </section>
  );
}
