"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  PAGE_EXIT_EASE,
  ROUTE_TRANSITION_COMPLETE_EVENT,
  ROUTE_TRANSITION_START_EVENT,
} from "@/components/layout/RouteTransitionProvider";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

const FOOTER_MOVE_DURATION = 0.7;
const REDUCED_FOOTER_MOVE_DURATION = 0.06;

type FooterLock = {
  height: number;
  left: number;
  targetTop?: number;
  top: number;
  width: number;
};

function isFixedFooterPathname(pathname: string) {
  return (
    pathname === "/contact" ||
    pathname === "/contact/success" ||
    pathname === "/fun-gallery" ||
    pathname.startsWith("/fun-gallery/")
  );
}

function getEventPathname(event: Event) {
  if (!(event instanceof CustomEvent)) return null;
  if (typeof event.detail?.href !== "string") return null;

  return new URL(event.detail.href, window.location.href).pathname;
}

function isVisibleInViewport(rect: DOMRect) {
  return rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
}

export default function Footer() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const pathnameRef = useRef(pathname);
  const footerLockRef = useRef<FooterLock | null>(null);
  const measureFrameRef = useRef<number | null>(null);
  const [footerLock, setFooterLock] = useState<FooterLock | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const isFunGallery =
    pathname === "/fun-gallery" || pathname.startsWith("/fun-gallery/");
  const isContactForm = pathname === "/contact";
  const isDarkRoute = pathname === "/contact/success";

  const useGalleryBlend = isFunGallery;
  const footerTone = isFunGallery || isDarkRoute ? "dark" : "light";

  const textClass =
    isFunGallery || isDarkRoute ? "text-off-white" : "text-off-black";

  const footerSmallTextWeight = isFunGallery ? "font-thin" : "font-[550]";
  const footerCtaWeight = isFunGallery ? "font-thin" : "";
  const moveDuration = reduceMotion
    ? REDUCED_FOOTER_MOVE_DURATION
    : FOOTER_MOVE_DURATION;
  const footerClassName = `w-full border-none ${
    useGalleryBlend
      ? "fixed bottom-[26px] left-0 right-0 z-[100] bg-transparent text-off-white mix-blend-difference"
      : isContactForm || isDarkRoute
        ? "fixed bottom-0 left-0 right-0 z-[100] bg-transparent"
        : "bg-off-white"
  }`;
  const footerRouteStyle = isFunGallery
    ? {
        background: "transparent",
        backgroundColor: "transparent",
        backdropFilter: "none",
        WebkitBackdropFilter: "none",
      }
    : undefined;

  useEffect(() => {
    const finishFooterLock = () => {
      footerLockRef.current = null;
      setFooterLock(null);
    };

    const handleTransitionStart = (event: Event) => {
      const destinationPathname = getEventPathname(event);
      const footer = footerRef.current;

      if (
        !footer ||
        !destinationPathname ||
        isFixedFooterPathname(pathnameRef.current) ||
        isFixedFooterPathname(destinationPathname)
      ) {
        finishFooterLock();
        return;
      }

      const rect = footer.getBoundingClientRect();
      if (!isVisibleInViewport(rect)) {
        finishFooterLock();
        return;
      }

      const nextLock = {
        height: rect.height,
        left: rect.left,
        top: rect.top,
        width: rect.width,
      };

      footerLockRef.current = nextLock;
      setFooterLock(nextLock);
    };

    const handleTransitionComplete = () => {
      const currentLock = footerLockRef.current;
      if (!currentLock) return;

      if (measureFrameRef.current !== null) {
        window.cancelAnimationFrame(measureFrameRef.current);
      }

      measureFrameRef.current = window.requestAnimationFrame(() => {
        measureFrameRef.current = window.requestAnimationFrame(() => {
          const footer = footerRef.current;
          if (!footer) {
            finishFooterLock();
            return;
          }

          const rect = footer.getBoundingClientRect();
          const nextTop = Number.isFinite(rect.top) ? rect.top : 0;
          const targetTop =
            nextTop < window.innerHeight
              ? nextTop
              : Math.max(nextTop, window.innerHeight + currentLock.height);
          const nextLock = { ...currentLock, targetTop };

          footerLockRef.current = nextLock;
          setFooterLock(nextLock);
        });
      });
    };

    window.addEventListener(ROUTE_TRANSITION_START_EVENT, handleTransitionStart);
    window.addEventListener(
      ROUTE_TRANSITION_COMPLETE_EVENT,
      handleTransitionComplete,
    );

    return () => {
      window.removeEventListener(
        ROUTE_TRANSITION_START_EVENT,
        handleTransitionStart,
      );
      window.removeEventListener(
        ROUTE_TRANSITION_COMPLETE_EVENT,
        handleTransitionComplete,
      );

      if (measureFrameRef.current !== null) {
        window.cancelAnimationFrame(measureFrameRef.current);
      }
    };
  }, [moveDuration]);

  const footerContent = (
    <div className="flex w-full flex-row items-center justify-between px-12 py-10 lg:px-16">
      <div className="flex flex-row items-center justify-start gap-12 lg:gap-16">
        <div className="flex-shrink-0">
          <LogoScript size="sm" tone={footerTone} />
        </div>

        <div
          className={`grid grid-cols-4 gap-x-12 gap-y-[8px] font-body ${footerSmallTextWeight} text-[17px] uppercase leading-none ${isFunGallery ? "tracking-[0.035em]" : "tracking-normal"} ${textClass}`}
        >
          <span className="block whitespace-nowrap">BORN IN</span>
          <span className="block whitespace-nowrap">WORKING</span>

          <HoverButton
            href="https://www.instagram.com/esquina_estudio/"
            external
            underline
            tightUnderline
            tone={footerTone}
            blend={useGalleryBlend}
            className="justify-self-start"
          >
            INSTAGRAM
          </HoverButton>

          <span className="block whitespace-nowrap">&copy; 2024</span>

          <span className="block whitespace-nowrap">ARGENTINA</span>
          <span className="block whitespace-nowrap">WORLDWIDE</span>

          <HoverButton
            href="https://www.linkedin.com/company/esquina-estudio/"
            external
            underline
            tightUnderline
            tone={footerTone}
            blend={useGalleryBlend}
            className="justify-self-start"
          >
            LINKEDIN
          </HoverButton>

          <span />
        </div>
      </div>

      <div className="flex-shrink-0">
        <HoverButton
          href="/contact"
          underline
          tightUnderline
          tone={footerTone}
          blend={useGalleryBlend}
          className={`font-display ${footerCtaWeight} whitespace-nowrap text-[40px] uppercase leading-none ${isFunGallery ? "tracking-[0.02em] font-thin" : "tracking-normal"} ${textClass}`}
        >
          LET&apos;S WORK TOGETHER!
        </HoverButton>
      </div>
    </div>
  );

  const finishCloneAnimation = () => {
    if (footerLock?.targetTop === undefined) return;

    footerLockRef.current = null;
    setFooterLock(null);
  };

  if (isFunGallery) {
    return (
      <footer
        className="fixed bottom-[26px] left-0 right-0 z-[100] w-full border-none bg-transparent text-off-white mix-blend-difference"
        style={footerRouteStyle}
      >
        {footerContent}
      </footer>
    );
  }

  return (
    <>
      <motion.footer
        ref={footerRef}
        layout={footerLock ? false : "position"}
        transition={{
          layout: { duration: 0.65, ease: PAGE_EXIT_EASE },
        }}
        className={footerClassName}
        style={{
          ...footerRouteStyle,
          visibility: footerLock ? "hidden" : "visible",
        }}
      >
        {footerContent}
      </motion.footer>

      {footerLock && (
        <motion.footer
          aria-hidden
          initial={false}
          animate={{ top: footerLock.targetTop ?? footerLock.top }}
          transition={{ duration: moveDuration, ease: PAGE_EXIT_EASE }}
          onAnimationComplete={finishCloneAnimation}
          className={`${footerClassName} pointer-events-none fixed z-[101]`}
          style={{
            ...footerRouteStyle,
            bottom: "auto",
            height: footerLock.height,
            left: footerLock.left,
            right: "auto",
            width: footerLock.width,
          }}
        >
          {footerContent}
        </motion.footer>
      )}
    </>
  );
}
