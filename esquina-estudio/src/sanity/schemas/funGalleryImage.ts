import { defineType, defineField } from "sanity";

export default defineType({
  name: "funGalleryImage",
  title: "Fun Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image (PNG with transparent background)",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Name (e.g. Cocktail Hour napkins)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "altText",
      title: "Alt text (optional — describes the image for screen readers)",
      type: "string",
    }),
    defineField({
      name: "linkedProject",
      title: "Linked project (optional — makes the image clickable)",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    // Sanity resuelve referencias en `select`: `linkedProject.title` trae el
    // nombre del proyecto vinculado sin `prepare()` (createPathObserver.ts).
    select: { title: "title", subtitle: "linkedProject.title", media: "image" },
  },
});
