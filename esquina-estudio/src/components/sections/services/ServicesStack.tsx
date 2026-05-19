"use client";

import { useLayoutEffect, useRef, useState } from "react";
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

export default function ServicesStack({ services }: ServicesStackProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

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
        onEnter: () => setHasReachedEnd(true),
      });
    }, root);

    return () => ctx.revert();
  }, [services.length]);

  return (
    <div ref={rootRef} className="overflow-visible bg-off-white text-off-black">
      <section id="services-list" aria-label="Services">
        <div className="mx-auto mb-8 max-w-[1600px] px-6 md:px-12">
          <h2 className="font-body text-[17px] uppercase text-off-black">
            BRANDING PACK OPTIONS
          </h2>
        </div>

        {services.map((service, index) => (
          <div key={service.id} className="w-full">
            {service.id === "A.S/01" && (
              <div className="mx-auto w-full max-w-[1600px] px-6 md:px-12 mt-16 mb-8">
                <h2 className="font-body text-[17px] uppercase text-off-black">
                  ADDITIONAL SERVICES
                </h2>
              </div>
            )}
            <ServiceItem
              service={service}
              index={index}
              isLast={index === services.length - 1}
              hasReachedEnd={hasReachedEnd}
            />
          </div>
        ))}
      </section>
    </div>
  );
}
