import { Metadata } from "next";
import TeamSection from "@/components/sections/team/TeamSection";

export const metadata: Metadata = {
  title: "Team - ESQUINA ESTUDIO™",
  description:
    "Meet ESQUINA ESTUDIO, a design studio focused on building brands and shaping ideas with clarity and intention.",
};

export default function TeamPage() {
  return <TeamSection />;
}
