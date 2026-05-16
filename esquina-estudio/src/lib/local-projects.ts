import { Project } from "@/types/project";

function textBlock(key: string, text: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal",
    children: [{ _type: "span", text }],
    markDefs: [],
  };
}

export const LOCAL_WORK_PROJECTS: Project[] = [
  {
    _id: "local-akasha",
    title: "AKASHA BLENDS",
    slug: { current: "akasha-blends" },
    projectNumber: "01",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / PACKAGING DESIGN / PHOTOGRAPHY",
    year: "Y / 2025",
    coverImage: "/projects/akasha-producto-2.jpg",
    coverColor: "#C4A77D",
    content: [
      textBlock(
        "local-akasha-intro",
        "A sensory brand and packaging system for Akasha, built around botanical detail, texture, and product ritual.",
      ),
    ],
  },
  {
    _id: "local-brook",
    title: "BROOK",
    slug: { current: "brook" },
    projectNumber: "02",
    category: "BRANDING",
    services: "VISUAL IDENTITY / LOGOTYPE / ART DIRECTION",
    year: "Y / 2025",
    coverImage: "/projects/brook-logo-texto.png",
    coverColor: "#F3F3F3",
    content: [
      textBlock(
        "local-brook-intro",
        "A clean identity exploration centered on typography, restraint, and confident brand marks.",
      ),
    ],
  },
  {
    _id: "local-brooks",
    title: "BROOKS",
    slug: { current: "brooks" },
    projectNumber: "03",
    category: "BRANDING",
    services: "LOGO DESIGN / IDENTITY SYSTEM",
    year: "Y / 2025",
    coverImage: "/projects/brooks-logo.png",
    coverColor: "#F3F3F3",
    content: [
      textBlock(
        "local-brooks-intro",
        "A brand mark study with a strong graphic presence and editorial balance.",
      ),
    ],
  },
  {
    _id: "local-matsu",
    title: "MATSU",
    slug: { current: "matsu" },
    projectNumber: "04",
    category: "DIGITAL / BRANDING",
    services: "WEB DESIGN / ART DIRECTION / VISUAL IDENTITY",
    year: "Y / 2024",
    coverImage: "/projects/matsu-compu.png",
    coverColor: "#D9D9D9",
    content: [
      textBlock(
        "local-matsu-intro",
        "A digital-first brand expression shaped through interface, composition, and quiet visual rhythm.",
      ),
    ],
  },
  {
    _id: "local-matsu-identity",
    title: "MATSU IDENTITY",
    slug: { current: "matsu-identity" },
    projectNumber: "05",
    category: "BRANDING",
    services: "IDENTITY SYSTEM / ART DIRECTION",
    year: "Y / 2024",
    coverImage: "/projects/matsu.png",
    coverColor: "#D9D9D9",
    content: [
      textBlock(
        "local-matsu-identity-intro",
        "A visual identity system extending the Matsu world through typography, imagery, and composition.",
      ),
    ],
  },
  {
    _id: "local-romar",
    title: "ROMAR",
    slug: { current: "romar" },
    projectNumber: "06",
    category: "BRANDING",
    services: "VISUAL IDENTITY / ART DIRECTION",
    year: "Y / 2024",
    coverImage: "/projects/romar.jpg",
    coverColor: "#BFB8A8",
    content: [
      textBlock(
        "local-romar-intro",
        "A grounded identity with a tactile visual language and strong brand atmosphere.",
      ),
    ],
  },
  {
    _id: "local-tukumi",
    title: "TUKUMI",
    slug: { current: "tukumi" },
    projectNumber: "07",
    category: "BRANDING",
    services: "PACKAGING / ILLUSTRATION / ART DIRECTION",
    year: "Y / 2024",
    coverImage: "/projects/tukumi.jpg",
    coverColor: "#EFEEDA",
    content: [
      textBlock(
        "local-tukumi-intro",
        "A vivid brand world built through illustration, color, and expressive packaging detail.",
      ),
    ],
  },
  {
    _id: "local-akasha-packaging",
    title: "AKASHA PACKAGING",
    slug: { current: "akasha-packaging" },
    projectNumber: "08",
    category: "PACKAGING",
    services: "PACKAGING DESIGN / PHOTOGRAPHY",
    year: "Y / 2025",
    coverImage: "/projects/akasha-producto.png",
    coverColor: "#C4A77D",
    content: [
      textBlock(
        "local-akasha-packaging-intro",
        "A closer look at the Akasha packaging system through product-focused imagery.",
      ),
    ],
  },
];

const LOCAL_PROJECT_IMAGE_MATCHERS: Array<[string, string]> = [
  ["akasha-packaging", "/projects/akasha-producto.png"],
  ["akasha", "/projects/akasha-producto-2.jpg"],
  ["brooks", "/projects/brooks-logo.png"],
  ["brook", "/projects/brook-logo-texto.png"],
  ["matsu-identity", "/projects/matsu.png"],
  ["matsu", "/projects/matsu-compu.png"],
  ["romar", "/projects/romar.jpg"],
  ["tukumi", "/projects/tukumi.jpg"],
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function getLocalProjectBySlug(slug: string) {
  return LOCAL_WORK_PROJECTS.find((project) => project.slug.current === slug);
}

export function getLocalProjectImage(project: Project) {
  const key = normalize(`${project.slug.current} ${project.title}`);
  return LOCAL_PROJECT_IMAGE_MATCHERS.find(([matcher]) =>
    key.includes(matcher),
  )?.[1];
}

export function withLocalProjectImages(projects: Project[]) {
  return projects.map((project) => {
    if (project.coverImage) return project;

    const coverImage = getLocalProjectImage(project);

    if (!coverImage) return project;

    return {
      ...project,
      coverImage,
    };
  });
}
