"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";
import {
  type MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { usePreloader } from "@/components/providers/PreloaderProvider";
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

// Crossfade timing (preserve the existing intro state-machine feel).
const FADE_OUT_TIME = 1;
const FADE_IN_TIME = 1;

// Reveal timing — mirrors src/components/sections/home/Hero.tsx so the intro
// uses the exact same line-reveal primitive (no parallel system).
const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const TITLE_DELAY = 0.12;
const TITLE_STAGGER = 0.08;
const TITLE_LINE_DURATION = 0.42;
const TITLE_1_LINE_COUNT = 3;
const CTA_DURATION = 0.45;
// Button appears after the last line of text 1 has revealed (same math as Hero).
const CTA_DELAY =
  TITLE_DELAY + TITLE_STAGGER * (TITLE_1_LINE_COUNT - 1) + TITLE_LINE_DURATION;
const CTA_UNDERLINE_DELAY = CTA_DELAY + CTA_DURATION;
// Text 2 reveal waits for text 1 to finish fading out before staggering in.
const TEXT2_DELAY_CHILDREN = TITLE_DELAY + FADE_OUT_TIME;
// Deterministic latch timings (ms). We don't rely on Framer's onAnimationComplete
// for these gates: that callback can be dropped on re-render races (and the text-2
// layer carries infinitely-animating image children), which would leave the intro
// stuck. Timers tied to the known durations are race-proof.
const TEXT1_REVEAL_MS =
  (TITLE_DELAY + TITLE_STAGGER * (TITLE_1_LINE_COUNT - 1) + TITLE_LINE_DURATION) *
  1000;
const CROSSFADE_MS = (FADE_OUT_TIME + FADE_IN_TIME) * 1000;

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TITLE_STAGGER,
      delayChildren: TITLE_DELAY,
    },
  },
};

// Text 2 shares the same line stagger but holds back until text 1 has cleared.
const container2Variants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: TITLE_STAGGER,
      delayChildren: TEXT2_DELAY_CHILDREN,
    },
  },
};

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: TITLE_LINE_DURATION, ease: EASE },
  },
};

// Once the intro region has scrolled fully off-screen we may swap to the
// static stacked layout invisibly (nothing the user can see changes).
const STATIC_SWITCH_OFFSET = () => window.innerHeight;

type FloatingMediaItem = (typeof FLOATING_MEDIA)[number];

function FloatingImage({
  item,
  index,
}: {
  item: FloatingMediaItem;
  index: number;
}) {
  const imgRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 50, damping: 15, mass: 0.5 };
  const repelX = useSpring(x, springConfig);
  const repelY = useSpring(y, springConfig);
  const lockedDirection = useRef<{ x: number; y: number } | null>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = imgRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = centerX - event.clientX;
    const distanceY = centerY - event.clientY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    const triggerRadius = 100;

    if (distance < triggerRadius) {
      if (!lockedDirection.current && distance > 0) {
        lockedDirection.current = {
          x: distanceX / distance,
          y: distanceY / distance,
        };
      }

      const force = Math.min(
        1,
        ((triggerRadius - distance) / triggerRadius) * 1.5,
      );
      const maxPush = 80;

      if (lockedDirection.current) {
        x.set(lockedDirection.current.x * force * maxPush);
        y.set(lockedDirection.current.y * force * maxPush);
      }
    } else {
      lockedDirection.current = null;
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    lockedDirection.current = null;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={`pointer-events-auto absolute z-0 hover:z-50 ${item.className}`}
      animate={{ y: [0, -25, 0], x: [0, 15, 0] }}
      transition={{
        duration: 8 + index * 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <motion.div
        ref={imgRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: repelX, y: repelY }}
        className="relative h-full w-full overflow-hidden bg-gray-brand/20"
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
  );
}

function FloatingMediaLayer() {
  return (
    <div className="absolute inset-0 z-0">
      {FLOATING_MEDIA.map((item, index) => (
        <FloatingImage key={item.src} item={item} index={index} />
      ))}
    </div>
  );
}

// Text 1 copy split into lines so each can reveal independently (like Hero).
function Text1Lines({
  reduceMotion,
  active,
}: {
  reduceMotion: boolean;
  active: boolean;
}) {
  return (
    <motion.p
      className="font-display text-[40px] uppercase leading-[1.05] text-off-black max-w-5xl"
      variants={reduceMotion ? undefined : containerVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || active ? "visible" : "hidden"}
    >
      <motion.span className="block" variants={reduceMotion ? undefined : lineVariants}>
        WE TRANSLATE IDEAS INTO LIVING IDENTITIES —
      </motion.span>
      <motion.span className="block" variants={reduceMotion ? undefined : lineVariants}>
        CRAFTED THROUGH STRATEGY, AESTHETICS AND
      </motion.span>
      <motion.span className="block" variants={reduceMotion ? undefined : lineVariants}>
        DETAIL-ORIENTED DESIGN SYSTEMS.
      </motion.span>
    </motion.p>
  );
}

// Text 2 copy split into lines (lines 3 & 4 bold, matching the original markup).
function Text2Lines({
  reduceMotion,
  active,
}: {
  reduceMotion: boolean;
  active: boolean;
}) {
  return (
    <motion.p
      className="font-display text-[40px] leading-[1.05] text-off-black max-w-5xl"
      variants={reduceMotion ? undefined : container2Variants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || active ? "visible" : "hidden"}
    >
      <motion.span className="block" variants={reduceMotion ? undefined : lineVariants}>
        Whether we&rsquo;re shaping a brand from scratch or
      </motion.span>
      <motion.span className="block" variants={reduceMotion ? undefined : lineVariants}>
        reimagining an existing one, our approach is rooted in
      </motion.span>
      <motion.span
        className="block font-bold"
        variants={reduceMotion ? undefined : lineVariants}
      >
        creating experiences that feel authentic, memorable
      </motion.span>
      <motion.span
        className="block font-bold"
        variants={reduceMotion ? undefined : lineVariants}
      >
        and visually cohesive across every touchpoint.
      </motion.span>
    </motion.p>
  );
}

export default function ServicesIntro() {
  const { isPreloaderDone } = usePreloader();
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotion);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  // Latched once the forward intro is done AND the region has scrolled away.
  // Never reset within a mount -> kills the scroll-up replay at the source.
  const [isStatic, setIsStatic] = useState(false);

  // Unlock the scroll-jack once the text-1 reveal has settled. Deterministic
  // timer instead of a Framer completion callback (race-proof). Under reduced
  // motion there's no reveal, so unlock as soon as the preloader is done.
  useEffect(() => {
    if (isInitialLoadComplete) return;
    if (!isPreloaderDone || hasInteracted) return;

    const delay = shouldReduceMotion ? 0 : TEXT1_REVEAL_MS;
    const timer = window.setTimeout(() => setIsInitialLoadComplete(true), delay);

    return () => window.clearTimeout(timer);
  }, [isPreloaderDone, hasInteracted, isInitialLoadComplete, shouldReduceMotion]);

  // Latch "intro complete" once the crossfade to text 2 has finished. The jump
  // path latches immediately; this covers the scroll-driven path.
  useEffect(() => {
    if (!hasInteracted || isIntroComplete) return;

    const timer = window.setTimeout(() => setIsIntroComplete(true), CROSSFADE_MS);

    return () => window.clearTimeout(timer);
  }, [hasInteracted, isIntroComplete]);

  // Scroll-jacking listeners. Inert in static mode (and removed entirely).
  // The initial-load lock waits for the text-1 reveal to settle; under reduced
  // motion there is no reveal, so that lock is skipped.
  useEffect(() => {
    if (isStatic) return;

    let touchStartY = 0;
    const isLocked = () => !isInitialLoadComplete && !shouldReduceMotion;

    const handleWheel = (event: WheelEvent) => {
      if (isJumping) return;
      if (!isPreloaderDone) return;
      if (isLocked()) return;

      if (!hasInteracted && event.deltaY > 0) {
        event.preventDefault();
        setHasInteracted(true);
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (isJumping) return;
      if (!isPreloaderDone) return;
      if (isLocked()) return;

      const touchEndY = event.touches[0]?.clientY ?? touchStartY;
      const deltaY = touchStartY - touchEndY;

      if (!hasInteracted && deltaY > 0) {
        event.preventDefault();
        setHasInteracted(true);
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
  }, [
    hasInteracted,
    isInitialLoadComplete,
    isJumping,
    isPreloaderDone,
    isStatic,
    shouldReduceMotion,
  ]);

  // After the intro completes, swap to the static stacked layout only once the
  // intro region is fully off-screen, so the swap produces no visible "pop".
  useEffect(() => {
    if (!isIntroComplete || isStatic) return;

    const maybeLatchStatic = () => {
      if (window.scrollY >= STATIC_SWITCH_OFFSET()) {
        setIsStatic(true);
      }
    };

    maybeLatchStatic();
    window.addEventListener("scroll", maybeLatchStatic, { passive: true });

    return () => window.removeEventListener("scroll", maybeLatchStatic);
  }, [isIntroComplete, isStatic]);

  useEffect(() => {
    if (isStatic || isIntroComplete || isJumping) {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    } else {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "var(--scrollbar-width, 0px)";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [isStatic, isIntroComplete, isJumping]);

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

  const handleDiscover = () => {
    setIsJumping(true);
    setHasInteracted(true);
    setIsIntroComplete(true);

    setTimeout(() => {
      const target = document.getElementById("services-list");
      if (target) {
        const headerOffset = 140;
        const elementPosition = target.getBoundingClientRect().top;
        const targetY = elementPosition + window.scrollY - headerOffset;
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 1000;
        let start: number | null = null;

        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          let ease = progress / duration;
          ease = ease < 0.5 ? 2 * ease * ease : -1 + (4 - 2 * ease) * ease;

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
  };

  // STATIC MODE: two texts stacked in normal flow, fully visible, no animation,
  // no sticky/absolute, no scroll-jack. Same outer height as the intro so the
  // content below (ServicesStack) never shifts.
  if (isStatic) {
    return (
      <div
        className="relative h-[120vh] w-full -mt-[var(--header-height)]"
        ref={containerRef}
      >
        <div className="flex h-[60vh] w-full flex-col items-center justify-center bg-off-white px-6 text-center">
          <Text1Lines reduceMotion active />
        </div>
        <div className="relative flex h-[60vh] w-full flex-col items-center justify-center overflow-hidden bg-off-white px-6 text-center">
          <FloatingMediaLayer />
          <div className="relative z-10 flex flex-col items-center">
            <Text2Lines reduceMotion active />
          </div>
        </div>
      </div>
    );
  }

  // INTRO MODE: scroll-jacked sticky crossfade with the Hero-style line reveal.
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
            opacity: !isPreloaderDone ? 0 : isJumping ? 0 : hasInteracted ? 0 : 1,
            pointerEvents: hasInteracted ? "none" : "auto",
          }}
          transition={{
            // Appear instantly so the line reveal (below) is visible from its
            // first frame; only the crossfade-out is timed.
            duration: hasInteracted ? FADE_OUT_TIME : 0,
            delay: 0,
            ease: "easeInOut",
          }}
        >
          <div className="relative flex flex-col items-center">
            <Text1Lines
              reduceMotion={shouldReduceMotion}
              active={isPreloaderDone && !hasInteracted}
            />

            <div className="absolute top-full mt-10">
              <HoverButton
                as="button"
                className="font-body text-[17px] uppercase"
                underline={isPreloaderDone}
                underlineDraw={isPreloaderDone}
                underlineDrawDelay={CTA_UNDERLINE_DELAY}
                onClick={handleDiscover}
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
          transition={{
            duration: hasInteracted ? FADE_IN_TIME : FADE_OUT_TIME,
            delay: hasInteracted ? FADE_OUT_TIME : 0,
            ease: "easeInOut",
          }}
        >
          <FloatingMediaLayer />

          <div className="relative z-10 flex flex-col items-center">
            <Text2Lines
              reduceMotion={shouldReduceMotion}
              active={hasInteracted}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
