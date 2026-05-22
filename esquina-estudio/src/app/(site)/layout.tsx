import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransitionShell from "@/components/layout/PageTransitionShell";
import RouteTransitionProvider from "@/components/layout/RouteTransitionProvider";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

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
      </RouteTransitionProvider>
    </SmoothScrollProvider>
  );
}
