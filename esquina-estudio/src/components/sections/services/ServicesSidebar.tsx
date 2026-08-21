"use client";

import { useCallback, useEffect, useState } from "react";
import ServicesArrow from "@/components/sections/services/ServicesArrow";
import {
  BRANDING_PACKS_ID,
  SIDEBAR_WIDTH,
  SPY_SENTINEL_ATTR,
  getHeaderOffset,
  getSectionScrollTarget,
} from "@/components/sections/services/services-layout";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import { SERVICES_NAV } from "@/lib/services-content";
import { cn } from "@/lib/utils";

/**
 * Sidebar sticky de `/services`, con la flecha marcando la sección que se está
 * leyendo.
 *
 * # Cuándo se muestra (B3.4b/F3)
 *
 * **Durante el intro no está.** Aparece cuando el visitante llega a Branding
 * Packs y se queda de ahí en adelante; volviendo al intro se va. La respuesta la
 * da el centinela de `BRANDING PACKS` —a través de `isIntersecting`, no de una
 * medición— porque es la única forma de que el cruce sea exacto en las dos
 * direcciones: midiendo dentro del callback, un cruce lento deja el valor a un
 * píxel del borde y el siguiente cuadro ya no genera aviso.
 *
 * `INTRO` sigue en la lista aunque el menú no se vea durante el intro: es lo que
 * permite volver arriba desde cualquier sección.
 *
 * # El scroll-spy — primero del repo (CLAUDE.md §6)
 *
 * Todo lo que había era de un disparo: `ScrollTrigger` con `once: true`,
 * `useInView` con `once: true`. Esto es lo contrario, tiene que seguir al
 * usuario **en las dos direcciones y para siempre**. Se construye uno solo y se
 * documenta acá.
 *
 * ## La regla: manda la última sección cuyo tope cruzó la línea de lectura
 *
 * La **línea de lectura** es el borde inferior del header fijo (128 px). Entre
 * todas las secciones cuyo tope ya quedó por encima de esa línea gana la de más
 * abajo; si ninguna la cruzó todavía —la página recién abierta— gana la primera.
 *
 * Es determinista y no tiene empates. Resuelve los dos casos que un spy ingenuo
 * deja indefinidos:
 *
 * - **Dos secciones visibles a la vez:** activa es la de arriba, que es la que
 *   ocupa el renglón que se está leyendo, no la que asoma abajo.
 * - **El hueco que no pertenece a ninguna sección** —el encabezado BRANDING
 *   PACKS, que no tiene entrada en el menú—: la última cruzada sigue siendo el
 *   intro, así que la flecha se queda en INTRO. Es exactamente lo que muestra
 *   `08a`, con BRANDING PACKS ya asomando y la flecha todavía arriba.
 *
 * Esta regla y la del aterrizaje del salto son **una sola geometría**; está
 * documentada entera en `services-layout` y no se toca una sin la otra.
 *
 * ## Por qué `IntersectionObserver` y no un listener de `scroll`
 *
 * Un listener de `scroll` corre en cada cuadro y obliga a medir las cinco
 * secciones cada vez: cinco `getBoundingClientRect`, o sea cinco reflows
 * forzados por cuadro, todo el tiempo. El observer avisa **solo cuando algo
 * cambia de lado**.
 *
 * El truco para preguntarle a un observer «¿el tope ya pasó?» es no observar la
 * sección —una sección alta sigue intersecando mientras su tope cruza, así que
 * nunca genera evento— sino un **centinela de 1 px pegado a su tope**
 * (`SpySentinel`). Con `rootMargin` de `-128px` arriba, la raíz del observer
 * empieza justo en la línea de lectura y cada centinela que la cruza genera un
 * evento.
 *
 * El observer se usa como **disparador**, no como fuente de la respuesta: cuando
 * avisa, se recalculan de una las cinco posiciones. Son cinco lecturas de
 * geometría por cruce —un puñado por visita, no una por cuadro— y a cambio el
 * resultado es exacto y **no depende de la dirección**: leyendo `entry` en vez
 * de medir, el borde justo (`top === 128`) daba una respuesta distinta según se
 * llegara desde arriba o desde abajo, porque el centinela de 1 px todavía
 * intersecaba.
 *
 * Se observan **los centinelas y también las secciones**, y esto no es
 * redundancia. Un salto instantáneo más largo que la ventana —tecla `End`, o un
 * salto del sidebar con `prefers-reduced-motion`— puede llevar un centinela de
 * «abajo de la raíz» a «arriba de la raíz» sin pasar nunca por «intersecando»:
 * no cambia de estado y **no genera evento**. Las secciones no tienen ese hueco
 * porque cubren la zona entera sin baches: después de cualquier salto hay otra
 * sección ocupando la banda, y con eso alcanza, porque el evento de cualquiera
 * recalcula a las cinco.
 *
 * `rootMargin` no depende del alto de la ventana —el header mide siempre lo
 * mismo—, así que el observer tampoco se reconstruye al redimensionar.
 */

/** Cuánto tarda el menú en aparecer y en irse. Suave, no un corte. */
const REVEAL_MS = 500;

export default function ServicesSidebar() {
  const [activeId, setActiveId] = useState<string>(SERVICES_NAV[0].id);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const headerOffset = getHeaderOffset();
    const targets: Element[] = [];
    const sentinels: { id: string; element: Element }[] = [];

    for (const item of SERVICES_NAV) {
      const section = document.getElementById(item.id);
      const sentinel = document.querySelector(
        `[${SPY_SENTINEL_ATTR}="${item.id}"]`,
      );
      if (!section || !sentinel) continue;

      sentinels.push({ id: item.id, element: sentinel });
      targets.push(sentinel, section);
    }

    if (sentinels.length === 0) return;

    // El centinela que decide si el menú se ve. No entra en `sentinels`: no es
    // una sección del spy, es el umbral de aparición.
    const revealSentinel = document.querySelector(
      `[${SPY_SENTINEL_ATTR}="${BRANDING_PACKS_ID}"]`,
    );
    if (revealSentinel) targets.push(revealSentinel);

    const resolveActive = () => {
      let active = sentinels[0].id;
      for (const { id, element } of sentinels) {
        if (element.getBoundingClientRect().top <= headerOffset) active = id;
      }
      setActiveId(active);
    };

    // El borde de la raíz va **dos píxeles por debajo** de la línea de lectura,
    // y los dos están medidos, no elegidos de arriba: uno lo come el alto del
    // propio centinela y el otro, el contacto de borde, que Chrome cuenta como
    // intersección aunque el área sea cero. Sin esa corrección, un centinela
    // apoyado **exactamente** en la línea seguía intersecando, no cambiaba de
    // estado y el observer no avisaba — verificado: la flecha se quedaba atrás.
    // Con dos píxeles, «llegar a la línea» y «salir de la raíz» son el mismo
    // evento, en las dos direcciones; y si algún motor decidiera que el
    // contacto de borde no interseca, el aviso se adelanta un píxel, que no se
    // ve. La respuesta la sigue dando la medición, no el `entry`.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Salió de la raíz = su tope cruzó la línea = estamos en los packs.
          if (entry.target === revealSentinel) {
            setRevealed(!entry.isIntersecting);
          }
        }
        resolveActive();
      },
      { rootMargin: `-${headerOffset + 2}px 0px 0px 0px`, threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  const handleJump = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const section = document.getElementById(id);
      // Sin destino no se intercepta nada: que el ancla nativa haga lo suyo.
      if (!section) return;

      event.preventDefault();

      // Acá **no** se marca el ítem a mano. Se probó y sobra: con el criterio
      // único de aterrizaje el destino cae 137 px adentro del rango del spy, y
      // adelantarlo solo agregaba un parpadeo —la flecha saltaba al destino y
      // volvía atrás en el cuadro siguiente, cuando el observer recalculaba
      // sobre el scroll todavía en el origen—. Una sola fuente de verdad.
      const target = getSectionScrollTarget(section);

      // Sin Lenis en esta ruta: el salto suave es el nativo. El `behavior` del
      // método le gana a la propiedad CSS, que `SmoothScrollProvider` deja en
      // `auto` fuera de /team y /work*.
      window.scrollTo({
        top: target,
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // Continuidad para quien navega por teclado o con lector de pantalla: el
      // foco viaja al destino sin volver a mover el scroll.
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });
    },
    [reduceMotion],
  );

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-12 hidden lg:right-16 lg:block"
      style={{ width: SIDEBAR_WIDTH }}
    >
      {/*
        Sticky centrado: se ancla a media pantalla y sube media altura propia. El
        `translate` es visual —`sticky` calcula con la caja sin transformar—, así
        que el menú se suelta cuando termina la zona de packs, que es el bloque
        que lo contiene.

        `visibility` acompaña a la opacidad para que el menú apagado no sea
        clickeable ni enfocable: transiciona en un solo paso y al **final** del
        fundido de salida, así que no corta la animación.
      */}
      <nav
        aria-label="Services sections"
        style={{ transitionDuration: `${REVEAL_MS}ms` }}
        className={cn(
          "pointer-events-auto sticky top-1/2 -translate-y-1/2",
          "transition-[opacity,visibility] ease-out motion-reduce:transition-none",
          revealed ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex flex-col items-end gap-[27px]">
          {SERVICES_NAV.map((item) => {
            const isActive = item.id === activeId;

            return (
              <li key={item.id} className="flex w-full justify-end">
                <a
                  href={`#${item.id}`}
                  onClick={(event) => handleJump(event, item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    // Fila alineada a la derecha: al activarse aparece la flecha
                    // y el rótulo se corre a la izquierda para hacerle lugar,
                    // manteniendo fijo el borde derecho. Así lo muestran `08a` y
                    // `08b`.
                    "flex items-center gap-3 font-body text-[17px] uppercase leading-[20px]",
                    "transition-colors duration-200",
                    isActive
                      ? "text-off-black"
                      : "text-gray-brand hover:text-off-black",
                  )}
                >
                  <span>{item.label}</span>
                  {isActive ? <ServicesArrow direction="left" /> : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
