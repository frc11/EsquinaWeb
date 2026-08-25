"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouteTransition } from "@/components/layout/RouteTransitionProvider";
import LocaleToggle from "@/components/layout/LocaleToggle";
import {
  NAV_INDICATOR_DOT_WIDTH,
  NavIndicator,
  indicatorTop,
  measureFillBox,
  measureTabIndicator,
  useIndicator,
  type IndicatorMeasure,
} from "@/components/layout/nav-indicator";
import { useLocale } from "@/lib/i18n";
import type { Dictionary } from "@/lib/i18n";
import { CHROME_GUTTER, TOUCH_LINKS } from "@/lib/mobile-layout";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

/**
 * Las rutas del menú, en orden. El rótulo NO vive acá: lo pone el diccionario
 * por `key`, porque cambia con el idioma mientras la ruta no.
 */
const NAV_LINKS = [
  { key: "work", href: "/work" },
  { key: "services", href: "/services" },
  { key: "team", href: "/team" },
  { key: "gallery", href: "/fun-gallery" },
] as const satisfies readonly {
  key: keyof Dictionary["nav"];
  href: DesktopNavHref;
}[];

/**
 * `CONTACT US` va aparte de los cuatro tabs, y no es un detalle de escritorio:
 * es la jerarquía del cromo. En el header vive en el bloque de la derecha; en
 * el menú de mobile, debajo de la lista y en la escala del cuerpo (M2/F1).
 */
const CONTACT_LINK = { key: "contact", href: "/contact" } as const satisfies {
  key: keyof Dictionary["nav"];
  href: DesktopNavHref;
};

/** Los cinco rótulos cuya caja gobierna la medición del indicador. */
const INDICATOR_HOSTS = [...NAV_LINKS, CONTACT_LINK] as const;

const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const NAV_INDICATOR_HOME_GAP = 24;
const MOBILE_MENU_ID = "mobile-menu";

/**
 * # El color del cromo acompana al panel (M3/F4, punto 5)
 *
 * Hasta M2 el cambio de tono **no tenia transicion ninguna**: `chromeOnDark`
 * es un booleano y las clases se cambiaban de golpe, asi que el header pasaba
 * de blanco a negro en 0 ms mientras el panel tardaba 500 en bajar. Eso es lo
 * que se sentia mecanico al abrir; y al cerrar era peor, porque el blanco
 * volvia en 0 ms con el panel todavia puesto medio segundo mas. El color se
 * adelantaba en las dos direcciones.
 *
 * ## De donde salen los numeros
 *
 * No son de gusto: salen de **cuando el panel tapa la banda del header**. El
 * panel viaja de `y: -100%` a `y: 0` en 500 ms con `EASE_EXIT`. La banda mide
 * 128 px sobre un viewport de 844, o sea el 15,2 % del recorrido; y como
 * `cubic-bezier(0.76, 0, 0.24, 1)` arranca lento, ese 15,2 % de avance recien
 * se alcanza cerca del 36 % del tiempo:
 *
 * - **Al abrir**, el panel tapa la banda a partir de los ~180 ms.
 * - **Al cerrar**, la suelta a los ~320 ms (le quedan 180 de recorrido).
 *
 * Asi que el cromo tiene que estar oscuro **antes** de los 180 ms al abrir, y
 * seguir oscuro **hasta** los 320 al cerrar. Con una ventana de 200 ms:
 *
 * ```
 *          0        200                    300       500
 *   abrir  |=========|                                     el cromo oscurece
 *   cerrar                                 |=========|     el cromo aclara
 *                 el panel tapa la banda entre 180 y 320
 * ```
 *
 * Las dos rampas son **espejo exacto** una de la otra: [0, 200] al abrir y
 * [300, 500] al cerrar, que es [0, 200] leido al reves sobre los mismos
 * 500 ms. Esa es la simetria que pide el punto 5, y de paso deja al cromo
 * oscuro justo mientras el panel ocupa la banda: nunca hay una franja clara
 * sobre el panel negro ni al reves.
 *
 * Los 200 ms **no son un numero nuevo**: son los que `LocaleToggle` ya usaba
 * para su propio `transition-colors`, asi que las cuatro piezas del cromo —la
 * superficie, el logo, el icono y el toggle— se mueven juntas.
 */
const CHROME_TONE_OUT_DELAY_MS = 300;

/** Al abrir: el cromo arranca a oscurecer en el acto. */
const CHROME_TONE_OPENING = "transition-colors duration-200 delay-0";
/** Al cerrar: espera a que el panel suelte la banda y recien ahi aclara. */
const CHROME_TONE_CLOSING = "transition-colors duration-200 delay-[300ms]";

/**
 * # El icono acompana al panel, no se adelanta (M4/F1)
 *
 * Las tres rayas son **siempre las mismas tres rayas**: al abrir, la de arriba y
 * la de abajo viajan al centro y giran hasta cruzarse, y la del medio se
 * desvanece. Antes habia dos dibujos distintos —tres rayas de 24 px cuando el
 * menu estaba cerrado y dos de 30 px cuando estaba abierto—, asi que el icono
 * **cambiaba de identidad** en vez de transformarse: eso es lo que se leia como
 * dos iconos.
 *
 * La ventana es la del cromo y no una nueva: **200 ms**, con el mismo retardo
 * (`chromeToneDelayClass`: 0 al abrir, 300 al cerrar). Asi el giro cae dentro de
 * la misma franja en la que el panel tapa la banda del header —entre los 180 y
 * los 320 ms del recorrido de 500— y el icono no llega ni antes ni despues que
 * el color. Ver `CHROME_TONE_OUT_DELAY_MS` para de donde salen los numeros.
 *
 * `background-color` viaja en la misma lista que `transform` y `opacity` porque
 * las rayas tambien cambian de tono con el cromo: si fueran dos transiciones
 * distintas, el color y el giro se separarian.
 *
 * Con `prefers-reduced-motion` la transicion se apaga entera y el cambio es
 * **inmediato**: el icono pasa a cruz sin girar, que es lo que pide el punto.
 */
const ICON_MOTION =
  "transition-[transform,opacity,background-color] duration-200 motion-reduce:transition-none motion-reduce:delay-0";

/**
 * Cuanto viaja cada raya exterior hasta el centro de la caja de 24.
 *
 * La caja centra 3 x 2 + 2 x 5 = 16 px de contenido, asi que las rayas arrancan
 * en 4, 11 y 18 y sus centros caen en 5, 12 y 19. Llevar la de arriba y la de
 * abajo al centro (12) son **7 px** en cada sentido, y el giro de 45 grados se
 * hace sobre el centro ya trasladado: las dos cruzan exactamente en (12, 12).
 */
const ICON_ARM_SHIFT = "7px";

type DesktopNavHref =
  | "/work"
  | "/services"
  | "/team"
  | "/fun-gallery"
  | "/contact";

function isPathActive(pathname: string, href: DesktopNavHref) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isHomePath(pathname: string) {
  return pathname === "/";
}

/**
 * El estado activo **anunciado**, no solo dibujado (M4/F2).
 *
 * El subrayado es visual y un lector de pantalla no lo ve. Lo natural seria
 * `aria-current="page"` sobre el `<a>`, pero el `<a>` lo emite `HoverButton` y
 * no se puede alcanzar desde afuera: el `className` que recibe va al `<span>`
 * de adentro y el primitivo no se toca (`CLAUDE.md` §4.2). Un sufijo
 * visualmente oculto viaja **dentro** de los hijos, o sea adentro del ancla, y
 * se anuncia con el rotulo: «WORK, current page».
 *
 * No afecta al dibujo: `sr-only` lo saca del flujo con una caja de 1 px, asi
 * que el ancho del rotulo —y con el el subrayado, que se estira a la caja— no
 * se mueve.
 */
function CurrentPageHint({ active }: { active: boolean }) {
  const { t } = useLocale();

  if (!active) {
    return null;
  }

  return <span className="sr-only">, {t.nav.currentPage}</span>;
}

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useLocale();
  const { pendingPathname } = useRouteTransition();
  const visualPathname = pendingPathname ?? pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopLogoRef = useRef<HTMLDivElement>(null);
  const desktopLinkRefs = useRef<
    Partial<Record<DesktopNavHref, HTMLSpanElement | null>>
  >({});
  // `/fun-gallery` dejó de ser un caso especial en B3.3: la galería pasó a ser
  // una página normal en off-white, así que toma el mismo tratamiento que el
  // resto de las rutas claras. La única ruta oscura que queda es
  // `/contact/success`.
  const isDarkRoute = pathname === "/contact/success";
  /**
   * La ruta marcada, y **es una sola para los dos repartos** (M4/F2). El
   * escritorio la pinta con la barrita del indicador y el menu de mobile con el
   * subrayado del item; que salga del mismo calculo es lo que garantiza que los
   * dos digan lo mismo en las ocho rutas.
   *
   * `isPathActive` cubre las subrutas por prefijo, asi que `/work/matsu` marca
   * `WORK` y `/contact/success` marca `CONTACT US`. Cualquier subruta futura
   * entra por el mismo criterio, sin tabla nueva.
   *
   * En `/` devuelve `null` **a proposito**: home no es un item del menu —se
   * entra por el logo—, asi que ahi no va ninguno subrayado.
   */
  const activeNavHref: DesktopNavHref | null = isPathActive(
    visualPathname,
    "/contact",
  )
    ? "/contact"
    : (NAV_LINKS.find((link) => isPathActive(visualPathname, link.href))
        ?.href ?? null);

  /*
    Con el menú abierto el cromo entra en el mismo tono que el panel: la fila se
    pinta de off-black y sus rótulos van en off-white. Es lo que unifica el menú
    en las ocho rutas (M2/F1, punto 11) y de paso evita el destello de medio
    segundo en que el panel todavía está entrando y el logo quedaría blanco
    sobre blanco: la banda del header ya está negra desde el primer cuadro.
  */
  const chromeOnDark = isDarkRoute || menuOpen;
  const navTone = chromeOnDark ? "dark" : "light";
  const linkTextClass = chromeOnDark ? "text-off-white" : "text-off-black";
  const iconLineClass = chromeOnDark ? "bg-off-white" : "bg-off-black";

  /*
    La ventana en que el cromo cambia de tono, y de que lado del panel cae.
    Ver `CHROME_TONE_OPENING`: al abrir arranca ya, al cerrar espera los
    300 ms que el panel tarda en soltar la banda del header.
  */
  const chromeToneClass = menuOpen ? CHROME_TONE_OPENING : CHROME_TONE_CLOSING;
  const chromeToneDelay = menuOpen
    ? "0ms"
    : `${CHROME_TONE_OUT_DELAY_MS}ms`;
  // Literal entero: Tailwind v4 busca los nombres de clase como texto.
  const chromeToneDelayClass = menuOpen ? "delay-0" : "delay-[300ms]";

  /*
    La superficie de la fila, y por qué el `backdrop-blur` vive ACÁ y no en el
    `<nav>` (M2/F1, punto 11).

    Un `backdrop-filter` convierte al elemento en **bloque contenedor de sus
    descendientes `position: fixed`**. Con el blur puesto en el `<nav>`, el
    `fixed inset-0` del panel del menú no se resolvía contra el viewport sino
    contra la banda de 128 px del header: el menú salía como una franja negra
    con los rótulos desbordados por arriba y por abajo. En `/contact/success`
    —la única ruta cuyo `<nav>` va transparente y por lo tanto **sin blur**— el
    panel sí se resolvía contra el viewport, y por eso era la única donde se veía
    bien. Bajar el blur a la fila deja al panel, que es hermano suyo, fuera del
    bloque contenedor. La banda pintada es la misma: el `<nav>` no tiene más
    contenido que esta fila.
  */
  const rowSurfaceClass = menuOpen
    ? "bg-off-black"
    : isDarkRoute
      ? "bg-transparent"
      : "bg-off-white/95 backdrop-blur-sm";

  const setDesktopLinkRef = useCallback(
    (href: DesktopNavHref) => (node: HTMLSpanElement | null) => {
      desktopLinkRefs.current[href] = node;
    },
    [],
  );

  // El menú vive en el Navbar, que **no** se remonta al navegar: sin esto,
  // salir por el logo —que ahora está a la vista con el menú abierto— dejaría
  // el panel puesto sobre la ruta nueva. También cubre atrás/adelante.
  useEffect(() => {
    // Intencional: se cierra un estado de interfaz cuando cambia la ruta.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  /**
   * La medición del menú. Lo único propio del Navbar es **qué** se mide: la
   * raíz no marca ningún rótulo y se dibuja como un punto a la derecha del
   * logo, y el resto de las rutas marcan su tab. El redondeo, la morfología del
   * viaje y los disparadores de remedición son del módulo compartido.
   *
   * El `baselineLink` es siempre `/work`, y no el tab activo: la altura de la
   * línea tiene que ser la misma en las cinco rutas, así que sale de una caja
   * fija y no de la que esté marcada.
   */
  const measureTarget = useCallback((): IndicatorMeasure | null => {
    const desktopNav = desktopNavRef.current;
    const activeLink = activeNavHref
      ? desktopLinkRefs.current[activeNavHref]
      : null;
    const logo = desktopLogoRef.current;
    const baselineLink = desktopLinkRefs.current["/work"];

    if (!desktopNav || !baselineLink || !logo) {
      return null;
    }

    const navRect = desktopNav.getBoundingClientRect();
    const baselineBox = measureFillBox(baselineLink);
    const logoRect = logo.getBoundingClientRect();

    if (!baselineBox || logoRect.width === 0) {
      return null;
    }

    if (isHomePath(visualPathname)) {
      return {
        kind: "home",
        x: Math.round(logoRect.right) - navRect.left + NAV_INDICATOR_HOME_GAP,
        width: NAV_INDICATOR_DOT_WIDTH,
        top: indicatorTop(baselineBox, navRect.top),
      };
    }

    if (!activeLink) {
      return null;
    }

    return measureTabIndicator(activeLink, navRect);
  }, [activeNavHref, visualPathname]);

  /**
   * Lo que se observa para remedir sin que cambie la ruta: los cinco tabs y el
   * logo. Cuando cambia el idioma, `WORK` pasa a `PROYECTOS` y las cajas de la
   * fila cambian de ancho; el `ResizeObserver` del módulo compartido lo levanta
   * y vuelve a medir con el rótulo nuevo ya pintado. El logo entra porque el
   * punto de la raíz se apoya en su borde derecho.
   */
  const indicatorHosts = useCallback(
    () => [
      desktopLogoRef.current,
      ...INDICATOR_HOSTS.map((link) => desktopLinkRefs.current[link.href]),
    ],
    [],
  );

  const indicator = useIndicator({
    measureTarget,
    hosts: indicatorHosts,
  });

  /*
    Los dos `z` de acá adentro **solo se comparan entre sí**: el `<nav>` ya abre
    su propio contexto de apilado con `z-[100]`, así que la fila y el panel se
    ordenan puertas adentro. La fila va arriba, y no es cosmético: es lo que
    deja el logo, el toggle y la cruz a la vista sobre el panel, que es lo que
    permite que el menú no repita el cromo. Antes el panel tapaba la fila —dos
    hermanos con `z-index: auto` contra `z-[99]`— y por eso la cruz vivía
    adentro del panel.
  */
  return (
    <nav className="fixed left-0 right-0 top-0 z-[100] border-none">
      <div
        ref={desktopNavRef}
        className={`pointer-events-auto relative z-[2] flex h-[var(--header-height)] items-center justify-between py-10 ${CHROME_GUTTER} ${chromeToneClass} ${rowSurfaceClass}`}
      >
        {/*
          El logo **se funde** entre sus dos versiones en vez de cambiar de
          archivo de golpe (M3/F4, punto 5).

          `LogoScript` elige la imagen por `tone`, y son dos PNG distintos: un
          cambio de `tone` es un cambio de `src`, o sea un corte instantaneo.
          Con la superficie ahora transicionando 200 ms, ese corte seria peor
          que el defecto original —el logo blanco quedaria sobre el fondo
          todavia claro durante toda la ventana—. Asi que se montan los dos y
          se cruza la opacidad con la misma ventana y el mismo retardo que la
          superficie.

          No se resolvio invirtiendo el logo negro con un filtro, que hubiera
          sido un nodo menos: los dos archivos comparten la silueta —sus
          canales alfa dan 63,9 dB de PSNR, o sea identicos— pero la tinta no
          se verifico como una inversion exacta, y el logo es la marca. Con
          los dos assets reales no hay nada que verificar.

          El de arriba va `inert`: es decorativo y no puede quedar un segundo
          enlace al inicio en el orden de tabulacion.
        */}
        <div ref={desktopLogoRef} className="relative flex-shrink-0">
          <LogoScript size="md" tone="light" ariaLabel={t.nav.logoHome} />
          <div
            inert
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-200"
            style={{
              opacity: chromeOnDark ? 1 : 0,
              transitionDelay: chromeToneDelay,
            }}
          >
            <LogoScript size="md" tone="dark" ariaLabel={t.nav.logoHome} />
          </div>
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            return (
              <span
                key={link.href}
                ref={setDesktopLinkRef(link.href)}
                className="inline-flex"
              >
                <HoverButton
                  href={link.href}
                  underline={false}
                  tone={navTone}
                  balancedPadding
                  className={`text-[17px] uppercase font-body font-[480] tracking-normal ${linkTextClass}`}
                >
                  {t.nav[link.key]}
                </HoverButton>
              </span>
            );
          })}
        </div>

        <div className="flex-1" />

        {/*
          El toggle de idioma va a la derecha de CONTACT US (mockups 02, 08a,
          12, 14 y 15). El `gap-8` es el mismo del menú: con los 6 px de relleno
          de CONTACT US da los 38-39 px de aire que muestra el mockup.

          `items-start` y no `items-center`, y es una medida y no un gusto: el
          `<span>` que envuelve a CONTACT US mide 43,5 px —6 más que la caja de
          `HoverButton`, porque el `<a>` que hay adentro aporta el hueco de
          descendentes de los 16 px del body— mientras el toggle mide los 37,5
          de su propia caja. Centrados, el toggle bajaba 3 px y su subrayado
          quedaba desalineado del indicador del menú. Alineados arriba, las dos
          cajas comparten el borde inferior (79,75 px medidos), que es
          exactamente la referencia que `measureFillBox` le da al indicador.
          CONTACT US no se mueve: es el ítem más alto, así que la alineación no
          lo toca.
        */}
        <div className="hidden items-start gap-8 lg:flex">
          <span ref={setDesktopLinkRef("/contact")} className="inline-flex">
            <HoverButton
              href={CONTACT_LINK.href}
              underline={false}
              tone={navTone}
              balancedPadding
              className={`text-[17px] uppercase font-body font-medium tracking-normal ${linkTextClass}`}
            >
              {t.nav.contact}
            </HoverButton>
          </span>

          <LocaleToggle tone={navTone} toneDelayClass={chromeToneDelayClass} />
        </div>

        <NavIndicator
          animation={indicator}
          className={`hidden lg:block ${linkTextClass}`}
        />

        {/*
          El bloque de mobile: **el toggle de idioma al costado del ícono** y
          visible siempre, sin abrir nada (M2/F1, punto 2). Hasta M1 el control
          de idioma solo existía adentro del menú; ahora el menú no lo lleva y
          este es el único de mobile, así que no hay dos.

          El `gap-3` está medido y no elegido: el `::after` que le da los 44 px
          tocables al código activo se estira 12 px hacia afuera, y el toggle
          termina 6 px adentro de su propia caja (`pr-[6px]`), así que la
          extensión llega a 6 px del borde del grupo y quedan 6 px libres contra
          la caja del ícono. Con `gap-4` sobraba aire justo donde menos hay: a
          320 la fila entera pide 258,6 px de los 272 útiles.
        */}
        <div className="flex items-center gap-3 lg:hidden">
          <LocaleToggle tone={navTone} toneDelayClass={chromeToneDelayClass} />

          {/*
            Un solo botón para abrir y cerrar, y desde M4/F1 **un solo dibujo**:
            la cruz no reemplaza a las rayas, sale de ellas. Misma caja tocable
            de 44 × 44 y mismo centro (M2/F1, punto 12).

            El margen negativo de 20 px compensa el ancho que le sobra a la caja
            tocable a la derecha del dibujo: el borde derecho del ícono queda
            sobre el gutter, alineado con el resto del cromo.
          */}
          <button
            type="button"
            className="-mr-5 flex h-11 w-11 items-center"
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {/*
              La caja del dibujo mide 24 × 24 y es lo que hace que las tres
              rayas caigan en píxeles enteros (M2/F1, punto 3). La cuenta: la
              fila mide 128 y centra un botón de 44, así que el botón arranca en
              42; el botón centra esta caja de 24, así que la caja arranca en 52;
              la caja centra 3 × 2 + 2 × 5 = 16 px de contenido, así que la
              primera raya arranca en 56 y las otras en 63 y 70. **Los tres
              enteros.** Con el grosor de 1,5 px que había, los bordes caían en
              medios píxeles distintos por raya —una se repartía entre dos filas
              y las otras no— y por eso una se veía más gruesa que las demás. Y
              el largo: las tres miden 24, no dos de 24 y una de 16.
            */}
            <span
              aria-hidden
              className="flex h-6 w-6 flex-col items-start justify-center gap-[5px]"
            >
              {/*
                La raya del medio sigue ocupando su lugar con la opacidad en 0:
                es lo que mantiene a las otras dos en 4 y 18 mientras viajan, y
                por eso el desplazamiento es una constante y no una medida que
                dependa del estado.
              */}
              <span
                className={`block h-[2px] w-6 origin-center ${ICON_MOTION} ${chromeToneDelayClass} ${iconLineClass}`}
                style={
                  menuOpen
                    ? { transform: `translateY(${ICON_ARM_SHIFT}) rotate(45deg)` }
                    : { transform: "none" }
                }
              />
              <span
                className={`block h-[2px] w-6 ${ICON_MOTION} ${chromeToneDelayClass} ${iconLineClass}`}
                style={{ opacity: menuOpen ? 0 : 1 }}
              />
              <span
                className={`block h-[2px] w-6 origin-center ${ICON_MOTION} ${chromeToneDelayClass} ${iconLineClass}`}
                style={
                  menuOpen
                    ? { transform: `translateY(-${ICON_ARM_SHIFT}) rotate(-45deg)` }
                    : { transform: "none" }
                }
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id={MOBILE_MENU_ID}
            className={`fixed inset-0 z-[1] flex flex-col bg-off-black pt-[var(--header-height)] ${CHROME_GUTTER}`}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE_EXIT }}
          >
            {/*
              El menú no repite el cromo: el logo, el toggle y la cruz siguen
              siendo los de la fila de arriba, que queda por encima del panel
              (z-100 contra z-99) y pintada del mismo negro. Acá abajo va solo la
              navegación.

              `overflow-y-auto` con `my-auto` en el grupo: centra cuando hay
              lugar y **no recorta** cuando no lo hay (un teléfono acostado), que
              es lo que sí haría un `justify-center`.
            */}
            <div className="flex flex-1 flex-col overflow-y-auto pb-12">
              <div className={`my-auto w-full ${TOUCH_LINKS}`}>
                {/*
                  **Centrados** (M3/F4, punto 6). Hasta M2 la lista colgaba del
                  gutter izquierdo, alineada con el logo de arriba. La jerarquía
                  la siguen dando la escala y el aire —la lista en la escala de
                  display, `CONTACT US` en la del cuerpo— y no un borde ni una
                  caja: lo único que cambia es el eje.

                  Centrar no cambia lo que entra, porque no cambia el ancho de
                  ningún rótulo: el más ancho de los cuatro sigue siendo
                  `PROYECTOS`, 229,6 px a 40, contra 272 de caja útil a 320.
                  `CONTACTANOS`, que medía 348,6, era el que obligaba a bajar a
                  34 en M1 y ya no está en la lista.
                */}
                {/*
                  **El subrayado marca la seccion actual, y solo esa** (M4/F2).
                  Hasta M3 los cinco items lo llevaban puesto —`underline` es
                  `true` por defecto en `HoverButton`—, asi que el menu abierto
                  no decia en que pagina estabas: cinco lineas iguales no
                  distinguen nada. Ahora la linea es el estado.

                  El escritorio **no se toca**: alla el estado lo dice la
                  barrita del indicador, que se mide aparte y sigue igual.
                */}
                <div className="flex flex-col items-center gap-1 text-center">
                  {NAV_LINKS.map((link) => (
                    <HoverButton
                      key={link.href}
                      href={link.href}
                      tone="dark"
                      underline={activeNavHref === link.href}
                      className="font-display text-[40px] uppercase leading-[48px] sm:text-[48px] sm:leading-[56px]"
                    >
                      {t.nav[link.key]}
                      <CurrentPageHint active={activeNavHref === link.href} />
                    </HoverButton>
                  ))}
                </div>

                <div className="mt-10 flex justify-center text-center">
                  <HoverButton
                    href={CONTACT_LINK.href}
                    tone="dark"
                    underline={activeNavHref === CONTACT_LINK.href}
                    tightUnderline
                    className="font-body text-[17px] font-medium uppercase tracking-normal"
                  >
                    {t.nav.contact}
                    <CurrentPageHint
                      active={activeNavHref === CONTACT_LINK.href}
                    />
                  </HoverButton>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
