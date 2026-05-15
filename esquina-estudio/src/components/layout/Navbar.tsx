"use client";

import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "TEAM", href: "/team" },
  { label: "FUN GALLERY", href: "/fun-gallery" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-100 bg-off-white/95 backdrop-blur-sm border-b border-off-black/10"
      style={{ height: 72 }}
    >
      <div className="flex items-center justify-between h-full px-8 lg:px-12">
        {/* Logo — left */}
        <div className="flex-shrink-0">
          <LogoScript size="md" />
        </div>

        {/* Nav links — center-left */}
        <div className="hidden md:flex items-center gap-8 ml-12">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <div key={link.href} className="relative">
                <HoverButton
                  href={link.href}
                  className={`text-nav uppercase font-body font-medium tracking-wider !border-b-0 ${
                    isActive ? "!border-b !border-off-black" : ""
                  }`}
                >
                  {link.label}
                </HoverButton>
                {isActive && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[1px] bg-off-black" />
                )}
              </div>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Contact — right */}
        <div className="hidden md:block">
          <HoverButton
            href="/contact"
            className="text-nav uppercase font-body font-medium tracking-wider"
          >
            CONTACT US
          </HoverButton>
        </div>

        {/* Mobile hamburger — Prompt 09 */}
        <button
          type="button"
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Open menu"
        >
          <span className="block w-6 h-[1.5px] bg-off-black" />
          <span className="block w-6 h-[1.5px] bg-off-black" />
          <span className="block w-4 h-[1.5px] bg-off-black" />
        </button>
      </div>
    </nav>
  );
}
