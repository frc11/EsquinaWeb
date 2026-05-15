"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
} from "framer-motion";
import HoverButton from "@/components/ui/HoverButton";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import type { ServiceContent } from "@/components/sections/services/ServicesStack";

interface ServiceItemProps {
  service: ServiceContent;
  index: number;
  isActive: boolean;
  shouldExpand: boolean;
  allExpanded: boolean;
  onSeen: (id: string) => void;
  onToggle: (id: string) => void;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ServiceItem({
  service,
  index,
  isActive,
  shouldExpand,
  allExpanded,
  onSeen,
  onToggle,
}: ServiceItemProps) {
  const ref = useRef<HTMLElement | null>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [isHovering, setIsHovering] = useState(false);
  const isDark = service.id.startsWith("A.S");
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px 0px -20% 0px",
  });
  const quoteHref = `/contact?service=${encodeURIComponent(
    service.name.toLowerCase(),
  )}`;

  useEffect(() => {
    if (isInView) {
      onSeen(service.id);
    }
  }, [isInView, onSeen, service.id]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle(service.id);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    cursorX.set(event.clientX + 28);
    cursorY.set(event.clientY + 28);
  };

  return (
    <RevealOnScroll delay={index * 0.05}>
      <article
      ref={ref}
      data-service-item
      data-service-id={service.id}
      className={`border-t ${
        isDark
          ? "border-off-white/20 bg-off-black text-off-white"
          : "border-off-black/20 bg-off-white text-off-black"
      }`}
      style={{ zIndex: 20 + index }}
    >
      <div
        data-service-header
        role="button"
        tabIndex={0}
        data-cursor="hover"
        aria-expanded={shouldExpand}
        onClick={() => onToggle(service.id)}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
        className={`relative flex min-h-[76px] cursor-pointer flex-col gap-4 px-6 py-5 outline-none md:min-h-[88px] md:flex-row md:items-center md:gap-8 md:px-12 md:py-6 ${
          isDark ? "bg-off-black" : "bg-off-white"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 md:flex-row md:items-center md:gap-8">
          <span className="w-16 flex-shrink-0 font-body text-[17px] uppercase leading-none opacity-50">
            {service.id}
          </span>
          <span className="min-w-0 flex-1 font-display text-[30px] uppercase leading-none">
            {service.name}
          </span>
          <span
            className="w-fit flex-shrink-0"
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
          </span>
        </div>

        <AnimatePresence>
          {isHovering ? (
            <motion.div
              aria-hidden
              className="pointer-events-none fixed left-0 top-0 z-[120] hidden h-[220px] w-[165px] md:block"
              style={{ x: cursorX, y: cursorY }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
            >
              <div
                className={`flex h-full w-full items-center justify-center border ${
                  isDark
                    ? "border-off-white/20 bg-off-white/15 text-off-white"
                    : "border-off-black/10 bg-gray-brand/30 text-gray-brand"
                }`}
              >
                <span className="px-4 text-center font-body text-[13px] uppercase tracking-wider">
                  Slide de fotos
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {shouldExpand ? (
          <motion.div
            key={`${service.id}-content`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mx-auto grid max-w-[1600px] gap-8 px-6 pb-12 pt-2 md:px-12 lg:grid-cols-[1fr_1fr_1fr]">
              <p className="font-body text-[17px] leading-[1.5]">
                {service.description}
              </p>

              <ul className="space-y-2 font-body text-[17px] leading-[1.45]">
                {service.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="flex-shrink-0">
                      +
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`flex aspect-[3/4] min-h-[320px] items-center justify-center ${
                  isDark ? "bg-off-white/15" : "bg-gray-brand/30"
                }`}
              >
                <span
                  className={`px-6 text-center font-body text-[13px] uppercase tracking-wider ${
                    isDark ? "text-off-white/60" : "text-gray-brand"
                  }`}
                >
                  Slide de fotos (a definir)
                </span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {isActive && (
        <span className="sr-only">Only this service is currently expanded.</span>
      )}
      {allExpanded && (
        <span className="sr-only">
          All services have been revealed. Select a row to isolate it.
        </span>
      )}
      </article>
    </RevealOnScroll>
  );
}
