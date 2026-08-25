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
 * Dónde cae cada pieza en la grilla de mobile (M4/F3).
 *
 * Van como tablas de literales enteros porque Tailwind v4 busca los nombres de
 * clase como texto: `` `row-start-${index + 1}` `` no llegaría nunca al CSS.
 *
 * # Por qué son dos tablas y no una
 *
 * Hasta M3 los lugares y las redes compartían tabla, y era a propósito: la red
 * de índice *n* caía en la **misma fila** que el par de índice *n*. La columna
 * derecha tiene ahora **tres** ítems —INSTAGRAM, LINKEDIN y `© 2024`— contra
 * dos de la izquierda, así que emparejar por fila ya no se puede: **el criterio
 * pasa a ser que las dos columnas terminen a la misma altura**.
 *
 * Se resuelve con la grilla y sin una sola medida nueva: las tres filas de
 * arriba miden 44 px cada una —el piso de área táctil, que se aplica por fila—,
 * la columna derecha las llena en orden, y el segundo par de lugar se manda a la
 * **tercera** fila apoyado en su borde inferior (`self-end`). La segunda fila de
 * la columna izquierda queda vacía y no importa: lo que tiene que coincidir es
 * el borde de abajo, no el renglón.
 *
 * ```
 *   fila 1   BORN IN / ARGENTINA          INSTAGRAM
 *   fila 2   (vacía)                      LINKEDIN
 *   fila 3   WORKING / WORLDWIDE ┐        © 2024
 *                                └── los dos apoyados en el mismo borde
 * ```
 */
const MOBILE_PLACE_CELL = [
  "max-lg:col-start-1 max-lg:row-start-1",
  "max-lg:col-start-1 max-lg:row-start-3 max-lg:self-end",
] as const;

/** La columna derecha, de arriba abajo. `© 2024` toma la tercera fila aparte. */
const MOBILE_SOCIAL_CELL = [
  "max-lg:col-start-2 max-lg:row-start-1",
  "max-lg:col-start-2 max-lg:row-start-2",
] as const;

/**
 * El piso de área táctil, aplicado a mano a `© 2024`.
 *
 * `TOUCH_LINKS` alcanza al `<a>` que emite `HoverButton` y el copyright no es un
 * enlace, así que sin esto su fila mediría 20 px y la columna derecha terminaría
 * 24 px más arriba que la izquierda. No es un área táctil de verdad —no hay nada
 * que tocar— sino la **misma unidad de fila** que usan las dos redes: es lo que
 * hace que los tres ítems de la derecha tengan un solo ritmo.
 */
const MOBILE_COPYRIGHT_CELL =
  "max-lg:col-start-2 max-lg:row-start-3 max-lg:flex max-lg:min-h-[44px] max-lg:items-center max-lg:justify-self-end";

/**
 * Las dos filas de abajo, cada una a lo ancho del footer.
 *
 * El crédito va **solo** y centrado, que es donde estaba (de 360 para arriba; a
 * 320 la fila caía a `justify-between` porque `© 2024` no entraba al lado, y ese
 * problema desapareció con el copyright mudado a la columna derecha: ahora
 * centra exacto en los cinco anchos).
 *
 * El logo script cierra la composición **abajo a la derecha**. Va en su propia
 * fila y no al lado del crédito, y es una medida: a 320 la caja útil es de 272
 * px y los dos juntos piden 185,03 + 120,5 = 305,53 px sin contar el aire entre
 * ellos. Es el mismo conflicto que en M2 dejó al logo fuera del footer de
 * mobile; la salida es la fila propia.
 */
const MOBILE_CREDIT_CELL =
  "max-lg:col-span-2 max-lg:row-start-4 max-lg:mt-4 max-lg:flex max-lg:justify-center";
const MOBILE_LOGO_CELL =
  "max-lg:col-span-2 max-lg:row-start-5 max-lg:mt-4 max-lg:flex max-lg:justify-end";

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

/**
 * Las dos redes, cada una envuelta en su propia celda.
 *
 * El envoltorio no es decorativo: `HoverButton` **no expone la clase de su
 * `<a>`** —el `className` que recibe va al `<span>` de adentro— y el primitivo
 * no se toca (`CLAUDE.md` §4.2). Sin un div propio no hay dónde colgar el
 * `col-start` / `row-start` que coloca cada red en su fila de la grilla de
 * mobile, ni el `justify-self-end` que la pega al borde derecho.
 *
 * De `lg` para arriba el envoltorio se declara `contents` y desaparece: las dos
 * anclas vuelven a ser hijas directas del grupo de escritorio, así que la fila
 * de ≥1024 queda **exactamente** como estaba.
 */
function SocialLinks({ tone }: { tone: "light" | "dark" }) {
  return (
    <>
      {SOCIAL_LINKS.map((link, index) => (
        <div
          key={link.label}
          className={`flex max-lg:justify-self-end ${MOBILE_SOCIAL_CELL[index]} lg:contents`}
        >
          <HoverButton
            href={link.href}
            external
            underline
            tightUnderline
            tone={tone}
          >
            {link.label}
          </HoverButton>
        </div>
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
 * # Mobile (< 1024): dos columnas alineadas abajo y dos filas al pie (M4/F3)
 *
 * ```
 *   NACIDO EN                        INSTAGRAM
 *   ARGENTINA
 *                                    LINKEDIN
 *   TRABAJANDO
 *   EN TODO EL MUNDO                 © 2024
 *
 *              HECHO POR develOP
 *                                 [logo script]   ← solo el footer claro
 * ```
 *
 * Dos ítems a la izquierda, tres a la derecha pegados al gutter, y **los bordes
 * inferiores de las dos columnas a la misma altura** —el criterio es ese y no la
 * cantidad de renglones—. Debajo, el crédito solo y centrado, y en el footer de
 * home el logo script cerrando abajo a la derecha. Cómo se consigue la
 * alineación está en `MOBILE_PLACE_CELL`.
 *
 * Hasta M3 el copyright compartía la última línea con el crédito y las dos redes
 * emparejaban fila con los dos pares de lugar. Antes de eso —M1— era una sola
 * columna de cinco bloques apilados, que medía 488 px de alto: más de la mitad
 * de un teléfono de 844.
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
      /*
        `gap-y-0` y no `gap-y-4` desde M4/F3, y no es ahorro por ahorro: las tres
        filas de arriba miden **44 px** cada una por el piso de área táctil, así
        que entre dos renglones de texto de 20 px ya quedan 24 px de aire. Los
        16 px de hueco encima de eso separaban de más y, con dos filas nuevas al
        pie, engordaban el footer 64 px. El aire que sí hace falta —el que aparta
        el crédito y el logo del bloque de las dos columnas— lo ponen los `mt-4`
        de esas dos celdas, que es donde se ve.
      */
      className={`grid w-full grid-cols-[auto_auto] items-start justify-between gap-x-4 gap-y-0 lg:flex lg:flex-row lg:justify-between lg:gap-x-12 lg:gap-y-0 ${align} ${TOUCH_LINKS} ${INFO_TYPE} ${leadingClass} ${textClass}`}
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
            className={`flex flex-col ${MOBILE_PLACE_CELL[index]} ${stackGap}`}
          >
            <span className="whitespace-nowrap">{first}</span>
            <span className="whitespace-nowrap">{second}</span>
          </div>
        ))}

        {/*
          El copyright y el crédito **se separan en mobile** (M4/F3): el
          copyright baja a la columna derecha como tercer ítem, debajo de
          LINKEDIN, y el crédito se queda solo en su propia fila, centrado a lo
          ancho del footer.

          Por eso este envoltorio se declara `contents` debajo de 1024: sus dos
          hijos tienen que ser **celdas propias** de la grilla, cada una con su
          `col-start` / `row-start`. De `lg` para arriba conserva exactamente las
          dos formas que tenía —en fila con el `gap-x-12` del propio grupo para
          las rutas internas, apilado para home—, así que el escritorio no se
          mueve.

          **Y con eso se fue el corte de 360.** Hasta M3 la última línea llevaba
          las dos cosas y el crédito solo podía centrarse a partir de 360: a 320
          cada columna lateral de la grilla `[1fr auto 1fr]` medía
          (272 − 185,03) / 2 = 43,49 px y `© 2024` pide 51,36, así que la fila
          caía a `justify-between`. Con el copyright mudado, el crédito es lo
          único que hay en su fila y **centra exacto en los cinco anchos**.
        */}
        <div
          className={`max-lg:contents ${
            inlineCredit
              ? "lg:contents"
              : `lg:flex lg:flex-col lg:items-start ${stackGap}`
          }`}
        >
          <span className={`whitespace-nowrap ${MOBILE_COPYRIGHT_CELL}`}>
            {COPYRIGHT}
          </span>
          {/*
            El envoltorio existe por lo mismo que el de las redes: `HoverButton`
            **no expone la clase de su `<a>`** —el `className` que recibe va al
            `<span>` de adentro— y el primitivo no se toca (`CLAUDE.md` §4.2),
            así que sin un div propio no hay dónde colgar la celda.
            `lg:contents` lo hace desaparecer arriba de 1024.
          */}
          <div className={`${MOBILE_CREDIT_CELL} lg:contents`}>{credit}</div>
        </div>
      </div>

      {/*
        El grupo de la derecha.

        Hasta M2 era **una sola celda** que abarcaba las filas 1 y 2, con las dos
        redes apiladas adentro. Eso las dejaba a la deriva en dos sentidos, los
        dos medidos a 390: quedaban alineadas a la izquierda de su columna
        —INSTAGRAM terminaba en 336,1 contra los 366 del gutter, 29,9 px cortos—
        y LINKEDIN caía en 692, doce píxeles por encima de WORKING en vez de a su
        misma altura.

        Ahora el grupo se declara `contents` en mobile y **cada red es su propia
        celda**: columna 2, fila 1 y fila 2, con `justify-self-end`. Así cada una
        se pega al borde derecho de la caja útil y cada una comparte fila con su
        par de lugar, que es la composición que pidió Valentino.

        De `lg` para arriba el grupo vuelve a ser una fila flex y **no cambia
        nada**: los envoltorios de las redes se declaran `contents` allá arriba,
        así que el árbol que ve el escritorio es el mismo de antes.
      */}
      <div className="contents lg:flex lg:flex-row lg:items-center lg:gap-x-12 lg:gap-y-0">
        <div
          className={
            inlineSocial
              ? "contents lg:flex lg:flex-row lg:items-center lg:gap-x-5 lg:gap-y-0"
              : `contents ${stackGap} lg:flex lg:flex-col lg:items-start`
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
      /*
        `py-6` debajo de 1024 y `py-10` de ahí para arriba (M4/F3). El relleno de
        40 px estaba calibrado para un footer de **tres** filas; con las dos que
        suman el crédito y el logo, la fila de info pasa de 164 a 256 px y esos
        80 px de aire propio ya no caben en un teléfono bajo. Con 24 el footer
        mide 304 px y `/` sigue entrando en una pantalla a 320 × 640 —el bloque
        del hero se queda con 208 px y la frase pide 187—. **El escritorio no se
        toca:** de `lg` para arriba sigue en 40.
      */
      className={`w-full border-none ${GUTTER} py-6 lg:py-10 ${
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
          El logo script cierra la composición: en escritorio a la derecha de la
          fila, en mobile **abajo a la derecha, en su propia fila** (M4/F3).
          M2 lo había sacado de mobile porque compartía línea con el crédito y
          los dos juntos pedían 305,53 px contra 272 de caja útil a 320; en fila
          propia el conflicto no existe y vuelve en los cinco anchos.
        */
        trailing={
          <div className={`flex-shrink-0 ${MOBILE_LOGO_CELL} lg:block`}>
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
