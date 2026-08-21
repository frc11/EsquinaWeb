import Image from "next/image";
import Link from "next/link";
import footerLogo from "../../../logos/logo-footer.png";
import headerLogo from "../../../logos/logo-header-negro.png";
import headerLogoWhite from "../../../logos/logo-header-blanco.png";

interface LogoScriptProps {
  className?: string;
  size?: "sm" | "md";
  tone?: "light" | "dark";
  /**
   * Nombre accesible del link. Llega por prop y no se lee del diccionario acá
   * para que este componente siga siendo de servidor: sus dos consumidores
   * —Navbar y Footer— ya son de cliente y ya tienen el idioma a mano.
   */
  ariaLabel?: string;
}

export default function LogoScript({
  className = "",
  size = "md",
  tone = "light",
  ariaLabel = "ESQUINA ESTUDIO home",
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
      aria-label={ariaLabel}
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
