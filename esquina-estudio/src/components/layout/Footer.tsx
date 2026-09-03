"use client";

import { Fragment } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";
import { getHeroLines } from "@/lib/site-copy";
import { useLocale } from "@/lib/i18n";
import {
  CHROME_GUTTER,
  TOUCH_LINKS,
  TOUCH_LINKS_OVERLAY,
} from "@/lib/mobile-layout";
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
 * Dónde cae cada pieza en la grilla de mobile. **Rearmada en R2/F11.3 y
 * comprimida en R3/F2.**
 *
 * Van como tablas de literales enteros porque Tailwind v4 busca los nombres de
 * clase como texto: `` `row-start-${index + 1}` `` no llegaría nunca al CSS.
 *
 * # El reparto
 *
 * Tres filas de **un renglón cada una** y tres columnas; la del medio es solo
 * para el logo, que dejó de tener fila propia:
 *
 * ```
 *   fila 1   BORN IN                                   INSTAGRAM
 *   fila 2   ARGENTINA              [logo script]      LINKEDIN
 *   fila 3   © 2024                                    develOP
 * ```
 *
 * # Qué cambió y por qué
 *
 * Contra `docs/archivo/mockups/r2-mob-02.jpg` (columna del medio) y
 * `r2-mob-01.jpg` (segunda captura):
 *
 * 1. **`WORKING WORLDWIDE` sale de mobile.** En escritorio se queda, y en
 *    inglés: el PDF de traducción lo pide explícitamente
 *    (`r2-trad-01.jpg`/`r2-trad-02.jpg`). Es una divergencia deliberada por
 *    rango, no un borrado: el diccionario sigue llevando los dos pares y el
 *    segundo se apaga con una variante.
 * 2. **El crédito pierde el prefijo en mobile**: dice `develOP` a secas, sin
 *    `POWERED BY` / `HECHO POR`. En escritorio los dos prefijos quedan.
 * 3. **El copyright se muda a la izquierda**, debajo del par de lugar, y el
 *    crédito a la derecha, cerrando la columna de los enlaces.
 * 4. **El logo script deja la cuarta fila** y pasa a la columna del medio,
 *    centrado vertical y horizontalmente entre las otras dos.
 * 5. **R3/F2: el par de lugar se parte en dos filas y los renglones van al
 *    paso del mockup.** En `r2-mob-02.jpg` los seis renglones caen a **20,9
 *    px** unos de otros (38 px de captura a 1,82 px por px CSS) y `© 2024` va
 *    pegado debajo de `ARGENTINA` con ese mismo paso. Hasta R3 cada fila medía
 *    44 px —el piso táctil de `TOUCH_LINKS`— y el copyright quedaba 92 px
 *    debajo de `ARGENTINA`. Ahora el par se declara `contents` en mobile, sus
 *    dos renglones son celdas propias (`MOBILE_PLACE_LINE`), las tres filas
 *    miden lo que mide un renglón y el área táctil de los enlaces sale de un
 *    pseudo-elemento que no ocupa lugar (`TOUCH_LINKS_OVERLAY`).
 *
 * **Lo que esa compresión le cuesta al piso de 44 px, dicho de frente.** Cada
 * enlace conserva una caja tocable de 44 px de alto, pero a 21 px de paso las
 * cajas de dos enlaces vecinos se pisan 23 px: el área **exclusiva** de
 * `INSTAGRAM` y de `LINKEDIN` es la de su renglón, ~21 px. Es la decisión de
 * Valentino en R3 (la alternativa era no comprimir), y es el único lugar del
 * sitio donde §2b no se cumple en el eje vertical. Para que un toque sobre la
 * palabra vaya siempre a su propio enlace, el texto se pinta por encima de las
 * cajas vecinas; ver `TOUCH_LINKS_OVERLAY`.
 */
const MOBILE_PLACE_CELL = [
  "max-lg:contents",
  // El segundo par —WORKING WORLDWIDE— no existe debajo de 1024.
  "max-lg:hidden",
] as const;

/**
 * Los dos renglones del par de lugar, cada uno en su fila. Solo importa para
 * el primer par: el segundo está apagado entero debajo de 1024 y sus hijos no
 * llegan a la grilla.
 */
const MOBILE_PLACE_LINE = [
  "max-lg:col-start-1 max-lg:row-start-1",
  "max-lg:col-start-1 max-lg:row-start-2",
] as const;

/** La columna derecha, de arriba abajo. El crédito toma la tercera fila aparte. */
const MOBILE_SOCIAL_CELL = [
  "max-lg:col-start-3 max-lg:row-start-1",
  "max-lg:col-start-3 max-lg:row-start-2",
] as const;

/**
 * El copyright cierra la columna izquierda, en la tercera fila, debajo de
 * `ARGENTINA`. No lleva piso de área táctil porque no es un enlace.
 */
const MOBILE_COPYRIGHT_CELL =
  "max-lg:col-start-1 max-lg:row-start-3 max-lg:justify-self-start";

/**
 * El crédito cierra la columna derecha; el logo ocupa la columna del medio.
 *
 * En mobile el crédito dice `develOP` a secas —el prefijo se esconde—, así que
 * pasó de 185,03 px a 15 px de tipografía a poco más de 80: ya no es el elemento
 * más ancho del footer y ya no es él quien decide si la fila entra a 320.
 */
const MOBILE_CREDIT_CELL =
  "max-lg:col-start-3 max-lg:row-start-3 max-lg:flex max-lg:justify-self-end";
/*
  `self-center` es lo que lo centra **en el eje vertical** (R3/F2): la grilla
  alinea sus celdas arriba (`items-start`) y sin esto la celda del logo, que
  abarca las tres filas, quedaba apoyada en la primera —medido a 390: centro
  del logo en el 18 % del alto de la fila—. El `items-center` de adentro centra
  al logo dentro de la celda, que no es lo mismo.
*/
const MOBILE_LOGO_CELL =
  "max-lg:col-start-2 max-lg:row-start-1 max-lg:row-span-3 max-lg:flex max-lg:items-center max-lg:justify-center max-lg:self-center";

/**
 * Gutter horizontal del chrome: alinea el footer con el Navbar. Sale del módulo
 * compartido para que los dos corten en el mismo ancho (M1).
 */
const GUTTER = CHROME_GUTTER;

/**
 * Sistema tipográfico de la información del footer: 17 px, interletrado 0.
 *
 * **Baja a 15 px debajo de 1024 (M2/F2, punto 7)**, y sale de medir: a 17 px el
 * crédito pide 205,45 px y el copyright 58,2, o sea 263,65 más el hueco contra
 * los 272 de caja útil a 320. A 15 px la misma fila pide 252,39 y quedan 19,6 px
 * de aire. De `lg` para arriba **no cambia nada**: la fila de escritorio sigue
 * en 17.
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
 * de 22 px sí es fijo, y es lo que hace que la línea mida 205,45 px a 17 px de
 * tipografía y 185,03 a 15 (ver `INFO_TYPE` y `MOBILE_CREDIT_CELL`). La variante
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
        {/*
          El prefijo se esconde debajo de 1024 (R2/F11.3): en mobile el crédito
          dice `develOP` a secas. El espacio va DENTRO del span que se esconde,
          así que al apagarse no queda un hueco delante de la marca.
        */}
        <span>
          <span className="max-lg:hidden">{t.footer.poweredBy}{" "}</span>
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
 * script en home) a la derecha. **No cambió desde B2**: los dos grupos siguen
 * siendo los mismos nodos y los mismos `gap`.
 *
 * # Mobile (< 1024): tres filas, tres columnas y el logo en la del medio
 *
 * ```
 *   NACIDO EN                                      INSTAGRAM
 *   ARGENTINA
 *
 *                        [logo script]             LINKEDIN
 *                        ← solo el footer claro
 *
 *   © 2024                                        develOP
 * ```
 *
 * La izquierda apoya en el gutter izquierdo y la derecha en el derecho; el logo
 * ocupa la columna del medio, abarcando las tres filas. Cómo se consigue que las
 * dos columnas terminen parejas está en `MOBILE_PLACE_CELL`, y ahí está también
 * por qué **`WORKING WORLDWIDE` no aparece acá y sí de 1024 para arriba**.
 *
 * Medido sobre el sitio servido: el footer de `/` mide **180 px** a 320, 390 y
 * 430 en los dos idiomas —de ahí sale `HOME_BLOCK_HEIGHT_MOBILE`—, la columna
 * izquierda apoya en x = 24 y la derecha cierra contra el gutter derecho.
 *
 * Antes de R2/F11.3 eran **cuatro filas y 304 px**: los dos pares de lugar a la
 * izquierda, el crédito con su prefijo y el copyright compartiendo la tercera, y
 * el logo script en una fila propia al pie. Antes de eso —M4/F3— el crédito iba
 * solo y centrado en una fila propia y el logo abajo a la derecha: eran **tres
 * ejes** en cuatro filas —el par de columnas, el crédito al centro, el logo a la
 * derecha— y el logo se leía como un elemento suelto. Antes de eso —M1— era una
 * sola columna de cinco bloques apilados, que medía 488 px de alto: más de la
 * mitad de un teléfono de 844.
 *
 * **El par de lugar que queda va apilado y no en una línea**, y es una medida:
 * en castellano `TRABAJANDO` + `EN TODO EL MUNDO` pedían 71,58 + 121,83 px y con
 * INSTAGRAM al costado daban 267 px de contenido **a 13 px de tipografía**, que
 * ya no entra en los 272 de caja útil a 320. Apilado, `NACIDO EN` + `ARGENTINA`
 * pide 159,31 + 96,44 = 255,75 a 17 px y entra en los cinco anchos.
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
   * debajo de 1024 manda la grilla. Llega como clase entera (`lg:items-center`)
   * y no como sufijo porque Tailwind v4 busca los nombres de clase como
   * literales en el código.
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
        `gap-y-0`: desde R3/F2 cada fila mide lo que mide un renglón —20 px de
        caja de línea, 21 con el píxel de relleno de `HoverButton`— y el paso
        entre renglones es el del mockup. Un hueco acá lo alejaría de la
        referencia. El área táctil de los enlaces ya no fija el alto de la fila:
        la pone `TOUCH_LINKS_OVERLAY` con un pseudo-elemento fuera de flujo.
      */
      className={`grid w-full grid-cols-[auto_1fr_auto] items-start justify-between gap-x-4 gap-y-0 lg:flex lg:flex-row lg:justify-between lg:gap-x-12 lg:gap-y-0 ${align} ${TOUCH_LINKS_OVERLAY} ${INFO_TYPE} ${leadingClass} ${textClass}`}
    >
      {/*
        El grupo de la izquierda de escritorio. En mobile se declara
        `display: contents` y sus tres hijos —los dos pares y el bloque del
        copyright— pasan a ser celdas de la grilla de arriba.
      */}
      <div className="contents lg:flex lg:flex-row lg:items-start lg:gap-x-12">
        {t.footer.places.map(([first, second], index) => (
          // `key` por índice: el texto cambia con el idioma y los pares son
          // siempre dos, garantizado por el tipo. Y por eso `MOBILE_PLACE_CELL`
          // puede ser una tabla de dos entradas: el índice no se sale de rango.
          <div
            key={index}
            className={`flex flex-col ${MOBILE_PLACE_CELL[index]} ${stackGap}`}
          >
            <span className={`whitespace-nowrap ${MOBILE_PLACE_LINE[0]}`}>
              {first}
            </span>
            <span className={`whitespace-nowrap ${MOBILE_PLACE_LINE[1]}`}>
              {second}
            </span>
          </div>
        ))}

        {/*
          El copyright y el crédito **se separan en mobile**: el copyright cierra
          la columna derecha, debajo de LINKEDIN, y el crédito cierra la
          izquierda, debajo del segundo par de lugar. Los dos comparten la fila
          3, cada uno apoyado en su gutter.

          Por eso este envoltorio se declara `contents` debajo de 1024: sus dos
          hijos tienen que ser **celdas propias** de la grilla, cada una con su
          `col-start` / `row-start`. De `lg` para arriba conserva exactamente las
          dos formas que tenía —en fila con el `gap-x-12` del propio grupo para
          las rutas internas, apilado para home—, así que el escritorio no se
          mueve.
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
        y LINKEDIN caía doce píxeles por encima de WORKING en vez de a su misma
        altura.

        Ahora el grupo se declara `contents` en mobile y **cada red es su propia
        celda**: columna 2, filas 1 y 2, con `justify-self-end`. Así cada una se
        pega al borde derecho de la caja útil y cada una comparte fila con su par
        de lugar.

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
 *
 * **En `/contact` esta franja ya no se monta** (R2/F7.3), así que el componente
 * dejó de necesitar el prop `isContactPage` con el que se callaba a sí mismo:
 * quien decide es `SiteFooter`. Ver el bloque de decisión que hay allá.
 */
function StatementBand() {
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

      {/*
        En mobile baja a la escala de cuerpo (17/21) y va alineado a la
        derecha. La proporción es la del escritorio, no un número nuevo: allá
        la frase va a 40 y este bloque a 26, o sea 0,65; en mobile la frase va
        a 26 y 26 × 0,65 = 17. A 26 px este bloque medía lo mismo que la frase
        y por eso los dos se leían con el mismo peso.
      */}
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
    </div>
  );
}

/**
 * Banda oscura de las rutas internas. El logo script gigante gobierna el alto:
 * el asset ya viene cortado por su propio lienzo arriba y a la derecha, así que
 * se monta a ancho completo y sin gutter — su borde derecho es el del viewport
 * — y el sangrado del mockup sale sin recortar de más (perderíamos el ™).
 *
 * **El aire propio del asset a la izquierda (24,8 % del ancho) quedó libre en
 * R2**: ahí vivía «JOIN OUR CLUB», superpuesto sin tocar la tinta y solo en
 * `/contact`. Las clientas lo sacaron del sitio entero
 * (`docs/archivo/mockups/r2-trad-02.jpg`), y no había nada detrás — ni endpoint,
 * ni newsletter, ni campo de Sanity—, así que se fue el bloque, sus dos claves
 * del diccionario y el prop con el que esta banda decidía si mostrarlo.
 *
 * # La composición de mobile es la misma del footer claro
 *
 * Las dos bandas comparten `InfoRow`, así que el reparto —tres ítems por
 * columna, cada una apoyada en su gutter— entra acá sin una línea propia. Lo que
 * esta banda **no** lleva es la cuarta fila: el logo script chico no se
 * renderiza acá, porque el logo de esta banda es el gigante de arriba, que
 * gobierna el alto y no se toca.
 *
 * **Verificado que la composición no lo desacomoda** (cinco anchos, dos
 * idiomas): el asset sigue montándose a ancho completo del viewport —320 × 95,5
 * px a 320 y 430 × 128,3 a 430—, y el borde inferior de la imagen y el borde
 * superior del bloque de información siguen siendo **el mismo píxel**. Cero
 * desborde horizontal en las tres rutas medidas.
 *
 * **El relleno de abajo baja a 24 px en mobile** y se queda en 40 de `lg` para
 * arriba. La banda cierra con la fila del crédito y el copyright, que arrastran
 * 12 px de su caja táctil de 44: con `pb-10` quedaban 52 px de aire muerto al
 * pie de la página, contra los 24 con que abre. Con 24 la banda es simétrica.
 */
function ScriptBand() {
  return (
    <div className="relative w-full overflow-hidden bg-off-black">
      <Image
        src={footerScriptLarge}
        alt=""
        className="block h-auto w-full"
        sizes="100vw"
      />

      <div className={`${GUTTER} pb-6 pt-6 lg:pb-10`}>
        <InfoRow
          tone="dark"
          // `leading-none` es de escritorio; debajo de 1024 el renglón mide 20
          // px para que las tres filas vayan al paso del mockup (R3/F2), el
          // mismo que ya usa el footer claro.
          leadingClass="max-lg:leading-[20px] lg:leading-none"
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
 * Footer de las rutas internas: franja clara + banda oscura.
 *
 * # En `/contact` la franja clara NO SE MONTA (R2/F7.3)
 *
 * Hasta R2 la llamada a contacto alternaba entre las dos bandas con un XOR:
 * `StatementBand` la callaba en `/contact` —la clienta ya está en el
 * formulario— y `ScriptBand` mostraba ahí «JOIN OUR CLUB» en su lugar. R2 se
 * llevó el club del sitio entero (no había backend detrás: ni endpoint, ni
 * newsletter, ni campo de Sanity, y el enlace apuntaba a `/contact` desde
 * `/contact`), y el mismo PDF pide además sacar la frase de la marca del footer
 * de esa sección (`docs/archivo/mockups/r2-trad-14.jpg`). Con las dos cosas
 * afuera, en `/contact` la franja clara quedaba **sin frase y sin CTA**.
 *
 * Por eso acá no se renderiza vacía ni con altura cero: **no se monta**. Un
 * bloque en el árbol que no dibuja nada es exactamente lo que después nadie
 * entiende por qué está.
 *
 * Con eso los dos componentes perdieron su prop `isContactPage`: la decisión
 * vive en un solo lugar, que es este.
 *
 * El `mt-auto` es el mismo criterio que en `HomeFooter`: con
 * `PageTransitionShell` declarando `min-h-svh` en columna, el footer se apoya en
 * el pie de la pantalla cuando el contenido no llega a llenarla. En las rutas
 * internas largas el margen calcula 0 y no cambia nada; existe para las cortas.
 */
function SiteFooter({ isContactPage }: { isContactPage: boolean }) {
  return (
    <footer className="mt-auto w-full border-none bg-off-white">
      {!isContactPage && <StatementBand />}
      <ScriptBand />
    </footer>
  );
}

/**
 * Footer de home: una sola franja clara. El hero ya trae la frase, así que acá
 * solo va la fila de info, con el logo script cerrando abajo.
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
        `py-6` debajo de 1024 y `py-10` de ahí para arriba. El relleno de 40 px
        estaba calibrado para un footer de tres filas; con la cuarta que suma el
        logo, la fila de info creció y esos 80 px de aire propio ya no caben en
        un teléfono bajo.

        **El `mt-auto` es lo que apoya el footer en el pie de la pantalla**, y va
        de la mano del `min-h-svh` en columna de `PageTransitionShell`. Sin él el
        footer quedaba anclado arriba y el sobrante se acumulaba debajo, pintado
        del mismo off-white: medido en `/` a 425 × 747, el footer cerraba en 671
        y el body en 747, o sea **76 px de body vacío** que se leían como aire del
        footer. Bajarle el relleno al footer movía ese hueco en vez de sacarlo.

        Con `onDark` **no se aplica**: en `/contact/success` el footer es
        `absolute` y el margen no tendría contra qué empujar.
      */
      className={`w-full border-none ${GUTTER} py-6 lg:py-10 ${
        onDark
          ? "absolute inset-x-0 bottom-0 z-[95] bg-off-black"
          : "mt-auto bg-off-white"
      }`}
    >
      <InfoRow
        tone={onDark ? "dark" : "light"}
        leadingClass="leading-[20px]"
        stackGap="gap-y-0"
        align="lg:items-center"
        /*
          El logo script cierra la composición: en escritorio a la derecha de la
          fila, en mobile **centrado y en su propia fila** al pie del footer.
          M2 lo había sacado de mobile porque compartía línea con el crédito y
          los dos juntos pedían 305,53 px contra 272 de caja útil a 320; en fila
          propia el conflicto no existe y vuelve en los cinco anchos. Por qué
          centrado y no a la derecha está en `MOBILE_LOGO_CELL`.
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