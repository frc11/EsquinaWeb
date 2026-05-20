"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import HoverButton from "@/components/ui/HoverButton";

const FLOATING_MEDIA = [
  {
    src: "/projects/akasha-producto-2.jpg",
    alt: "Akasha packaging detail",
    className: "top-[15%] left-[8%] w-[180px] h-[240px]",
  },
  {
    src: "/projects/matsu-compu.png",
    alt: "Matsu digital identity",
    className: "top-[45%] left-[2%] w-[140px] h-[200px]",
  },
  {
    src: "/projects/romar.jpg",
    alt: "Romar brand atmosphere",
    className: "bottom-[10%] left-[10%] w-[160px] h-[160px]",
  },
  {
    src: "/projects/tukumi.jpg",
    alt: "Tukumi illustration and packaging",
    className: "top-[12%] right-[12%] w-[200px] h-[280px]",
  },
  {
    src: "/projects/brook-logo-texto.png",
    alt: "Brook identity detail",
    className: "top-[40%] right-[5%] w-[150px] h-[150px]",
  },
  {
    src: "/projects/akasha-producto.png",
    alt: "Akasha packaging alternate detail",
    className: "bottom-[25%] right-[20%] w-[120px] h-[160px]",
  },
  {
    src: "/projects/matsu.png",
    alt: "Matsu identity detail",
    className: "bottom-[5%] right-[5%] w-[220px] h-[220px]",
  },
];

const INITIAL_DELAY = 0.5;
const INITIAL_DURATION = 1;
const FADE_OUT_TIME = 1;
const FADE_IN_TIME = 1;

export default function ServicesIntro() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    let touchStartY = 0;

    const handleWheel = (event: WheelEvent) => {
      if (!isInitialLoadComplete) return;

      if (!hasInteracted && event.deltaY > 0) {
        event.preventDefault();
        setHasInteracted(true);
      } else if (
        hasInteracted &&
        isIntroComplete &&
        window.scrollY === 0 &&
        event.deltaY < 0
      ) {
        event.preventDefault();
        setHasInteracted(false);
        setIsIntroComplete(false);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isInitialLoadComplete) return;

      const touchEndY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - touchEndY;

      if (!hasInteracted && deltaY > 0) {
        event.preventDefault();
        setHasInteracted(true);
      } else if (
        hasInteracted &&
        isIntroComplete &&
        window.scrollY === 0 &&
        deltaY < 0
      ) {
        event.preventDefault();
        setHasInteracted(false);
        setIsIntroComplete(false);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [hasInteracted, isInitialLoadComplete, isIntroComplete]);

  useEffect(() => {
    if (!hasInteracted || !isIntroComplete) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [hasInteracted, isIntroComplete]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const restoreStyles: Array<() => void> = [];
    let element = container.parentElement;

    while (element && element !== document.body) {
      const styles = window.getComputedStyle(element);
      const hasStickyBlockingOverflow = [
        styles.overflow,
        styles.overflowX,
        styles.overflowY,
      ].some((value) => value === "hidden" || value === "clip");

      if (hasStickyBlockingOverflow) {
        const target = element;
        const previousOverflow = target.style.overflow;
        const previousOverflowX = target.style.overflowX;
        const previousOverflowY = target.style.overflowY;

        target.style.overflow = "visible";
        target.style.overflowX = "visible";
        target.style.overflowY = "visible";

        restoreStyles.push(() => {
          target.style.overflow = previousOverflow;
          target.style.overflowX = previousOverflowX;
          target.style.overflowY = previousOverflowY;
        });
      }

      element = element.parentElement;
    }

    return () => {
      restoreStyles.forEach((restoreStyle) => restoreStyle());
    };
  }, []);

  return (
    <div
      className="relative h-[120vh] w-full -mt-[var(--header-height)]"
      ref={containerRef}
    >
      <div className="sticky top-0 h-screen w-full bg-off-white z-10">
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isJumping ? 0 : hasInteracted ? 0 : 1,
            pointerEvents: hasInteracted ? "none" : "auto",
          }}
          onAnimationComplete={() => {
            if (!hasInteracted) setIsInitialLoadComplete(true);
          }}
          transition={{
            duration: !isInitialLoadComplete
              ? INITIAL_DURATION
              : hasInteracted
                ? FADE_OUT_TIME
                : FADE_IN_TIME,
            delay: !isInitialLoadComplete
              ? INITIAL_DELAY
              : hasInteracted
                ? 0
                : FADE_OUT_TIME,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center">
            <p className="font-display text-[40px] uppercase leading-[1.05] text-off-black max-w-5xl">
              WE TRANSLATE IDEAS INTO LIVING IDENTITIES — <br></br>CRAFTED THROUGH
              STRATEGY, AESTHETICS AND <br></br>DETAIL-ORIENTED DESIGN SYSTEMS.
            </p>

            <div className="absolute top-full mt-10">
              <HoverButton
                as="button"
                className="font-body text-[17px] uppercase"
                onClick={() => {
                  setIsJumping(true);

                  setTimeout(() => {
                    const target = document.getElementById("services-list");
                    if (target) {
                      const headerOffset = 140;
                      const elementPosition =
                        target.getBoundingClientRect().top;
                      const targetY =
                        elementPosition + window.scrollY - headerOffset;
                      const startY = window.scrollY;
                      const distance = targetY - startY;
                      const duration = 1000;
                      let start: number | null = null;

                      const step = (timestamp: number) => {
                        if (!start) start = timestamp;
                        const progress = timestamp - start;
                        let ease = progress / duration;
                        ease =
                          ease < 0.5
                            ? 2 * ease * ease
                            : -1 + (4 - 2 * ease) * ease;

                        const finalEase = Math.min(Math.max(ease, 0), 1);
                        window.scrollTo(0, startY + distance * finalEase);

                        if (progress < duration) {
                          window.requestAnimationFrame(step);
                        }
                      };

                      window.requestAnimationFrame(step);
                    }

                    setTimeout(() => setIsJumping(false), 1600);
                  }, 400);
                }}
              >
                DISCOVER OUR BRANDING SERVICES
              </HoverButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isJumping ? 0 : hasInteracted ? 1 : 0,
            pointerEvents: hasInteracted ? "auto" : "none",
          }}
          onAnimationComplete={() => {
            if (hasInteracted) {
              setIsIntroComplete(true);
            }
          }}
          transition={{
            duration: hasInteracted ? FADE_IN_TIME : FADE_OUT_TIME,
            delay: hasInteracted ? FADE_OUT_TIME : 0,
            ease: "easeInOut",
          }}
        >
          <div className="pointer-events-none absolute inset-0 z-0">
            {FLOATING_MEDIA.map((item, index) => (
              <motion.div
                key={item.src}
                className={`absolute z-0 hover:z-50 ${item.className}`}
                animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
                transition={{
                  duration: 8 + index * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.div
                  className="relative h-full w-full overflow-hidden bg-gray-brand/20"
                  whileHover={{ scale: 2.2 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 42vw, 22vw"
                    className="h-full w-full object-cover"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <p className="font-display text-[40px]  leading-[1.05] text-off-black max-w-5xl">
              Whether we’re shaping a brand from scratch or<br></br>
              reimagining an existing one, our approach is rooted in
              <br></br><b>creating experiences that feel authentic, memorable</b>
              <br></br><b>and visually cohesive across every touchpoint.</b>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
