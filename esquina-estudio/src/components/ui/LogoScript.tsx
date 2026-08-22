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
        // Los dos son cajas de alto fijo y ancho automatico, asi que su ancho
        // no cambia con el viewport: medidos, 146,3 px el del header y 120,5 el
        // del footer. Los 196 px que declaraba el header eran de una version
        // anterior y en un telefono a DPR 2 pedian el corte de 640 en vez del
        // de 384 (M1/F7).
        sizes={isFooter ? "120px" : "146px"}
      />
    </Link>
  );
}
