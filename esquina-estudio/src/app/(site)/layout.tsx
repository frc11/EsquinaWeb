import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FullLayoutTransitionShell from "@/components/layout/FullLayoutTransitionShell";
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
        <FullLayoutTransitionShell>
  <Navbar />
  <main className="pt-[var(--header-height)]">
    <PageTransitionShell>{children}</PageTransitionShell>
  </main>
</FullLayoutTransitionShell>

<Footer />
      </RouteTransitionProvider>
    </SmoothScrollProvider>
  );
}
