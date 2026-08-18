"use client";

import { Fragment } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";
import { HERO_LINES } from "@/lib/site-copy";
import developLogo from "../../../logos/logodevelOP.png";
import footerScriptLarge from "../../../logos/logo-footer-grande.png";

const DEVELOP_URL = "https://develop-portfolio.netlify.app";

const SOCIAL_LINKS = [
  { label: "INSTAGRAM", href: "https://www.instagram.com/esquina_estudio/" },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/company/esquina-estudio/",
  },
] as const;

/** Pares de dos líneas de la fila de info. Mismo texto en las tres variantes. */
const PLACE_PAIRS = [
  ["BORN IN", "ARGENTINA"],
  ["WORKING", "WORLDWIDE"],
] as const;

const COPYRIGHT = "© 2024";

/** Gutter horizontal del chrome: alinea el footer con el Navbar. */
const GUTTER = "px-12 lg:px-16";

/** Sistema tipográfico de la información del footer: 17 px, interletrado 0. */
const INFO_TYPE = "font-body font-[550] text-[17px] uppercase tracking-normal";

function SocialLinks({ tone }: { tone: "light" | "dark" }) {
  return (
    <>
      {SOCIAL_LINKS.map((link) => (
        <HoverButton
          key={link.label}
          href={link.href}
          external
          underline
          tightUnderline
          tone={tone}
        >
          {link.label}
        </HoverButton>
      ))}
    </>
  );
}

/**
 * Crédito de develOP. Escala única (17 px, heredada del contenedor); solo
 * cambia la etiqueta: la fila de info del footer nuevo lleva «POWERED BY», y la
 * variante compacta de las rutas con footer fijo conserva el «BY» de hoy.
 */
function DevelopCredit({
  label = "powered",
  logoClassName,
  textClassName,
  tone,
  blend,
}: {
  label?: "powered" | "short";
  logoClassName: string;
  textClassName: string;
  tone: "light" | "dark";
  blend: boolean;
}) {
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
      className={`normal-case ${textClassName}`}
    >
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span>
          {label === "powered" ? "POWERED BY " : "BY "}
          <span className="normal-case">develOP</span>
        </span>
        <Image
          src={developLogo}
          alt=""
          width={22}
          height={22}
          className={`h-[22px] w-[22px] object-contain transition-[filter,opacity] duration-200 ${logoClassName} ${logoHoverClass}`}
          sizes="22px"
        />
      </span>
    </HoverButton>
  );
}

/**
 * Fila de información del footer nuevo: procedencia, alcance, copyright y
 * crédito a la izquierda; redes (y el logo script en home) a la derecha.
 */
function InfoRow({
  tone,
  leadingClass,
  stackGap,
  align,
  trailing,
  inlineCredit = false,
  inlineSocial = false,
}: {
  tone: "light" | "dark";
  leadingClass: string;
  stackGap: string;
  align: string;
  trailing?: React.ReactNode;
  /** Rutas internas: copyright y crédito develOP van a la misma altura, no apilados. */
  inlineCredit?: boolean;
  /** Rutas internas: Instagram y LinkedIn van lado a lado, no apilados. */
  inlineSocial?: boolean;
}) {
  const isDark = tone === "dark";
  const textClass = isDark ? "text-off-white" : "text-off-black";
  const developLogoClass = isDark ? "invert" : "opacity-80";

  const credit = (
    <DevelopCredit
      logoClassName={developLogoClass}
      textClassName={textClass}
      tone={tone}
      blend={false}
    />
  );

  return (
    <div
      className={`flex w-full flex-row ${align} justify-between gap-12 ${INFO_TYPE} ${leadingClass} ${textClass}`}
    >
      <div className="flex flex-row items-start gap-x-12">
        {PLACE_PAIRS.map(([first, second]) => (
          <div key={first} className={`flex flex-col ${stackGap}`}>
            <span className="whitespace-nowrap">{first}</span>
            <span className="whitespace-nowrap">{second}</span>
          </div>
        ))}

        {inlineCredit ? (
          <>
            <span className="whitespace-nowrap">{COPYRIGHT}</span>
            {credit}
          </>
        ) : (
          <div className={`flex flex-col items-start ${stackGap}`}>
            <span className="whitespace-nowrap">{COPYRIGHT}</span>
            {credit}
          </div>
        )}
      </div>

      <div className="flex flex-row items-center gap-12">
        <div
          className={
            inlineSocial
              ? "flex flex-row items-center gap-x-5"
              : `flex flex-col items-start ${stackGap}`
          }
        >
          <SocialLinks tone={tone} />
        </div>
        {trailing}
      </div>
    </div>
  );
}

/**
 * Franja clara de las rutas internas: la frase de la marca a la izquierda y la
 * llamada a contacto a la derecha. Reemplaza al CTA «LET'S WORK TOGETHER!».
 * En `/contact` el bloque de llamada a contacto no se renderiza: la clienta
 * ya está en el formulario.
 */
function StatementBand({ isContactPage }: { isContactPage: boolean }) {
  return (
    <div className={`flex w-full flex-row items-start justify-between gap-12 ${GUTTER} py-20`}>
      <div className="font-display text-[40px] uppercase leading-[48px] tracking-normal text-off-black">
        {HERO_LINES.map((line) => (
          <p key={line.map((fragment) => fragment.text).join(" ")}>
            {line.map((fragment, index) => (
              <Fragment key={fragment.text}>
                {index > 0 && " "}
                <span className={fragment.bold ? "font-semibold" : undefined}>
                  {fragment.text}
                </span>
              </Fragment>
            ))}
          </p>
        ))}
      </div>

      {!isContactPage && (
        <div className="flex flex-col items-end gap-y-[8px] text-right font-body font-[550] uppercase tracking-normal text-off-black">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            className="text-[26px] leading-[31px]"
          >
            CONTACT US
          </HoverButton>
          <p className="whitespace-nowrap text-[26px] leading-[31px]">
            LET&apos;S BRING
            <br />
            YOUR IDEAS TO LIFE
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Banda oscura de las rutas internas. El logo script gigante gobierna el alto:
 * el asset ya viene cortado por su propio lienzo arriba y a la derecha, así que
 * se monta a ancho completo y sin gutter — su borde derecho es el del viewport
 * — y el sangrado del mockup sale sin recortar de más (perderíamos el ™).
 * El aire propio del asset a la izquierda (24,8 % del ancho) aloja «JOIN OUR
 * CLUB», que se superpone sin tocar la tinta. Solo se renderiza en `/contact`
 * (mockup de esa ruta); el resto de las rutas internas lo omite.
 */
function ScriptBand({ isContactPage }: { isContactPage: boolean }) {
  return (
    <div className="relative w-full overflow-hidden bg-off-black">
      <Image
        src={footerScriptLarge}
        alt=""
        className="block h-auto w-full"
        sizes="100vw"
      />

      {isContactPage && (
        <div className="absolute left-12 top-[46%] lg:left-16 font-body font-[550] uppercase tracking-normal text-off-white">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            tone="dark"
            className="text-[26px] leading-[31px]"
          >
            JOIN OUR CLUB
          </HoverButton>
          <p className="mt-3 whitespace-nowrap text-[22px] leading-[26px]">
            BECOME PART OF A
            <br />
            CREATIVE COMMUNITY
          </p>
        </div>
      )}

      <div className={`${GUTTER} pb-10 pt-6`}>
        <InfoRow
          tone="dark"
          leadingClass="leading-none"
          stackGap="gap-y-[8px]"
          align="items-start"
          inlineCredit
          inlineSocial
        />
      </div>
    </div>
  );
}

/**
 * Footer de las rutas internas: franja clara + banda oscura. La llamada a
 * contacto alterna por ruta entre las dos bandas (`isContactPage`).
 */
function SiteFooter({ isContactPage }: { isContactPage: boolean }) {
  return (
    <footer className="w-full border-none bg-off-white">
      <StatementBand isContactPage={isContactPage} />
      <ScriptBand isContactPage={isContactPage} />
    </footer>
  );
}

/**
 * Footer de home: una sola franja clara. El hero ya trae la frase, así que acá
 * solo va la fila de info, con el logo script como último elemento a la derecha.
 */
function HomeFooter() {
  return (
    <footer className={`w-full border-none bg-off-white ${GUTTER} py-10`}>
      <InfoRow
        tone="light"
        leadingClass="leading-[20px]"
        stackGap="gap-y-0"
        align="items-center"
        trailing={
          <div className="flex-shrink-0">
            <LogoScript size="sm" />
          </div>
        }
      />
    </footer>
  );
}

/**
 * Rutas con footer fijo (`/fun-gallery` y `/contact/success`): el logo gigante y
 * la banda oscura romperían esas pantallas, así que conservan la composición
 * compacta de hoy. Único cambio: el interletrado pasa a 0 en todo el footer.
 * `/fun-gallery` se rediseña en el Bloque 3.
 */
function FixedFooter({ isFunGallery }: { isFunGallery: boolean }) {
  const textClass = "text-off-white";
  const smallTextWeight = isFunGallery ? "font-thin" : "font-[550]";
  const ctaWeight = isFunGallery ? "font-thin" : "";
  const developLogoClass = isFunGallery ? "brightness-0 invert" : "invert";

  return (
    <footer
      className={`w-full border-none ${
        isFunGallery
          ? "fixed bottom-[26px] left-0 right-0 z-[100] bg-transparent text-off-white mix-blend-difference"
          : "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
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
            <LogoScript size="sm" tone="dark" />
          </div>

          <div
            className={`grid grid-cols-4 gap-x-12 gap-y-[8px] font-body ${smallTextWeight} text-[17px] uppercase leading-none tracking-normal ${textClass}`}
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
                href={SOCIAL_LINKS[0].href}
                external
                underline
                tightUnderline
                tone="dark"
                blend={isFunGallery}
              >
                {SOCIAL_LINKS[0].label}
              </HoverButton>
            </div>

            <div className="col-start-3 row-start-2 justify-self-start">
              <HoverButton
                href={SOCIAL_LINKS[1].href}
                external
                underline
                tightUnderline
                tone="dark"
                blend={isFunGallery}
              >
                {SOCIAL_LINKS[1].label}
              </HoverButton>
            </div>

            <div className="col-start-4 row-start-1 row-span-2 flex flex-col items-start gap-y-[8px]">
              <span className="block whitespace-nowrap">{COPYRIGHT}</span>
              <DevelopCredit
                label="short"
                logoClassName={developLogoClass}
                textClassName={textClass}
                tone="dark"
                blend={isFunGallery}
              />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            tone="dark"
            blend={isFunGallery}
            className={`font-display ${ctaWeight} whitespace-nowrap text-[40px] uppercase leading-none tracking-normal ${textClass}`}
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();

  const isFunGallery =
    pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
  const isDarkRoute = pathname === "/contact/success";
  const isContactPage = pathname === "/contact";

  if (isFunGallery || isDarkRoute) {
    return <FixedFooter isFunGallery={isFunGallery} />;
  }

  if (pathname === "/") {
    return <HomeFooter />;
  }

  return <SiteFooter isContactPage={isContactPage} />;
}
