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
    // The site layout already wraps page content in <main>; use a <section>
    // here to avoid nesting <main>. No fixed height / overflow-hidden so the
    // page scrolls naturally. The site Footer renders in normal flow on
    // /contact (bg-off-white). Only /fun-gallery and /contact/success use a
    // fixed footer. The aside is not sticky (B3.2b): it sits in normal flow,
    // level with the form, and never moves during scroll.
    <section className="bg-off-white px-6 pt-6 text-off-black md:px-12 md:pt-10 lg:px-16 lg:pt-14">
      <ContactForm service={serviceParam} />
    </section>
  );
}
