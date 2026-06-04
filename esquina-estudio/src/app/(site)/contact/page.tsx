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
    // page scrolls naturally. On /contact the site Footer is `position: fixed`
    // (z-100, ~166px tall) overlaying the viewport bottom — so reserve bottom
    // padding larger than the footer height to keep the last fields and the
    // SEND button clear of it when scrolled to the end.
    <section className="bg-off-white px-6 pb-[clamp(13rem,22vh,16rem)] pt-6 text-off-black md:px-12 md:pt-10 lg:px-16 lg:pt-14">
      <ContactForm service={serviceParam} />
    </section>
  );
}
