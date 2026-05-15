import { Project } from "@/types/project";

/**
 * Mock Portable Text content blocks for development.
 */
function mockTextBlock(text: string) {
  return {
    _type: "block" as const,
    _key: Math.random().toString(36).slice(2),
    style: "normal",
    children: [{ _type: "span", text }],
    markDefs: [],
  };
}

/**
 * Mock project data for development.
 * Used as fallback when Sanity returns no results.
 */
export const MOCK_PROJECTS: Project[] = [
  {
    _id: "mock-1",
    title: "AKASHA BLENDS",
    slug: { current: "akasha-blends" },
    projectNumber: "01",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / PACKAGING DESIGN / ILLUSTRATION / PHOTOGRAPHY",
    year: "Y / 2025",
    coverImage: null,
    coverColor: "#C4A77D",
    content: [
      mockTextBlock(
        "Akasha Blends is an artisanal tea brand rooted in Ayurvedic tradition. We crafted a visual identity that bridges ancient wisdom with contemporary aesthetics, creating a sensory experience from shelf to cup."
      ),
      mockTextBlock(
        "The packaging system uses earth-toned palettes and hand-drawn botanical illustrations to communicate the organic, handcrafted nature of each blend."
      ),
    ],
  },
  {
    _id: "mock-2",
    title: "NÓMADA STUDIO",
    slug: { current: "nomada-studio" },
    projectNumber: "02",
    category: "ARCHITECTURE",
    services: "BRANDING / WEB DESIGN / ART DIRECTION",
    year: "Y / 2024",
    coverImage: null,
    coverColor: "#8B9D83",
    content: [
      mockTextBlock(
        "Nómada is a boutique architecture studio specializing in sustainable residential design. Their brand needed to reflect the fluidity and intentionality of their work — spaces that feel both rooted and free."
      ),
      mockTextBlock(
        "We developed a restrained typographic identity paired with a modular grid system that mirrors their architectural philosophy."
      ),
    ],
  },
  {
    _id: "mock-3",
    title: "TERRACOTA LIVING",
    slug: { current: "terracota-living" },
    projectNumber: "03",
    category: "LIFESTYLE",
    services: "BRANDING / PACKAGING DESIGN / SOCIAL MEDIA",
    year: "Y / 2024",
    coverImage: null,
    coverColor: "#C97C5D",
    content: [
      mockTextBlock(
        "Terracota Living is a home goods brand celebrating Latin American craftsmanship. Every piece tells a story of heritage, materiality, and the hands that shaped it."
      ),
    ],
  },
  {
    _id: "mock-4",
    title: "LUNA BOTANICAL",
    slug: { current: "luna-botanical" },
    projectNumber: "04",
    category: "BEAUTY & WELLNESS",
    services: "BRANDING / PACKAGING DESIGN / PHOTOGRAPHY",
    year: "Y / 2024",
    coverImage: null,
    coverColor: "#A8B5A2",
    content: [
      mockTextBlock(
        "Luna Botanical produces small-batch skincare using locally sourced botanicals. The brand identity draws from lunar cycles and natural rhythms, evoking a sense of ritual in daily skincare."
      ),
    ],
  },
  {
    _id: "mock-5",
    title: "VERSO EDITORIAL",
    slug: { current: "verso-editorial" },
    projectNumber: "05",
    category: "EDITORIAL",
    services: "EDITORIAL DESIGN / ART DIRECTION / TYPOGRAPHY",
    year: "Y / 2023",
    coverImage: null,
    coverColor: "#D4C5B9",
    content: [
      mockTextBlock(
        "Verso is an independent publishing house focused on contemporary Latin American literature. We designed their editorial system to honor the written word while bringing a bold, modern visual language to each release."
      ),
    ],
  },
  {
    _id: "mock-6",
    title: "SAVIA ORGÁNICA",
    slug: { current: "savia-organica" },
    projectNumber: "06",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / PACKAGING DESIGN / ILLUSTRATION",
    year: "Y / 2023",
    coverImage: null,
    coverColor: "#7A8B6F",
    content: [
      mockTextBlock(
        "Savia Orgánica is an organic juice brand committed to regenerative agriculture. The identity needed to feel as alive and vibrant as the ingredients themselves."
      ),
    ],
  },
  {
    _id: "mock-7",
    title: "COBRE JOYERÍA",
    slug: { current: "cobre-joyeria" },
    projectNumber: "07",
    category: "FASHION & JEWELRY",
    services: "BRANDING / PHOTOGRAPHY / WEB DESIGN",
    year: "Y / 2023",
    coverImage: null,
    coverColor: "#B87351",
    content: [
      mockTextBlock(
        "Cobre is a jewelry line that transforms raw copper into wearable sculpture. The brand captures the warmth of the material and the precision of the craft."
      ),
    ],
  },
  {
    _id: "mock-8",
    title: "RAÍZ CAFÉ",
    slug: { current: "raiz-cafe" },
    projectNumber: "08",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / INTERIOR DESIGN / PACKAGING DESIGN",
    year: "Y / 2022",
    coverImage: null,
    coverColor: "#6B4F3A",
    content: [
      mockTextBlock(
        "Raíz is a specialty coffee roastery connecting farm to cup. We built a brand ecosystem spanning packaging, café interiors, and digital presence — all grounded in the idea of returning to the root."
      ),
    ],
  },
];

/**
 * Find a mock project by its slug.
 */
export function getMockProjectBySlug(slug: string): Project | undefined {
  return MOCK_PROJECTS.find((p) => p.slug.current === slug);
}
