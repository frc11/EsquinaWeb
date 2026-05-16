"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverButton from "@/components/ui/HoverButton";
import ServiceItem from "@/components/sections/services/ServiceItem";

gsap.registerPlugin(ScrollTrigger);

export interface ServiceContent {
  id: string;
  name: string;
  description: string;
  items: string[];
}

interface ServicesStackProps {
  services: ServiceContent[];
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
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
    <main ref={rootRef} className="bg-off-white text-off-black">
      <section className="flex min-h-[calc(100vh-var(--header-height))] flex-col items-center justify-center px-6 py-24 text-center md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="max-w-5xl"
        >
          <h1 className="font-display text-[clamp(36px,6vw,64px)] uppercase leading-[1.02] text-off-black">
            WE TRANSLATE IDEAS INTO LIVING IDENTITIES &mdash; CRAFTED THROUGH
            STRATEGY, AESTHETICS AND DETAIL-ORIENTED DESIGN SYSTEMS.
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
          className="mt-12"
        >
          <HoverButton
            href="#services-stack"
            className="font-body text-[17px] uppercase tracking-wider"
          >
            DISCOVER OUR BRANDING SERVICES -&gt;
          </HoverButton>
        </motion.div>
      </section>

      <section id="services-stack" aria-label="Services">
        {services.map((service, index) => {
          const isActive = activeService === service.id;
          const shouldExpand = activeService
            ? isActive
            : allExpanded || seenIds.has(service.id);

          return (
            <ServiceItem
              key={service.id}
              service={service}
              index={index}
              isActive={isActive}
              shouldExpand={shouldExpand}
              allExpanded={allExpanded}
              onSeen={handleSeen}
              onToggle={handleToggle}
            />
          );
        })}
      </section>
    </main>
  );
}
