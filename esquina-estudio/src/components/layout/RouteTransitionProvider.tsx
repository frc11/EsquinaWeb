"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

export const PAGE_EXIT_DURATION = 0.65;
export const PAGE_EXIT_EASE: [number, number, number, number] = [
  0.76, 0, 0.24, 1,
];
export const PAGE_EXIT_EASE_CSS = "cubic-bezier(0.76, 0, 0.24, 1)";

const REDUCED_EXIT_DURATION = 0.06;

type RouteTransitionContextValue = {
  exitDuration: number;
  isLeaving: boolean;
  navigateWithTransition: (href: string) => void;
  pendingPathname: string | null;
};

const RouteTransitionContext =
  createContext<RouteTransitionContextValue | null>(null);

function isModifiedClick(event: MouseEvent) {
  return (
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function getAnchor(event: MouseEvent) {
  if (!(event.target instanceof Element)) return null;
  return event.target.closest<HTMLAnchorElement>("a[href]");
}

function getInternalUrl(href: string) {
  const destination = new URL(href, window.location.href);

  if (destination.origin !== window.location.origin) return null;
  if (!["http:", "https:"].includes(destination.protocol)) return null;

  return destination;
}

function isCurrentRoute(destination: URL) {
  return destination.pathname === window.location.pathname;
}

function getRouteHref(destination: URL) {
  return `${destination.pathname}${destination.search}${destination.hash}`;
}

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReduceMotion(media.matches);

    updatePreference();
    media.addEventListener("change", updatePreference);

    return () => media.removeEventListener("change", updatePreference);
  }, []);

  return reduceMotion;
}

export function useRouteTransition() {
  const context = useContext(RouteTransitionContext);

  if (!context) {
    throw new Error(
      "useRouteTransition must be used inside RouteTransitionProvider.",
    );
  }

  return context;
}

export default function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduceMotion = usePrefersReducedMotion();
  const router = useRouter();
  const [leavingPathname, setLeavingPathname] = useState<string | null>(null);
  const [pendingPathname, setPendingPathname] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const exitDuration = reduceMotion
    ? REDUCED_EXIT_DURATION
    : PAGE_EXIT_DURATION;
  const isLeaving = leavingPathname === pathname;
  const visualPendingPathname =
    pendingPathname === pathname ? null : pendingPathname;

  const clearNavigationTimer = useCallback(() => {
    if (navigationTimerRef.current === null) return;

    window.clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current = null;
  }, []);

  const resetTransitionState = useCallback(() => {
    clearNavigationTimer();
    pendingHrefRef.current = null;
    setLeavingPathname(null);
    setPendingPathname(null);
  }, [clearNavigationTimer]);

  const navigateWithTransition = useCallback(
    (href: string) => {
      const destination = getInternalUrl(href);

      if (!destination) return;
      if (isCurrentRoute(destination)) {
        router.push(getRouteHref(destination));
        return;
      }

      const routeHref = getRouteHref(destination);
      if (pendingHrefRef.current === routeHref) return;

      pendingHrefRef.current = routeHref;
      setPendingPathname(destination.pathname);
      setLeavingPathname(pathname);
      clearNavigationTimer();

      navigationTimerRef.current = window.setTimeout(() => {
        router.push(routeHref);
      }, exitDuration * 1000);
    },
    [clearNavigationTimer, exitDuration, pathname, router],
  );

  useEffect(() => {
    const completedHref = pendingHrefRef.current;

    pendingHrefRef.current = null;
    clearNavigationTimer();

    const frame = window.requestAnimationFrame(() => {
      if (!completedHref) {
        resetTransitionState();
        return;
      }

      setLeavingPathname(null);
      setPendingPathname(null);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [clearNavigationTimer, pathname, resetTransitionState]);

  useEffect(() => {
    const handlePopState = () => {
      resetTransitionState();
    };

    window.addEventListener("popstate", handlePopState);

    return () => window.removeEventListener("popstate", handlePopState);
  }, [resetTransitionState]);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const anchor = getAnchor(event);
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const destination = getInternalUrl(anchor.href);
      if (!destination || isCurrentRoute(destination)) return;

      event.preventDefault();
      navigateWithTransition(getRouteHref(destination));
    };

    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      clearNavigationTimer();
    };
  }, [clearNavigationTimer, navigateWithTransition]);

  const contextValue = useMemo(
    () => ({
      exitDuration,
      isLeaving,
      navigateWithTransition,
      pendingPathname: visualPendingPathname,
    }),
    [
      exitDuration,
      isLeaving,
      navigateWithTransition,
      visualPendingPathname,
    ],
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}
    </RouteTransitionContext.Provider>
  );
}
