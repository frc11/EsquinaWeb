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
 * En qué fila de la grilla de mobile cae cada par de lugar. Va como tabla de
 * literales enteros porque Tailwind v4 busca los nombres de clase como texto:
 * `` `row-start-${index + 1}` `` no llegaría nunca al CSS.
 */
const PLACE_ROW = ["max-lg:row-start-1", "max-lg:row-start-2"] as const;

/**
 * Gutter horizontal del chrome: alinea el footer con el Navbar. Sale del módulo
 * compartido para que los dos corten en el mismo ancho (M1).
 */
const GUTTER = CHROME_GUTTER;

/**
 * Sistema tipográfico de la información del footer: 17 px, interletrado 0.
 *
 * **Baja a 15 px debajo de 1024 (M2/F2, punto 7)**, y sale de medir: la línea
 * nueva del nivel 2 —`© 2024` y el crédito uno al lado del otro— pide 205,45 px
 * de crédito más 58,2 de copyright a 17 px, o sea 271,65 contra los 272 de caja
 * útil a 320. Entraba por 0,35 px, que no es entrar. A 15 px la misma línea pide
 * 244, y quedan 28 px de aire. De `lg` para arriba **no cambia nada**: la fila
 * de escritorio sigue en 17.
 */
const INFO_TYPE =
  "font-body font-[550] text-[15px] uppercase tracking-normal lg:text-[17px]";

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
 * Crédito de develOP. **La escala la hereda del contenedor** —`INFO_TYPE`, o sea
 * 15 px debajo de 1024 y 17 de ahí para arriba—: no fija tamaño propio. El logo
 * de 22 px sí es fijo, y es lo que hace que la línea del nivel 2 mida 205,45 px
 * a 17 px de tipografía (ver `INFO_TYPE`). La variante corta («BY») se fue con
 * el footer fijo de `/fun-gallery` en B3.3.
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
 * Fila de información del footer.
 *
 * # Escritorio (≥ 1024): una fila, dos grupos
 *
 * Procedencia, alcance, copyright y crédito a la izquierda; redes (y el logo
 * script en home) a la derecha. **No cambió en M2**: los dos grupos siguen
 * siendo los mismos nodos y los mismos `gap`.
 *
 * # Mobile (< 1024): dos niveles (M2/F2, punto 7)
 *
 * ```
 *   NACIDO EN            INSTAGRAM
 *   ARGENTINA            LINKEDIN
 *   TRABAJANDO
 *   EN TODO EL MUNDO
 *   © 2024  HECHO POR develOP
 * ```
 *
 * Arriba, los dos pares de lugar a la izquierda y las dos redes a la derecha;
 * debajo, el copyright y el crédito **uno al lado del otro**, a lo ancho. Antes
 * era una sola columna de cinco bloques apilados, que medía 488 px de alto: más
 * de la mitad de un teléfono de 844.
 *
 * **Los pares de lugar van apilados y no uno al lado del otro**, y es una
 * medida: en castellano piden 71,58 + 121,83 px y con INSTAGRAM al costado dan
 * 267 px de contenido **a 13 px de tipografía**, que ya no entra en los 272 de
 * caja útil a 320. Apilados, el nivel 1 pide 159,31 + 96,44 = 255,75 a 17 px y
 * entra en los cinco anchos.
 *
 * # Cómo se arma sin duplicar el markup
 *
 * La fila es una **grilla de dos columnas** debajo de 1024 y vuelve a ser una
 * fila flex de `lg` para arriba. Los dos grupos de escritorio se declaran
 * `display: contents` en mobile, así que sus hijos pasan a ser celdas de la
 * grilla y cada uno se coloca por `col-start` / `row-start`. Es lo que permite
 * que el **mismo** árbol dé los dos repartos: no hay una versión de mobile y
 * otra de escritorio.
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
   * debajo de 1024 manda la grilla de dos niveles. Llega como clase entera
   * (`lg:items-center`) y no como sufijo porque Tailwind v4 busca los nombres de
   * clase como literales en el código.
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
    <div
      className={`grid w-full grid-cols-[auto_auto] items-start justify-between gap-x-4 gap-y-4 lg:flex lg:flex-row lg:justify-between lg:gap-x-12 lg:gap-y-0 ${align} ${TOUCH_LINKS} ${INFO_TYPE} ${leadingClass} ${textClass}`}
    >
      {/*
        El grupo de la izquierda de escritorio. En mobile se declara
        `display: contents` y sus tres hijos —los dos pares y el bloque del
        copyright— pasan a ser celdas de la grilla de arriba.
      */}
      <div className="contents lg:flex lg:flex-row lg:items-start lg:gap-x-12">
        {t.footer.places.map(([first, second], index) => (
          // `key` por índice: el texto cambia con el idioma y los pares son
          // siempre dos, garantizado por el tipo. Y por eso `PLACE_ROW` puede
          // ser una tabla de dos entradas: el índice no se sale de rango.
          <div
            key={index}
            className={`flex flex-col max-lg:col-start-1 ${PLACE_ROW[index]} ${stackGap}`}
          >
            <span className="whitespace-nowrap">{first}</span>
            <span className="whitespace-nowrap">{second}</span>
          </div>
        ))}

        {/*
          El nivel 2: ocupa las dos columnas y va en fila **siempre** en mobile,
          que es lo que pide el punto 7. De `lg` para arriba conserva las dos
          formas que tenía —en fila con el `gap-x-12` del propio grupo para las
          rutas internas, apilado para home— así que el escritorio no se mueve.
        */}
        <div
          className={`flex max-lg:col-span-2 max-lg:row-start-3 max-lg:flex-row max-lg:items-center max-lg:gap-x-4 ${
            inlineCredit
              ? "lg:contents"
              : `lg:flex-col lg:items-start ${stackGap}`
          }`}
        >
          <span className="whitespace-nowrap">{COPYRIGHT}</span>
          {credit}
        </div>
      </div>

      {/*
        El grupo de la derecha. En mobile es una sola celda: columna 2, filas 1 y
        2, o sea al costado de los dos pares de lugar.
      */}
      <div className="flex flex-col items-start gap-y-5 max-lg:col-start-2 max-lg:row-span-2 max-lg:row-start-1 max-lg:gap-y-0 lg:flex-row lg:items-center lg:gap-x-12 lg:gap-y-0">
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
    /*
      M2/F2, punto 6 — la franja pasa a ser una FILA también en mobile: la frase
      a la izquierda y el bloque de contacto a la derecha, **alineado abajo**
      (`items-end`), o sea a la altura de la última línea de la frase y no de la
      primera.

      `flex-wrap` no es decoración, es lo que hace que la regla se pueda aplicar
      sin romper nada: los dos bloques tienen ancho mínimo propio —la frase, su
      palabra más larga (146 px en castellano a 26 px); el bloque de contacto, su
      corte de línea escrito, que **no se deja al ancho del navegador**
      (`CLAUDE.md` §6.4)— y la suma no entra en cualquier teléfono. Medido a 320:
      146 + 16 + 166 = 328 contra 272 de caja útil. Con `flex-wrap` el bloque de
      contacto **baja solo** donde no entra y la franja queda como estaba, sin
      desborde y sin un corte de ancho nuevo. Entra en fila a partir de 376 px de
      viewport; de los cinco anchos de prueba, en 390, 414 y 430.

      De `lg` para arriba se restituye exactamente lo de antes: `flex-nowrap`,
      `items-start`, `gap-x-12` y `gap-y-0`.
    */
    <div
      className={`flex w-full flex-row flex-wrap items-end justify-between gap-x-4 gap-y-10 lg:flex-nowrap lg:items-start lg:gap-x-12 lg:gap-y-0 ${TOUCH_LINKS} ${GUTTER} py-12 lg:py-20`}
    >
      {/*
        La frase baja a 26/31 debajo de `md`. Los cortes de tres líneas siguen
        siendo tres `<p>` —las negritas son por fragmento y viven adentro de su
        línea—, pero cada línea envuelve sola: a 320 la más larga del castellano
        mide 381,7 px contra 272 de caja, así que se parte en dos. Es lo que
        pide §3.3 de la instrucción: el corte escrito no aplica en mobile, las
        negritas se conservan.
      */}
      <div className="font-display text-[26px] uppercase leading-[31px] tracking-normal text-off-black max-lg:flex-1 max-lg:basis-[min-content] md:text-[40px] md:leading-[48px]">
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
        /*
          En mobile baja a la escala de cuerpo (17/21) y va alineado a la
          derecha. La proporción es la del escritorio, no un número nuevo: allá
          la frase va a 40 y este bloque a 26, o sea 0,65; en mobile la frase va
          a 26 y 26 × 0,65 = 17. A 26 px este bloque medía lo mismo que la frase
          y por eso los dos se leían con el mismo peso.
        */
        <div className="flex flex-col items-end gap-y-[8px] text-right font-body font-[550] uppercase tracking-normal text-off-black max-lg:flex-none">
          <HoverButton
            href="/contact"
            underline
            tightUnderline
            className="text-[17px] leading-[21px] lg:text-[26px] lg:leading-[31px]"
          >
            {t.footer.contactCta}
          </HoverButton>
          <p className="whitespace-nowrap text-[17px] leading-[21px] lg:text-[26px] lg:leading-[31px]">
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
 *
 * # La variante sobre fondo oscuro (M2/F3, puntos 8 y 9)
 *
 * `/contact/success` es una pantalla oscura de una sola vista, y una franja
 * clara al pie no tenía sentido. Con `onDark` el footer **deja de ser una franja
 * aparte y pasa a ser el pie de la pantalla oscura**: se saca del flujo y se
 * ancla al pie del contenedor posicionado de `PageTransitionShell`, cuyo alto es
 * el de la sección —`100svh`—, así que la ruta entera vuelve a medir **una
 * pantalla**, en escritorio y en mobile. Es también el único lugar donde el
 * footer no es `static`: en las otras siete rutas no cambia nada.
 *
 * **Pinta el off-black en vez de ir transparente, y es una medida.** El panel
 * oscuro de la pantalla entra desde abajo, así que durante los primeros ~150 ms
 * todavía no llegó al pie: con el footer transparente sus rótulos —que son
 * off-white— quedaban sobre el off-white de la página, ilegibles. Medido: a los
 * 80 ms el borde superior del panel está en 778 y el del footer en 608. Pintado
 * del mismo negro que el panel, el resultado en reposo es idéntico y durante la
 * entrada la pantalla oscura crece desde el pie en vez de dejar un fantasma.
 *
 * El `z-[95]` se compara contra el `z-[90]` de la sección de éxito, que es
 * posicionada: sin él el panel oscuro taparía la fila.
 */
function HomeFooter({ onDark = false }: { onDark?: boolean }) {
  const { t } = useLocale();

  return (
    <footer
      className={`w-full border-none ${GUTTER} py-10 ${
        onDark
          ? "absolute inset-x-0 bottom-0 z-[95] bg-off-black"
          : "bg-off-white"
      }`}
    >
      <InfoRow
        tone={onDark ? "dark" : "light"}
        leadingClass="leading-[20px]"
        stackGap="gap-y-0"
        align="lg:items-center"
        /*
          El logo script cierra la composición ancha del escritorio y **no entra
          en mobile**: el nivel 2 del footer nuevo pide 205,45 px de crédito más
          58,2 de copyright, y con el logo al lado —72,3 px al alto de 48— la
          línea se va a 335 contra 272 de caja útil a 320. El punto 7 enumera lo
          que lleva la fila de mobile y el logo no está en esa lista. Arriba de
          1024 no cambia nada.
        */
        trailing={
          <div className="hidden flex-shrink-0 lg:block">
            <LogoScript
              size="sm"
              tone={onDark ? "dark" : "light"}
              ariaLabel={t.nav.logoHome}
            />
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
  //
  // Desde M2/F3 va además **sin fondo y superpuesta** en esa ruta (puntos 8
  // y 9): la pantalla es oscura, la franja clara al pie no tenía sentido y la
  // ruta tiene que entrar en una sola vista.
  if (pathname === "/contact/success") {
    return <HomeFooter onDark />;
  }

  if (pathname === "/") {
    return <HomeFooter />;
  }

  return <SiteFooter isContactPage={pathname === "/contact"} />;
}
