"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import ServicesStack, {
  type ServiceContent,
} from "@/components/sections/services/ServicesStack";
import ServicesIntro from "@/components/sections/services/ServicesIntro";

interface ServicesPageClientProps {
  services: ServiceContent[];
}

export default function ServicesPageClient({
  services,
}: ServicesPageClientProps) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className="overflow-visible bg-off-white text-off-black">
      <ServicesIntro />
      <ServicesStack key={pathname} services={services} />
    </main>
  );
}
