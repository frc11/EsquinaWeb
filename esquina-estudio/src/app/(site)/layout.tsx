import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <Navbar />
      <main className="pt-[var(--header-height)]">
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
