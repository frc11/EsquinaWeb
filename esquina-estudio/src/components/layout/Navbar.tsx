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
  const activeDesktopHref: DesktopNavHref | null = isPathActive(
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
    const activeLink = activeDesktopHref
      ? desktopLinkRefs.current[activeDesktopHref]
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
  }, [activeDesktopHref, visualPathname]);

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
        className={`pointer-events-auto relative z-[2] flex h-[var(--header-height)] items-center justify-between py-10 ${CHROME_GUTTER} ${rowSurfaceClass}`}
      >
        <div ref={desktopLogoRef} className="flex-shrink-0">
          <LogoScript size="md" tone={navTone} ariaLabel={t.nav.logoHome} />
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

          <LocaleToggle tone={navTone} />
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
          <LocaleToggle tone={navTone} />

          {/*
            Un solo botón para abrir y cerrar. La cruz vive en la misma ranura
            que las rayas —misma caja tocable de 44 × 44, mismo centro— así que
            el ícono se cambia en el lugar y no hay una cruz chiquita perdida en
            una esquina (M2/F1, punto 12).

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
            <span className="relative flex h-6 w-6 flex-col items-start justify-center gap-[5px]">
              {menuOpen ? (
                <>
                  <span
                    className={`absolute left-1/2 top-1/2 h-[2px] w-[30px] -translate-x-1/2 -translate-y-1/2 rotate-45 ${iconLineClass}`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 h-[2px] w-[30px] -translate-x-1/2 -translate-y-1/2 -rotate-45 ${iconLineClass}`}
                  />
                </>
              ) : (
                <>
                  <span className={`block h-[2px] w-6 ${iconLineClass}`} />
                  <span className={`block h-[2px] w-6 ${iconLineClass}`} />
                  <span className={`block h-[2px] w-6 ${iconLineClass}`} />
                </>
              )}
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
                  Alineado a la izquierda contra el gutter: los rótulos cuelgan
                  de la misma línea que el logo de arriba y que el resto del
                  sitio. La jerarquía la dan la escala y el aire —la lista en la
                  escala de display, `CONTACT US` en la del cuerpo— y no un
                  borde ni una caja.

                  Los 40 px entran en los cinco anchos ahora que `CONTACT US`
                  salió de la lista: el rótulo más ancho de los cuatro es
                  `PROYECTOS`, que a 40 px mide 229,6 contra 272 de caja útil a
                  320. `CONTACTANOS`, que medía 348,6, era el que obligaba a
                  bajar a 34 en M1.
                */}
                <div className="flex flex-col items-start gap-1">
                  {NAV_LINKS.map((link) => (
                    <HoverButton
                      key={link.href}
                      href={link.href}
                      tone="dark"
                      className="font-display text-[40px] uppercase leading-[48px] sm:text-[48px] sm:leading-[56px]"
                    >
                      {t.nav[link.key]}
                    </HoverButton>
                  ))}
                </div>

                <div className="mt-10">
                  <HoverButton
                    href={CONTACT_LINK.href}
                    tone="dark"
                    underline
                    tightUnderline
                    className="font-body text-[17px] font-medium uppercase tracking-normal"
                  >
                    {t.nav.contact}
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
