import Image from "next/image";
import Link from "next/link";
import footerLogo from "../../../logos/logo-footer.png";
import headerLogo from "../../../logos/logo-header-negro.png";

interface LogoScriptProps {
  className?: string;
  size?: "sm" | "md";
}

export default function LogoScript({
  className = "",
  size = "md",
}: LogoScriptProps) {
  const isFooter = size === "sm";

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="ESQUINA ESTUDIO home"
    >
      <Image
        src={isFooter ? footerLogo : headerLogo}
        alt="ESQUINA ESTUDIO"
        className={isFooter ? "h-20 w-auto" : "h-16 w-auto"}
        priority={!isFooter}
        sizes={isFooter ? "120px" : "196px"}
      />
    </Link>
  );
}
