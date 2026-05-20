import { Metadata } from "next";
import type { ServiceContent } from "@/components/sections/services/ServicesStack";
import ServicesPageClient from "./ServicesPageClient";

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
    description: "Motion graphics is an animation\ntechnique that combines design\nand movement to communicate\nideas in a clear, engaging and\ndynamic way.\n\nIt is a key tool for enhancing\nvisual identity, standing out\nacross digital media and formats,\nand creating high-impact content\n— ideal for promoting products,\nservices or projects in an\neffective and original way.\n\nApplications may include:",
    items: [
      "Digital screens and display content",
      "Social media content and campaigns",
      "Brand launch videos",
      "Institutional and corporate videos",
      "Event visuals and presentations",
      "Product or service promotion",
      "Broadcast graphics and titling",
      "Animated logos and brand assets",
    ],
  },
  {
    id: "A.S/02",
    name: "PACKAGING",
    description: "Packaging design transforms a\nproduct’s container into a key\ntouchpoint between the brand\nand its audience.\n\nThrough typography, color,\nillustration and visual\ncomposition, it communicates\nthe product’s attributes while\nreinforcing the brand’s identity.\n\nProfessional packaging design\ncaptures attention within\nseconds, builds trust,\ndifferentiates the product from\ncompetitors and influences\npurchasing decisions through a\nstrong and memorable visual\npresence.\n\nApplications may include:",
    items: [
      "Custom illustrated packaging concepts",
      "Merchandise and branded products",
      "Shipping and unboxing experiences",
      "Product packaging systems",
    ],
  },
  {
    id: "A.S/03",
    name: "EDITORIAL",
    description: "Creative editorial design\ntransforms information into\nvisually compelling experiences.\n\nThrough thoughtful layouts,\ntypography and visual\nstorytelling, we create pieces\nthat not only communicate\nclearly, but also capture attention\nand reinforce a brand’s identity\nacross both print and digital\nformats.\n\nApplications may include:",
    items: [
      "Brand and corporate brochures",
      "Editorial magazines",
      "Product catalogs and lookbooks",
      "Menus",
      "Portfolios",
      "Printed campaigns and promotional materials",
      "Annual reports and institutional documents",
      "Event programs and informational guides",
      "Digital editorial layouts and interactive PDFs",
    ],
  },
  {
    id: "A.S/04",
    name: "ILLUSTRATION",
    description: "Illustration adds depth,\npersonality and a distinctive\nvisual language to a brand’s\ncommunication.\n\nWhether used as a central\nelement or as a supporting asset,\ncustom illustration helps create\nmore memorable, expressive and\nvisually cohesive experiences\nwhile reinforcing a brand’s\nidentity in a unique and engaging\nway.\n\nApplications may include:",
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
  return <ServicesPageClient services={services} />;
}
