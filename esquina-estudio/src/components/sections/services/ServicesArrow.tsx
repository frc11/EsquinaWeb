import { cn } from "@/lib/utils";

/**
 * Flecha larga y fina del rediseño de Services: la del sidebar (apuntando a la
 * izquierda, sobre el ítem activo) y las de los links (a la derecha).
 *
 * Es un SVG y no el carácter «→» a propósito: Manrope es una familia latina y no
 * garantiza las flechas Unicode, así que el glifo caería en una tipografía de
 * respaldo distinta en cada sistema. Mide 26×11 fijo —los tres usos del mockup
 * tienen el mismo tamaño de flecha aunque el texto vaya a 17 o a 24 px— y pinta
 * con `currentColor`, así que hereda el color del contexto sin props de tono.
 *
 * El trazo cae en medios píxeles (`5.5`) para que el 1 px quede sobre la grilla
 * y no salga difuminado entre dos filas.
 */
export default function ServicesArrow({
  direction = "right",
  className,
}: {
  direction?: "left" | "right";
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 26 11"
      width={26}
      height={11}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn(
        "shrink-0",
        direction === "left" && "rotate-180",
        className,
      )}
    >
      <path
        d="M0 5.5h24M19.75 1.5 24 5.5l-4.25 4"
        stroke="currentColor"
        strokeWidth={1}
      />
    </svg>
  );
}
