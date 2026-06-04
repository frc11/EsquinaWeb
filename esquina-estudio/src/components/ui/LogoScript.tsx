import Image from "next/image";
import Link from "next/link";
import footerLogo from "../../../logos/logo-footer.png";
import headerLogo from "../../../logos/logo-header-negro.png";
import headerLogoWhite from "../../../logos/logo-header-blanco.png";

interface LogoScriptProps {
  className?: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
}

export default function LogoScript({
  className = "",
  size = "md",
  tone = "light",
}: LogoScriptProps) {
  const isFooter = size === "sm";
  const isDark = tone === "dark";

  const logoSrc = isFooter
    ? footerLogo
    : isDark
      ? headerLogoWhite
      : headerLogo;

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="ESQUINA ESTUDIO home"
    >
      <Image
        src={logoSrc}
        alt="ESQUINA ESTUDIO"
        className={`${isFooter ? "h-20 w-auto" : "h-12 w-auto"}${isDark && isFooter ? " invert" : ""}`}
        priority={!isFooter}
        sizes={isFooter ? "120px" : "196px"}
      />
    </Link>
  );
}
