"use client";

import { LOCALES, useLocale, type Locale } from "@/lib/i18n";

/**
 * Control `EN / ES` del header, a la derecha de `CONTACT US`.
 *
 * # De dónde salen las medidas
 *
 * De medir `docs/mockups/08a-services-intro.jpg` (export de 1327 px sobre un
 * diseño de 1920, factor 0,691), no de elegirlas:
 *
 * - El bloque `EN / ES` mide **55 px** y su borde derecho cae en **1849**, o sea
 *   donde termina hoy el texto de `CONTACT US`: 6 px adentro del gutter de 64.
 *   Esos 6 px son el `balancedPadding` que porta todo el menú, así que el
 *   toggle se corre esa misma distancia y **el texto queda alineado con el resto
 *   del cromo**, no con el borde de su caja.
 * - Entre `CONTACT US` y `EN` hay **39 px** de aire visible. Con los 6 px de
 *   relleno de `CONTACT US` a la izquierda de esa cuenta, el hueco de la fila es
 *   el `gap-8` del propio menú (32 + 6 = 38): no se inventa un número nuevo.
 * - Alrededor de la barra hay **5,8 y 4,3 px**, o sea un espacio de 17 px a cada
 *   lado. De ahí el `px-[4px]` del separador.
 *
 * # El subrayado es el mismo que el del menú
 *
 * En los mockups el idioma activo se marca con una línea, y esa línea está a la
 * **misma altura** que el indicador del Navbar (medido en `14`: y = 99 contra
 * 100). Acá eso no se copia con un número, se comparte la geometría:
 *
 * 1. Los botones llevan el mismo relleno vertical de 6 px que `HoverButton` con
 *    `balancedPadding`, y el Navbar alinea la fila **arriba**, así que la caja
 *    del toggle termina en el mismo borde inferior que la de los tabs (79,75 px
 *    medidos a 1920) — que es justo lo que `measureFillBox` le entrega al
 *    indicador.
 * 2. El subrayado **cuelga** de ese borde en vez de apoyarse adentro
 *    (`-bottom-px`), que es la misma regla del indicador: «su borde superior se
 *    apoya en el borde inferior del fill, sin hueco».
 *
 * Queda una diferencia de **0,25 px** entre los centros de las dos líneas, y
 * viene de que el indicador redondea su `top` a píxel entero desde JavaScript y
 * el subrayado no puede: es CSS. Si algún día cambia el relleno del menú, las
 * dos se mueven juntas.
 *
 * # Color
 *
 * Los tres elementos van en gris. No es una interpretación: muestreado sobre el
 * mockup, `EN` da 153, la barra 160 y `ES` 151 sobre un `CONTACT US` de 12 —o
 * sea el `gray-brand` del sitio (#939393) contra el off-black—. Lo que distingue
 * al idioma activo es el subrayado; lo que distingue al otro es que responde al
 * hover y al foco subiendo al color pleno, que es el mismo gesto que ya usan el
 * sidebar de Services y las pills de Contact.
 *
 * # Accesibilidad
 *
 * Son dos `<button>` dentro de un `role="group"` con nombre. El estado viaja en
 * `aria-pressed`, así que un lector de pantalla anuncia cuál es el idioma
 * actual; el nombre accesible de cada botón agrega el idioma completo escrito en
 * el idioma de la página («EN Inglés» / «EN English»), y el visible sigue siendo
 * parte de ese nombre. La barra es decorativa: `aria-hidden` y sin foco.
 *
 * # Lo que NO hace
 *
 * No navega. Son `<button>`, no `<a>`, así que el listener de captura de
 * `RouteTransitionProvider` —que solo mira `a[href]`— ni se entera: cambiar de
 * idioma no dispara la transición de página ni remonta el árbol.
 */
export default function LocaleToggle({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  const { locale, setLocale, t } = useLocale();

  const activeHoverClass =
    tone === "dark"
      ? "hover:text-off-white focus-visible:text-off-white"
      : "hover:text-off-black focus-visible:text-off-black";

  return (
    <div
      role="group"
      aria-label={t.common.language}
      className="flex items-center pr-[6px] font-body text-[17px] font-medium uppercase tracking-normal text-gray-brand"
    >
      {LOCALES.map((code: Locale, index) => (
        <span key={code} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="select-none px-[4px]">
              /
            </span>
          )}
          <button
            type="button"
            lang={code}
            aria-pressed={code === locale}
            onClick={() => setLocale(code)}
            className={`relative block cursor-pointer py-[6px] transition-colors duration-200 ${activeHoverClass}`}
          >
            {code.toUpperCase()}
            {/*
              El espacio va ADENTRO del `sr-only` y no como `{" "}` suelto: un
              nodo de texto entre los dos elementos sí ocuparía ancho —4,5 px a
              17 px— y correría el borde derecho del control. El `sr-only` está
              fuera de flujo, así que su contenido no mide.
            */}
            <span className="sr-only">{` ${t.common.languageNames[code]}`}</span>
            {code === locale && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-px bg-current"
              />
            )}
          </button>
        </span>
      ))}
    </div>
  );
}
