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
