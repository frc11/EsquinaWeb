"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion, type Transition } from "framer-motion";
import ServicesArrow, {
  SERVICES_ARROW_WIDTH,
} from "@/components/sections/services/ServicesArrow";
import {
  BRANDING_PACKS_ID,
  SCROLL_KEYS,
  SIDEBAR_WIDTH,
  SPY_SENTINEL_ATTR,
  getHeaderOffset,
  getSectionScrollTarget,
} from "@/components/sections/services/services-layout";
import { usePrefersReducedMotion } from "@/components/layout/RouteTransitionProvider";
import {
  SERVICES_NAV_IDS,
  getServicesNav,
} from "@/lib/services-content";
import { useLocale } from "@/lib/i18n";
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
 *
 * # El salto y la flecha (B3.4b/F4)
 *
 * ## El salto: resorte, no `behavior: "smooth"`
 *
 * El suave nativo llega de golpe y no se puede modelar: no expone ni duración ni
 * curva. Se cambia por un resorte de Framer —el mismo vocabulario que el
 * despliegue de Fun Gallery, `visualDuration` + `bounce`— que aterriza con un
 * rebote corto. La duración **escala con la distancia**: los saltos entre
 * secciones vecinas son de unos 900 px y la vuelta al intro desde Add-ons es de
 * casi 5000, y un solo número no puede servir para los dos.
 *
 * Como es una animación propia y no del navegador, no se cancela sola: se le
 * agrega la parte que el nativo trae de fábrica —**si el usuario scrollea, el
 * salto se aparta**— con rueda, dedo o tecla de scroll. Sin eso, un gesto a
 * mitad de camino pelearía contra la animación por todo lo que le queda.
 *
 * ## La flecha: fijar el destino mientras dura
 *
 * Durante un salto largo el spy atraviesa todas las secciones intermedias y la
 * flecha las recorrería una por una: un parpadeo que no informa nada. Mientras
 * dura el salto **se fija el destino** (`pinnedId`) y el spy sigue midiendo pero
 * no manda. Al terminar —o al cancelarse— se suelta y se recalcula de una, así
 * que la posición final la decide siempre la misma medición y no el azar de qué
 * aviso llegó último.
 *
 * ## El gesto
 *
 * La flecha ya no aparece y desaparece en su lugar: **se retira hacia la derecha
 * y vuelve a entrar empujando la palabra de destino**. La mecánica es una sola
 * propiedad: la fila entera se corre `ARROW_SLOT` px a la derecha cuando el ítem
 * no está activo —lo que deja su rótulo alineado con los demás, con la flecha
 * fuera del bloque y en opacidad cero— y vuelve a cero cuando se activa,
 * arrastrando la palabra con ella. Es `transform` + `opacity`: no toca el
 * layout, así que ningún ítem empuja a los otros.
 */

/** Cuánto tarda el menú en aparecer y en irse. Suave, no un corte. */
const REVEAL_MS = 500;

/** Aire entre el rótulo y la flecha. Va inline porque el gesto necesita el número. */
const ARROW_GAP = 12;
/** Lo que se corre la fila: el hueco entero que ocupa la flecha. */
const ARROW_SLOT = SERVICES_ARROW_WIDTH + ARROW_GAP;

/** Entra empujando: resorte corto, con un asentamiento apenas perceptible. */
const ARROW_ENTER: Transition = {
  type: "spring",
  visualDuration: 0.34,
  bounce: 0.22,
  delay: 0.09,
};
/** Se retira acelerando, y arranca antes que la entrada para que se lea uno solo. */
const ARROW_EXIT: Transition = { duration: 0.24, ease: [0.4, 0, 1, 1] };
const ARROW_FADE_IN: Transition = { duration: 0.2, delay: 0.09 };
const ARROW_FADE_OUT: Transition = { duration: 0.16 };
const INSTANT: Transition = { duration: 0 };

/** Rebote del aterrizaje. Es el del despliegue de Fun Gallery; no se inventa otro. */
const JUMP_BOUNCE = 0.18;
/** Piso y techo de la duración del salto, en segundos. */
const JUMP_MIN_DURATION = 0.9;
const JUMP_MAX_DURATION = 1.5;
/** Base y pendiente: cada 6000 px de recorrido suman un segundo. */
const JUMP_BASE_DURATION = 0.75;
const JUMP_PX_PER_SECOND = 6000;

function jumpDuration(distance: number) {
  return Math.min(
    JUMP_MAX_DURATION,
    Math.max(
      JUMP_MIN_DURATION,
      JUMP_BASE_DURATION + distance / JUMP_PX_PER_SECOND,
    ),
  );
}

export default function ServicesSidebar() {
  const { locale, t } = useLocale();
  // Los rótulos siguen al idioma; los `id` no, y por eso el observer de más
  // abajo se arma con `SERVICES_NAV_IDS` y no con esta lista: cambiar de idioma
  // no reconstruye el scroll-spy.
  const nav = getServicesNav(locale);
  const [activeId, setActiveId] = useState<string>(SERVICES_NAV_IDS[0]);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  // El spy mide dentro de su efecto; el salto necesita pedirle un recálculo al
  // terminar, que es lo que garantiza que la flecha quede donde aterrizó.
  const resolveActiveRef = useRef<(() => void) | null>(null);
  const jumpRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const headerOffset = getHeaderOffset();
    const targets: Element[] = [];
    const sentinels: { id: string; element: Element }[] = [];

    for (const id of SERVICES_NAV_IDS) {
      const section = document.getElementById(id);
      const sentinel = document.querySelector(
        `[${SPY_SENTINEL_ATTR}="${id}"]`,
      );
      if (!section || !sentinel) continue;

      sentinels.push({ id, element: sentinel });
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

    resolveActiveRef.current = resolveActive;

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

    return () => {
      observer.disconnect();
      resolveActiveRef.current = null;
    };
  }, []);

  /**
   * Única salida del salto: corta la animación, da de baja sus listeners, suelta
   * el destino fijado y le pide al spy la palabra final. Idempotente.
   */
  const endJump = useCallback(() => {
    const teardown = jumpRef.current;
    if (!teardown) return;

    jumpRef.current = null;
    teardown();
    setPinnedId(null);
    resolveActiveRef.current?.();
  }, []);

  // Si alguien navega a otra ruta a mitad de un salto, el salto se va con él.
  useEffect(() => endJump, [endJump]);

  const handleJump = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      const section = document.getElementById(id);
      // Sin destino no se intercepta nada: que el ancla nativa haga lo suyo.
      if (!section) return;

      event.preventDefault();
      endJump();

      // El destino sale del criterio único: aterriza el contenido de la sección,
      // no su tope. Ver `services-layout`.
      const target = getSectionScrollTarget(section);

      // Continuidad para quien navega por teclado o con lector de pantalla: el
      // foco viaja al destino sin volver a mover el scroll.
      section.setAttribute("tabindex", "-1");
      section.focus({ preventScroll: true });

      if (reduceMotion) {
        window.scrollTo(0, target);
        resolveActiveRef.current?.();
        return;
      }

      const from = window.scrollY;
      setPinnedId(id);

      const interrupt = () => endJump();
      const interruptByKey = (keyEvent: KeyboardEvent) => {
        if (SCROLL_KEYS.has(keyEvent.key)) endJump();
      };

      const controls = animate(from, target, {
        type: "spring",
        visualDuration: jumpDuration(Math.abs(target - from)),
        bounce: JUMP_BOUNCE,
        onUpdate: (value) => window.scrollTo(0, value),
        onComplete: () => endJump(),
      });

      window.addEventListener("wheel", interrupt, { passive: true });
      window.addEventListener("touchstart", interrupt, { passive: true });
      window.addEventListener("keydown", interruptByKey);

      jumpRef.current = () => {
        controls.stop();
        window.removeEventListener("wheel", interrupt);
        window.removeEventListener("touchstart", interrupt);
        window.removeEventListener("keydown", interruptByKey);
      };
    },
    [endJump, reduceMotion],
  );

  const markedId = pinnedId ?? activeId;

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
        aria-label={t.services.sidebarLabel}
        style={{ transitionDuration: `${REVEAL_MS}ms` }}
        className={cn(
          "pointer-events-auto sticky top-1/2 -translate-y-1/2",
          "transition-[opacity,visibility] ease-out motion-reduce:transition-none",
          revealed ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <ul className="flex flex-col items-end gap-[27px]">
          {nav.map((item) => {
            const isMarked = item.id === markedId;

            return (
              <li key={item.id} className="flex w-full justify-end">
                <motion.a
                  href={`#${item.id}`}
                  onClick={(event) => handleJump(event, item.id)}
                  aria-current={isMarked ? "true" : undefined}
                  style={{ gap: ARROW_GAP }}
                  initial={false}
                  animate={{ x: isMarked ? 0 : ARROW_SLOT }}
                  transition={
                    reduceMotion
                      ? INSTANT
                      : isMarked
                        ? ARROW_ENTER
                        : ARROW_EXIT
                  }
                  className={cn(
                    // Fila alineada a la derecha: al activarse la flecha vuelve
                    // a su lugar y el rótulo se corre a la izquierda para
                    // hacerle sitio, manteniendo fijo el borde derecho. Así lo
                    // muestran `08a` y `08b`.
                    "flex items-center font-body text-[17px] uppercase leading-[20px]",
                    "transition-colors duration-200",
                    isMarked
                      ? "text-off-black"
                      : "text-gray-brand hover:text-off-black",
                  )}
                >
                  <span>{item.label}</span>
                  <motion.span
                    className="flex"
                    initial={false}
                    animate={{ opacity: isMarked ? 1 : 0 }}
                    transition={
                      reduceMotion
                        ? INSTANT
                        : isMarked
                          ? ARROW_FADE_IN
                          : ARROW_FADE_OUT
                    }
                  >
                    <ServicesArrow direction="left" />
                  </motion.span>
                </motion.a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
