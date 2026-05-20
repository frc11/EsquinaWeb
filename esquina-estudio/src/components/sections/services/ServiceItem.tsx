"use client";

import Image from "next/image";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal, flushSync } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverButton from "@/components/ui/HoverButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { ServiceContent } from "@/components/sections/services/ServicesStack";

gsap.registerPlugin(ScrollTrigger);

interface ServiceItemProps {
  service: ServiceContent;
  index: number;
  isLast: boolean;
  hasReachedEnd: boolean;
  activeAccordionId: string | null;
  onToggle: (id: string) => void;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const CONTENT_GRID =
  "grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-6 lg:gap-10 w-full pt-6 pb-16";
const HEADER_GRID =
  "w-full pt-[52px] grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1.4fr] gap-6 lg:gap-10 items-center";
const SLIDESHOW_IMAGES = [
  "/projects/akasha.png",
  "/projects/tukumi.jpg",
  "/projects/romar.jpg",
  "/projects/matsu.png",
];

export default function ServiceItem({
  service,
  index,
  isLast,
  hasReachedEnd,
  activeAccordionId,
  onToggle,
}: ServiceItemProps) {
  const articleRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hasBeenPassed, setHasBeenPassed] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const isDark = service.id.startsWith("A.S");
  const isSectionCloser = service.id === "02" || isLast;
  const isEffectivelyOpen = hasReachedEnd
    ? activeAccordionId === service.id
    : !hasBeenPassed;
  const headerPositionClass = isLast
    ? "relative z-10"
    : "sticky top-[115px] z-40";
  const leftFeatures = isDark ? service.items : service.items.slice(0, 5);
  const rightFeatures = isDark ? [] : service.items.slice(5);
  const applicationsLabel = "Applications may include:";
  const hasApplicationsLabel = service.description.includes(applicationsLabel);
  const cleanDescription = hasApplicationsLabel
    ? service.description
      .replace(`\n\n${applicationsLabel}`, "")
      .replace(applicationsLabel, "")
      .trimEnd()
    : service.description;
  const quoteHref = `/contact?service=${encodeURIComponent(
    service.name.toLowerCase(),
  )}`;
  const renderFeatureItem = (
    item: ServiceContent["items"][number],
    itemIndex: number,
  ) => {
    const primaryTextClass = isDark ? "text-off-white" : "text-off-black";
    const secondaryTextClass = isDark
      ? "text-off-white/50"
      : "text-off-black/50";
    const isObjectStructure = typeof item === "object" && item !== null;

    if (isObjectStructure) {
      return (
        <li
          key={`${item.main}-${itemIndex}`}
          className="mb-4 flex break-inside-avoid flex-col gap-1"
        >
          <div className={`flex gap-2 font-medium ${primaryTextClass}`}>
            <span aria-hidden className="flex-shrink-0">
              +
            </span>
            <span className="whitespace-pre-line">{item.main}</span>
          </div>

          {item.subs?.map((subFeature, subIndex) => (
            <div
              key={`${subFeature}-${subIndex}`}
              className={`ml-6 flex gap-2 ${secondaryTextClass}`}
            >
              <span aria-hidden className="flex-shrink-0">
                +
              </span>
              <span className="whitespace-pre-line">{subFeature}</span>
            </div>
          ))}
        </li>
      );
    }

    return (
      <li
        key={`${String(item)}-${itemIndex}`}
        className={`flex break-inside-avoid gap-2 ${primaryTextClass}`}
      >
        <span aria-hidden className="flex-shrink-0">
          +
        </span>
        <span className="whitespace-pre-line">{String(item)}</span>
      </li>
    );
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    if (isLast) return;

    const article = articleRef.current;
    if (!article) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: article,
        start: "top bottom",
        end: () => "bottom 128px", // DYNAMIC: Evaluates exact position at time of trigger
        invalidateOnRefresh: true, // CRITICAL: Updates markers when previous items collapse
        once: true,
        onLeave: () => {
          if (contentRef.current && !hasBeenPassed) {
            const heightToLose = contentRef.current.getBoundingClientRect().height;

            flushSync(() => {
              setHasBeenPassed(true);
            });

            window.scrollBy({ top: -heightToLose, behavior: "instant" });

            // Allow layout to settle before recalculating GSAP markers for subsequent items
            setTimeout(() => {
              ScrollTrigger.refresh();
            }, 50);
          }
        },
      });
    }, article);

    return () => ctx.revert();
  }, [hasBeenPassed, isLast]);

  useEffect(() => {
    if (!isEffectivelyOpen && !isHovering) return;

    const timer = window.setInterval(() => {
      setCurrentImageIndex((current) =>
        (current + 1) % SLIDESHOW_IMAGES.length
      );
    }, 2000);

    return () => window.clearInterval(timer);
  }, [isEffectivelyOpen, isHovering]);

  useEffect(() => {
    if (!showWarning) return;

    const timer = window.setTimeout(() => setShowWarning(false), 2000);

    return () => window.clearTimeout(timer);
  }, [showWarning]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    cursorX.set(event.clientX + 28);
    cursorY.set(event.clientY + 28);
  };

  const handleHeaderClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    if (hasReachedEnd) {
      onToggle(service.id);
    } else if (hasBeenPassed && !hasReachedEnd) {
      setShowWarning(true);
    }
  };

  return (
    <RevealOnScroll delay={index * 0.05}>
      <article
        ref={articleRef}
        data-service-item
        data-service-id={service.id}
        className={isDark ? "bg-off-black text-off-white" : "bg-off-white text-off-black"}
        style={{ zIndex: 20 + index }}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-12">
          <div
            data-service-header
            onClick={handleHeaderClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
            className={`${headerPositionClass} ${hasReachedEnd ? "cursor-pointer" : "cursor-default"} outline-none ${HEADER_GRID} ${isSectionCloser ? "pb-[52px]" : "pb-5"} ${isDark
              ? "bg-off-black"
              : "bg-off-white"
            }`}
          >
            <div
              className={`absolute left-0 right-0 top-8 z-10 h-[1px] ${isDark ? "bg-off-white" : "bg-off-black"
                }`}
            />

            <span
              className={`font-body text-[17px] uppercase leading-none opacity-100 ${isDark ? "text-off-white" : "text-off-black"
                }`}
            >
              {service.id}
            </span>

            <span
              className={`font-display text-[30px] uppercase leading-none lg:col-span-1 ${isDark ? "text-off-white" : "text-off-black"
                }`}
            >
              {service.name}
            </span>
            <div className="flex items-center lg:col-start-3">
              <AnimatePresence mode="wait">
                {showWarning && !hasReachedEnd ? (
                  <motion.span
                    key="warning-hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 2,
                      times: [0, 0.2, 0.8, 1],
                      ease: "easeInOut",
                    }}
                    className={`font-body text-[12px] uppercase tracking-widest ${isDark ? "text-off-white/50" : "text-off-black/40"
                      }`}
                  >
                    [ SCROLL TO END TO UNLOCK ]
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <div
              className="ml-auto flex w-fit items-center justify-end"
              onClick={(event) => event.stopPropagation()}
            >
              <HoverButton
                href={quoteHref}
                as="a"
                tone={isDark ? "dark" : "light"}
                className="font-body text-[17px] uppercase tracking-wider"
              >
                REQUEST FORMAL QUOTE
              </HoverButton>
            </div>

            {mounted
              ? createPortal(
                  <AnimatePresence>
                    {isHovering && !isEffectivelyOpen ? (
                      <motion.div
                        aria-hidden
                        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-[220px] w-[165px] overflow-hidden md:block"
                        style={{ x: cursorX, y: cursorY }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.28, ease: EASE }}
                      >
                        <div
                          className={`relative h-full w-full border ${
                            isDark
                              ? "border-off-white/20 bg-off-black"
                              : "border-off-black/10 bg-off-white"
                          }`}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={SLIDESHOW_IMAGES[currentImageIndex]}
                              className="absolute inset-0"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: EASE }}
                            >
                              <Image
                                src={SLIDESHOW_IMAGES[currentImageIndex]}
                                alt={`${service.name} hover visual`}
                                fill
                                sizes="165px"
                                className="h-full w-full object-cover"
                              />
                            </motion.div>
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>,
                  document.body,
                )
              : null}
          </div>

          <AnimatePresence initial={false}>
            {isEffectivelyOpen ? (
              <motion.div
                key={`${service.id}-content`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: hasReachedEnd ? 0.55 : 0,
                  ease: EASE,
                }}
                className="overflow-hidden"
              >
                <div ref={contentRef} className={CONTENT_GRID}>
                  <div className="flex flex-col gap-6">
                    <p
                      className={`font-body text-[17px] leading-[1.5] whitespace-pre-line ${isDark ? "text-off-white" : "text-off-black"
                        }`}
                    >
                      {cleanDescription}
                    </p>
                    {service.note ? (
                      <p
                        className={`font-body text-[14px] leading-[1.4] whitespace-pre-line uppercase tracking-wide ${isDark ? "text-off-white/50" : "text-off-black/50"
                          }`}
                      >
                        {service.note}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-4">
                    {hasApplicationsLabel ? (
                      <p className="font-body text-[17px] leading-none">
                        {applicationsLabel}
                      </p>
                    ) : null}
                    <ul className="space-y-4 font-body text-[17px] leading-[1.45]">
                      {leftFeatures.map(renderFeatureItem)}
                    </ul>
                  </div>

                  {isDark ? (
                    <div aria-hidden />
                  ) : (
                    <ul className="space-y-4 font-body text-[17px] leading-[1.45]">
                      {rightFeatures.map(renderFeatureItem)}
                    </ul>
                  )}

                  <div
                    className={`relative w-full aspect-[3/4] min-h-[500px] max-h-[650px] overflow-hidden ${isDark ? "bg-off-white/15" : "bg-gray-brand/30"
                      }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={SLIDESHOW_IMAGES[currentImageIndex]}
                        className="absolute inset-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: EASE }}
                      >
                        <Image
                          src={SLIDESHOW_IMAGES[currentImageIndex]}
                          alt={`${service.name} visual reference`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 28vw"
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

        </div>
      </article>
    </RevealOnScroll>
  );
}
