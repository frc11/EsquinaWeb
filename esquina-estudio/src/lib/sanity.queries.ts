// All projects for the Work grid (ordered)
export const ALL_PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, coverColor,
    titleEs, categoryEs, servicesEs
  }
`;

// Single project by slug for detail page
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, content,
    titleEs, categoryEs, servicesEs
  }
`;

// Fun Gallery images: su propio tipo de contenido, ya no derivadas de project.
// El desempate es obligatorio, no decoración: `order` es opcional, y sin un
// orden total GROQ no garantiza una secuencia estable entre dos lecturas — y de
// esa secuencia sale el seed de la composición. Ante `order` repetido desempata
// `_createdAt`, así gana la que se cargó primero; `_id` queda como último
// recurso porque `_createdAt` tampoco es único por definición (dos documentos
// creados en el mismo milisegundo comparten marca).
export const FUN_GALLERY_IMAGES_QUERY = `
  *[_type == "funGalleryImage" && defined(image.asset)] | order(order asc, _createdAt asc, _id asc) {
    _id,
    title,
    altText,
    image,
    "projectSlug": linkedProject->slug.current
  }
`;

// Las cuatro portadas más recientes, para el cierre de `/services`.
//
// El criterio de «más reciente» es `_createdAt` descendente, que es el que quedó
// cerrado en B3.3: el campo `order` de `project` ordena la grilla de `/work` a
// gusto de las clientas y no tiene nada que ver con cuándo se cargó cada
// proyecto. `_id` desempata porque `_createdAt` no es único por definición —dos
// documentos creados en el mismo milisegundo comparten marca— y sin orden total
// GROQ no garantiza la misma secuencia entre dos lecturas.
//
// El filtro por `coverImage.asset` no es cosmético: la sección **son** las
// portadas, así que un proyecto sin portada no es candidato. En `project` solo
// `title` y `slug` son requeridos, así que el caso existe de verdad.
export const LATEST_PROJECTS_QUERY = `
  *[_type == "project" && defined(coverImage.asset)] | order(_createdAt desc, _id desc)[0...4] {
    _id, title, slug, coverImage, coverColor
  }
`;
