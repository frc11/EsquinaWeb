import type { Metadata } from "next";
import localFont from "next/font/local";
import RootClientShell from "@/components/providers/RootClientShell";
import { PRELOADER_GATE_SCRIPT } from "@/lib/preloader-gate";
import "./globals.css";

const manropeFont = localFont({
  src: "../../tipografia/manrope-variable.ttf",
  variable: "--font-manrope",
  weight: "300 800",
  display: "swap",
});

const defaultDescription =
  "A design studio focused on building brands and shaping ideas with clarity, intention, and strong visual identity based in Tucumán, Argentina.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://your-site-name.netlify.app",
  ),
  title: {
    template: "%s | ESQUINA ESTUDIO™",
    default: "ESQUINA ESTUDIO™ | Branding & Design",
  },
  description: defaultDescription,
  icons: {
    icon: [
      {
        url: "/logo-favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/logo-favicon.png",
    apple: "/logo-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "ESQUINA ESTUDIO™ | Branding & Design",
    description: defaultDescription,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ESQUINA ESTUDIO™",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manropeFont.variable} antialiased`}>
      {/*
        `min-h-svh` y **no** `min-h-screen`, que es el punto 4 y el 13 de M3.

        `min-h-screen` es `min-height: 100vh`, y en un teléfono `100vh` no es la
        pantalla que se ve: es la pantalla **con la barra del navegador oculta**,
        o sea el viewport grande. La visible mientras la barra está puesta es
        `100svh`, entre 50 y 100 px más baja. Con `100vh` en el `<body>` el
        documento quedaba más alto que la pantalla aunque su contenido midiera
        exactamente `100svh`, y eso producía las dos cosas que se reportaron:
        `/` se dejaba scrollear de más, y en `/contact/success` —donde el panel
        oscuro mide `100svh` clavados— la franja sobrante mostraba **el fondo
        off-white del propio body**, que es el blanco que aparecía debajo.

        Demostrado en el banco: no se puede emular la barra del navegador, pero
        forzando el mismo `min-height` que declara `100vh` con la barra oculta
        (+72 px) las dos rutas pasan de `docH = 844` y `scrollY = 0` a
        `docH = 916` y `scrollY = 72`, y la captura de la pantalla de éxito
        muestra la franja clara al pie. Con `svh` eso no puede pasar **por
        construcción**: el viewport chico es por definición el más bajo de los
        tres, así que el `min-height` del body nunca supera lo que se ve.

        Es además la regla que el propio repo ya tenía escrita —«nada de
        `100vh`: `100svh`»— y este era el último lugar donde quedaba sin aplicar.
      */}
      <body className="bg-off-white text-off-black font-body min-h-svh">
        {/*
          La compuerta de la cortina de entrada. El script y el porqué de su
          forma —un `<style>` propio en `<head>` y **nada** escrito sobre
          `<html>`, que es lo que rompía la hidratación en desarrollo— viven en
          `src/lib/preloader-gate.ts`, que es la única fuente: `LoadingScreen`
          levanta la compuerta desde el mismo módulo.
        */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE_SCRIPT }} />
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
  );
}
