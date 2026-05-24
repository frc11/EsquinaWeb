import type { Metadata } from "next";
import localFont from "next/font/local";
import PreloaderProvider from "@/components/providers/PreloaderProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import "./globals.css";

const displayFont = localFont({
  src: "../../tipografia/manrope-variable.ttf",
  variable: "--font-display",
  weight: "300 800",
  display: "swap",
});

const bodyFont = localFont({
  src: "../../tipografia/manrope-variable.ttf",
  variable: "--font-body",
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
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} antialiased`}
    >
      <body className="bg-off-white text-off-black font-body min-h-screen">
        <style suppressHydrationWarning>{`
  /* Nuclear scrollbar hide */
  ::-webkit-scrollbar {
    display: none !important;
    width: 0px !important;
    height: 0px !important;
    background: transparent !important;
    -webkit-appearance: none !important;
  }
  html, body {
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }
`}</style>
        <PreloaderProvider>
          <CustomCursor />
          <LoadingScreen />
          {children}
        </PreloaderProvider>
      </body>
    </html>
  );
}
