"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRouteTransition } from "@/components/layout/RouteTransitionProvider";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "TEAM", href: "/team" },
  { label: "FUN GALLERY", href: "/fun-gallery" },
] as const;

const MOBILE_LINKS = [...NAV_LINKS, { label: "CONTACT US", href: "/contact" }];
const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const NAV_INDICATOR_DURATION = 0.62;
const NAV_INDICATOR_DOT_WIDTH = 5;
const NAV_INDICATOR_EASE: [number, number, number, number] = [
  0.65, 0, 0.15, 1,
];
const NAV_INDICATOR_TIMES = [0, 0.28, 0.72, 1];
const NAV_INDICATOR_HOME_GAP = 24;

type DesktopNavHref =
  | "/work"
  | "/services"
  | "/team"
  | "/fun-gallery"
  | "/contact";

type IndicatorMeasure = {
  kind: "home" | "tab";
  x: number;
  width: number;
  top: number;
};

type IndicatorAnimation = {
  opacity: number | number[];
  x: number | number[];
  width: number | number[];
  top: number;
  duration: number;
};

type FillBox = {
  left: number;
  right: number;
  bottom: number;
};

/**
 * Mide la caja que cubre el fill del hover de `HoverButton`, no el texto.
 *
 * El indicador se lee como el pie de ese fill, así que su referencia es la
 * misma caja que el fill pinta. El fill es un `absolute top-0 left-0 right-0
 * h-full` — con `balancedPadding`, que es lo que porta el Navbar en los cinco
 * tabs — de modo que ocupa exactamente su bloque contenedor. En reposo no
 * sirve medirlo a él: está desplazado `y: 120%` fuera de la caja. Lo que se
 * mide es el contenedor, y ese es el mismo elemento posicionado del que cuelga
 * el texto: de ahí el recorrido hasta el nodo de texto y el salto a su
 * `offsetParent`. Tampoco sirve el `<span>` que referencia el Navbar: envuelve
 * un `<a>` que hereda los 16 px del body y agrega por debajo del fill un hueco
 * de descendentes que no escala con el tamaño del tab.
 */
function measureFillBox(host: HTMLElement): FillBox | null {
  const walker = document.createTreeWalker(host, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node && !node.nodeValue?.trim()) {
    node = walker.nextNode();
  }

  const container = node?.parentElement?.offsetParent;

  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const rect = container.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return {
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
}

/**
 * Alto del subrayado relativo al contenedor del header: su borde superior se
 * apoya en el borde inferior del fill, sin hueco. Se redondea a píxel CSS
 * entero: el elemento mide 1 px de alto y un `top` fraccionario lo reparte entre
 * dos filas de píxeles, que es como se ve el hairline sucio a DPR 1.
 */
function indicatorTop(box: FillBox, navTop: number) {
  return Math.round(box.bottom - navTop);
}

function isPathActive(pathname: string, href: DesktopNavHref) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isHomePath(pathname: string) {
  return pathname === "/";
}

export default function Navbar() {
  const pathname = usePathname();
  const { pendingPathname } = useRouteTransition();
  const visualPathname = pendingPathname ?? pathname;
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopNavRef = useRef<HTMLDivElement>(null);
  const desktopLogoRef = useRef<HTMLDivElement>(null);
  const desktopLinkRefs = useRef<
    Partial<Record<DesktopNavHref, HTMLSpanElement | null>>
  >({});
  const currentIndicatorRef = useRef<IndicatorMeasure | null>(null);
  const [indicator, setIndicator] = useState<IndicatorAnimation | null>(null);
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

  const updateIndicator = useCallback(
    (animateMove: boolean) => {
      const desktopNav = desktopNavRef.current;
      const activeLink = activeDesktopHref
        ? desktopLinkRefs.current[activeDesktopHref]
        : null;
      const logo = desktopLogoRef.current;
      const baselineLink = desktopLinkRefs.current["/work"];

      if (!desktopNav || !baselineLink || !logo) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      const navRect = desktopNav.getBoundingClientRect();
      const baselineBox = measureFillBox(baselineLink);
      const logoRect = logo.getBoundingClientRect();

      if (!baselineBox || logoRect.width === 0) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      const homeIndicator: IndicatorMeasure = {
        kind: "home",
        x: Math.round(logoRect.right - navRect.left) + NAV_INDICATOR_HOME_GAP,
        width: NAV_INDICATOR_DOT_WIDTH,
        top: indicatorTop(baselineBox, navRect.top),
      };
      const previousIndicator = currentIndicatorRef.current;

      if (isHomePath(visualPathname)) {
        currentIndicatorRef.current = homeIndicator;

        if (
          !animateMove ||
          !previousIndicator ||
          previousIndicator.kind === "home"
        ) {
          setIndicator({
            ...homeIndicator,
            opacity: 0,
            duration: 0,
          });
          return;
        }

        setIndicator({
          opacity: [1, 1, 1, 0],
          x: [
            previousIndicator.x,
            previousIndicator.x,
            homeIndicator.x,
            homeIndicator.x,
          ],
          width: [
            previousIndicator.width,
            NAV_INDICATOR_DOT_WIDTH,
            NAV_INDICATOR_DOT_WIDTH,
            NAV_INDICATOR_DOT_WIDTH,
          ],
          top: homeIndicator.top,
          duration: NAV_INDICATOR_DURATION,
        });
        return;
      }

      if (!activeLink) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      const activeBox = measureFillBox(activeLink);

      if (!activeBox) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      // Los dos bordes se redondean por separado y el ancho sale de la resta,
      // para que ninguno de los dos caiga en medio de un píxel.
      const activeLeft = Math.round(activeBox.left - navRect.left);
      const activeRight = Math.round(activeBox.right - navRect.left);

      const nextIndicator: IndicatorMeasure = {
        kind: "tab",
        x: activeLeft,
        width: activeRight - activeLeft,
        top: indicatorTop(activeBox, navRect.top),
      };

      if (!animateMove || !previousIndicator) {
        setIndicator({
          ...nextIndicator,
          opacity: 1,
          duration: 0,
        });
        currentIndicatorRef.current = nextIndicator;
        return;
      }

      const movingRight = nextIndicator.x > previousIndicator.x;
      const isSamePosition =
        nextIndicator.x === previousIndicator.x &&
        nextIndicator.width === previousIndicator.width;

      setIndicator(
        isSamePosition
          ? {
              ...nextIndicator,
              opacity: 1,
              duration: 0,
            }
          : {
              opacity:
                previousIndicator.kind === "home" ? [0, 1, 1, 1] : 1,
              x: movingRight
                ? [
                    previousIndicator.x,
                    previousIndicator.x +
                      previousIndicator.width -
                      NAV_INDICATOR_DOT_WIDTH,
                    nextIndicator.x,
                    nextIndicator.x,
                  ]
                : [
                    previousIndicator.x,
                    previousIndicator.x,
                    nextIndicator.x +
                      nextIndicator.width -
                      NAV_INDICATOR_DOT_WIDTH,
                    nextIndicator.x,
                  ],
              width: [
                previousIndicator.width,
                NAV_INDICATOR_DOT_WIDTH,
                NAV_INDICATOR_DOT_WIDTH,
                nextIndicator.width,
              ],
              top: nextIndicator.top,
              duration: NAV_INDICATOR_DURATION,
            },
      );

      currentIndicatorRef.current = nextIndicator;
    },
    [activeDesktopHref, visualPathname],
  );

  useLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      updateIndicator(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [updateIndicator]);

  useLayoutEffect(() => {
    const handleResize = () => updateIndicator(false);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateIndicator]);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-[100] border-none ${
        isDarkRoute ? "bg-transparent" : "bg-off-white/95 backdrop-blur-sm"
      }`}
    >
      <div
        ref={desktopNavRef}
        className="pointer-events-auto relative flex h-[var(--header-height)] items-center justify-between px-12 py-10 lg:px-16"
      >
        <div ref={desktopLogoRef} className="flex-shrink-0">
          <LogoScript size="md" tone={navTone} />
        </div>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
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
                  {link.label}
                </HoverButton>
              </span>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="hidden md:block">
          <span ref={setDesktopLinkRef("/contact")} className="inline-flex">
            <HoverButton
              href="/contact"
              underline={false}
              tone={navTone}
              balancedPadding
              className={`text-[17px] uppercase font-body font-medium tracking-normal ${linkTextClass}`}
            >
              CONTACT US
            </HoverButton>
          </span>
        </div>

        {indicator ? (
          <motion.span
            aria-hidden
            className={`pointer-events-none absolute left-0 z-10 hidden h-px bg-current md:block ${linkTextClass}`}
            style={{ top: indicator.top }}
            initial={false}
            animate={{
              opacity: indicator.opacity,
              x: indicator.x,
              width: indicator.width,
            }}
            transition={{
              duration: indicator.duration,
              ease: NAV_INDICATOR_EASE,
              times: NAV_INDICATOR_TIMES,
            }}
          />
        ) : null}

        <button
          type="button"
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
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
          >
            <button
              type="button"
              className="absolute right-6 top-6 font-body text-[17px] uppercase text-off-white"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              X
            </button>

            <div className="flex flex-col items-center gap-3 text-center">
              {MOBILE_LINKS.map((link) => (
                <HoverButton
                  key={link.href}
                  href={link.href}
                  tone="dark"
                  className="font-display text-[48px] uppercase leading-none"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </HoverButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
