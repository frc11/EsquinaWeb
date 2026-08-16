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
    // fixed footer. The bottom padding that keeps the last fields and SEND
    // clear of the page end lives INSIDE the form column (ContactForm) so it
    // also lengthens the sticky aside's container (the aside stays pinned
    // through the end of the page instead of drifting up).
    <section className="bg-off-white px-6 pt-6 text-off-black md:px-12 md:pt-10 lg:px-16 lg:pt-14">
      <ContactForm service={serviceParam} />
    </section>
  );
}
