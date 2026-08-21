"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ServicesArrow from "@/components/sections/services/ServicesArrow";
import {
  CONTENT_INSET,
  GUTTER,
  LATEST_GRID,
} from "@/components/sections/services/services-layout";
import { getServicesCopy } from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";
import { urlFor } from "@/lib/sanity";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Cierre de `/services`: el rótulo a la izquierda, el párrafo al centro, los dos
 * links a la derecha y, debajo, la fila de las cuatro portadas más recientes.
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
/** Ancho pedido al CDN: 4 portadas en 1920 dan 480 CSS px, y el doble en DPR 2. */
const COVER_CDN_WIDTH = 1200;
const COVER_CDN_HEIGHT = 900;
const COVER_CDN_FORMAT = "webp" as const;

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
      className="group inline-flex w-fit items-center gap-3 font-body text-[24px] uppercase leading-[28px] text-off-black"
    >
      <span className="relative inline-block">
        {label}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px origin-left scale-x-0 bg-off-black transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
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
  const { locale } = useLocale();
  const { label, paragraph, links } = getServicesCopy(locale).latestProjects;
  const lastIndex = projects.length - 1;

  return (
    <section aria-labelledby="latest-projects" className="pb-[120px]">
      {/*
        El texto conserva la misma medida que los packs —`CONTENT_INSET`—, aunque
        acá el sidebar ya no esté: es lo que muestra `08e` y lo que mantiene un
        margen derecho parejo en toda la página. La fila de portadas, en cambio,
        va a sangre y por eso queda fuera de este bloque.
      */}
      <div className={cn(GUTTER, CONTENT_INSET, LATEST_GRID, "pt-[160px]")}>
        <h2
          id="latest-projects"
          className="font-body text-[30px] uppercase leading-[36px] text-off-black"
        >
          {label}
        </h2>

        <p className="mt-10 max-w-[720px] font-body text-[30px] leading-[36px] text-off-black lg:mt-0">
          {paragraph}
        </p>

        {/*
          Hasta `2xl` los links van debajo del párrafo, en su misma columna: a
          esos anchos las tres columnas no entran sin espicharlo (ver
          `LATEST_GRID`).
        */}
        <div className="mt-10 flex flex-col items-start gap-[14px] lg:col-start-2 lg:row-start-2 2xl:col-start-3 2xl:row-start-1 2xl:mt-0">
          {links.map((link) => (
            <UnderlineOnHoverLink
              key={link.href}
              href={link.href}
              label={link.label}
            />
          ))}
        </div>
      </div>

      {projects.length > 0 ? (
        <div
          className="relative mt-[160px] flex w-full"
          style={{ gap: COVER_GAP, paddingInline: COVER_EDGE }}
        >
          {projects.map((project, index) => {
            const isHovered = hoveredIndex === index;
            const isDimmed = hoveredIndex !== null && !isHovered;
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
                aria-label={project.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onFocus={() => setHoveredIndex(index)}
                onBlur={() => setHoveredIndex(null)}
                className={cn(
                  "relative block aspect-[4/3] flex-1 transition-[transform,filter,opacity] duration-500 ease-out motion-reduce:transition-none",
                  isDimmed && DIMMED,
                )}
                style={{
                  backgroundColor: project.coverColor || undefined,
                  transform: isHovered ? `scale(${HOVER_SCALE})` : undefined,
                  transformOrigin:
                    index === 0
                      ? `${EDGE_ORIGIN_PX}px center`
                      : index === lastIndex
                        ? `calc(100% - ${EDGE_ORIGIN_PX}px) center`
                        : "center",
                  zIndex: isHovered ? 2 : 1,
                }}
              >
                {source ? (
                  <Image
                    src={source}
                    alt={project.title}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
