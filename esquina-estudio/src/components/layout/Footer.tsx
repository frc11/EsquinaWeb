"use client";

import { Fragment } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";
import { getHeroLines } from "@/lib/site-copy";
import { useLocale } from "@/lib/i18n";
import { CHROME_GUTTER, TOUCH_LINKS } from "@/lib/mobile-layout";
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

const COPYRIGHT = "© 2024";

/**
 * Gutter horizontal del chrome: alinea el footer con el Navbar. Sale del módulo
 * compartido para que los dos corten en el mismo ancho (M1).
 */
const GUTTER = CHROME_GUTTER;

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
 * Crédito de develOP. Escala única: 17 px, heredada del contenedor. La variante
 * corta («BY») se fue con el footer fijo de `/fun-gallery` en B3.3.
 */
function DevelopCredit({
  logoClassName,
  textClassName,
  tone,
}: {
  logoClassName: string;
  textClassName: string;
  tone: "light" | "dark";
}) {
  const { t } = useLocale();
  const logoHoverClass =
    tone === "dark" ? "group-hover:invert-0" : "group-hover:invert";

  return (
    <HoverButton
      href={DEVELOP_URL}
      external
      underline
      tightUnderline
      tone={tone}
      className={`normal-case ${textClassName}`}
    >
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span>
          {t.footer.poweredBy}{" "}
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
  /**
   * Alineación de la fila **de `lg` para arriba**, que es donde la fila existe:
   * debajo de 1024 el footer es una columna y todo va alineado a la izquierda.
   * Llega como clase entera (`lg:items-center`) y no como sufijo porque
   * Tailwind v4 busca los nombres de clase como literales en el código.
   */
  align: string;
  trailing?: React.ReactNode;
  /** Rutas internas: copyright y crédito develOP van a la misma altura, no apilados. */
  inlineCredit?: boolean;
  /** Rutas internas: Instagram y LinkedIn van lado a lado, no apilados. */
  inlineSocial?: boolean;
}) {
  const { t } = useLocale();
  const isDark = tone === "dark";
  const textClass = isDark ? "text-off-white" : "text-off-black";
  const developLogoClass = isDark ? "invert" : "opacity-80";

  const credit = (
    <DevelopCredit
      logoClassName={developLogoClass}
      textClassName={textClass}
      tone={tone}
    />
  );

  return (
    // Debajo de 1024 la fila es una COLUMNA: los dos pares de lugar, el
    // copyright, el crédito, las redes y el logo se apilan y quedan alineados a
    // la izquierda. Es lo único que hacía falta para que el footer entre —medido
    // en F0: la fila pide 789 px de ancho contra 294 de caja útil a 390— y por
    // eso el corte es `lg` y no `md`: a 768 tampoco entraba.
    <div
      className={`flex w-full flex-col items-start gap-y-8 lg:flex-row lg:justify-between lg:gap-x-12 lg:gap-y-0 ${align} ${TOUCH_LINKS} ${INFO_TYPE} ${leadingClass} ${textClass}`}
    >
      <div className="flex flex-col items-start gap-y-5 lg:flex-row lg:items-start lg:gap-x-12 lg:gap-y-0">
        {t.footer.places.map(([first, second], index) => (
          // `key` por índice: el texto cambia con el idioma y los pares son
          // siempre dos, garantizado por el tipo.
          <div key={index} className={`flex flex-col ${stackGap}`}>
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

      <div className="flex flex-col items-start gap-y-5 lg:flex-row lg:items-center lg:gap-x-12 lg:gap-y-0">
        <div
          className={
            inlineSocial
              ? "flex flex-col items-start gap-y-[8px] lg:flex-row lg:items-center lg:gap-x-5 lg:gap-y-0"
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
  const { locale, t } = useLocale();

  return (
    <div
      className={`flex w-full flex-col items-start gap-y-10 lg:flex-row lg:justify-between lg:gap-x-12 lg:gap-y-0 ${TOUCH_LINKS} ${GUTTER} py-12 lg:py-20`}
    >
      {/*
        La frase baja a 26/31 debajo de `md`. Los cortes de tres líneas siguen
        siendo tres `<p>` —las negritas son por fragmento y viven adentro de su
        línea—, pero cada línea envuelve sola: a 320 la más larga del castellano
        mide 381,7 px contra 272 de caja, así que se parte en dos. Es lo que
        pide §3.3 de la instrucción: el corte escrito no aplica en mobile, las
        negritas se conservan.
      */}
      <div className="font-display text-[26px] uppercase leading-[31px] tracking-normal text-off-black md:text-[40px] md:leading-[48px]">
        {getHeroLines(locale).map((line, lineIndex) => (
          <p key={lineIndex}>
            {line.map((fragment, index) => (
              <Fragment key={index}>
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
        <div className="flex flex-col items-start gap-y-[8px] text-left font-body font-[550] uppercase tracking-normal text-off-black lg:items-end lg:text-right">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            className="text-[26px] leading-[31px]"
          >
            {t.footer.contactCta}
          </HoverButton>
          <p className="whitespace-nowrap text-[26px] leading-[31px]">
            {t.footer.contactLines[0]}
            <br />
            {t.footer.contactLines[1]}
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
  const { t } = useLocale();

  return (
    <div className="relative w-full overflow-hidden bg-off-black">
      <Image
        src={footerScriptLarge}
        alt=""
        className="block h-auto w-full"
        sizes="100vw"
      />

      {isContactPage && (
        // Debajo de `md` el bloque sale del modo superpuesto y pasa a FLUJO
        // NORMAL, debajo del logo: a 390 la imagen mide 116 px de alto y el
        // bloque, apoyado en el 46 % de esa altura, terminaba 39 px por debajo
        // de ella, encima de la fila de informacion. Medido en F0.
        <div
          className={`static mt-8 px-6 md:absolute md:left-12 md:top-[46%] md:mt-0 md:px-0 lg:left-16 ${TOUCH_LINKS} font-body font-[550] uppercase tracking-normal text-off-white`}
        >
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            tone="dark"
            className="text-[26px] leading-[31px]"
          >
            {t.footer.clubCta}
          </HoverButton>
          <p className="mt-3 whitespace-nowrap text-[22px] leading-[26px]">
            {t.footer.clubLines[0]}
            <br />
            {t.footer.clubLines[1]}
          </p>
        </div>
      )}

      <div className={`${GUTTER} pb-10 pt-6`}>
        <InfoRow
          tone="dark"
          leadingClass="leading-none"
          stackGap="gap-y-[8px]"
          align="lg:items-start"
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
  const { t } = useLocale();

  return (
    <footer className={`w-full border-none bg-off-white ${GUTTER} py-10`}>
      <InfoRow
        tone="light"
        leadingClass="leading-[20px]"
        stackGap="gap-y-0"
        align="lg:items-center"
        trailing={
          <div className="flex-shrink-0">
            <LogoScript size="sm" ariaLabel={t.nav.logoHome} />
          </div>
        }
      />
    </footer>
  );
}

export default function Footer() {
  const pathname = usePathname();

  // `/fun-gallery` dejó de tener footer fijo en B3.3: la galería pasó a ser una
  // página normal, así que toma el footer de rutas internas como el resto. Con
  // eso se fue el último llamador de la variante fija —y con ella la divergencia
  // `font-thin` que arrastraba desde B2.2b.

  // `/contact/success` usa la variante de home. Es una pantalla simple y de una
  // sola vista: el footer de dos zonas (franja clara + banda oscura con el logo
  // gigante) era demasiada pieza. Además resuelve un defecto real — el Navbar
  // de esa ruta va en off-white sobre fondo transparente, y la franja clara del
  // footer interno (982 px de alto) terminaba justo debajo de la banda del
  // header: el menú desaparecía. La franja de home mide ~124 px, así que ni con
  // el scroll al máximo alcanza la banda [0, 128] que ocupa el Navbar.
  if (pathname === "/" || pathname === "/contact/success") {
    return <HomeFooter />;
  }

  return <SiteFooter isContactPage={pathname === "/contact"} />;
}
