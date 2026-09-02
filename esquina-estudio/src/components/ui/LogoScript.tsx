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
        /*
          # El del HEADER baja a 37 px debajo de 1024 (R2/F11.1)

          Lo pidieron las clientas —«achicar el logo»— y el número **sale de
          medir el mockup**, no de elegir: en
          `docs/archivo/mockups/r2-mob-01.jpg` la segunda captura es el estado
          deseado, y contra la primera —que es el sitio de hoy— la tinta del logo
          pasa de 246 a 191 px de ancho y de 87 a 67,5 de alto sobre una pantalla
          de 714 px. O sea **0,776 de la altura actual: 0,776 x 48 = 37,2**.

          Comprobacion cruzada: el logo ocupa el 28,85 % del ancho del viewport
          en el mockup, y con 37 px de alto (relacion medida 3,0475) da 112,8 px
          sobre 390, o sea **28,9 %**.

          De `lg` para arriba **no cambia nada**: sigue en 48.

          # El del FOOTER se queda en 48 en mobile, y ahora por otra razon

          M4/F3 lo bajo de 80 a 48 justificandolo como «la altura del logo del
          header», o sea una medida que ya existia en el cromo. **Esa
          justificacion dejo de valer**: el del header mide 37. El valor se
          conserva igual porque el motivo de fondo sigue en pie —a 80 px el logo
          del pie quedaba mas alto que el de arriba, invirtiendo la jerarquia, y
          le costaba 32 px al alto del footer, que en un telefono de 640 se los
          saca al hero de `/`— y porque bajarlo a 37 seria una decision de
          composicion del footer que esta ronda no pidio. De `lg` para arriba
          sigue en 80.
        */
        className={`${isFooter ? "h-12 w-auto lg:h-20" : "h-[37px] w-auto lg:h-12"}${isDark && isFooter ? " invert" : ""}`}
        priority={!isFooter}
        // Los dos son cajas de alto fijo y ancho automatico, asi que su ancho no
        // cambia con el viewport: medidos, el del header da 146,3 px a 48 de alto
        // y **112,8 a 37** (relacion 3,0475), y el del footer 120,5 en escritorio
        // y 72,3 en mobile. Los 196 px que declaraba el header eran de una version
        // anterior y en un telefono a DPR 2 pedian el corte de 640 en vez del
        // de 384 (M1/F7); el `146px` fijo quedo viejo con el cambio de R2 y por
        // eso ahora declara los dos rangos.
        sizes={
          isFooter
            ? "(min-width: 1024px) 120px, 73px"
            : "(min-width: 1024px) 146px, 113px"
        }
      />
    </Link>
  );
}
