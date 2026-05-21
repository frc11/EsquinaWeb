import { Metadata } from "next";
import ContactForm from "@/components/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact - ESQUINA ESTUDIO\u2122",
  description:
    "Share your project details with ESQUINA ESTUDIO and receive a custom proposal.",
};

type ContactPageProps = {
  searchParams: Promise<{ service?: string | string[] }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { service } = await searchParams;
  const serviceParam = typeof service === "string" ? service : null;

  return (
    <main className="h-[calc(100svh-var(--header-height))] overflow-hidden bg-off-white px-6 pb-[clamp(9rem,18vh,12rem)] pt-6 text-off-black md:px-12 md:pt-10 lg:px-16 lg:pt-10">
      <ContactForm service={serviceParam} />
    </main>
  );
}
