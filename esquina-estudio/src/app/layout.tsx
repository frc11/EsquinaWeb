import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "ESQUINA ESTUDIO™ — Branding & Design Studio",
  description:
    "Estudio de branding y diseño en Tucumán, Argentina. Creamos marcas memorables.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bebasNeue.variable} ${dmSans.variable} antialiased`}
    >
      <body className="bg-off-white text-off-black font-body min-h-screen">
        <CustomCursor />
        <LoadingScreen />
        {children}
      </body>
    </html>
  );
}
