import { Metadata } from "next";
import FunGallery from "@/components/sections/gallery/FunGallery";
import GalleryNotice from "@/components/sections/gallery/GalleryNotice";
import { client } from "@/lib/sanity";
import { FUN_GALLERY_IMAGES_QUERY } from "@/lib/sanity.queries";
import { FunGalleryImage } from "@/types/fun-gallery-image";

export const metadata: Metadata = {
  title: "Fun Gallery - ESQUINA ESTUDIO™",
  description:
    "A free-form visual gallery from ESQUINA ESTUDIO with images, references and studio moments.",
};

/**
 * La ruta ya no declara `force-dynamic` ni sortea un `randomUUID()` por
 * request: cachea con el mismo patrón que `/work` —`revalidate: 60` en el
 * fetch, sin configuración de segmento— y el mapa se sortea con un seed
 * derivado del contenido (ver `getMapSeed`).
 *
 * Devuelve `null` tanto si falta el cliente de Sanity como si el fetch falla:
 * los dos casos terminan en la misma pantalla de error. **No hay fallback a
 * datos locales**: la galería ya no deriva de los proyectos.
 */
async function getGalleryImages(): Promise<FunGalleryImage[] | null> {
  if (!client) return null;

  try {
    const images = await client.fetch<FunGalleryImage[]>(
      FUN_GALLERY_IMAGES_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    return Array.isArray(images) ? images : null;
  } catch {
    return null;
  }
}

/**
 * Seed derivado del contenido: los identificadores de las imágenes, en el orden
 * en que las devuelve la query. El mismo contenido produce siempre la misma
 * composición —dos cargas seguidas caen en las mismas posiciones— y el sorteo
 * solo cambia cuando las clientas agregan, sacan o reordenan imágenes. Cambiar
 * la foto de una imagen ya cargada no mueve nada: el documento sigue siendo el
 * mismo. `FunGallery` lo hashea con FNV-1a antes de sembrar el PRNG.
 */
function getLayoutSeed(images: FunGalleryImage[]) {
  return images.map((image) => image._id).join("|");
}

export default async function FunGalleryPage() {
  const images = await getGalleryImages();

  // El texto de las dos pantallas lo pone `GalleryNotice`, que es de cliente y
  // por eso sigue al idioma; acá queda solo la decisión de cuál corresponde.
  if (!images) return <GalleryNotice variant="error" />;
  if (images.length === 0) return <GalleryNotice variant="empty" />;

  return <FunGallery images={images} randomSeed={getLayoutSeed(images)} />;
}
