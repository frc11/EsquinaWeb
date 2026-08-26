"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import PreloaderProvider from "@/components/providers/PreloaderProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LocaleProvider } from "@/lib/i18n";
import { isStudioPath } from "@/lib/preloader-gate";

export default function RootClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  /*
    El test de ruta **no se escribe acá**: viene de `preloader-gate.ts`, que es
    el otro lado que tiene que coincidir. Ese módulo emite el script bloqueante
    de la compuerta, y el script usa el mismo patrón para saltearse `/studio`.
    Si los dos criterios se separaran, volvería el defecto de M6/F1: la
    compuerta puesta por el script y `LoadingScreen` sin montar para
    levantarla, o sea el lienzo negro para siempre. Una sola expresión, dos
    consumidores (`CLAUDE.md` §8.10).
  */
  const isStudio = isStudioPath(pathname);

  useEffect(() => {
    if (isStudio) {
      delete document.body.dataset.customCursor;
      return;
    }
  }, [isStudio]);

  if (isStudio) {
    return <>{children}</>;
  }

  // `LocaleProvider` va por fuera de todo lo demás: el idioma lo consumen tanto
  // el cromo (Navbar, Footer) como las páginas, y la detección tiene que correr
  // en el montaje —o sea, detrás de la cortina del preloader en la primera
  // visita de la pestaña—. `/studio` queda afuera por el early-return de arriba:
  // esa ruta es la interfaz de Sanity y trae su propio idioma.
  return (
    <LocaleProvider>
      <PreloaderProvider>
        <CustomCursor />
        <LoadingScreen />
        {children}
      </PreloaderProvider>
    </LocaleProvider>
  );
}
