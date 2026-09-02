"use client";

import Link from "next/link";
import HoverButton from "@/components/ui/HoverButton";
import ServicesArrow from "@/components/sections/services/ServicesArrow";
import SpySentinel from "@/components/sections/services/SpySentinel";
import {
  ITEM_GRID,
  ITEM_RULE_BORDER,
  SECTION_GRID,
  SECTION_RULE,
  SERVICES_ANCHOR_ATTR,
  SERVICES_BODY_20,
  SERVICES_HEADING_30,
  SERVICES_LINK_24,
} from "@/components/sections/services/services-layout";
import {
  getServicePack,
  getServicesCopy,
  type ServicePackId,
} from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Una de las cuatro secciones de packs. Composición de los mockups: a la
 * izquierda el número, el nombre y la descripción; a la derecha la lista de
 * ítems con su detalle en gris, y el `REQUEST FORMAL QUOTE` alineado a la
 * derecha al cierre.
 *
 * Recibe el **id** y no el pack entero: el pack depende del idioma y la página
 * es un componente de servidor, que siempre rinde inglés. La estructura —cuáles
 * son los cuatro y en qué orden— sigue viviendo en la página; el contenido lo
 * resuelve este componente.
 *
 * El `id` es a la vez el ancla del sidebar y el objetivo del scroll-spy. El
 * `scroll-mt` existe para el camino sin JavaScript: si alguien llega con
 * `/services#universe` antes de que hidrate, el salto nativo respeta el header
 * fijo igual que el salto animado.
 */
export default function ServicePackSection({
  packId,
}: {
  packId: ServicePackId;
}) {
  const { locale } = useLocale();
  const pack = getServicePack(locale, packId);
  const quoteHref = pack.quoteService
    ? `/contact?service=${encodeURIComponent(pack.quoteService)}`
    : "/contact";
  // Un solo punto de resolución del rótulo: el del pack le gana al global. Sin
  // esto habría que repetir el `<Link>` entero en dos ramas.
  const quoteLabel = pack.quoteLabel ?? getServicesCopy(locale).quoteLabel;

  return (
    <section
      id={pack.id}
      aria-labelledby={`${pack.id}-name`}
      className="relative scroll-mt-[var(--header-height)]"
    >
      <SpySentinel id={pack.id} />

      <div className={cn("h-px w-full", SECTION_RULE)} aria-hidden="true" />

      {/*
        El salto del sidebar aterriza **acá adentro**, no en el tope de la
        sección: apuntando al tope, la divisoria quedaba clavada bajo el header
        (B3.4b/F3). Ver el criterio único en `services-layout`.
      */}
      <div
        {...{ [SERVICES_ANCHOR_ATTR]: "" }}
        className={cn(SECTION_GRID, "pb-16 pt-16 md:pb-[120px] md:pt-[160px]")}
      >
        {pack.number ? (
          <p
            className={cn(
              "mb-[12px] font-body text-off-black lg:col-start-1 lg:row-start-1",
              SERVICES_HEADING_30,
            )}
          >
            {pack.number}
          </p>
        ) : null}

        <div className="lg:col-start-1 lg:row-start-2">
          <h3
            id={`${pack.id}-name`}
            className={cn("font-body uppercase text-off-black", SERVICES_HEADING_30)}
          >
            {pack.name.map((line, index) => (
              <span key={index} className="block">
                {line}
              </span>
            ))}
          </h3>

          <div
            className={cn(
              "mt-8 space-y-[22px] font-body text-off-black md:mt-[56px]",
              SERVICES_BODY_20,
            )}
          >
            {pack.description.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {pack.footnote ? (
            <div className="mt-8 font-body text-off-black md:mt-[40px]">
              <p className={SERVICES_BODY_20}>{pack.footnote[0]}</p>
              <p className="mt-[16px] text-[17px] uppercase leading-[20px]">
                {pack.footnote[1]}
              </p>
            </div>
          ) : null}
        </div>

        <div className="mt-10 lg:col-start-2 lg:row-start-2 lg:mt-0">
          <ul>
            {pack.items.map((item, index) => (
              <li
                key={index}
                className={cn(
                  "py-4 md:py-[22px]",
                  index > 0 && ["border-t", ITEM_RULE_BORDER],
                )}
              >
                <div className={ITEM_GRID}>
                  <p
                    className={cn(
                      "font-body text-off-black",
                      SERVICES_HEADING_30,
                    )}
                  >
                    {item.name}
                  </p>
                  {item.detail ? (
                    <p
                      className={cn(
                        "font-body text-gray-brand md:text-right",
                        SERVICES_BODY_20,
                      )}
                    >
                      {item.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex flex-col items-end md:mt-[88px]">
            {/*
              El precio va ARRIBA del CTA y alineado a la derecha con él: lo
              alinea el `items-end` de esta columna, que es el mismo eje del que
              ya cuelgan el link y la nota. Medido contra
              `docs/archivo/mockups/r2-trad-03.jpg`.

              La escala es la de los nombres de ítem (`SERVICES_HEADING_30`) y no
              la del link: el precio es un valor, no una acción, y en la
              referencia se lee un escalón por encima del CTA.
            */}
            {pack.price ? (
              <p
                className={cn(
                  "mb-[10px] font-body text-off-black md:mb-[14px]",
                  SERVICES_HEADING_30,
                )}
              >
                {pack.price}
              </p>
            ) : null}

            {/*
              El link envuelve texto y flecha, pero el subrayado y el relleno de
              hover son solo del texto: en el mockup la flecha queda fuera de la
              línea. `HoverButton` va como `span` porque el `<a>` ya es este
              `Link` — anidarlos rompería la semántica.
            */}
            <Link
              href={quoteHref}
              className="flex items-center gap-3 text-off-black max-lg:min-h-[44px]"
            >
              <HoverButton
                as="span"
                className={cn("font-body uppercase", SERVICES_LINK_24)}
              >
                {quoteLabel}
              </HoverButton>
              <ServicesArrow />
            </Link>

            {pack.quoteNote ? (
              <p
                className={cn(
                  "mt-[14px] max-w-[340px] text-right font-body text-gray-brand",
                  SERVICES_BODY_20,
                )}
              >
                {pack.quoteNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
