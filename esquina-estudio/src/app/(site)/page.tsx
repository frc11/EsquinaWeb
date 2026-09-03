import Hero from "@/components/sections/home/Hero";
import { HOME_BLOCK_HEIGHT_MOBILE } from "@/lib/mobile-layout";

/**
 * Alto del bloque del hero de `/` **de 1024 para arriba**: el hueco real entre
 * el borde inferior del header y el borde superior del footer. Da exactamente
 * un viewport de alto total, sin scroll y sin franja muerta bajo el footer.
 *
 * Los 164 px que se restan son el alto del `HomeFooter` de escritorio, y siguen
 * siendo rastreables término a término: `py-10` arriba (40) + la fila de info,
 * cuyo alto lo gobierna el logo script `sm` (84) + `py-10` abajo (40). El header
 * publica el suyo como variable global, así que va por `var()`.
 *
 * **La clase va escrita ENTERA, y eso es el punto 13 de M2.** M1/F2 la armaba
 * con una plantilla —`` `lg:h-[calc(...-(${HOME_FOOTER_HEIGHT}))]` ``— y
 * Tailwind v4 **busca los nombres de clase como literales en el código**: esa
 * clase nunca llegó al CSS. El atributo `class` la llevaba puesta y no pintaba
 * nada, así que el alto caía a `auto` y mandaba el `lg:min-h-[50vh]`: a 1920 el
 * bloque medía 540 px en vez de 788, el hero subía 124 px, el footer subía 248 y
 * quedaba una franja muerta de 248 px al pie. Medido contra el código pre-M1
 * recompilado; el diagnóstico completo está en la entrada F0 de la bitácora.
 *
 * `svh` y no `vh`: en un teléfono la barra del navegador cambia el `vh` a mitad
 * del scroll y el bloque salta. En desktop las dos unidades valen lo mismo
 * (verificado: los altos de `/` a 1920 y a 1366 no se mueven), así que la
 * sustitución no tiene costo.
 *
 * El término de mobile vive aparte, en `HOME_BLOCK_HEIGHT_MOBILE`, porque su
 * footer es otro: desde R2/F11.3 son **tres filas de dos columnas con el logo
 * script en la del medio**, y desde R3/F2 esas filas miden un renglón, así que
 * el footer mide **113 px** —eran 180 con las filas de 44 del piso táctil, y 304
 * mientras el logo tuvo su cuarta fila y `WORKING WORLDWIDE` su renglón—. Los
 * dos términos son excluyentes (`lg` contra `max-lg`) y nunca compiten.
 *
 * **El de mobile no se verifica con el alto del documento sino midiendo el
 * bloque contra el footer**: `/` da una pantalla exacta con el número bien o mal,
 * porque el `mt-auto` del footer absorbe la diferencia. Lo que tiene que dar 0 es
 * la holgura entre el borde inferior de este bloque y el borde superior del
 * footer, y da 0 en 320, 390 y 430 en los dos idiomas.
 */
const HOME_BLOCK_HEIGHT = "lg:h-[calc(100svh-var(--header-height)-164px)]";

export default function HomePage() {
  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden ${HOME_BLOCK_HEIGHT_MOBILE} lg:min-h-[50vh] ${HOME_BLOCK_HEIGHT}`}
    >
      <Hero />
    </div>
  );
}
