import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransitionShell from "@/components/layout/PageTransitionShell";
import RouteTransitionProvider from "@/components/layout/RouteTransitionProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import BackToTop from "@/components/ui/BackToTop";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <RouteTransitionProvider>
        <Navbar />
        <PageTransitionShell>
          <main className="pt-[var(--header-height)]">{children}</main>
          <Footer />
        </PageTransitionShell>
        {/*
          Fuera de `PageTransitionShell` a propósito: ese árbol baja de opacidad
          entero durante la transición de ruta, y el botón tiene que quedarse
          quieto —igual que el Navbar, que tampoco está adentro—.
        */}
        <BackToTop />
      </RouteTransitionProvider>
    </SmoothScrollProvider>
  );
}
