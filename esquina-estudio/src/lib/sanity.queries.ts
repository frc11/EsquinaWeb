// All projects for the Work grid (ordered)
export const ALL_PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, coverColor
  }
`;

// Single project by slug for detail page
export const PROJECT_BY_SLUG_QUERY = `
  *[_type == "project" && slug.current == $slug][0] {
    _id, title, slug, projectNumber, category, services, year,
    coverImage, content
  }
`;

// Fun gallery images
export const FUN_GALLERY_QUERY = `
  *[_type == "funGalleryImage"] | order(order asc) {
    _id, image, alt
  }
`;

// All services
export const ALL_SERVICES_QUERY = `
  *[_type == "service"] | order(order asc) {
    _id, title, description, items, gallery
  }
`;
