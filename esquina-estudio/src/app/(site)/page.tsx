import Hero from "@/components/sections/home/Hero";
import { HOME_BLOCK_HEIGHT_MOBILE } from "@/lib/mobile-layout";

/**
 * Alto del footer de home (`HomeFooter`, en `Footer.tsx`): `py-10` arriba y
 * abajo más la fila de info, cuyo alto lo gobierna el logo script `sm`
 * (40 + 84 + 40 = 164 px, medido a 1920). Se escribe descompuesto para que cada
 * término siga siendo rastreable hasta su decisión en el footer; el header, en
 * cambio, ya publica el suyo como variable global.
 *
 * **Vale de `lg` para arriba y nada más.** El término de mobile vive aparte, en
 * `HOME_BLOCK_HEIGHT_MOBILE`, porque su footer es otro: desde M2/F2 la fila de
 * info de mobile son **dos niveles** y mide 236 px, no los 488 de M1. Los dos
 * términos son excluyentes (`max-lg` contra `lg`), así que nunca compiten.
 */
const HOME_FOOTER_HEIGHT = "40px+84px+40px";

/**
 * Hueco real entre el borde inferior del header y el borde superior del footer:
 * es la caja donde el hero queda centrado, y da exactamente un viewport de alto
 * total (sin scroll y sin franja muerta bajo el footer).
 *
 * `svh` y no `vh`: en un teléfono la barra del navegador cambia el `vh` a mitad
 * del scroll y el bloque salta. En desktop las dos unidades valen lo mismo
 * (verificado: los altos de `/` a 1920 y a 1366 no se mueven), así que la
 * sustitución no tiene costo.
 */
const HOME_BLOCK_HEIGHT = `lg:h-[calc(100svh-var(--header-height)-(${HOME_FOOTER_HEIGHT}))]`;

export default function HomePage() {
  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden ${HOME_BLOCK_HEIGHT_MOBILE} lg:min-h-[50vh] ${HOME_BLOCK_HEIGHT}`}
    >
      <Hero />
    </div>
  );
}
