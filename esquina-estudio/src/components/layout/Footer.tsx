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

  const useGalleryBlend = isFunGallery;
  const footerTone = isFunGallery || isDarkRoute ? "dark" : "light";

  const textClass =
    isFunGallery || isDarkRoute ? "text-off-white" : "text-off-black";

  const footerSmallTextWeight = isFunGallery ? "font-thin" : "font-[550]";
  const footerCtaWeight = isFunGallery ? "font-thin" : "";

  return (
    <footer
      className={`w-full border-none ${
        useGalleryBlend
  ? "fixed bottom-[26px] left-0 right-0 z-[100] bg-transparent text-off-white mix-blend-difference"
          : isContactForm || isDarkRoute
            ? "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
            : "bg-off-white"
      }`}
      style={
        isFunGallery
          ? {
              background: "transparent",
              backgroundColor: "transparent",
              backdropFilter: "none",
              WebkitBackdropFilter: "none",
            }
          : undefined
      }
    >
      <div className="flex w-full flex-row items-center justify-between px-12 py-10 lg:px-16">
        <div className="flex flex-row items-center justify-start gap-12 lg:gap-16">
          <div className="flex-shrink-0">
            <LogoScript size="sm" tone={footerTone} />
          </div>

          <div
            className={`grid grid-cols-4 gap-x-12 gap-y-[8px] font-body ${footerSmallTextWeight} text-[17px] uppercase leading-none ${isFunGallery ? "tracking-[0.035em]" : "tracking-normal"} ${textClass}`}
          >
            <span className="block whitespace-nowrap">BORN IN</span>
            <span className="block whitespace-nowrap">WORKING</span>

            <HoverButton
              href="https://www.instagram.com/esquina_estudio/"
              external
              underline
              tightUnderline
              tone={footerTone}
              blend={useGalleryBlend}
              className="justify-self-start"
            >
              INSTAGRAM
            </HoverButton>

            <span className="block whitespace-nowrap">&copy; 2024</span>

            <span className="block whitespace-nowrap">ARGENTINA</span>
            <span className="block whitespace-nowrap">WORLDWIDE</span>

            <HoverButton
              href="https://www.linkedin.com/company/esquina-estudio/"
              external
              underline
              tightUnderline
              tone={footerTone}
              blend={useGalleryBlend}
              className="justify-self-start"
            >
              LINKEDIN
            </HoverButton>

            <span />
          </div>
        </div>

        <div className="flex-shrink-0">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            tone={footerTone}
            blend={useGalleryBlend}
            className={`font-display ${footerCtaWeight} whitespace-nowrap text-[40px] uppercase leading-none ${isFunGallery ? "tracking-[0.02em] font-thin" : "tracking-normal"} ${textClass}`}
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </div>
      </div>
    </footer>
  );
}