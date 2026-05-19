import { Metadata } from "next";
import ServicesStack, {
  type ServiceContent,
} from "@/components/sections/services/ServicesStack";
import ServicesIntro from "@/components/sections/services/ServicesIntro";

export const metadata: Metadata = {
  title: "Services - ESQUINA ESTUDIO(TM)",
  description:
    "Branding, motion graphics, packaging, editorial and illustration services by ESQUINA ESTUDIO.",
};

const services: ServiceContent[] = [
  {
    id: "01",
    name: "BRAND ESSENTIALS",
    description:
      "For brands ready to take shape\nthrough thoughtful strategy\nand a distinctive visual identity.",
    items: [
      {
        main: "Strategic Definition",
        subs: ["Vision", "Values", "Tone of Voice", "Brand Personality"],
      },
      {
        main: "Market Research",
        subs: ["Desk Research", "Target Audience Definition", "SWOT Analysis"],
      },
      {
        main: "Value Proposition",
        subs: ["Added-value ideas to enhance", "the consumer experience"],
      },
      {
        main: "Visual Identity Development",
        subs: [
          "Institutional Identity",
          "Logotype / Symbol",
          "Typography System",
          "Color Palette",
          "Graphic Elements",
          "Photographic Direction",
        ],
      },
      {
        main: "Brand Guidelines",
        subs: [
          "Basic brand usage guide for consistent and correct implementation (Approximately 20–40 pages)",
        ],
      },
      {
        main: "3 Custom Brand Applications of Choice",
        subs: [
          "Business Card Design",
          "Letterhead Design",
          "Flyers / Stationery",
          "Instagram Post Design (first publication)",
          "Instagram Story Template Design",
          "Signage Design",
        ],
      },
    ],
  },
  {
    id: "02",
    name: "BRAND UNIVERSE",
    description:
      "For brands ready to create an\nimmersive brand universe\ndesigned to grow and evolve. \n \n \n (*)ITEMS EXCLUSIVE \nTO THIS PACK",
    items: [
      {
        main: "Strategic Definition",
        subs: ["Vision", "Values", "Tone of Voice", "Brand Personality"],
      },
      {
        main: "Market Research",
        subs: ["Desk Research", "Target Audience Definition", "SWOT Analysis"],
      },
      {
        main: "Value Proposition",
        subs: ["Added-value ideas to enhance", "the consumer experience"],
      },
      {
        main: "Visual Identity Development",
        subs: [
          "Institutional Identity",
          "(Logotype / Symbol)",
          "Typography System",
          "Color Palette",
          "Graphic Elements",
          "Photographic Direction",
          "Social Media Visual Guidelines (*)",
        ],
      },
      {
        main: "Brand Guidelines",
        subs: [
          "Basic brand usage guide for\nconsistent and correct\nimplementation\n(Approximately 40–60 pages)",
        ],
      },
      { main: "Logo Animation (*)", subs: [] },
      { main: "Landing Page Design (*)", subs: [] },
      { main: "Initial Photoshoot (*)", subs: [] },
      { main: "Curated Image Library (*)", subs: [] },
      {
        main: "6 Custom Brand Applications\nof Choice (*)",
        subs: [
          "Business Card Design",
          "Letterhead Design",
          "Flyers / Stationery",
          "Instagram Post Design\n(first publication)",
          "Instagram Story Template Design",
          "Signage Design",
        ],
      },
    ],
  },
  {
    id: "A.S/01",
    name: "MOTION GRAPHICS",
    description: "Bring your brand to life through movement.",
    items: [
      { main: "Custom Logo Animation", subs: [] },
      { main: "Social Media Motion Assets", subs: [] },
      { main: "UI/UX Animations", subs: [] },
    ],
  },
  {
    id: "A.S/02",
    name: "PACKAGING",
    description: "Physical touchpoints that stand out on the shelf.",
    items: [
      { main: "Label Design", subs: [] },
      { main: "Box & Structure Design", subs: [] },
      { main: "Production Ready Files", subs: [] },
    ],
  },
  {
    id: "A.S/03",
    name: "EDITORIAL",
    description: "Layouts that tell a cohesive visual story.",
    items: [
      { main: "Lookbooks", subs: [] },
      { main: "Brand Presentations", subs: [] },
      { main: "Print Collateral", subs: [] },
    ],
  },
  {
    id: "A.S/04",
    name: "ILLUSTRATION",
    description:
      "Illustration adds depth, personality and a distinctive visual language to a brand's communication. Whether used as a central element or as a supporting asset, custom illustration helps create more memorable, expressive and visually cohesive experiences while reinforcing a brand's identity in a unique and engaging way.",
    items: [
      { main: "Custom brand illustrations", subs: [] },
      { main: "Packaging and label artwork", subs: [] },
      { main: "Editorial and publishing illustrations", subs: [] },
      { main: "Merchandise and apparel graphics", subs: [] },
      { main: "Icon systems and graphic elements", subs: [] },
      { main: "Event and promotional artwork", subs: [] },
      { main: "Character and mascot design", subs: [] },
      { main: "Illustrated maps, patterns and compositions", subs: [] },
    ],
  },
];

export default function ServicesPage() {
  return (
    <main className="overflow-visible bg-off-white text-off-black">
      <ServicesIntro />
      <ServicesStack services={services} />
    </main>
  );
}
