import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services - ESQUINA ESTUDIO(TM)",
  description:
    "Branding, motion graphics, packaging, editorial and illustration services by ESQUINA ESTUDIO.",
};

/**
 * PROVISIONAL (B3.4/F1). El desmontaje se llevó la máquina de scroll-jack del
 * intro, el acordeón con sus `ScrollTrigger`, los slideshows y el catálogo viejo
 * de 6 servicios. El contenido real de las cinco secciones llega en F2.
 *
 * La página es un componente de servidor sin estado: nadie toca `body`, ni
 * `history.scrollRestoration`, ni registra listeners globales. El layout del
 * sitio ya envuelve el contenido en `<main>`, así que acá va un `<section>`
 * —mismo criterio que `/contact`— y no un `<main>` anidado.
 */
export default function ServicesPage() {
  return (
    <section className="bg-off-white text-off-black">
      <div className="flex min-h-[calc(100vh-var(--header-height))] w-full items-center justify-center px-6">
        <p className="max-w-5xl text-center font-display text-[40px] uppercase leading-[48px] tracking-normal">
          WE TRANSLATE IDEAS INTO LIVING IDENTITIES — CRAFTED THROUGH STRATEGY,
          AESTHETICS AND EVERYTHING IN-BETWEEN.
        </p>
      </div>

      <div className="min-h-[150vh] px-12 pb-32 lg:px-16">
        <h2 className="font-body text-[30px] uppercase leading-[36px]">
          BRANDING PACKS
        </h2>
      </div>
    </section>
  );
}
