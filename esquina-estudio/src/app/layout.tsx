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
 * Marca `data-preloader` en `<html>` con uno de dos valores, y de ahí cuelgan las
 * dos reglas de `globals.css`:
 *
 * - **`"skip"`** — la cortina no corresponde (ya se vio en esta pestaña, o el
 *   visitante pidió menos movimiento). La regla la esconde con `display: none`.
 * - **`"on"`** — la cortina va a correr, y entonces **el lienzo se pinta de
 *   negro**. Esto último no es redundante con la cortina, y es un defecto que
 *   apareció midiendo el build final: el nodo de la cortina es lo segundo que
 *   hay dentro de `<body>`, pero el navegador puede pintar **antes** de haberlo
 *   parseado, y lo que pinta entonces es el `bg-off-white` del body. Medido en
 *   un arranque lento: primer pintado a los 2198 ms con la pantalla en blanco
 *   —`elementFromPoint` daba `BODY` en los cinco puntos, o sea sin contenido
 *   ninguno— y la cortina recién a los 2337. Eran ~140 ms de destello claro
 *   antes del negro. Pintando el lienzo desde el script, la pantalla está negra
 *   desde el primer cuadro haya o no llegado el nodo.
 *
 * React ni se entera de ninguno de los dos —su primer render es idéntico al del
 * servidor, con cortina— y el `useEffect` de `LoadingScreen` desmonta la cortina
 * después, sobre algo que el usuario ya no estaba viendo. Es `LoadingScreen`
 * también quien **saca** el atributo cuando la cortina empieza a irse, así que
 * el off-white vuelve detrás de ella y no después.
 *
 * Todo va dentro de `try`: si `sessionStorage` tira (navegación privada,
 * almacenamiento bloqueado) no se marca nada y la cortina se muestra. Es el lado
 * seguro del error, porque la cortina siempre se levanta por temporizador.
 */
const PRELOADER_GATE = `(function(){try{var s=false;try{s=window.sessionStorage.getItem("esquina:preloaderShown")==="1"}catch(e){}if(!s&&window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){s=true}document.documentElement.setAttribute("data-preloader",s?"skip":"on")}catch(e){}})();`;

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
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_GATE }} />
        <RootClientShell>{children}</RootClientShell>
      </body>
    </html>
  );
}
