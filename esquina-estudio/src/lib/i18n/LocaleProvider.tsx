"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import {
  PAGE_EXIT_DURATION,
  PAGE_EXIT_EASE,
  usePrefersReducedMotion,
} from "@/components/layout/RouteTransitionProvider";
import { EN } from "@/lib/i18n/en";
import { ES } from "@/lib/i18n/es";
import type { Dictionary, Locale } from "@/lib/i18n/types";

/**
 * Contexto de idioma. Un proveedor, un hook, y nada más: el cambio de idioma es
 * **estado**, no navegación.
 *
 * # El servidor siempre rinde inglés
 *
 * El estado arranca en `"en"` en el servidor **y en el primer render del
 * cliente**. Recién en un efecto —o sea, después de hidratar— se resuelve el
 * idioma real. Es el mismo patrón que ya usan `PreloaderProvider` (que lee
 * `sessionStorage`) y `usePrefersReducedMotion` (que lee una media query), y por
 * la misma razón: resolver cualquiera de las dos cosas **durante** el primer
 * render rompe la hidratación. Precedente registrado en B3.3.
 *
 * Consecuencia aceptada por escrito: la metadata y el `<html lang>` que sirve el
 * servidor quedan en inglés para todos, crawlers incluidos.
 *
 * # Cuándo se decide el idioma
 *
 * En el montaje, que en la primera visita de la pestaña ocurre **detrás de la
 * cortina del preloader** (2700 ms): el cambio a español no se ve. En una
 * recarga a mitad de sesión la cortina dura 0 ms y el cambio ocurre a la vista;
 * también es una aceptación escrita del plan.
 *
 * El orden es: **la elección explícita le gana a la detección**. Si hay
 * preferencia guardada se usa esa y no se mira el navegador; si no la hay y
 * `navigator.language` empieza con `es`, se pasa a español.
 *
 * # La transición al cambiar de idioma (B4b)
 *
 * B4 dejó escrito que el toggle **no** disparaba la transición de página.
 * B4b revierte esa regla por decisión de Valentino: cambiar de idioma tiene que
 * sentirse como cambiar de página. La secuencia, y lo que la hace posible:
 *
 * 1. **Dos idiomas, no uno.** `selectedLocale` es lo que la persona eligió y
 *    cambia **en el mismo click**; `locale` es el que se está renderizando y
 *    cambia mucho después. Esa distancia es toda la fase 3: el toggle acusa
 *    recibo —repinta el activo y manda la barrita a viajar— mientras el
 *    diccionario todavía es el viejo.
 * 2. **El acuse de recibo dura `ACK_DELAY`**, que no es un número nuevo: es lo
 *    que tarda el propio toggle en cambiar de color (`transition-colors
 *    duration-200`). Durante ese rato la cortina todavía no empezó.
 * 3. **La cortina** es un `fixed inset-0` en off-white que sube a opacidad 1 con
 *    la duración y el easing de una navegación (`PAGE_EXIT_DURATION`,
 *    `PAGE_EXIT_EASE`) y después vuelve a 0. Tapa **todo**, el menú incluido,
 *    porque vive a la altura del `<body>` y por encima del cromo.
 * 4. **El idioma se cambia con la cortina arriba**, en el punto máximo del
 *    desvanecimiento. El texto nunca se ve cambiar.
 *
 * Total: `ACK_DELAY` + dos mitades de `PAGE_EXIT_DURATION` = 1500 ms. Las dos
 * mitades son exactamente las de una navegación (650 ms cada una, mismo
 * easing); lo que suma es el acuse de recibo, que el sprint pidió ver **antes**
 * del desvanecimiento.
 *
 * ## Por qué una cortina y no el sistema de transición de rutas
 *
 * Ese sistema está atado a la navegación: su estado de salida se cierra cuando
 * llega la ruta nueva y `template.tsx` se remonta. Acá no hay navegación, así
 * que no habría nada que lo cerrara. Y además su overlay vive **adentro** de
 * `PageTransitionShell`, que no cubre el Navbar. Una cortina propia a la altura
 * del `<body>` da el mismo resultado visual —todo se va a off-white y vuelve—
 * sin tocar una línea del camino de navegación, y con una ventaja de seguridad:
 * como nada baja de opacidad, no puede quedar **ningún elemento a media
 * opacidad**; el único estado posible es «la cortina está» o «no está».
 *
 * ## Las tres salvaguardas
 *
 * 1. **El estado de salida se revierte siempre.** Por la vía normal —dos
 *    temporizadores, uno por etapa— y por un **failsafe** armado en el mismo
 *    click, con `FAILSAFE_MARGIN_MS` de margen sobre la duración total, que
 *    apaga la cortina y aplica el idioma pase lo que pase.
 * 2. **Limpieza en el desmontaje.** Los temporizadores de etapa los limpia React
 *    con el efecto; el failsafe tiene su propio efecto de limpieza. Si el
 *    proveedor se va (la única forma es entrar a `/studio`), no queda nada.
 *    Navegar a otra ruta del sitio **no** lo desmonta: la secuencia termina sola
 *    y la cortina se va igual.
 * 3. **El idioma cambia aunque la animación falle.** La elección se guarda en el
 *    primer instante del click, el swap lo dispara un temporizador —nunca un
 *    callback de animación—, y el failsafe lo vuelve a aplicar. La animación es
 *    decoración; el cambio de idioma es la función.
 *
 * Con `prefers-reduced-motion` no hay cortina ni etapas: el idioma cambia al
 * instante.
 *
 * # `<html lang>`
 *
 * Se escribe al DOM cuando cambia el idioma **renderizado**. No puede salir del
 * render porque el `<html>` lo emite el layout raíz del servidor, que no sabe
 * del idioma del cliente.
 *
 * # Lo que este proveedor NO hace
 *
 * No navega, no toca el router y no cambia ninguna `key`: cambiar de idioma
 * sigue siendo un cambio de estado y el árbol se queda donde está. Si remontara,
 * las transiciones de página y las animaciones de entrada se dispararían de
 * nuevo.
 */

const STORAGE_KEY = "esquina:locale";

const DICTIONARIES: { readonly [L in Locale]: Dictionary } = { en: EN, es: ES };

/**
 * El acuse de recibo del click, en segundos. Es la duración del
 * `transition-colors duration-200` del propio toggle: el desvanecimiento
 * arranca cuando el activo terminó de repintarse.
 */
const ACK_DELAY = 0.2;

/** Lo que dura la secuencia entera: acuse + cortina que sube + cortina que baja. */
const TRANSITION_MS = (ACK_DELAY + PAGE_EXIT_DURATION * 2) * 1000;

/** Margen del failsafe sobre la duración total. */
const FAILSAFE_MARGIN_MS = 400;

/**
 * `covering` es el tramo que termina con la cortina arriba y el idioma ya
 * cambiado; `revealing` es el que la baja. Fuera de esos dos la cortina **no
 * está en el DOM**.
 */
type TransitionPhase = "idle" | "covering" | "revealing";

type LocaleContextValue = {
  /** El idioma que se está renderizando. Cambia detrás de la cortina. */
  readonly locale: Locale;
  /** El idioma que la persona eligió. Cambia en el click, sin esperar nada. */
  readonly selectedLocale: Locale;
  /** Elección explícita del visitante: se persiste y le gana a la detección. */
  readonly setLocale: (locale: Locale) => void;
  /** Diccionario del idioma activo. */
  readonly t: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used inside LocaleProvider.");
  }

  return context;
}

function isLocale(value: string | null): value is Locale {
  return value === "en" || value === "es";
}

/**
 * Las tres puertas al almacenamiento fallan en silencio, igual que en
 * `fun-gallery-return.ts`: sin `localStorage` —modo privado, almacenamiento
 * bloqueado— el sitio sigue funcionando, solo que la elección no sobrevive a la
 * pestaña.
 */
function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

function storeLocale(locale: Locale) {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Sin almacenamiento la elección vale para esta carga y nada más.
  }
}

/** Detección: solo `navigator.language`, y solo si no hay preferencia guardada. */
function detectLocale(): Locale {
  return navigator.language?.toLowerCase().startsWith("es") ? "es" : "en";
}

export default function LocaleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [selectedLocale, setSelectedLocale] = useState<Locale>("en");
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const reduceMotion = usePrefersReducedMotion();

  // Las dos lecturas que hace `setLocale` viven también en refs para que la
  // función sea estable: si dependiera del estado, el valor del contexto
  // cambiaría de identidad en cada etapa de la transición y volvería a
  // renderizar todo el árbol tres veces por cambio de idioma.
  const selectedRef = useRef<Locale>("en");
  const phaseRef = useRef<TransitionPhase>("idle");
  const pendingRef = useRef<Locale | null>(null);
  const failsafeRef = useRef<number | null>(null);

  useEffect(() => {
    const resolved = readStoredLocale() ?? detectLocale();

    if (resolved === "en") return;

    selectedRef.current = resolved;

    // Intencional: se sincroniza un almacén externo (la preferencia guardada y
    // el idioma del navegador) hacia el estado de React en el montaje. Las dos
    // llaves se mueven juntas y sin transición porque acá no hubo click.
    /* eslint-disable react-hooks/set-state-in-effect */
    setSelectedLocale(resolved);
    setLocaleState(resolved);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const clearFailsafe = useCallback(() => {
    if (failsafeRef.current === null) return;

    window.clearTimeout(failsafeRef.current);
    failsafeRef.current = null;
  }, []);

  const finishTransition = useCallback(() => {
    clearFailsafe();
    pendingRef.current = null;
    phaseRef.current = "idle";
    setPhase("idle");
  }, [clearFailsafe]);

  const setLocale = useCallback(
    (next: Locale) => {
      // Click en el idioma ya elegido: no pasa nada, ni transición ni parpadeo.
      // Y mientras dura la secuencia no se acepta otro: los clicks repetidos se
      // ignoran hasta que termine, no se encadenan ni la cortan a la mitad.
      if (next === selectedRef.current) return;
      if (phaseRef.current !== "idle") return;

      // Lo primero, y pase lo que pase con la animación: la elección queda
      // guardada. Si algo se rompiera de acá en adelante, una recarga muestra el
      // idioma que la persona pidió.
      storeLocale(next);
      selectedRef.current = next;
      setSelectedLocale(next);

      if (reduceMotion) {
        setLocaleState(next);
        return;
      }

      pendingRef.current = next;
      phaseRef.current = "covering";
      setPhase("covering");

      clearFailsafe();
      failsafeRef.current = window.setTimeout(() => {
        failsafeRef.current = null;
        pendingRef.current = null;
        phaseRef.current = "idle";
        setLocaleState(next);
        setPhase("idle");
      }, TRANSITION_MS + FAILSAFE_MARGIN_MS);
    },
    [clearFailsafe, reduceMotion],
  );

  // Etapa 1: la cortina sube y, con ella arriba, se cambia el idioma. El swap lo
  // dispara este temporizador y no el final de la animación, que es lo que hace
  // que el idioma cambie igual si la animación no corre (pestaña en segundo
  // plano, por ejemplo).
  useEffect(() => {
    if (phase !== "covering") return;

    const swap = window.setTimeout(
      () => {
        const target = pendingRef.current;

        if (target) setLocaleState(target);

        phaseRef.current = "revealing";
        setPhase("revealing");
      },
      (ACK_DELAY + PAGE_EXIT_DURATION) * 1000,
    );

    return () => window.clearTimeout(swap);
  }, [phase]);

  // Etapa 2: la cortina baja y se va del DOM. El easing de salida es plano en el
  // final, así que aunque el temporizador se adelante un cuadro la opacidad ya
  // es del orden de 0,0005: no se ve desaparecer.
  useEffect(() => {
    if (phase !== "revealing") return;

    const done = window.setTimeout(finishTransition, PAGE_EXIT_DURATION * 1000);

    return () => window.clearTimeout(done);
  }, [finishTransition, phase]);

  useEffect(() => clearFailsafe, [clearFailsafe]);

  const value = useMemo(
    () => ({
      locale,
      selectedLocale,
      setLocale,
      t: DICTIONARIES[locale],
    }),
    [locale, selectedLocale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>
      {children}

      {phase === "idle" ? null : (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[500] bg-off-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "covering" ? 1 : 0 }}
          transition={{
            duration: PAGE_EXIT_DURATION,
            ease: PAGE_EXIT_EASE,
            delay: phase === "covering" ? ACK_DELAY : 0,
          }}
        />
      )}
    </LocaleContext.Provider>
  );
}
