import { Metadata } from "next";
import ServicesIntro from "@/components/sections/services/ServicesIntro";
import BrandingPacksHeading from "@/components/sections/services/BrandingPacksHeading";
import ServicePackSection from "@/components/sections/services/ServicePackSection";
import ServicesSidebar from "@/components/sections/services/ServicesSidebar";
import IntroScrollTrigger from "@/components/sections/services/IntroScrollTrigger";
import LatestProjects from "@/components/sections/services/LatestProjects";
import {
  BRANDING_PACKS_ID,
  CONTENT_INSET,
  GUTTER,
} from "@/components/sections/services/services-layout";
import { SERVICE_PACKS } from "@/lib/services-content";
import { client } from "@/lib/sanity";
import { LATEST_PROJECTS_QUERY } from "@/lib/sanity.queries";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services - ESQUINA ESTUDIO(TM)",
  description:
    "Branding, motion graphics, packaging, editorial and illustration services by ESQUINA ESTUDIO.",
};

/**
 * Las cuatro portadas del cierre. Cachea como `/work` —`revalidate: 60` en el
 * fetch, sin configuración de segmento—, así que la ruta sigue siendo estática.
 *
 * **Sin fallback local, y a propósito:** los proyectos locales de respaldo
 * tienen slugs que no coinciden con el dataset (CLAUDE.md §5), así que un
 * fallback acá mandaría a las visitantes a fichas que no existen. Ante un fallo
 * la sección se muestra sin portadas: el texto y los dos links siguen en pie.
 */
async function getLatestProjects(): Promise<Project[]> {
  if (!client) return [];

  try {
    const projects = await client.fetch<Project[]>(
      LATEST_PROJECTS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return Array.isArray(projects) ? projects : [];
  } catch {
    return [];
  }
}

/**
 * `/services` — rediseño B3.4.
 *
 * Componente de servidor sin estado: no toca `body`, no toca
 * `history.scrollRestoration` y no registra listeners globales. Lo único con
 * comportamiento son el sidebar (F3), el gatillo del intro (F4) y el hover de
 * las portadas (F5), que son componentes de cliente acotados.
 *
 * El layout del sitio ya envuelve el contenido en `<main>`, así que acá van
 * `<section>` sueltas —mismo criterio que `/contact`— y no un `<main>` anidado.
 *
 * El intro va **fuera** de la banda que el contenido le reserva al sidebar
 * (`CONTENT_INSET`) porque su frase está centrada en la **pantalla**, no en la
 * columna de contenido: así lo muestra `08a`. Y LATEST PROJECTS va fuera del
 * gutter porque su fila de portadas ocupa el ancho completo (`08e`); el texto de
 * esa sección se pone su propio gutter.
 */
export default async function ServicesPage() {
  const projects = await getLatestProjects();

  return (
    <div className="bg-off-white text-off-black">
      <div className={cn("relative", GUTTER)}>
        <ServicesIntro />
        <IntroScrollTrigger targetId={BRANDING_PACKS_ID} />

        <div className={CONTENT_INSET}>
          <BrandingPacksHeading />
          {SERVICE_PACKS.map((pack) => (
            <ServicePackSection key={pack.id} pack={pack} />
          ))}
        </div>

        {/*
          El sidebar es hermano del contenido y vive dentro de este `relative`,
          que abarca del intro a Add-ons: por eso queda pegado desde el intro
          —como en `08a`— y se suelta al terminar los packs, antes de LATEST
          PROJECTS, que no tiene entrada en el menú.
        */}
        <ServicesSidebar />
      </div>

      <LatestProjects projects={projects} />
    </div>
  );
}
