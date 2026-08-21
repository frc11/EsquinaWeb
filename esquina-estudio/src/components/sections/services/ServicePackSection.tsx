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
} from "@/components/sections/services/services-layout";
import { SERVICES_COPY, type ServicePack } from "@/lib/services-content";
import { cn } from "@/lib/utils";

/**
 * Una de las cuatro secciones de packs. Composición de los mockups: a la
 * izquierda el número, el nombre y la descripción; a la derecha la lista de
 * ítems con su detalle en gris, y el `REQUEST FORMAL QUOTE` alineado a la
 * derecha al cierre.
 *
 * El `id` es a la vez el ancla del sidebar y el objetivo del scroll-spy. El
 * `scroll-mt` existe para el camino sin JavaScript: si alguien llega con
 * `/services#universe` antes de que hidrate, el salto nativo respeta el header
 * fijo igual que el salto animado.
 */
export default function ServicePackSection({ pack }: { pack: ServicePack }) {
  const quoteHref = pack.quoteService
    ? `/contact?service=${encodeURIComponent(pack.quoteService)}`
    : "/contact";

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
        className={cn(SECTION_GRID, "pt-[160px] pb-[120px]")}
      >
        {pack.number ? (
          <p className="mb-[12px] font-body text-[30px] leading-[36px] text-off-black lg:col-start-1 lg:row-start-1">
            {pack.number}
          </p>
        ) : null}

        <div className="lg:col-start-1 lg:row-start-2">
          <h3
            id={`${pack.id}-name`}
            className="font-body text-[30px] uppercase leading-[36px] text-off-black"
          >
            {pack.name.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h3>

          <div className="mt-[56px] space-y-[22px] font-body text-[20px] leading-[26px] text-off-black">
            {pack.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {pack.footnote ? (
            <div className="mt-[40px] font-body text-off-black">
              <p className="text-[20px] leading-[26px]">{pack.footnote[0]}</p>
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
                key={item.name}
                className={cn(
                  "py-[22px]",
                  index > 0 && ["border-t", ITEM_RULE_BORDER],
                )}
              >
                <div className={ITEM_GRID}>
                  <p className="font-body text-[30px] leading-[36px] text-off-black">
                    {item.name}
                  </p>
                  {item.detail ? (
                    <p className="font-body text-[20px] leading-[26px] text-gray-brand md:text-right">
                      {item.detail}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-[88px] flex flex-col items-end">
            {/*
              El link envuelve texto y flecha, pero el subrayado y el relleno de
              hover son solo del texto: en el mockup la flecha queda fuera de la
              línea. `HoverButton` va como `span` porque el `<a>` ya es este
              `Link` — anidarlos rompería la semántica.
            */}
            <Link
              href={quoteHref}
              className="flex items-center gap-3 text-off-black"
            >
              <HoverButton
                as="span"
                className="font-body text-[24px] uppercase leading-[28px]"
              >
                {SERVICES_COPY.quoteLabel}
              </HoverButton>
              <ServicesArrow />
            </Link>

            {pack.quoteNote ? (
              <p className="mt-[14px] max-w-[340px] text-right font-body text-[20px] leading-[26px] text-gray-brand">
                {pack.quoteNote}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
