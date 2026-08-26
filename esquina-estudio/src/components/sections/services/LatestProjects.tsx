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
 * Cierre de `/services`. **Dos composiciones, una por rango, y el corte es el
 * único del sitio: 1024** (M8).
 *
 * - **De 1024 para arriba** —lo que muestra `08e`—: el rótulo a la izquierda, el
 *   párrafo al centro, los dos links a la derecha, los tres en la **fila del
 *   encabezado**, y debajo las portadas en **una sola fila**.
 * - **Debajo de 1024**: rótulo, párrafo, las portadas en **una columna** y los
 *   dos links **después** de ellas.
 *
 * # Por qué hay dos composiciones (M8, sobre M3/F6)
 *
 * M3/F6 hizo dos cambios en este bloque —las portadas de fila a cuadrícula, y
 * los links de la fila del encabezado a debajo de las portadas— y los aplicó **en
 * todos los anchos**. Los dos valían para mobile y ninguno para escritorio: a
 * 1920 la cuadrícula dejaba portadas de 949 px, dos por renglón, y los links
 * quedaban a 1550 px del rótulo al que pertenecen. M8 devuelve el escritorio a
 * lo aprobado en B3.4b/F5 y **conserva mobile tal cual estaba**.
 *
 * **Debajo de 1024 la cuadrícula nunca fue de dos.** La clase es `grid-cols-1`
 * sin variante intermedia: en teléfonos y en tablet vertical las portadas van
 * una debajo de la otra, a todo el ancho menos el margen. Es lo que M3/F6 midió
 * y eligió —a 390, dos columnas darían portadas de 184 × 138 px, más chicas que
 * las tarjetas de `/work`— y es lo que se conserva.
 *
 * **Cómo conviven los dos repartos de las portadas.** El contenedor es
 * `grid grid-cols-1 lg:flex`: debajo de 1024 manda la grilla de una columna y de
 * ahí para arriba manda `flex`, con lo que la grilla queda inerte y las portadas
 * —que llevan `flex-1`— se reparten el renglón en partes iguales. La fila se
 * adapta sola a **cuántas portadas devuelva el dataset**, que hoy son tres y
 * pueden ser hasta cuatro; una `grid-cols-4` habría dejado un hueco del ancho de
 * una portada cuando son tres.
 *
 * **Cómo conviven los dos lugares de los links.** El bloque se escribe dos veces
 * —uno en la fila del encabezado, `hidden lg:flex`, y otro después de las
 * portadas, `lg:hidden`— y nunca se ven los dos: el rango los excluye. No se
 * puede hacer con uno solo, porque en escritorio el bloque tiene que ser **hijo
 * de la grilla del encabezado** para caer en su columna, y en mobile tiene que
 * ser **hermano posterior** de la fila de portadas, que es otro elemento. El
 * marcado sale de `ProjectLinks`, así que los rótulos, el subrayado y la flecha
 * se declaran una sola vez. La copia oculta va con `display: none`, o sea que no
 * está en el árbol de accesibilidad ni en el orden de tabulación: el lector de
 * pantalla encuentra los dos links una vez, no dos.
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
 * Ancho pedido al CDN. **Se queda en 1800 aunque el escritorio vuelva a la fila**
 * (M8): el que manda ahora es el rango de abajo, donde la portada ocupa todo el
 * ancho —752 CSS px en una tablet vertical, que a DPR 2 son 1504 de dispositivo—
 * y los 1200 de antes de M3/F6 la dejarían escalada hacia arriba. Es el techo de
 * la fuente y no el peso servido: quien recorta por viewport es el optimizador
 * de `next/image` a partir de `sizes`. Se mantiene el 4:3.
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

/**
 * La columna de los dos links. Se monta en **dos lugares** —la fila del
 * encabezado en escritorio, después de las portadas en mobile— y por eso vive
 * acá: el rótulo, el subrayado y la flecha se declaran una sola vez. Ver la nota
 * de arriba sobre por qué no puede ser un solo nodo.
 */
function ProjectLinks({
  links,
  className,
}: {
  links: readonly { href: string; label: string }[];
  className: string;
}) {
  return (
    <div className={cn("flex-col items-start gap-[14px]", className)}>
      {links.map((link) => (
        <UnderlineOnHoverLink
          key={link.href}
          href={link.href}
          label={link.label}
        />
      ))}
    </div>
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
  const lastIndex = projects.length - 1;

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

        {/*
          Los dos links de **escritorio**, en la fila del encabezado. Hasta `2xl`
          bajan a una segunda fila dentro de la columna del párrafo: a esos
          anchos las tres columnas no entran sin espicharlo (ver `LATEST_GRID`).
          Siguen estando arriba de las portadas en los dos casos.

          Debajo de 1024 esta copia no se muestra y la que se ve es la de después
          de las portadas.
        */}
        <ProjectLinks
          links={links}
          className="hidden md:mt-10 lg:col-start-2 lg:row-start-2 lg:flex 2xl:col-start-3 2xl:row-start-1 2xl:mt-0"
        />
      </div>

      {projects.length > 0 ? (
        <div
          /*
            Una columna debajo de 1024 y una sola fila de ahí para arriba: la
            grilla queda inerte cuando entra `lg:flex` y las portadas se reparten
            el renglón por su `flex-1`. Las separaciones son las mismas de
            siempre —`COVER_GAP` entre portadas y `COVER_EDGE` contra los
            bordes—: lo que cambia es el reparto, no las medidas.
          */
          className="relative mt-16 grid w-full grid-cols-1 md:mt-[160px] lg:flex"
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
                    En la fila las que tocan un borde son **la primera y la
                    última**, y crecen hacia adentro justo lo que mide el margen;
                    las del medio crecen hacia los dos lados. M3/F6 había pasado
                    a `index % 2` porque en 2 × 2 las cuatro tocaban un borde, y
                    esa rama se va con la cuadrícula. Debajo de 1024 el hover no
                    se registra, así que en la columna única esto queda inerte.
                  */
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
                    alt={title}
                    fill
                    // Todo el ancho menos el margen debajo de 1024; de ahí
                    // para arriba, la parte del renglón que le toque. El techo
                    // es **un tercio**, que es lo que mide con las tres portadas
                    // que hay hoy; con cuatro mide un cuarto y sobra hint, que es
                    // el lado seguro. Los `vw` van dentro de `calc()` a
                    // propósito: ver la nota de `src/lib/mobile-layout.ts`.
                    sizes="(max-width: 1023.98px) calc(100vw - 16px), calc(34vw)"
                    className="object-cover"
                  />
                ) : null}
              </Link>
            );
          })}
        </div>
      ) : null}

      {/*
        Los dos links de **mobile**, después de las portadas: el bloque se lee de
        arriba abajo —rótulo, descripción, portadas, links—, que es lo que M3/F6
        pidió para el teléfono y M8 conserva.

        Los 120 px de aire no son un número nuevo: son los mismos que la sección
        ya usa como relleno inferior. Los 160 quedan para lo que separa bloques
        mayores —el texto de las portadas—, y estos links son el cierre de las
        portadas, no un bloque aparte.

        No lleva ni `LATEST_GRID` ni `CONTENT_INSET`: los dos son inertes debajo
        de 1024 —una grilla de una columna con un solo hijo, y un `lg:pr`— y este
        bloque no existe de 1024 para arriba. Verificado midiendo: la geometría de
        mobile no se mueve ni un píxel.
      */}
      <ProjectLinks
        links={links}
        className={cn(GUTTER, "flex mt-16 md:mt-[120px] lg:hidden")}
      />
    </section>
  );
}
