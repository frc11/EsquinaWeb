"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";
import developLogo from "../../../logos/logodevelOP.png";

const DEVELOP_URL = "https://develop-portfolio.netlify.app";

function DevelopCredit({
  variant = "small",
  logoClassName,
  textClassName,
  tone,
  blend,
}: {
  variant?: "small" | "large";
  logoClassName: string;
  textClassName: string;
  tone: "light" | "dark";
  blend: boolean;
}) {
  const isLarge = variant === "large";
  const logoHoverClass = blend
    ? ""
    : tone === "dark"
      ? "group-hover:invert-0"
      : "group-hover:invert";

  return (
    <HoverButton
      href={DEVELOP_URL}
      external
      underline
      tightUnderline
      tone={tone}
      blend={blend}
      className={`normal-case ${textClassName} ${
        isLarge
          ? "font-display text-[40px] leading-none tracking-normal"
          : "font-body text-[17px] leading-none tracking-normal"
      }`}
    >
      <span
        className={`inline-flex items-center whitespace-nowrap ${
          isLarge ? "gap-4" : "gap-2"
        }`}
      >
        <span>
          {isLarge ? "POWERED BY " : "BY "}
          <span className="normal-case">develOP</span>
        </span>
        <Image
          src={developLogo}
          alt=""
          width={isLarge ? 36 : 22}
          height={isLarge ? 36 : 22}
          className={`object-contain transition-[filter,opacity] duration-200 ${
            isLarge ? "h-[36px] w-[36px]" : "h-[22px] w-[22px]"
          } ${logoClassName} ${logoHoverClass}`}
          sizes={isLarge ? "36px" : "22px"}
        />
      </span>
    </HoverButton>
  );
}

export default function Footer() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isFunGallery =
    pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
  const isContactForm = pathname === "/contact";
  const shouldReplaceFooterCta = isHome || isContactForm;
  const isDarkRoute = pathname === "/contact/success";

  const useGalleryBlend = isFunGallery;
  const footerTone = isFunGallery || isDarkRoute ? "dark" : "light";
  const textClass =
    isFunGallery || isDarkRoute ? "text-off-white" : "text-off-black";
  const footerSmallTextWeight = isFunGallery ? "font-thin" : "font-[550]";
  const footerCtaWeight = isFunGallery ? "font-thin" : "";
  const developerLogoClass =
    isFunGallery || isDarkRoute ? "invert" : "opacity-80";
  const footerRouteStyle = isFunGallery
    ? {
        background: "transparent",
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }
    : undefined;

  return (
    <footer
      className={`w-full border-none ${
        isFunGallery
          ? "fixed bottom-[26px] left-0 right-0 z-[100] bg-transparent text-off-white mix-blend-difference"
          : isContactForm || isDarkRoute
            ? "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
            : "bg-off-white"
      }`}
      style={footerRouteStyle}
    >
      <div className="flex w-full flex-row items-center justify-between px-12 py-10 lg:px-16">
        <div className="flex flex-row items-center justify-start gap-12 lg:gap-16">
          <div className="flex-shrink-0">
            <LogoScript size="sm" tone={footerTone} />
          </div>

          <div
            className={`grid grid-cols-4 gap-x-12 gap-y-[8px] font-body ${footerSmallTextWeight} text-[17px] uppercase leading-none ${isFunGallery ? "tracking-[0.035em]" : "tracking-normal"} ${textClass}`}
          >
            <span className="col-start-1 row-start-1 block whitespace-nowrap">
              BORN IN
            </span>
            <span className="col-start-1 row-start-2 block whitespace-nowrap">
              ARGENTINA
            </span>
            <span className="col-start-2 row-start-1 block whitespace-nowrap">
              WORKING
            </span>
            <span className="col-start-2 row-start-2 block whitespace-nowrap">
              WORLDWIDE
            </span>

            <div className="col-start-3 row-start-1 justify-self-start">
              <HoverButton
                href="https://www.instagram.com/esquina_estudio/"
                external
                underline
                tightUnderline
                tone={footerTone}
                blend={useGalleryBlend}
              >
                INSTAGRAM
              </HoverButton>
            </div>

            <div className="col-start-3 row-start-2 justify-self-start">
              <HoverButton
                href="https://www.linkedin.com/company/esquina-estudio/"
                external
                underline
                tightUnderline
                tone={footerTone}
                blend={useGalleryBlend}
              >
                LINKEDIN
              </HoverButton>
            </div>

            <div className="col-start-4 row-start-1 row-span-2 flex flex-col items-start gap-y-[8px]">
              <span className="block whitespace-nowrap">&copy; 2024</span>
              {!shouldReplaceFooterCta && (
                <DevelopCredit
                  logoClassName={developerLogoClass}
                  textClassName={textClass}
                  tone={footerTone}
                  blend={useGalleryBlend}
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {shouldReplaceFooterCta ? (
            <DevelopCredit
              variant="large"
              logoClassName={developerLogoClass}
              textClassName={textClass}
              tone={footerTone}
              blend={useGalleryBlend}
            />
          ) : (
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
          )}
        </div>
      </div>
    </footer>
  );
}
