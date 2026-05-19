"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    lenis: Lenis;
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
    if (pathname === "/services") {
      document.documentElement.style.scrollBehavior = "auto";
      delete window.lenis;
      lenisRef.current = null;
      return;
    }

    document.documentElement.style.scrollBehavior = "";

    const lenis = new Lenis({
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

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      delete window.lenis;
      lenisRef.current = null;
    };
  }, [pathname]);

  return <>{children}</>;
}
