"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceItem from "@/components/sections/services/ServiceItem";

gsap.registerPlugin(ScrollTrigger);

export interface ServiceContent {
  id: string;
  name: string;
  description: string;
  note?: string;
  items: Array<
    | string
    | {
        main: string;
        subs?: string[];
      }
  >;
}

interface ServicesStackProps {
  services: ServiceContent[];
}

const HEADER_HEIGHT = 88;
const NAV_OFFSET = 72;

export default function ServicesStack({ services }: ServicesStackProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(() => new Set());
  const [activeService, setActiveService] = useState<string | null>(null);

  const serviceCount = services.length;
  const allExpanded = serviceCount > 0 && seenIds.size === serviceCount;

  const handleSeen = useCallback((id: string) => {
    setSeenIds((current) => {
      if (current.has(id)) return current;

      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  const handleToggle = useCallback((id: string) => {
    setActiveService((current) => (current === id ? null : id));
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-service-item]");

      items.forEach((item, index) => {
        const header = item.querySelector<HTMLElement>("[data-service-header]");
        const serviceId = item.dataset.serviceId;
        const stickyOffset = NAV_OFFSET + index * HEADER_HEIGHT;

        if (serviceId) {
          ScrollTrigger.create({
            trigger: item,
            start: "top 72%",
            once: true,
            onEnter: () => handleSeen(serviceId),
          });
        }

        if (header && window.matchMedia("(min-width: 768px)").matches) {
          ScrollTrigger.create({
            trigger: item,
            start: `top top+=${stickyOffset}`,
            end: `bottom top+=${stickyOffset}`,
            pin: header,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          });
        }
      });

      ScrollTrigger.refresh();
    }, root);

    return () => context.revert();
  }, [handleSeen, services.length]);

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [seenIds, activeService]);

  return (
    <div ref={rootRef} className="overflow-visible bg-off-white text-off-black">
      <section id="services-list" aria-label="Services">
        <div className="mx-auto mb-8 max-w-[1600px] px-6 md:px-12">
          <h2 className="font-body text-[17px] uppercase text-off-black">
            BRANDING PACK OPTIONS
          </h2>
        </div>

        {services.map((service, index) => {
          const isActive = activeService === service.id;
          const shouldExpand = activeService
            ? isActive
            : allExpanded || seenIds.has(service.id);

          return (
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
                isActive={isActive}
                shouldExpand={shouldExpand}
                allExpanded={allExpanded}
                onSeen={handleSeen}
                onToggle={handleToggle}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
}
