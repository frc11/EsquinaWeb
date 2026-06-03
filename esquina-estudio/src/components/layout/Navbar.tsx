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
  const isFunGallery =
    pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
  const isDarkRoute = pathname === "/contact/success";
  const activeDesktopHref: DesktopNavHref | null = isPathActive(
    visualPathname,
    "/contact",
  )
    ? "/contact"
    : (NAV_LINKS.find((link) => isPathActive(visualPathname, link.href))
        ?.href ?? null);

  const useGalleryBlend = isFunGallery && !menuOpen;
  const navTone = isFunGallery || isDarkRoute ? "dark" : "light";
  const linkTextClass = isFunGallery || isDarkRoute
    ? "text-off-white"
    : "text-off-black";
  const hamburgerLineClass = isFunGallery || isDarkRoute
    ? "bg-off-white"
    : "bg-off-black";

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
      const baselineRect = baselineLink.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();

      if (
        baselineRect.width === 0 ||
        baselineRect.height === 0 ||
        logoRect.width === 0
      ) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      const homeIndicator: IndicatorMeasure = {
        kind: "home",
        x: logoRect.right - navRect.left + NAV_INDICATOR_HOME_GAP,
        width: NAV_INDICATOR_DOT_WIDTH,
        top: baselineRect.bottom - navRect.top - 7,
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

      const linkRect = activeLink.getBoundingClientRect();

      if (linkRect.width === 0 || linkRect.height === 0) {
        currentIndicatorRef.current = null;
        setIndicator(null);
        return;
      }

      const nextIndicator: IndicatorMeasure = {
        kind: "tab",
        x: linkRect.left - navRect.left,
        width: linkRect.width,
        top: linkRect.bottom - navRect.top - 7,
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
        useGalleryBlend
          ? "pointer-events-none bg-transparent text-off-white mix-blend-difference"
          : isFunGallery
            ? "pointer-events-none bg-transparent"
          : isDarkRoute
            ? "bg-transparent"
            : "bg-off-white/95 backdrop-blur-sm"
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
                  blend={useGalleryBlend}
                  balancedPadding
                  className={`text-[13px] uppercase font-body ${
                    isFunGallery ? "font-thin" : "font-[480]"
                  } ${
                    isFunGallery ? "tracking-[0.09em]" : "tracking-wider"
                  } ${linkTextClass}`}
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
              blend={useGalleryBlend}
              balancedPadding
              className={`text-[13px] uppercase font-body ${
                isFunGallery ? "font-normal" : "font-medium"
              } ${
                isFunGallery ? "tracking-[0.09em]" : "tracking-wider"
              } ${linkTextClass}`}
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
