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

// Projects with every image source needed by Fun Gallery
export const FUN_GALLERY_PROJECTS_QUERY = `
  *[_type == "project"] | order(order asc) {
    _id, title, slug, projectNumber, category, services, year,
    coverImage {
      ...,
      asset->
    },
    coverColor,
    content[] {
      _type,
      _key,
      ...,
      _type == "mediaItem" => {
        caption,
        file {
          ...,
          asset->
        }
      },
      _type == "dualMedia" => {
        left {
          ...,
          asset->
        },
        right {
          ...,
          asset->
        }
      },
      image {
        ...,
        asset->
      },
      images[] {
        ...,
        asset->
      },
      gallery[] {
        ...,
        asset->
      }
    }
  }
`;
