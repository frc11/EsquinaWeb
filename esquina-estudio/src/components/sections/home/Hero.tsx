"use client";

import { Fragment, useState } from "react";
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
  /*
    ¿La entrada ya corrió? (R2/F7.)

    Desde R2 los dos idiomas **no tienen la misma cantidad de líneas** —tres en
    inglés, dos en castellano—, así que al pasar de castellano a inglés aparece
    un `<p>` que antes no existía. Un hijo que se monta dentro de un padre que ya
    está en su variante final hereda `hidden` y anima solo hasta `visible`: la
    tercera línea entraba sola, con su stagger, a mitad de la cortina de cambio
    de idioma.

    La `key` no lo arregla, y conviene dejarlo escrito porque es contraintuitivo:
    con una `key` derivada del texto se remontarían **las tres** líneas en cada
    cambio —el texto cambia entero— y la frase se reanimaría completa, que es
    justo lo que §6 (contrato 5) manda evitar. El índice deja sobrevivir a las
    líneas que existen en los dos idiomas; lo único que falta es que la línea
    nueva **nazca ya en su estado final**, y eso es `initial={false}`.

    La puerta es **estado y no un `ref`**: `initial` se lee durante el render y
    leer un `ref` ahí es impuro (lo ataja `react-hooks/refs`). El render de más
    que cuesta ocurre una sola vez, cuando la entrada termina, y no toca a los
    `<p>` que ya están montados: `initial` solo se consume al montar.

    Se cierra cuando la entrada termina, o sea que la primera visita —y la
    recarga a mitad de sesión, donde el preloader dura 0 ms— animan igual que
    siempre.
  */
  const [hasEntered, setHasEntered] = useState(false);

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
          onAnimationComplete={() => setHasEntered(true)}
          className="font-display text-[26px] uppercase leading-[31px] tracking-normal text-off-black md:text-[40px] md:leading-[48px]"
        >
          {getHeroLines(locale).map((line, lineIndex) => (
            // `key` por índice y no por texto: con el texto, cambiar de idioma
            // desmontaría y volvería a montar TODOS estos `<p>`, y como tienen
            // animación de entrada la frase se reanimaría entera en cada cambio.
            // Con el índice sobreviven las líneas comunes a los dos idiomas.
            // `initial={false}` una vez que la entrada corrió: es lo que hace que
            // la línea que se monta al pasar a inglés aparezca ya en su lugar en
            // vez de animarse sola. Ver el bloque de `hasEntered`.
            <motion.p
              key={lineIndex}
              variants={lineVariants}
              initial={hasEntered ? false : undefined}
            >
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
