import LogoScript from "@/components/ui/LogoScript";
import HoverButton from "@/components/ui/HoverButton";

export default function Footer() {
  return (
    <footer className="bg-off-white border-t border-off-black">
      <div className="flex flex-col items-center justify-between gap-8 py-8 px-6 text-center md:flex-row md:text-left lg:px-12">
        <div className="flex-shrink-0">
          <LogoScript size="sm" />
        </div>

        <div className="text-nav uppercase font-body tracking-wider text-gray-brand">
          <span>BORN IN ARGENTINA</span>
          <span className="mx-2">|</span>
          <span>WORKING WORLDWIDE</span>
        </div>

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

        <div className="text-nav uppercase font-body tracking-wider text-gray-brand">
          &copy; {new Date().getFullYear()}
        </div>

        <div className="w-full flex-shrink-0 text-center md:w-auto">
          <HoverButton
            href="/contact"
            className="font-display text-[34px] uppercase leading-none md:text-footer-cta"
          >
            LET&apos;S WORK TOGETHER!
          </HoverButton>
        </div>
      </div>
    </footer>
  );
}
