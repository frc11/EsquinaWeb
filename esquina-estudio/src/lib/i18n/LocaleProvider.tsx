"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
 * # `<html lang>`
 *
 * Se escribe al DOM cuando cambia el idioma. No puede salir del render porque el
 * `<html>` lo emite el layout raíz del servidor, que no sabe del idioma del
 * cliente.
 *
 * # Lo que este proveedor NO hace
 *
 * No navega, no toca el router y no cambia ninguna `key`: cambiar de idioma es
 * un cambio de estado y el árbol se queda donde está. Si remontara, las
 * transiciones de página y las animaciones de entrada se dispararían de nuevo.
 */

const STORAGE_KEY = "esquina:locale";

const DICTIONARIES: { readonly [L in Locale]: Dictionary } = { en: EN, es: ES };

type LocaleContextValue = {
  readonly locale: Locale;
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

  useEffect(() => {
    const resolved = readStoredLocale() ?? detectLocale();

    if (resolved === "en") return;

    // Intencional: se sincroniza un almacén externo (la preferencia guardada y
    // el idioma del navegador) hacia el estado de React en el montaje.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocaleState(resolved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    storeLocale(next);
    setLocaleState(next);
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: DICTIONARIES[locale] }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
