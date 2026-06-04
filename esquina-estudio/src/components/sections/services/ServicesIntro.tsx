"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
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
// Underline-draw duration baked into HoverButton (the `scaleX` tween). Kept here
// so the initial scroll-lock can outlast the full draw, not just the line reveal.
const CTA_UNDERLINE_DURATION = 2.5;
// Text 2 reveal waits for text 1 to finish fading out before staggering in.
const TEXT2_DELAY_CHILDREN = TITLE_DELAY + FADE_OUT_TIME;
// Deterministic latch timings (ms). We don't rely on Framer's onAnimationComplete
// for these gates: that callback can be dropped on re-render races (and the text-2
// layer carries infinitely-animating image children), which would leave the intro
// stuck. Timers tied to the known durations are race-proof.
//
// The initial scroll-lock holds until the button's underline has finished
// drawing (reveal delay + draw duration), not merely until the lines settle —
// so the user can't scroll past a half-drawn underline.
const INITIAL_LOCK_MS = (CTA_UNDERLINE_DELAY + CTA_UNDERLINE_DURATION) * 1000;
const CROSSFADE_MS = (FADE_OUT_TIME + FADE_IN_TIME) * 1000;

// Per-line reveal driven directly off `active` with an explicit per-line delay,
// instead of parent `staggerChildren` orchestration. The orchestrated form
// (container variant with staggerChildren) silently no-ops here: the container's
// hidden/visible variants are value-identical (opacity 1 -> 1), so Framer sees
// no parent transition and never staggers the children — leaving the lines
// stuck at their hidden y:30 state. Driving each line itself is race-proof and
// visually identical to Hero's line reveal (fade + rise, staggered).
function RevealLine({
  text,
  index,
  delayBase,
  reduceMotion,
  active,
  bold = false,
}: {
  text: React.ReactNode;
  index: number;
  delayBase: number;
  reduceMotion: boolean;
  active: boolean;
  bold?: boolean;
}) {
  if (reduceMotion) {
    return <span className={`block${bold ? " font-bold" : ""}`}>{text}</span>;
  }
  return (
    <motion.span
      className={`block${bold ? " font-bold" : ""}`}
      initial={{ opacity: 0, y: 30 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: TITLE_LINE_DURATION,
        delay: active ? delayBase + index * TITLE_STAGGER : 0,
        ease: EASE,
      }}
    >
      {text}
    </motion.span>
  );
}

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
// Bug A fix lives at the call-site: the parent passes `active={isPreloaderDone}`,
// which is MONOTONIC (the preloader only ever flips done once and never back).
// So once the lines reach `visible` they stay there for the rest of the mount —
// they never revert to the hidden (`y:30`) variant. The only thing that moves
// text 1 off-screen is the opacity fade of its parent container. (Previously
// `active` depended on `!hasInteracted`, so it flipped back to `hidden` on the
// crossfade and the lines dropped down — that was Bug A.)
function Text1Lines({
  reduceMotion,
  active,
}: {
  reduceMotion: boolean;
  active: boolean;
}) {
  const lines = [
    "WE TRANSLATE IDEAS INTO LIVING IDENTITIES —",
    "CRAFTED THROUGH STRATEGY, AESTHETICS AND",
    "DETAIL-ORIENTED DESIGN SYSTEMS.",
  ];
  return (
    <p className="font-display text-[40px] uppercase leading-[1.05] text-off-black max-w-5xl">
      {lines.map((text, index) => (
        <RevealLine
          key={index}
          text={text}
          index={index}
          delayBase={TITLE_DELAY}
          reduceMotion={reduceMotion}
          active={active}
        />
      ))}
    </p>
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
  const lines: Array<{ text: React.ReactNode; bold?: boolean }> = [
    { text: <>Whether we&rsquo;re shaping a brand from scratch or</> },
    { text: "reimagining an existing one, our approach is rooted in" },
    { text: "creating experiences that feel authentic, memorable", bold: true },
    { text: "and visually cohesive across every touchpoint.", bold: true },
  ];
  return (
    <p className="font-display text-[40px] leading-[1.05] text-off-black max-w-5xl">
      {lines.map((line, index) => (
        <RevealLine
          key={index}
          text={line.text}
          bold={line.bold}
          index={index}
          delayBase={TEXT2_DELAY_CHILDREN}
          reduceMotion={reduceMotion}
          active={active}
        />
      ))}
    </p>
  );
}

export default function ServicesIntro() {
  const { isPreloaderDone } = usePreloader();
  const reduceMotion = useReducedMotion();
  const shouldReduceMotion = Boolean(reduceMotion);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  // Latched once the forward intro is done. Never reset within a mount -> kills
  // the scroll-up replay at the source.
  const [isStatic, setIsStatic] = useState(false);
  // True when the static swap was triggered by the DISCOVER button (a smooth
  // jump that already lands the viewport on the list) rather than by scrolling
  // through the crossfade. The two paths position the viewport differently, so
  // the layout-effect that compensates scroll must know which one ran.
  const jumpedViaButtonRef = useRef(false);

  // Unlock the scroll-jack once the button's underline has finished drawing
  // (not merely once the lines settle). Deterministic timer instead of a Framer
  // completion callback (race-proof). Under reduced motion there's no reveal, so
  // unlock as soon as the preloader is done.
  useEffect(() => {
    if (isInitialLoadComplete) return;
    if (!isPreloaderDone || hasInteracted) return;

    const delay = shouldReduceMotion ? 0 : INITIAL_LOCK_MS;
    const timer = window.setTimeout(() => setIsInitialLoadComplete(true), delay);

    return () => window.clearTimeout(timer);
  }, [isPreloaderDone, hasInteracted, isInitialLoadComplete, shouldReduceMotion]);

  // Scroll-driven path: once the user has triggered the crossfade, keep the
  // scroll LOCKED through the whole text-2 reveal, then swap to the static
  // stacked layout while still locked. The matching scroll compensation runs in
  // a layout effect (below) so the viewport lands on the text-2 block in the
  // same frame as the swap — no visible pop, and scroll-up afterwards reveals
  // text 1. The DISCOVER button path is handled separately (it jumps to the
  // list and latches static after the jump), so skip it here.
  useEffect(() => {
    if (!hasInteracted || isStatic || isJumping || shouldReduceMotion) return;

    const timer = window.setTimeout(() => {
      setIsStatic(true);
    }, CROSSFADE_MS);

    return () => window.clearTimeout(timer);
  }, [hasInteracted, isStatic, isJumping, shouldReduceMotion]);

  // Scroll-jacking listeners. Inert in static mode (and removed entirely).
  // The initial-load lock holds until the button underline has finished drawing
  // (see INITIAL_LOCK_MS); under reduced motion there is no reveal, so that lock
  // is skipped.
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

  // Body scroll lock. The page stays locked for the ENTIRE intro (text-1
  // reveal -> crossfade -> text-2 reveal) and is released only once we've
  // swapped to the static layout — or while the DISCOVER button is performing
  // its smooth jump, or under reduced motion (no scroll-jack at all). Releasing
  // on `isStatic` (instead of mid-crossfade) is what lets the swap + scroll
  // compensation happen off-screen with no intermediate, scrollable, half-intro
  // state. Runs as a layout effect so the lock is lifted before the companion
  // scroll-compensation effect calls `scrollTo` in the same commit.
  useLayoutEffect(() => {
    if (isStatic || isJumping || shouldReduceMotion) {
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
  }, [isStatic, isJumping, shouldReduceMotion]);

  // Scroll compensation for the scroll-driven swap. When `isStatic` flips via
  // the crossfade path, the static layout mounts with the viewport at scrollY 0
  // (showing the text-1 block) while the user was just looking at text 2. Before
  // the browser paints, jump the viewport to the second viewport-height block so
  // it shows text 2 exactly where the sticky crossfade left it — no pop. The
  // button path positions itself (jumps to the list), so it opts out via the ref.
  useLayoutEffect(() => {
    if (!isStatic || jumpedViaButtonRef.current) return;
    window.scrollTo(0, window.innerHeight);
  }, [isStatic]);

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
    // Mark this as the button path so the static-swap scroll compensation does
    // NOT yank the viewport back up to the text-2 block — the jump below owns
    // the final scroll position (the services list).
    jumpedViaButtonRef.current = true;
    setIsJumping(true);
    setHasInteracted(true);

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

      setTimeout(() => {
        setIsJumping(false);
        // Swap to the static stacked layout now that the jump is over and the
        // user is parked on the list. The intro region (above the fold) keeps
        // the same total height, so this happens entirely off-screen and the
        // list does not shift. Scroll-up afterwards reveals the stacked texts.
        setIsStatic(true);
      }, 1600);
    }, 400);
  };

  // STATIC MODE: two texts stacked in normal flow, fully visible, no animation,
  // no sticky/absolute, no scroll-jack. Each block is a full viewport-height
  // (`h-screen`) section that mirrors EXACTLY what the sticky intro showed —
  // same centering, same FloatingMediaLayer + positions on text 2 — so the
  // crossfade-to-static swap is seamless and scroll-up/scroll-down keep the
  // same spacing with no overlapping floats (Bug B). The outer height
  // (`h-[200vh]` = two `h-screen` blocks) matches the intro container so
  // ServicesStack below never shifts.
  //
  // Reduced motion lands here directly: no scroll-jack, no crossfade, just the
  // two texts stacked and fully visible.
  if (isStatic || shouldReduceMotion) {
    return (
      <div
        className="relative h-[200vh] w-full -mt-[var(--header-height)]"
        ref={containerRef}
      >
        <div className="flex h-screen w-full flex-col items-center justify-center bg-off-white px-6 text-center">
          <div className="relative flex flex-col items-center">
            <Text1Lines reduceMotion active />
          </div>
        </div>
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-off-white px-6 text-center">
          <FloatingMediaLayer />
          <div className="relative z-10 flex flex-col items-center">
            <Text2Lines reduceMotion active />
          </div>
        </div>
      </div>
    );
  }

  // INTRO MODE: scroll-jacked sticky crossfade with the Hero-style line reveal.
  // Outer height is `h-[200vh]` to match the static layout (two `h-screen`
  // blocks), so the swap between the two never changes total height and the
  // content below never shifts.
  return (
    <div
      className="relative h-[200vh] w-full -mt-[var(--header-height)]"
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
            {/* Bug A: text 1 is LATCHED visible once revealed (active depends on
                the preloader, NOT on `!hasInteracted`). On crossfade it leaves
                purely via the parent container's opacity — the lines no longer
                drop back down to y:30. */}
            <Text1Lines
              reduceMotion={shouldReduceMotion}
              active={isPreloaderDone}
            />

            {/* Bug A: the button gets its OWN opacity fade (in addition to the
                parent's), synced to the crossfade, so it fades out together
                with the text instead of lingering. */}
            <motion.div
              className="absolute top-full mt-10"
              initial={false}
              animate={{ opacity: isJumping || hasInteracted ? 0 : 1 }}
              transition={{
                duration: hasInteracted ? FADE_OUT_TIME : 0,
                ease: "easeInOut",
              }}
            >
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
            </motion.div>
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
