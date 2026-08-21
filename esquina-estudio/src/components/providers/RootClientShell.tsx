"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import PreloaderProvider from "@/components/providers/PreloaderProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { LocaleProvider } from "@/lib/i18n";

export default function RootClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStudio = pathname === "/studio" || pathname.startsWith("/studio/");

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
