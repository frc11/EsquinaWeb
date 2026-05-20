"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceItem from "@/components/sections/services/ServiceItem";

gsap.registerPlugin(ScrollTrigger);

export interface ServiceContent {
  id: string;
  name: string;
  description: string;
  note?: string;
  items: Array<string | { main: string; subs?: string[] }>;
}

interface ServicesStackProps {
  services: ServiceContent[];
}

function ToggleHint() {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        times: [0, 0.2, 0.8, 1],
        ease: "easeInOut",
      }}
      className="font-body text-[12px] uppercase tracking-widest text-off-black/40"
    >
      [ CLICK SERVICE TO TOGGLE ]
    </motion.span>
  );
}


export default function ServicesStack({ services }: ServicesStackProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [activeAccordionId, setActiveAccordionId] = useState<string | null>(
    null,
  );
  const lastServiceId = services.at(-1)?.id ?? null;
  const handleToggle = useCallback((id: string) => {
    setActiveAccordionId((previousId) => (previousId === id ? null : id));
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-service-item]");
      const lastItem = items[items.length - 1];
      if (!lastItem) return;

      ScrollTrigger.create({
        trigger: lastItem,
        start: "top 104px", // Triggers exactly when Illustration hits the sticky navbar line
        once: true,
        onEnter: () => {
          setHasReachedEnd(true);
          if (lastServiceId) {
            setActiveAccordionId(lastServiceId);
          }
        },
      });
    }, root);

    return () => ctx.revert();
  }, [lastServiceId, services.length]);

  useEffect(() => {
    if (!hasReachedEnd || !lastServiceId) return;

    const frame = window.requestAnimationFrame(() => {
      setActiveAccordionId(lastServiceId);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hasReachedEnd, lastServiceId]);

  return (
    <div ref={rootRef} className="overflow-visible bg-off-white text-off-black">
      <section
        id="services-list"
        aria-label="Services"
        className="scroll-mt-[140px]"
      >
        <div className="mx-auto mb-8 flex max-w-[1600px] items-baseline justify-between px-6 md:px-12">
          <h2 className="font-body text-[17px] uppercase text-off-black">
            BRANDING PACK OPTIONS
          </h2>
          <AnimatePresence>
            {hasReachedEnd ? <ToggleHint /> : null}
          </AnimatePresence>
        </div>

        {services.map((service, index) => (
          <div key={service.id} className="w-full">
            {service.id === "A.S/01" && (
              <div className="mx-auto mb-8 mt-16 flex max-w-[1600px] items-baseline justify-between px-6 md:px-12">
                <h2 className="font-body text-[17px] uppercase text-off-black">
                  ADDITIONAL SERVICES
                </h2>
                <AnimatePresence>
                  {hasReachedEnd ? <ToggleHint /> : null}
                </AnimatePresence>
              </div>
            )}
            <ServiceItem
              service={service}
              index={index}
              isLast={index === services.length - 1}
              hasReachedEnd={hasReachedEnd}
              activeAccordionId={activeAccordionId}
              onToggle={handleToggle}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
