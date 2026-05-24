"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "@studio-freight/lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

function shouldUseSmoothScroll(pathname: string) {
  return pathname === "/team" || pathname.startsWith("/work");
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

    if (!shouldUseSmoothScroll(pathname)) {
      document.documentElement.style.scrollBehavior = "auto";
      delete window.lenis;
      lenisRef.current = null;
      return;
    }

    document.documentElement.style.scrollBehavior = "";

    const setupSmoothScroll = async () => {
      const { default: LenisConstructor } = await import("@studio-freight/lenis");

      if (isDisposed) return;

      const lenis = new LenisConstructor({
        lerp: 0.1,
        duration: 1.2,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      let animationFrame = 0;
      const updateLenis = (time: number) => {
        lenis.raf(time);
        animationFrame = window.requestAnimationFrame(updateLenis);
      };

      animationFrame = window.requestAnimationFrame(updateLenis);

      cleanupSmoothScroll = () => {
        window.cancelAnimationFrame(animationFrame);
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
