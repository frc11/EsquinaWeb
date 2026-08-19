import Hero from "@/components/sections/home/Hero";

/**
 * Alto del footer de home (`HomeFooter`, en `Footer.tsx`): `py-10` arriba y
 * abajo más la fila de info, cuyo alto lo gobierna el logo script `sm`
 * (40 + 84 + 40 = 164 px, medido a 1920). Se escribe descompuesto para que cada
 * término siga siendo rastreable hasta su decisión en el footer; el header, en
 * cambio, ya publica el suyo como variable global.
 */
const HOME_FOOTER_HEIGHT = "40px + 84px + 40px";

/**
 * Hueco real entre el borde inferior del header y el borde superior del footer:
 * es la caja donde el hero queda centrado, y da exactamente un viewport de alto
 * total (sin scroll y sin franja muerta bajo el footer).
 */
const HOME_BLOCK_HEIGHT = `calc(100vh - var(--header-height) - (${HOME_FOOTER_HEIGHT}))`;

export default function HomePage() {
  return (
    <div
      className="flex min-h-[50vh] w-full items-center justify-center overflow-hidden"
      style={{ height: HOME_BLOCK_HEIGHT }}
    >
      <Hero />
    </div>
  );
}
