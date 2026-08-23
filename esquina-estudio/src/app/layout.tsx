import type { Metadata } from "next";
import localFont from "next/font/local";
import RootClientShell from "@/components/providers/RootClientShell";
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

/**
 * Script bloqueante de la cortina de entrada (M3/F1, punto 1).
 *
 * Va **primero dentro de `<body>` y sin `async`/`defer`**, así que el navegador
 * lo ejecuta mientras parsea el documento: antes de leer el nodo de la cortina y
 * mucho antes del primer pintado. Es lo único que puede resolver la regla de
 * «una vez por pestaña» sin que participe de la hidratación.
 *
 * Decide y no hace nada más: marca `data-preloader="skip"` en `<html>` y deja
 * que la regla de `globals.css` esconda la cortina con `display: none`. React
 * ni se entera —su primer render es idéntico al del servidor, con cortina— y el
 * `useEffect` de `LoadingScreen` la desmonta después, sobre algo que el usuario
 * ya no estaba viendo.
 *
 * Todo va dentro de `try`: si `sessionStorage` tira (navegación privada,
 * almacenamiento bloqueado) no se marca nada y la cortina se muestra. Es el lado
 * seguro del error, porque la cortina siempre se levanta por temporizador.
 */
const PRELOADER_GATE = `(function(){try{var s=false;try{s=window.sessionStorage.getItem("esquina:preloaderShown")==="1"}catch(e){}if(!s&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){s=true}if(s){document.documentElement.setAttribute("data-preloader","skip")}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manropeFont.variable} antialiased`}>
      <body className="bg-off-white text-off-black font-body min-h-screen">
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE }} />
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
  );
}
