import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------ */
/*  Write-capable Sanity client (requires SANITY_API_WRITE_TOKEN)     */
/* ------------------------------------------------------------------ */
function getWriteClient() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !token) {
    throw new Error(
      "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local",
    );
  }

  return createClient({
    projectId,
    dataset: "production",
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}

/* ------------------------------------------------------------------ */
/*  Image-to-file mapping for the local /public/projects folder       */
/* ------------------------------------------------------------------ */
interface ImageMapping {
  filename: string;
  /** Resolved absolute path */
  absolutePath: string;
}

function resolveImage(filename: string): ImageMapping | null {
  // Try /public/projects first, then /Asset_ Imágenes
  const candidates = [
    path.join(/* turbopackIgnore: true */ process.cwd(), "public", "projects", filename),
    path.join(/* turbopackIgnore: true */ process.cwd(), "Asset_ Imágenes", filename),
  ];

  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return { filename, absolutePath: p };
    }
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Upload a local image to Sanity and return the asset reference     */
/* ------------------------------------------------------------------ */
async function uploadImage(
  client: ReturnType<typeof getWriteClient>,
  mapping: ImageMapping,
) {
  const buffer = fs.readFileSync(mapping.absolutePath);
  const asset = await client.assets.upload("image", buffer, {
    filename: mapping.filename,
  });

  return {
    _type: "image" as const,
    asset: {
      _type: "reference" as const,
      _ref: asset._id,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helper: create a Portable Text block                              */
/* ------------------------------------------------------------------ */
function textBlock(key: string, text: string) {
  return {
    _type: "block" as const,
    _key: key,
    style: "normal" as const,
    children: [{ _type: "span" as const, _key: `${key}-span`, text }],
    markDefs: [],
  };
}

/* ------------------------------------------------------------------ */
/*  Project definitions                                               */
/* ------------------------------------------------------------------ */
interface ProjectSeed {
  title: string;
  slug: string;
  projectNumber: string;
  category: string;
  services: string;
  year: string;
  order: number;
  coverColor?: string;
  /** Filename inside /public/projects (or /Asset_ Imágenes) */
  coverImageFile: string;
  /** Description text for the content body */
  description: string;
  /** Additional single images for mediaItem blocks */
  contentImages: string[];
  /** Pairs [left, right] for dualMedia blocks */
  dualImages: [string, string][];
}

const PROJECTS: ProjectSeed[] = [
  {
    title: "AKASHA BLENDS",
    slug: "akasha-blends",
    projectNumber: "01",
    category: "FOOD & BEVERAGES",
    services: "BRANDING / PACKAGING DESIGN / ILLUSTRATION / PHOTOGRAPHY",
    year: "Y / 2025",
    order: 1,
    coverColor: "#C4A77D",
    coverImageFile: "akasha-producto-2.jpg",
    description:
      "A sensory brand and packaging system for Akasha, built around botanical detail, texture, and product ritual. Every element—from label composition to color story—was designed to evoke warmth, intention, and craft.",
    contentImages: ["akasha-producto.png"],
    dualImages: [["akasha-producto-2.jpg", "akasha.png"]],
  },
  {
    title: "BROOK MOTORS",
    slug: "brook-motors",
    projectNumber: "02",
    category: "AUTOMOTIVE",
    services: "BRANDING / VISUAL IDENTITY / LOGOTYPE / ART DIRECTION",
    year: "Y / 2025",
    order: 2,
    coverColor: "#F3F3F3",
    coverImageFile: "brook-logo-texto.png",
    description:
      "A clean identity exploration centered on typography, restraint, and confident brand marks. Brook Motors demanded a visual language that felt engineered and precise, with every detail considered.",
    contentImages: ["brooks-logo.png"],
    dualImages: [],
  },
  {
    title: "TUKUMI TAKEAWAY",
    slug: "tukumi-takeaway",
    projectNumber: "03",
    category: "RESTAURANTS",
    services: "BRANDING / PACKAGING / SOCIAL MEDIA",
    year: "Y / 2025",
    order: 3,
    coverColor: "#DA291C",
    coverImageFile: "tukumi.jpg",
    description:
      "A vivid brand world built through illustration, color, and expressive packaging detail. Tukumi's identity brings energy to every touchpoint—from takeaway boxes to social content.",
    contentImages: [],
    dualImages: [],
  },
  {
    title: "MATSU",
    slug: "matsu",
    projectNumber: "04",
    category: "TECHNOLOGY",
    services: "BRANDING / WEB DESIGN",
    year: "Y / 2025",
    order: 4,
    coverColor: "#D9D9D9",
    coverImageFile: "matsu-compu.png",
    description:
      "A digital-first brand expression shaped through interface, composition, and quiet visual rhythm. Matsu's web presence balances minimalism with functional clarity.",
    contentImages: ["matsu.png"],
    dualImages: [],
  },
];

/* ------------------------------------------------------------------ */
/*  Main seeder handler                                               */
/* ------------------------------------------------------------------ */
export async function POST() {
  try {
    const client = getWriteClient();

    const results: Array<{ title: string; status: string; id?: string }> = [];

    for (const proj of PROJECTS) {
      // ── Duplicate check ────────────────────────────────────────
      const existing = await client.fetch<{ _id: string } | null>(
        `*[_type == "project" && slug.current == $slug][0]{ _id }`,
        { slug: proj.slug },
      );

      if (existing) {
        results.push({
          title: proj.title,
          status: "SKIPPED (already exists)",
          id: existing._id,
        });
        continue;
      }

      // ── Upload cover image ─────────────────────────────────────
      const coverMapping = resolveImage(proj.coverImageFile);
      if (!coverMapping) {
        results.push({
          title: proj.title,
          status: `FAILED — cover image not found: ${proj.coverImageFile}`,
        });
        continue;
      }

      const coverImageRef = await uploadImage(client, coverMapping);

      // ── Build content array ────────────────────────────────────
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const content: any[] = [];

      // Intro text block
      content.push(textBlock(`${proj.slug}-intro`, proj.description));

      // Single media items
      for (let idx = 0; idx < proj.contentImages.length; idx++) {
        const mapping = resolveImage(proj.contentImages[idx]);
        if (mapping) {
          const imgRef = await uploadImage(client, mapping);
          content.push({
            _type: "mediaItem",
            _key: `${proj.slug}-media-${idx}`,
            file: imgRef,
          });
        }
      }

      // Dual media items
      for (let idx = 0; idx < proj.dualImages.length; idx++) {
        const [leftFile, rightFile] = proj.dualImages[idx];
        const leftMapping = resolveImage(leftFile);
        const rightMapping = resolveImage(rightFile);
        if (leftMapping && rightMapping) {
          const leftRef = await uploadImage(client, leftMapping);
          const rightRef = await uploadImage(client, rightMapping);
          content.push({
            _type: "dualMedia",
            _key: `${proj.slug}-dual-${idx}`,
            left: leftRef,
            right: rightRef,
          });
        }
      }

      // ── Create document ────────────────────────────────────────
      const doc = await client.create({
        _type: "project",
        title: proj.title,
        slug: { _type: "slug", current: proj.slug },
        projectNumber: proj.projectNumber,
        category: proj.category,
        services: proj.services,
        year: proj.year,
        order: proj.order,
        coverImage: coverImageRef,
        ...(proj.coverColor ? { coverColor: proj.coverColor } : {}),
        content,
      });

      results.push({
        title: proj.title,
        status: "CREATED",
        id: doc._id,
      });
    }

    return NextResponse.json(
      { success: true, results },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

/* Only allow POST requests */
export async function GET() {
  return NextResponse.json(
    {
      message:
        "Send a POST request to this endpoint to seed Sanity. Make sure SANITY_API_WRITE_TOKEN is set in .env.local.",
    },
    { status: 405 },
  );
}
