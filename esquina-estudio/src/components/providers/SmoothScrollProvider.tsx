"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let isDisposed = false;
    let cleanupSmoothScroll: (() => void) | undefined;

    if (pathname === "/services") {
      document.documentElement.style.scrollBehavior = "auto";
      delete window.lenis;
      lenisRef.current = null;
      return;
    }

    document.documentElement.style.scrollBehavior = "";

    const setupSmoothScroll = async () => {
      const [{ default: LenisConstructor }, { gsap }, { ScrollTrigger }] =
        await Promise.all([
          import("@studio-freight/lenis"),
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]);

      if (isDisposed) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new LenisConstructor({
        lerp: 0.1,
        duration: 1.2,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      const handleScroll = () => ScrollTrigger.update();
      const updateLenis = (time: number) => {
        lenis.raf(time * 1000);
        ScrollTrigger.update();
      };

      lenis.on("scroll", handleScroll);
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      cleanupSmoothScroll = () => {
        lenis.off("scroll", handleScroll);
        gsap.ticker.remove(updateLenis);
        lenis.destroy();
        delete window.lenis;
        lenisRef.current = null;
      };

      if (isDisposed) {
        cleanupSmoothScroll();
      }
    };

    void setupSmoothScroll();

    return () => {
      isDisposed = true;
      cleanupSmoothScroll?.();
    };
  }, [pathname]);

  return <>{children}</>;
}
