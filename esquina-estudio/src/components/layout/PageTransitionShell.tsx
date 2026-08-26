"use client";

import { motion } from "framer-motion";
import {
  PAGE_EXIT_EASE,
  useRouteTransition,
} from "@/components/layout/RouteTransitionProvider";

export default function PageTransitionShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { exitDuration, isLeaving } = useRouteTransition();

  return (
    <div className="relative">
      {/*
        `flex min-h-svh flex-col` — el eslabón que faltaba entre el `min-h-svh`
        del `<body>` y el footer.

        El body declara el alto mínimo pero no lo reparte: sus hijos siguen
        midiendo lo que mide su contenido. Medido en `/` a 425 × 747: el footer
        cerraba en 671 y el body en 747, así que quedaban **76 px de body vacío**
        pintados del mismo `bg-off-white` que el footer. Se leían como aire del
        footer y no lo eran: bajarle el relleno al footer movía el hueco, no lo
        sacaba (le sacamos 16 px y el hueco creció 16).

        Declarando el mínimo acá, el `div.relative` de arriba crece con su hijo
        —es un contenedor de bloque— y el `mt-auto` del footer tiene contra qué
        empujar. El sobrante deja de acumularse al pie y sube al aire entre la
        frase y el footer, que es donde se ve bien.

        El `div.relative` sigue siendo solo el contexto de posicionamiento del
        velo de transición y del footer `absolute` de `/contact/success`: no se
        le agregó nada.
      */}
      <motion.div
        initial={false}
        animate={{ opacity: isLeaving ? 0 : 1 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="flex min-h-svh flex-col will-change-opacity"
      >
        {children}
      </motion.div>

      <motion.div
        aria-hidden
        initial={false}
        animate={{ opacity: isLeaving ? 1 : 0 }}
        transition={{ duration: exitDuration, ease: PAGE_EXIT_EASE }}
        className="pointer-events-none absolute inset-0 z-20 bg-off-white"
      />
    </div>
  );
}