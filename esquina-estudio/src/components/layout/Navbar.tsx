"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

const NAV_LINKS = [
  { label: "WORK", href: "/work" },
  { label: "SERVICES", href: "/services" },
  { label: "TEAM", href: "/team" },
  { label: "FUN GALLERY", href: "/fun-gallery" },
];

const MOBILE_LINKS = [...NAV_LINKS, { label: "CONTACT US", href: "/contact" }];
const EASE_EXIT: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-100 border-none bg-off-white/95 backdrop-blur-sm">
      <div className="relative flex h-[var(--header-height)] items-center justify-between px-12 pb-6 pt-12 lg:px-16">
        <div className="flex-shrink-0">
          <LogoScript size="md" />
        </div>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <HoverButton
                key={link.href}
                href={link.href}
                underline={isActive}
                className={`text-[13px] uppercase font-body font-medium tracking-wider text-off-black text-center ${
    link.label === "WORK" ? "w-[43px]" : ""
  }${
    link.label === "SERVICES" ? "w-[68px]" : ""
  } ${
    link.label === "FUN GALLERY" ? "w-[102px]" : "" // Adjust 102px up or down slightly if this one also bleeds
  }${
    link.label === "TEAM" ? "w-[40px]" : ""
  }`}
>
                {link.label}
              </HoverButton>
            );
          })}
        </div>

        <div className="flex-1" />

        <div className="hidden md:block">
          <HoverButton
            href="/contact"
            underline={
              pathname === "/contact" || pathname.startsWith("/contact/")
            }
            className="text-[13px] uppercase font-body font-medium tracking-wider text-off-black"
          >
            CONTACT US
          </HoverButton>
        </div>

        <button
          type="button"
          className="md:hidden flex flex-col gap-[5px] p-2"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <span className="block w-6 h-[1.5px] bg-off-black" />
          <span className="block w-6 h-[1.5px] bg-off-black" />
          <span className="block w-4 h-[1.5px] bg-off-black" />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-off-black px-6"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5, ease: EASE_EXIT }}
          >
            <button
              type="button"
              className="absolute right-6 top-6 font-body text-[17px] uppercase text-off-white"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            >
              X
            </button>

            <div className="flex flex-col items-center gap-3 text-center">
              {MOBILE_LINKS.map((link) => (
                <HoverButton
                  key={link.href}
                  href={link.href}
                  tone="dark"
                  className="font-display text-[48px] uppercase leading-none"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </HoverButton>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
