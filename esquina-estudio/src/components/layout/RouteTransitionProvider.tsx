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
export const FULL_LAYOUT_EXIT_DURATION = 0.55;
export const FULL_LAYOUT_ENTER_DURATION = 0.65;
export const PAGE_EXIT_EASE: [number, number, number, number] = [
  0.76, 0, 0.24, 1,
];
export const ROUTE_TRANSITION_START_EVENT = "esquina-route-transition-start";
export const ROUTE_TRANSITION_COMPLETE_EVENT =
  "esquina-route-transition-complete";

const REDUCED_EXIT_DURATION = 0.06;

type RouteTransitionContextValue = {
  exitDuration: number;
  finishFullLayoutTransition: () => void;
  isFullLayoutEntering: boolean;
  isFullLayoutLeaving: boolean;
  isFullLayoutTransition: boolean;
  isLeaving: boolean;
  navigateWithTransition: (href: string) => void;
};

type TransitionMode = "content" | "full-layout";

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

export function isFunGalleryPath(pathname: string) {
  return pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
}

export function shouldUseFullLayoutTransition(from: string, to: string) {
  return isFunGalleryPath(from) || isFunGalleryPath(to);
}

function announceRouteTransition(eventName: string, href: string) {
  window.dispatchEvent(new CustomEvent(eventName, { detail: { href } }));
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
  const [transitionMode, setTransitionMode] =
    useState<TransitionMode | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const navigationTimerRef = useRef<number | null>(null);

  const exitDuration = reduceMotion
    ? REDUCED_EXIT_DURATION
    : PAGE_EXIT_DURATION;
  const fullLayoutExitDuration = reduceMotion
    ? REDUCED_EXIT_DURATION
    : FULL_LAYOUT_EXIT_DURATION;
  const isFullLayoutTransition = transitionMode === "full-layout";
  const isFullLayoutLeaving =
    isFullLayoutTransition && leavingPathname === pathname;
  const isFullLayoutEntering =
    isFullLayoutTransition &&
    leavingPathname !== null &&
    leavingPathname !== pathname;
  const isLeaving =
    transitionMode === "content" && leavingPathname === pathname;

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
      const nextMode = shouldUseFullLayoutTransition(
        pathname,
        destination.pathname,
      )
        ? "full-layout"
        : "content";
      const nextExitDuration =
        nextMode === "full-layout" ? fullLayoutExitDuration : exitDuration;

      pendingHrefRef.current = routeHref;
      announceRouteTransition(ROUTE_TRANSITION_START_EVENT, routeHref);
      setTransitionMode(nextMode);
      setLeavingPathname(pathname);
      clearNavigationTimer();

      navigationTimerRef.current = window.setTimeout(() => {
        router.push(routeHref);
      }, nextExitDuration * 1000);
    },
    [
      clearNavigationTimer,
      exitDuration,
      fullLayoutExitDuration,
      pathname,
      router,
    ],
  );

  const finishFullLayoutTransition = useCallback(() => {
    if (transitionMode !== "full-layout") return;

    setLeavingPathname(null);
    setTransitionMode(null);
  }, [transitionMode]);

  useEffect(() => {
    const completedHref = pendingHrefRef.current;

    pendingHrefRef.current = null;
    clearNavigationTimer();

    if (completedHref) {
      announceRouteTransition(
        ROUTE_TRANSITION_COMPLETE_EVENT,
        completedHref,
      );
    }
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
      finishFullLayoutTransition,
      isFullLayoutEntering,
      isFullLayoutLeaving,
      isFullLayoutTransition,
      isLeaving,
      navigateWithTransition,
    }),
    [
      exitDuration,
      finishFullLayoutTransition,
      isFullLayoutEntering,
      isFullLayoutLeaving,
      isFullLayoutTransition,
      isLeaving,
      navigateWithTransition,
    ],
  );

  return (
    <RouteTransitionContext.Provider value={contextValue}>
      {children}
    </RouteTransitionContext.Provider>
  );
}
