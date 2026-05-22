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
import { useReducedMotion } from "framer-motion";

export const PAGE_EXIT_DURATION = 0.65;
export const PAGE_EXIT_EASE: [number, number, number, number] = [
  0.76, 0, 0.24, 1,
];

const REDUCED_EXIT_DURATION = 0.06;

type RouteTransitionContextValue = {
  exitDuration: number;
  isLeaving: boolean;
  navigateWithTransition: (href: string) => void;
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
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const [leavingPathname, setLeavingPathname] = useState<string | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const exitDuration = reduceMotion
    ? REDUCED_EXIT_DURATION
    : PAGE_EXIT_DURATION;
  const isLeaving = leavingPathname === pathname;

  const clearNavigationTimer = useCallback(() => {
    if (navigationTimerRef.current === null) return;

    window.clearTimeout(navigationTimerRef.current);
    navigationTimerRef.current = null;
  }, []);

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
      setLeavingPathname(pathname);
      clearNavigationTimer();

      navigationTimerRef.current = window.setTimeout(() => {
        router.push(routeHref);
      }, exitDuration * 1000);
    },
    [clearNavigationTimer, exitDuration, pathname, router],
  );

  useEffect(() => {
    pendingHrefRef.current = null;
    clearNavigationTimer();
  }, [clearNavigationTimer, pathname]);

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
    }),
    [exitDuration, isLeaving, navigateWithTransition],
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}
    </RouteTransitionContext.Provider>
  );
}
