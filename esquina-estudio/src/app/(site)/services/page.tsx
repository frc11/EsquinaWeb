import { Metadata } from "next";
import ServicesIntro from "@/components/sections/services/ServicesIntro";
import BrandingPacksHeading from "@/components/sections/services/BrandingPacksHeading";
import ServicePackSection from "@/components/sections/services/ServicePackSection";
import {
  CONTENT_INSET,
  GUTTER,
} from "@/components/sections/services/services-layout";
import { SERVICE_PACKS } from "@/lib/services-content";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services - ESQUINA ESTUDIO(TM)",
  description:
    "Branding, motion graphics, packaging, editorial and illustration services by ESQUINA ESTUDIO.",
};

/**
 * `/services` — rediseño B3.4.
 *
 * Componente de servidor sin estado: no toca `body`, no toca
 * `history.scrollRestoration` y no registra listeners globales. Lo único con
 * comportamiento es el sidebar (F3) y el gatillo del intro (F4), que son
 * componentes de cliente acotados.
 *
 * El layout del sitio ya envuelve el contenido en `<main>`, así que acá van
 * `<section>` sueltas —mismo criterio que `/contact`— y no un `<main>` anidado.
 *
 * El intro va **fuera** de la banda que el contenido le reserva al sidebar
 * (`CONTENT_INSET`) porque su frase está centrada en la **pantalla**, no en la
 * columna de contenido: así lo muestra `08a`.
 */
export default function ServicesPage() {
  return (
    <div className="bg-off-white text-off-black">
      <div className={cn("relative", GUTTER)}>
        <ServicesIntro />

        <div className={CONTENT_INSET}>
          <BrandingPacksHeading />
          {SERVICE_PACKS.map((pack) => (
            <ServicePackSection key={pack.id} pack={pack} />
          ))}
        </div>
      </div>
    </div>
  );
}
