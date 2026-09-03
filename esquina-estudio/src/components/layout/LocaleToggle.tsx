"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  NavIndicator,
  measureTabIndicator,
  useIndicator,
  type IndicatorMeasure,
} from "@/components/layout/nav-indicator";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { useIsBelowDesktop } from "@/lib/use-media-query";
import { LOCALES, useLocale, type Locale } from "@/lib/i18n";

/**
 * Dónde cae el idioma inactivo cuando el desplegable de mobile está abierto.
 *
 * Hasta R3 la celda era una caja —borde de 1 px del color pleno, fondo de la
 * página y 12 px de relleno—, anclada al borde **derecho** del grupo. En la
 * revisión en teléfono se leía como un rectángulo suelto y corrido: medido a
 * 390, `ES` arrancaba 12,45 px a la derecha de `EN` (el relleno) y la caja
 * cerraba contra el chevron. R3/F5 la deja sin caja y anclada a la
 * **izquierda**: el estado abierto ya se lee porque aparece la opción, y el
 * código nuevo cae exactamente debajo del activo, mismo borde izquierdo. El
 * área táctil no cambia: la pone el `::after` del propio botón, no el relleno
 * que se fue.
 *
 * Solo existe debajo de 1024: de ahí para arriba ninguna de estas clases
 * aplica y el control queda exactamente como estaba.
 */
const OPTION_CELL_CLASS =
  "max-lg:absolute max-lg:left-0 max-lg:top-full max-lg:z-[3] max-lg:mt-3 max-lg:justify-start";

/**
 * Control `EN / ES` del header, a la derecha de `CONTACT US`.
 *
 * # Dónde vive (revisado en M2/F1)
 *
 * Hay **dos instancias y una sola implementación**: el bloque de escritorio del
 * header (`hidden lg:flex`, a la derecha de `CONTACT US`) y el bloque de mobile
 * del header (`lg:hidden`, al costado del ícono de menú). Nunca se ven las dos:
 * cada bloque se apaga con `display: none` en el rango del otro, y la instancia
 * apagada no pinta indicador porque su caja mide cero y `measureFillBox`
 * devuelve `null`.
 *
 * Hasta M1 la instancia de mobile vivía **adentro** del menú, así que el control
 * de idioma no existía sin abrirlo. M2/F1 lo sacó a la fila del header: se ve
 * siempre y, como esa fila no se desplaza al abrir el menú, desapareció con él
 * el disparador `measureKey` del módulo del indicador, que existía sólo para
 * remedir cuando el panel terminaba de entrar.
 *
 * # De dónde salen las medidas
 *
 * De medir `docs/archivo/mockups/08a-services-intro.jpg` (export de 1327 px
 * sobre un diseño de 1920, factor 0,691), no de elegirlas:
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
 * # Cuándo viaja y cuándo se planta
 *
 * La misma puerta `animate` del módulo compartido decide las dos cosas, y las
 * dos plantan la línea en vez de moverla:
 *
 * - **`prefers-reduced-motion`**: nunca viaja.
 * - **Al cargar la página** (M2/F4, punto 14): tampoco. El idioma se resuelve en
 *   el montaje, no en un click, y una barrita que se cruza sola apenas entra la
 *   página no acusa recibo de nada. Viaja a partir de la primera elección
 *   explícita en este control.
 *
 * Ninguna de las dos toca al indicador del menú, que sigue como estaba.
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
  toneDelayClass = "",
}: {
  tone?: "light" | "dark";
  /**
   * Retardo de la transición de color, como clase entera de Tailwind (M3/F4).
   *
   * El toggle ya transicionaba su color en 200 ms, pero **sin retardo**: al
   * cerrar el menú volvía al tono claro en el acto, con el panel todavía puesto
   * medio segundo más. Es el mismo defecto que el resto del cromo, y se
   * corrige igual — el `Navbar` le pasa `delay-0` al abrir y `delay-[300ms]` al
   * cerrar, que es lo que tarda el panel en soltar la banda del header.
   *
   * Llega como literal y no como número porque Tailwind v4 busca los nombres de
   * clase como texto: `` `delay-[${n}ms]` `` no llegaría nunca al CSS. Vacío por
   * defecto, así que el comportamiento sin la prop es el de siempre.
   */
  toneDelayClass?: string;
}) {
  const { selectedLocale, setLocale, t } = useLocale();
  const reduceMotion = usePrefersReducedMotion();
  /**
   * ¿Hubo una elección explícita en este control? (M2/F4, punto 14.)
   *
   * El viaje de la barrita es el **acuse de recibo de un click**: se contrae,
   * cruza y se vuelve a abrir sobre el idioma nuevo. Al cargar la página no hay
   * click, y sin embargo `selectedLocale` sí cambia —de `"en"`, que es lo que
   * rinde el servidor, al idioma que resuelve `LocaleProvider` en el montaje—,
   * así que sin esta puerta la barrita **viajaba sola al abrir el sitio**. Con
   * ella, en el arranque se planta directamente en su lugar y el viaje queda
   * para lo que fue hecho.
   */
  const [chosen, setChosen] = useState(false);
  /**
   * ¿Está abierto el desplegable de mobile? (R2/F11.2.)
   *
   * Debajo de 1024 el control deja de ser `EN / ES` y pasa a ser `EN ⌄`: se ve
   * el idioma elegido y el otro aparece al tocar. De 1024 para arriba **no
   * existe**: este estado no gobierna nada allá arriba, porque lo que esconde al
   * inactivo es una variante `max-lg:` y no una condición de JavaScript.
   */
  const [open, setOpen] = useState(false);
  /**
   * El corte se pregunta desde JavaScript **solo para el comportamiento del
   * toque**, que es el uso que §2b autoriza para este hook: en mobile, tocar el
   * idioma activo abre el desplegable en vez de reelegirlo. El layout lo sigue
   * decidiendo Tailwind, así que sale correcto del servidor y no parpadea al
   * hidratar. En el primer render el hook devuelve `false` —o sea, escritorio—;
   * un toque en ese cuadro llamaría a `setLocale` con el idioma que ya está
   * puesto, que no hace nada.
   */
  const isBelowDesktop = useIsBelowDesktop();

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
    animate: chosen && !reduceMotion,
  });

  /*
    El desplegable se cierra solo: al elegir, al tocar afuera y con Escape. Las
    tres salidas viven acá y no en tres lugares, y el efecto **no se registra si
    está cerrado**, así que en reposo el control no cuelga ni un listener.
  */
  useEffect(() => {
    if (!open) return;

    const closeOnOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && groupRef.current?.contains(target)) return;
      setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

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
      /*
        El escalón estrecho del cromo (R2/F5, documentado entero en `Navbar.tsx`):
        de 1024 a 1087 la fila del header baja a 15 px, que es lo que hace entrar
        el menú en castellano sin que se le monte `CONTACTANOS`.

        **El rango va acotado por abajo a propósito.** Este componente se monta
        dos veces —el bloque de escritorio y el de mobile— y un `max-[1151.98px]`
        suelto alcanzaría también a la instancia de mobile, que vive por debajo de
        1024 y no tiene nada que arreglar. Con los dos bordes escritos, el
        escalón existe solo en la banda donde el cromo de escritorio no entra.
      */
      className="relative flex items-center pr-[6px] font-body text-[17px] font-medium uppercase tracking-normal text-gray-brand min-[1024px]:max-[1151.98px]:text-[15px]"
    >
      {LOCALES.map((code: Locale, index) => {
        const isSelected = code === selectedLocale;

        return (
        /*
          En mobile el idioma que NO está elegido sale de la fila y pasa a ser el
          contenido del desplegable, y cuando está cerrado se esconde con
          `display: none` —o sea que tampoco recibe foco—. Que lo esconda una
          variante y no una condición de JavaScript es lo que mantiene el layout
          correcto desde el servidor (§2b): el árbol es el mismo en los dos
          rangos, y de `lg` para arriba ninguna de estas clases aplica.
        */
        <span
          key={code}
          className={`flex items-center ${
            isSelected ? "" : `${OPTION_CELL_CLASS} ${open ? "" : "max-lg:hidden"}`
          }`}
        >
          {index > 0 && (
            <span aria-hidden="true" className="select-none px-[4px] max-lg:hidden">
              /
            </span>
          )}
          <button
            ref={setButtonRef(code)}
            type="button"
            lang={code}
            aria-pressed={isSelected}
            /*
              El activo es además el disparador del desplegable **en mobile**, y
              por eso anuncia su estado. En escritorio no despliega nada, así que
              allá no hay nada que anunciar.
            */
            aria-expanded={isSelected && isBelowDesktop ? open : undefined}
            onClick={() => {
              if (isSelected) {
                // En mobile el activo abre y cierra; en escritorio reelegir el
                // idioma puesto no hace nada, que es lo que hacía antes.
                if (isBelowDesktop) setOpen((current) => !current);
                return;
              }

              setOpen(false);
              // Las dos van en el mismo click y React las agrupa: el render que
              // sigue ya tiene el idioma nuevo **y** la puerta abierta, así que
              // la remedición de ese render sale con viaje.
              setChosen(true);
              setLocale(code);
            }}
            /*
              El área tocable de mobile la agranda un pseudo-elemento y NO el
              relleno del botón, y la razón es la barrita: `measureFillBox` mide
              la caja del botón, así que un `px` de 12 la dejaría de 45 px de
              ancho debajo de un rótulo de 21. El `::after` no cambia la caja
              —el rótulo sigue midiendo lo que mide— pero sí recibe el toque,
              porque es hijo del propio botón. Con 12 px por lado da 45,6 de
              ancho contra el piso de 44, y el separador sube a `px-[12px]` para
              que los dos rectángulos no se pisen: quedan 28,7 px entre los
              botones contra los 24 que ocupan las dos extensiones.
            */
            className={`relative block cursor-pointer transition-colors duration-200 ${toneDelayClass} max-lg:after:absolute max-lg:after:inset-y-0 max-lg:after:-inset-x-[12px] max-lg:after:content-[''] ${
              code === selectedLocale ? fullToneClass : inactiveClass
            }`}
          >
            {/*
              El relleno va en este `<span>` y no en el botón: el botón tiene que
              ser el elemento **posicionado** para que `measureFillBox` mida su
              caja, y el nodo de texto tiene que colgar de un elemento sin
              posición. Es el mismo reparto que hace `HoverButton`.
            */}
            {/*
              El relleno sube a 11 px debajo de `lg`: 23,2 px de caja de texto
              más 22 dan 45,2 px de alto tocable, sobre el piso de 44 (§3.4.3
              de M1). De `lg` para arriba —donde el control comparte fila con
              `CONTACT US`— queda en los 6 px del `balancedPadding` del menú,
              sin mover un píxel.

              (El comentario decía «debajo de `lg` el toggle solo existe adentro
              del menú de mobile». Es de antes de M2/F1, que lo sacó a la fila
              del header: el número era correcto y la razón escrita no.)
            */}
            <span className="block py-[6px] max-lg:py-[11px]">
              {code.toUpperCase()}
            </span>
            {/*
              El espacio va ADENTRO del `sr-only` y no como `{" "}` suelto: un
              nodo de texto entre los dos elementos sí ocuparía ancho —4,5 px a
              17 px— y correría el borde derecho del control. El `sr-only` está
              fuera de flujo, así que su contenido no mide.
            */}
            <span className="sr-only">{` ${t.common.languageNames[code]}`}</span>
          </button>
        </span>
        );
      })}

      {/*
        La flecha del desplegable. Solo en mobile, decorativa —el estado lo
        anuncia el `aria-expanded` del botón— y con la misma geometría que la del
        select del formulario, girada un cuarto de vuelta: es el único chevron
        del sitio y no se dibuja un segundo.
      */}
      <span
        aria-hidden="true"
        className={`ml-[6px] flex shrink-0 items-center lg:hidden ${fullToneClass}`}
      >
        <svg
          viewBox="0 0 12 12"
          className="h-[12px] w-[12px] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 2.5 4 L 6 8 L 9.5 4" />
        </svg>
      </span>

      {/*
        La barrita es de escritorio. Debajo de 1024 el control muestra un solo
        idioma, así que no hay entre qué y qué viajar y el mockup de R2 no la
        lleva (`docs/archivo/mockups/r2-mob-01.jpg`). Se esconde con una variante
        y no se desmonta: la medición sigue corriendo igual, y —verificado— ni
        `ACK_DELAY` ni `TRANSITION_MS` dependen de ella. Las dos son constantes
        de módulo de `LocaleProvider`, derivadas de `NAV_INDICATOR_DURATION`, que
        es un número y no una medición.
      */}
      <NavIndicator
        animation={indicator}
        className={`${fullToneClass} max-lg:hidden`}
      />
    </div>
  );
}
