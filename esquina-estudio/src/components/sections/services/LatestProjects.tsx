"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ServicesArrow from "@/components/sections/services/ServicesArrow";
import {
  CONTENT_INSET,
  GUTTER,
  LATEST_GRID,
  SERVICES_HEADING_30,
  SERVICES_LINK_24,
} from "@/components/sections/services/services-layout";
import { getServicesCopy } from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity";
import { projectText } from "@/lib/project-text";
import { useIsBelowDesktop } from "@/lib/use-media-query";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Cierre de `/services`: el rótulo a la izquierda y el párrafo a la derecha;
 * debajo, las cuatro portadas más recientes en **cuadrícula de 2 × 2**; y
 * después de la cuadrícula, los dos links.
 *
 * # El orden y el tamaño (M3/F6, punto 10)
 *
 * Hasta M2 las cuatro portadas iban en **una fila de cuatro** y los dos links
 * compartían fila con el texto, o sea **arriba** de las portadas. Ahora el
 * bloque se lee de arriba abajo: título y descripción → cuadrícula → links.
 *
 * Las portadas pasan de un cuarto del ancho a la mitad: a 1920 cada una va de
 * 471,5 × 353,6 a **949 × 711,75**, o sea cuatro veces el área. Con eso la
 * cuadrícula ocupa su propio espacio y deja de ser una franja: dos filas más el
 * hueco dan 1429,5 px de alto, así que el título, la descripción y las cuatro
 * portadas **no entran juntos en una pantalla**, que es lo que pidió Valentino.
 *
 * **Debajo de 1024 va en una sola columna, y salió de medir.** A 390 la
 * cuadrícula de dos daría portadas de 184 × 138 px —más chicas que las tarjetas
 * de `/work`, ilegibles para una portada— mientras que en una columna miden
 * 374 × 280,5.
 *
 * El corte es `lg`, que es **el** corte del sitio, y no `md`, y eso también se
 * midió: con el corte en 768 la tablet en vertical (768 × 1024) daba portadas de
 * 373 × 280 y el bloque entero —título, descripción y las cuatro— medía 910 px
 * contra 1024 de pantalla, o sea que **entraba todo junto**, que es justo lo que
 * el punto 10 no quiere. Con el corte en 1024 esa tablet va en una columna, las
 * portadas miden 752 × 564 y el bloque pasa a medir más del doble de la
 * pantalla.
 *
 * # Los dos links
 *
 * No usan `HoverButton`. No es por gusto: el mockup pide que **el subrayado
 * aparezca en el hover**, y `HoverButton` lo tiene como booleano fijo. Atarlo a
 * un estado tampoco funciona: su relleno negro sube en el mismo gesto y taparía
 * la línea, que también es negra. Así que van como link con su propia línea que
 * crece de izquierda a derecha. No es un primitivo nuevo ni compite con
 * `HoverButton`: es un estilo de link local a esta sección.
 *
 * La flecha queda **fuera** del subrayado, como en `08e`.
 *
 * # Las separaciones (B3.4b/F5)
 *
 * B3.4 las pidió pegadas entre sí y a sangre; el mockup `08e` muestra otra cosa
 * y manda el mockup. Medido sobre el export (1328 px de ancho, factor 0,690
 * contra 1920): los huecos entre portadas dan 4,0 · 4,0 · 5,0 px del export, o
 * sea unos **6 px** a 1920; los márgenes contra los bordes dan 3,5 y 6,8, o sea
 * entre 5 y 10, de donde salen los **8 px** de acá. Las dos medidas son fijas y
 * no proporcionales, igual que el gutter del cromo.
 *
 * Van como estilo en línea y no como clases porque el hover necesita los mismos
 * números (ver abajo) y no pueden quedar escritos en dos lados.
 *
 * # El hover de las portadas — **de 1024 para arriba y nada más** (M1/F5)
 *
 * En touch el hover no existe, y el de Framer se dispara con el tap y se queda
 * pegado: la portada tocada quedaría agrandada y las otras tres difuminadas
 * hasta que alguien tocara otra cosa. Debajo de 1024 px, entonces, las cuatro
 * portadas **se muestran quietas** —sin escala y sin difuminado, que es lo que
 * pide §3.2 de la instrucción—: no se registran los cuatro manejadores y el
 * estado no se toca nunca.
 *
 * # El hover de las portadas
 *
 * La que recibe el cursor se agranda y el resto se difumina. Como el crecimiento
 * es un `transform`, no mueve a las vecinas —las tapa—, y por eso la que crece
 * sube de `z-index`.
 *
 * **Las de los bordes seguían creciendo hacia adentro con el borde exterior
 * clavado**, y con el margen nuevo eso ya no se sostiene: la portada dejó de
 * estar pegada al viewport, así que clavar su lado exterior deja un margen que
 * no se mueve mientras todo lo demás crece, y se lee como si la portada no
 * cupiera. Ahora crecen **hasta comerse el margen y ni un píxel más**: el origen
 * de la transformación se corre hacia adentro justo lo necesario para que el
 * lado exterior llegue al borde de la pantalla.
 *
 * La distancia sale de despejar `d · (escala − 1) = margen`, y el resultado es
 * **independiente del ancho de la portada**, así que es un número y no una
 * medición: a cualquier viewport, el origen va a `EDGE_ORIGIN_PX` del lado
 * exterior. Las del medio siguen creciendo hacia los dos lados.
 *
 * No hay recorte en la fila: recortarla anularía justamente el efecto. Tampoco
 * hace falta, porque con ese origen el crecimiento hacia afuera termina
 * exactamente en el borde del viewport; lo único que se sale es un poco de alto,
 * y para eso está el aire de abajo.
 */

/** Cuánto crece la portada con el cursor encima. */
const HOVER_SCALE = 1.08;
/** Separación entre portadas. La «línea delgada» de `08e`. */
const COVER_GAP = 6;
/** Margen de la fila contra los bordes de la página. */
const COVER_EDGE = 8;
/**
 * Origen del crecimiento de las portadas de los bordes, medido desde su lado
 * exterior: `d · (HOVER_SCALE − 1) = COVER_EDGE`. Con estos valores, 100 px.
 */
const EDGE_ORIGIN_PX = COVER_EDGE / (HOVER_SCALE - 1);
/** Difuminado y opacidad de las que no reciben el cursor. */
const DIMMED = "blur-[4px] opacity-70";
/**
 * Ancho pedido al CDN. **Sube de 1200 a 1800 con la cuadrícula** (M3/F6): con
 * cuatro portadas en fila cada una medía 471,5 CSS px y 1200 alcanzaba de sobra;
 * en 2 × 2 miden 949, que a DPR 2 son 1898 px de dispositivo, y servir 1200
 * dejaría la portada escalada hacia arriba. Se mantiene el 4:3.
 */
const COVER_CDN_WIDTH = 1800;
const COVER_CDN_HEIGHT = 1350;
const COVER_CDN_FORMAT = "webp" as const;

/**
 * Debajo de 1024 px el subrayado va **siempre puesto** (`max-lg:scale-x-100`):
 * es la misma regla que §3.2 escribe para los links del cromo —en touch el
 * hover no existe—, y sin ella estos dos links serían los únicos del sitio sin
 * línea. El área tocable toma los 44 px de piso por la misma razón.
 */
function UnderlineOnHoverLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex w-fit items-center gap-3 font-body uppercase text-off-black max-lg:min-h-[44px]",
        SERVICES_LINK_24,
      )}
    >
      <span className="relative inline-block">
        {label}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-off-black transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none max-lg:scale-x-100"
        />
      </span>
      <ServicesArrow />
    </Link>
  );
}

export default function LatestProjects({
  projects,
}: {
  projects: readonly Project[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  // El gesto de hover es de escritorio: debajo de 1024 no se cuelga ni un
  // manejador y las portadas se quedan quietas.
  const hoverEnabled = !useIsBelowDesktop();
  const { locale } = useLocale();
  const { label, paragraph, links } = getServicesCopy(locale).latestProjects;

  return (
    <section aria-labelledby="latest-projects" className="pb-16 md:pb-[120px]">
      {/*
        El texto conserva la misma medida que los packs —`CONTENT_INSET`—, aunque
        acá el sidebar ya no esté: es lo que muestra `08e` y lo que mantiene un
        margen derecho parejo en toda la página. La fila de portadas, en cambio,
        va a sangre y por eso queda fuera de este bloque.
      */}
      <div className={cn(GUTTER, CONTENT_INSET, LATEST_GRID, "pt-16 md:pt-[160px]")}>
        <h2
          id="latest-projects"
          className={cn("font-body uppercase text-off-black", SERVICES_HEADING_30)}
        >
          {label}
        </h2>

        <p
          className={cn(
            "mt-6 max-w-[720px] font-body text-off-black md:mt-10 lg:mt-0",
            SERVICES_HEADING_30,
          )}
        >
          {paragraph}
        </p>

      </div>

      {projects.length > 0 ? (
        <div
          /*
            Una columna debajo de 768 y dos de ahí para arriba. Las separaciones
            son las mismas de siempre —`COVER_GAP` entre portadas y `COVER_EDGE`
            contra los bordes—: la cuadrícula cambia el reparto, no las medidas.
          */
          className="relative mt-16 grid w-full grid-cols-1 md:mt-[160px] lg:grid-cols-2"
          style={{ gap: COVER_GAP, paddingInline: COVER_EDGE }}
        >
          {projects.map((project, index) => {
            const isHovered = hoverEnabled && hoveredIndex === index;
            const title = projectText(project, locale, "title");
            const isDimmed = hoverEnabled && hoveredIndex !== null && !isHovered;
            const source =
              typeof project.coverImage === "string"
                ? project.coverImage
                : project.coverImage
                  ? urlFor(project.coverImage)
                      .width(COVER_CDN_WIDTH)
                      .height(COVER_CDN_HEIGHT)
                      .format(COVER_CDN_FORMAT)
                      .url()
                  : null;

            return (
              <Link
                key={project._id}
                href={`/work/${project.slug.current}`}
                aria-label={title}
                onMouseEnter={
                  hoverEnabled ? () => setHoveredIndex(index) : undefined
                }
                onMouseLeave={
                  hoverEnabled ? () => setHoveredIndex(null) : undefined
                }
                onFocus={hoverEnabled ? () => setHoveredIndex(index) : undefined}
                onBlur={hoverEnabled ? () => setHoveredIndex(null) : undefined}
                className={cn(
                  "relative block aspect-[4/3] flex-1 transition-[transform,filter,opacity] duration-500 ease-out motion-reduce:transition-none",
                  isDimmed && DIMMED,
                )}
                style={{
                  backgroundColor: project.coverColor || undefined,
                  transform: isHovered ? `scale(${HOVER_SCALE})` : undefined,
                  /*
                    En 2 × 2 **las cuatro portadas tocan un borde**: las pares la
                    izquierda y las impares la derecha. Antes solo la primera y la
                    última lo hacían y las dos del medio crecían hacia los dos
                    lados; ahora esa rama no existe. El número sigue siendo el
                    mismo `EDGE_ORIGIN_PX`, que no depende del ancho de la
                    portada. Debajo de 1024 el hover no se registra, así que en
                    la columna única esto queda inerte.
                  */
                  transformOrigin:
                    index % 2 === 0
                      ? `${EDGE_ORIGIN_PX}px center`
                      : `calc(100% - ${EDGE_ORIGIN_PX}px) center`,
                  zIndex: isHovered ? 2 : 1,
                }}
              >
                {source ? (
                  <Image
                    src={source}
                    alt={title}
                    fill
                    // Una columna debajo de 768, media pantalla de ahí para
                    // arriba. Los `vw` van dentro de `calc()` a propósito: ver la
                    // nota de `src/lib/mobile-layout.ts`.
                    sizes="(max-width: 1023.98px) calc(100vw - 16px), calc(50vw)"
                    className="object-cover"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}

      {/*
        Los dos links, **después de la cuadrícula** (punto 10). Van en la
        columna 2 de la misma grilla que el texto, así que quedan alineados con
        el párrafo y el cierre conserva las dos verticales de la página.

        Los 120 px de aire no son un número nuevo: son los mismos que la sección
        ya usa como relleno inferior. Los 160 quedan para lo que separa bloques
        mayores —el texto de la cuadrícula—, y estos links son el cierre de la
        cuadrícula, no un bloque aparte.
      */}
      <div className={cn(GUTTER, CONTENT_INSET, LATEST_GRID, "mt-16 md:mt-[120px]")}>
        <div className="flex flex-col items-start gap-[14px] lg:col-start-2">
          {links.map((link) => (
            <UnderlineOnHoverLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
