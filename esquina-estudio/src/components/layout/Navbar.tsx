"use client";

import { useCallback, useRef, useState } from "react";
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

/** El menú de mobile suma CONTACT US, que en desktop vive aparte. */
const MOBILE_LINKS = [
  ...NAV_LINKS,
  { key: "contact", href: "/contact" },
] as const satisfies readonly {
  key: keyof Dictionary["nav"];
  href: DesktopNavHref;
}[];

const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const NAV_INDICATOR_HOME_GAP = 24;

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
  // El menú de mobile entra con un `y` animado: hasta que ese
  // desplazamiento termina, el origen contra el que redondea la barrita del
  // toggle todavía se está moviendo. Con esto se remide una vez, ya quieto.
  const [menuSettled, setMenuSettled] = useState(false);
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

  const navTone = isDarkRoute ? "dark" : "light";
  const linkTextClass = isDarkRoute ? "text-off-white" : "text-off-black";
  const hamburgerLineClass = isDarkRoute ? "bg-off-white" : "bg-off-black";

  const setDesktopLinkRef = useCallback(
    (href: DesktopNavHref) => (node: HTMLSpanElement | null) => {
      desktopLinkRefs.current[href] = node;
    },
    [],
  );

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
      ...MOBILE_LINKS.map((link) => desktopLinkRefs.current[link.href]),
    ],
    [],
  );

  const indicator = useIndicator({
    measureTarget,
    hosts: indicatorHosts,
  });

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] border-none ${
        isDarkRoute ? "bg-transparent" : "bg-off-white/95 backdrop-blur-sm"
      }`}
    >
      <div
        ref={desktopNavRef}
        className={`pointer-events-auto relative flex h-[var(--header-height)] items-center justify-between py-10 ${CHROME_GUTTER}`}
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
              href="/contact"
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
          La caja tocable es de 44x44 (§3.4.3) y las tres líneas siguen
          alineadas a la izquierda como estaban. El margen negativo de 20 px
          compensa el ancho que sobra a la derecha, así que el borde izquierdo
          de las líneas queda donde lo dejaba el `p-2` viejo: la caja crece
          hacia el gutter, que es aire.
        */}
        <button
          type="button"
          className="-mr-5 flex h-11 w-11 flex-col items-start justify-center gap-[5px] lg:hidden"
          aria-label={t.nav.openMenu}
          aria-expanded={menuOpen}
          onClick={() => {
            setMenuSettled(false);
            setMenuOpen(true);
          }}
        >
          <span className={`block w-6 h-[1.5px] ${hamburgerLineClass}`} />
          <span className={`block w-6 h-[1.5px] ${hamburgerLineClass}`} />
          <span className={`block w-4 h-[1.5px] ${hamburgerLineClass}`} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-off-black px-6"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE_EXIT }}
            onAnimationComplete={() => setMenuSettled(true)}
          >
            <button
              type="button"
              className="absolute right-2 top-3 flex h-11 w-11 items-center justify-center font-body text-[17px] uppercase text-off-white"
              aria-label={t.nav.closeMenu}
              onClick={() => setMenuOpen(false)}
            >
              X
            </button>

            {/*
              48 px no entraban: `CONTACTANOS` mide 348,6 px y a 320 la caja
              útil es de 272. A 34 px da 246,9 y entra en los cinco anchos de
              prueba; de `sm` para arriba vuelve a la escala de display del
              sitio (40/48). El `leading` explícito no es cosmético: con
              `leading-none` la caja del link medía 38,5 px de alto y no
              llegaba al piso táctil.
            */}
            <div
              className={`flex flex-col items-center gap-3 text-center ${TOUCH_LINKS}`}
            >
              {MOBILE_LINKS.map((link) => (
                <HoverButton
                  key={link.href}
                  href={link.href}
                  tone="dark"
                  className="font-display text-[34px] uppercase leading-[40px] sm:text-[40px] sm:leading-[48px]"
                  onClick={() => setMenuOpen(false)}
                >
                  {t.nav[link.key]}
                </HoverButton>
              ))}

              {/*
                El menú de mobile es la única puerta al toggle debajo de `md`:
                sin esto el control de idioma quedaría inalcanzable en pantallas
                chicas. La adaptación mobile completa es una ronda aparte.
              */}
              <div className="mt-6">
                <LocaleToggle tone="dark" measureKey={menuSettled} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
