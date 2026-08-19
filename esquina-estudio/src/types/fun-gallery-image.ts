import { SanityImageLike } from "./project";

/**
 * Documento `funGalleryImage` tal como lo devuelve
 * `FUN_GALLERY_IMAGES_QUERY`, no tal como se guarda: `projectSlug` es una
 * proyección desreferenciada, no un campo del schema.
 *
 * GROQ devuelve `null` explícito —no `undefined`— para los campos ausentes de
 * una proyección, así que los opcionales se tipan `| null`.
 *
 * `image` usa `Omit<..., "alt">` a propósito: el schema no le pone subcampo
 * `alt` a la imagen (el texto alternativo vive en `altText`, hermano suyo), y
 * declararlo repetiría la divergencia que el repo ya arrastra en `project`.
 */
export interface FunGalleryImage {
  _id: string;
  title: string;
  altText: string | null;
  image: Omit<SanityImageLike, "alt">;
  projectSlug: string | null;
}
