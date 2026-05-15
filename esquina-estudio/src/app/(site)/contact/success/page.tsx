import { Metadata } from "next";
import ContactSuccess from "@/components/sections/contact/ContactSuccess";

export const metadata: Metadata = {
  title: "Inquiry Sent - ESQUINA ESTUDIO™",
};

export default function ContactSuccessPage() {
  return <ContactSuccess />;
}
