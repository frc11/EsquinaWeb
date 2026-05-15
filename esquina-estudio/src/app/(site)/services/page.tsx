import { Metadata } from "next";
import ServicesStack, {
  type ServiceContent,
} from "@/components/sections/services/ServicesStack";

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
      "For brands ready to take shape through thoughtful strategy and a distinctive visual identity.",
    items: [
      "Strategic Definition: Vision, Values, Tone of Voice, Brand Personality",
      "Market Research: Desk Research, Target Audience Definition, SWOT Analysis",
      "Value Proposition",
      "Visual Identity Development: Institutional Identity (Logotype/Symbol), Typography System, Color Palette, Graphic Elements, Photographic Direction",
      "Brand Guidelines (~20-40 pages)",
      "3 Custom Brand Applications of Choice",
    ],
  },
  {
    id: "02",
    name: "BRAND UNIVERSE",
    description:
      "For brands ready to create an immersive brand universe designed to grow and evolve.",
    items: [
      "Strategic Definition: Vision, Values, Tone of Voice, Brand Personality",
      "Market Research: Desk Research, Target Audience Definition, SWOT Analysis",
      "Value Proposition",
      "Visual Identity Development: Institutional Identity (Logotype/Symbol), Typography System, Color Palette, Graphic Elements, Photographic Direction",
      "Brand Guidelines (~20-40 pages)",
      "3 Custom Brand Applications of Choice",
      "Social Media Visual Guidelines (*)",
      "Logo Animation (*)",
      "Landing Page Design (*)",
      "Initial Photoshoot (*)",
      "Curated Image Library (*)",
      "6 Custom Brand Applications of Choice (*)",
    ],
  },
  {
    id: "A.S/01",
    name: "MOTION GRAPHICS",
    description: "Bring your brand to life through movement.",
    items: [
      "Custom Logo Animation",
      "Social Media Motion Assets",
      "UI/UX Animations",
    ],
  },
  {
    id: "A.S/02",
    name: "PACKAGING",
    description: "Physical touchpoints that stand out on the shelf.",
    items: [
      "Label Design",
      "Box & Structure Design",
      "Production Ready Files",
    ],
  },
  {
    id: "A.S/03",
    name: "EDITORIAL",
    description: "Layouts that tell a cohesive visual story.",
    items: ["Lookbooks", "Brand Presentations", "Print Collateral"],
  },
  {
    id: "A.S/04",
    name: "ILLUSTRATION",
    description:
      "Illustration adds depth, personality and a distinctive visual language to a brand's communication. Whether used as a central element or as a supporting asset, custom illustration helps create more memorable, expressive and visually cohesive experiences while reinforcing a brand's identity in a unique and engaging way.",
    items: [
      "Custom brand illustrations",
      "Packaging and label artwork",
      "Editorial and publishing illustrations",
      "Merchandise and apparel graphics",
      "Icon systems and graphic elements",
      "Event and promotional artwork",
      "Character and mascot design",
      "Illustrated maps, patterns and compositions",
    ],
  },
];

export default function ServicesPage() {
  return <ServicesStack services={services} />;
}
