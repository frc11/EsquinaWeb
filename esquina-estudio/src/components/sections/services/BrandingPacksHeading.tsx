"use client";

import SpySentinel from "@/components/sections/services/SpySentinel";
import {
  BRANDING_PACKS_ID,
  SPLIT_GRID,
} from "@/components/sections/services/services-layout";
import { getServicesCopy } from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Encabezado de la zona de packs: el rótulo a la izquierda y, a la derecha, el
 * título y la bajada.
 *
 * No tiene entrada en el sidebar. La regla del scroll-spy («manda la última
 * sección cuyo tope cruzó la línea de lectura») lo deja bajo INTRO mientras se
 * lee, que es lo que muestra el mockup `08a`: la flecha sigue en INTRO con
 * BRANDING PACKS ya asomando.
 *
 * Lleva centinela igual, y no para el spy —el menú no lo lista— sino porque es
 * lo que decide **si el sidebar se muestra**: aparece justo acá y desaparece al
 * volver al intro (B3.4b/F3). Se pregunta por el centinela y no por este bloque
 * porque el bloque es alto y sigue intersecando un buen rato después de que su
 * tope cruzó; el centinela mide 1 px y cambia de estado exactamente en el cruce.
 *
 * La negrita es la del PDF y va en `font-semibold`: el peso acá es la excepción
 * deliberada que marca el énfasis del texto, no la herramienta de jerarquía.
 */
export default function BrandingPacksHeading() {
  const { locale } = useLocale();
  const { label, title, subtitle } = getServicesCopy(locale).packsHeading;

  return (
    <div
      id={BRANDING_PACKS_ID}
      className={cn(SPLIT_GRID, "relative pt-[160px] pb-[160px]")}
    >
      <SpySentinel id={BRANDING_PACKS_ID} />

      <h2 className="font-body text-[30px] uppercase leading-[36px] text-off-black">
        {label}
      </h2>

      <div className="mt-10 lg:mt-0">
        <p className="font-display text-[40px] leading-[48px] text-off-black">
          {title.lead}
          <span className="font-semibold">{title.emphasis}</span>
          {title.tail}
        </p>

        <p className="mt-[40px] font-body text-[30px] leading-[36px] text-off-black">
          {subtitle.lead}
          <span className="font-semibold">{subtitle.emphasis}</span>
        </p>
      </div>
    </div>
  );
}
