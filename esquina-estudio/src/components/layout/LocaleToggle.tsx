"use client";

import { useCallback, useRef } from "react";
import {
  NavIndicator,
  measureTabIndicator,
  useIndicator,
  type IndicatorMeasure,
} from "@/components/layout/nav-indicator";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
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
 * # La barrita ES el indicador del menú (B4b)
 *
 * En B4 el subrayado era un `<span>` de CSS adentro del botón activo: aparecía
 * y desaparecía. Desde B4b **es el mismo sistema que marca el menú**
 * (`nav-indicator.tsx`), con la misma medición, el mismo redondeo, la misma
 * duración y el mismo easing: se contrae hasta un punto, viaja y se vuelve a
 * abrir sobre el otro idioma. No hay un segundo sistema y no se copia ningún
 * número (`CLAUDE.md` §8.10).
 *
 * Para que la medición sea la misma y no una versión aparte, el botón cumple el
 * contrato que `measureFillBox` le pide a `HoverButton`: **el `<button>` es el
 * elemento posicionado** y el rótulo cuelga de un `<span>` sin posición, que es
 * el que lleva el relleno de 6 px. Así la caja que se mide es la del botón, con
 * el mismo relleno vertical que `balancedPadding`.
 *
 * De ahí sale la alineación con la línea del menú, que ya no es aproximada: el
 * Navbar alinea la fila **arriba** (`items-start`), así que la caja del toggle
 * termina en el mismo borde inferior que la de los tabs, y el módulo redondea
 * ese borde **en coordenadas de viewport**. Los 0,25 px de desfase que quedaban
 * en B4 —cuando el subrayado era CSS y no podía redondear— desaparecieron: las
 * dos líneas caen en la misma fila de píxeles.
 *
 * # Color (revisado en B4b)
 *
 * El mockup muestreaba los tres elementos en gris —`EN` 153, la barra 160, `ES`
 * 151 sobre un `CONTACT US` de 12— y hasta B4 el idioma activo se distinguía
 * **solo** por el subrayado. La verificación humana de B4 lo rechazó: con los dos
 * códigos en el mismo gris, el activo no se lee como activo. Desde B4b **el
 * idioma activo va en el color pleno del cromo** —off-black en las rutas claras,
 * off-white en las oscuras— y el inactivo se queda en el `gray-brand` del sitio
 * (#939393). El separador `/` no cambia nunca: es gris y no es interactivo.
 *
 * El contraste lo da el color y nada más: **mismo tamaño (17 px), mismo tracking
 * y mismo peso** que el resto del menú. El inactivo sigue subiendo al color pleno
 * con hover y foco, que es el mismo gesto del sidebar de Services y de las pills
 * de Contact; ahora ese gesto se lee como una vista previa del estado activo.
 *
 * La barrita hereda ese mismo color pleno (`bg-current` sobre el tono del cromo),
 * igual que la línea del menú.
 *
 * # El acuse de recibo (B4b, fase 3)
 *
 * El toggle pinta y mide contra `selectedLocale` —lo que la persona eligió— y
 * no contra `locale` —lo que se está renderizando—. Los dos coinciden salvo
 * durante la transición de idioma, y esa diferencia es justo lo que hace que el
 * color y la barrita respondan **en el click**, antes de que empiece el
 * desvanecimiento. El diccionario, y con él `aria-label` y los nombres de los
 * idiomas, cambia después, con la cortina arriba.
 *
 * `aria-pressed` sigue a `selectedLocale` por la misma razón: lo que se anuncia
 * es la elección, apenas se hizo.
 *
 * # `prefers-reduced-motion`
 *
 * La barrita no viaja: se planta en el idioma nuevo. Es la puerta `animate` del
 * módulo compartido, y no toca al indicador del menú, que sigue como estaba.
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
 * `RouteTransitionProvider` —que solo mira `a[href]`— ni se entera. La
 * transición que sí ocurre al cambiar de idioma la gobierna `LocaleProvider`, no
 * el router: el árbol no se remonta y la ruta no cambia.
 */
export default function LocaleToggle({
  tone = "light",
  measureKey,
}: {
  tone?: "light" | "dark";
  /**
   * Lo pasa el menú de mobile cuando termina de entrar: hasta entonces el
   * contenedor se está desplazando y la barrita redondearía contra un origen en
   * movimiento. En el header no hace falta.
   */
  measureKey?: unknown;
}) {
  const { selectedLocale, setLocale, t } = useLocale();
  const reduceMotion = usePrefersReducedMotion();

  const groupRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Partial<Record<Locale, HTMLButtonElement | null>>>(
    {},
  );

  const setButtonRef = useCallback(
    (code: Locale) => (node: HTMLButtonElement | null) => {
      buttonRefs.current[code] = node;
    },
    [],
  );

  const measureTarget = useCallback((): IndicatorMeasure | null => {
    const group = groupRef.current;
    const activeButton = buttonRefs.current[selectedLocale];

    if (!group || !activeButton) {
      return null;
    }

    return measureTabIndicator(activeButton, group.getBoundingClientRect());
  }, [selectedLocale]);

  const indicatorHosts = useCallback(
    () => LOCALES.map((code) => buttonRefs.current[code]),
    [],
  );

  const indicator = useIndicator({
    measureTarget,
    hosts: indicatorHosts,
    measureKey,
    animate: !reduceMotion,
  });

  // El color pleno del cromo: el mismo que porta el menú en cada tono. El activo
  // lo lleva fijo; el inactivo lo alcanza con hover y foco.
  const fullToneClass = tone === "dark" ? "text-off-white" : "text-off-black";
  const inactiveClass =
    tone === "dark"
      ? "text-gray-brand hover:text-off-white focus-visible:text-off-white"
      : "text-gray-brand hover:text-off-black focus-visible:text-off-black";

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={t.common.language}
      className="relative flex items-center pr-[6px] font-body text-[17px] font-medium uppercase tracking-normal text-gray-brand"
    >
      {LOCALES.map((code: Locale, index) => (
        <span key={code} className="flex items-center">
          {index > 0 && (
            <span aria-hidden="true" className="select-none px-[4px]">
              /
            </span>
          )}
          <button
            ref={setButtonRef(code)}
            type="button"
            lang={code}
            aria-pressed={code === selectedLocale}
            onClick={() => setLocale(code)}
            className={`relative block cursor-pointer transition-colors duration-200 ${
              code === selectedLocale ? fullToneClass : inactiveClass
            }`}
          >
            {/*
              El relleno va en este `<span>` y no en el botón: el botón tiene que
              ser el elemento **posicionado** para que `measureFillBox` mida su
              caja, y el nodo de texto tiene que colgar de un elemento sin
              posición. Es el mismo reparto que hace `HoverButton`.
            */}
            <span className="block py-[6px]">{code.toUpperCase()}</span>
            {/*
              El espacio va ADENTRO del `sr-only` y no como `{" "}` suelto: un
              nodo de texto entre los dos elementos sí ocuparía ancho —4,5 px a
              17 px— y correría el borde derecho del control. El `sr-only` está
              fuera de flujo, así que su contenido no mide.
            */}
            <span className="sr-only">{` ${t.common.languageNames[code]}`}</span>
          </button>
        </span>
      ))}

      <NavIndicator animation={indicator} className={fullToneClass} />
    </div>
  );
}
