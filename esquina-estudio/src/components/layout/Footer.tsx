import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

export default function Footer() {
  return (
    <footer className="bg-off-white border-t border-off-black">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-8 px-8 lg:px-12">
        {/* Logo — far left */}
        <div className="flex-shrink-0">
          <LogoScript size="sm" />
        </div>

        {/* Origin tagline */}
        <div className="text-nav uppercase font-body tracking-wider text-gray-brand">
          <span>BORN IN ARGENTINA</span>
          <span className="mx-2">|</span>
          <span>WORKING WORLDWIDE</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-4">
          <HoverButton
            href="https://www.instagram.com/esquina_estudio/"
            external
            className="text-nav uppercase font-body tracking-wider"
          >
            INSTAGRAM
          </HoverButton>
          <span className="text-gray-brand">|</span>
          <HoverButton
            href="https://www.linkedin.com/company/esquina-estudio/"
            external
            className="text-nav uppercase font-body tracking-wider"
          >
            LINKEDIN
          </HoverButton>
        </div>

        {/* Copyright */}
        <div className="text-nav uppercase font-body tracking-wider text-gray-brand">
          © {new Date().getFullYear()}
        </div>

        {/* CTA — far right */}
        <div className="flex-shrink-0">
          <HoverButton
            href="/contact"
            className="font-display text-footer-cta uppercase leading-none tracking-tight"
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </div>
      </div>
    </footer>
  );
}
