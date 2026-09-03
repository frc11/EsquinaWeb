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
    // /contact (bg-off-white); only /contact/success anchors its footer (the
    // gallery stopped having a fixed one in B3.3). The aside is not sticky
    // (B3.2b): it sits in normal flow, level with the form, and never moves
    // during scroll.
    //
    // Aire entre el envío y el footer, solo debajo de 1024 (R3/F7): el botón
    // SEND cerraba la sección a 0 px del footer oscuro (medido a 320 y 390 en
    // los dos idiomas). Son 72 px = 3 × el gutter de 24 del cromo de mobile,
    // el múltiplo que deja el cierre de esta ruta en la banda de las otras
    // internas —74 px en /services, 80 en /fun-gallery, 88 en /work/[slug] a
    // 390—. Va en la sección y no en el formulario: es aire de la ruta contra
    // el footer, no composición del questionnaire, que no se toca.
    <section className="bg-off-white px-6 pt-6 text-off-black max-lg:pb-18 md:px-12 md:pt-10 lg:px-16 lg:pt-14">
      <ContactForm service={serviceParam} />
    </section>
  );
}
