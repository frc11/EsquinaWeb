import { Metadata } from "next";
import FunGallery, {
  type FunGalleryImage,
} from "@/components/sections/gallery/FunGallery";
import { client } from "@/lib/sanity";
import { FUN_GALLERY_QUERY } from "@/lib/sanity.queries";

export const metadata: Metadata = {
  title: "Fun Gallery - ESQUINA ESTUDIO™",
  description:
    "A free-form visual gallery from ESQUINA ESTUDIO with images, references and studio moments.",
};

async function getGalleryImages(): Promise<FunGalleryImage[]> {
  try {
    if (!client) return [];

    const images = await client.fetch(
      FUN_GALLERY_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return Array.isArray(images) ? images : [];
  } catch {
    return [];
  }
}

export default async function FunGalleryPage() {
  const images = await getGalleryImages();

  return <FunGallery images={images} />;
}
