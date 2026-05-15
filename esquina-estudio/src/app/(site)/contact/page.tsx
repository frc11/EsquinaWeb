import { Metadata } from "next";
import { Suspense } from "react";
import ContactForm from "@/components/sections/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact - ESQUINA ESTUDIO\u2122",
  description:
    "Share your project details with ESQUINA ESTUDIO and receive a custom proposal.",
};

export default function ContactPage() {
  return (
    <main className="bg-off-white px-6 py-16 text-off-black md:px-12">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-16 lg:flex-row lg:gap-24">
        <aside className="w-full flex-shrink-0 self-start lg:sticky lg:top-24 lg:w-[300px]">
          <h1 className="font-display text-[48px] uppercase leading-[0.95]">
            LET&apos;S BRING
            <br />
            YOUR IDEAS
            <br />
            TO LIFE
          </h1>

          <div className="mt-10 space-y-4 font-body text-[17px] uppercase leading-[1.35]">
            <p>
              SHARE YOUR PROJECT DETAILS
              <br />
              TO RECEIVE A CUSTOM PROPOSAL
            </p>
            <p aria-hidden>&rarr;</p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
