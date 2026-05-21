"use client";

import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

export default function Footer() {
  const pathname = usePathname();
  const isFunGallery =
    pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
  const isContactForm = pathname === "/contact";
  const isDarkRoute = pathname === "/contact/success";

  const footerTone = isDarkRoute ? "dark" : "light";
  const textClass = isDarkRoute ? "text-off-white" : "text-off-black";

  return (
    <footer
      className={`w-full border-none ${
        isFunGallery
          ? "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
          : isContactForm || isDarkRoute
            ? "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
            : "bg-off-white"
      }`}
    >
      {/* Sacamos el h-full y bajamos el padding vertical a py-10 para que no sea gigante */}
      <div className="flex w-full flex-row items-center justify-between px-12 py-10 lg:px-16">

        {/* BLOQUE IZQUIERDO: Logo + Grid de textos */}
        <div className="flex flex-row items-center justify-start gap-12 lg:gap-16">

          {/* 1. Logo a la izquierda */}
          <div className="flex-shrink-0">
            <LogoScript size="sm" tone={footerTone} />
          </div>

          {/* 2. Bloque de texto usando CSS Grid (4 columnas, 2 filas) */}
          <div className={`grid grid-cols-4 gap-x-12 gap-y-[8px] font-body text-[17px] uppercase leading-none tracking-normal ${textClass}`}>

            {/* --- FILA 1 --- */}
            <span className="block whitespace-nowrap">BORN IN</span>
            <span className="block whitespace-nowrap">WORKING</span>
            <HoverButton
              href="https://www.instagram.com/esquina_estudio/"
              external
              underline
              tightUnderline
              tone={footerTone}
              className="justify-self-start"
            >
              INSTAGRAM
            </HoverButton>
            <span className="block whitespace-nowrap">&copy; 2024</span>

            {/* --- FILA 2 --- */}
            <span className="block whitespace-nowrap">ARGENTINA</span>
            <span className="block whitespace-nowrap">WORLDWIDE</span>
            <HoverButton
              href="https://www.linkedin.com/company/esquina-estudio/"
              external
              underline
              tightUnderline
              tone={footerTone}
              className="justify-self-start"
            >
              LINKEDIN
            </HoverButton>
            <span></span> {/* Celda vacía para mantener la estructura del grid debajo de 2024 */}

          </div>
        </div>

        {/* BLOQUE DERECHO: Botón CTA */}
        <div className="flex-shrink-0">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            tone={footerTone}
            className={`font-display text-[40px] uppercase leading-none tracking-normal whitespace-nowrap ${textClass}`}
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </div>

      </div>
    </footer>
  );
}
