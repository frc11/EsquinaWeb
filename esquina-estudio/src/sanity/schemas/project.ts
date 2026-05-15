import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "projectNumber",
      title: "Project Number (e.g. 01, 02)",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category (e.g. FOOD & BEVERAGES)",
      type: "string",
    }),
    defineField({
      name: "services",
      title: "Services (e.g. BRANDING / PACKAGING DESIGN)",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year (e.g. Y / 2025)",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image (shown in grid)",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverColor",
      title: "Cover Background Color (hex, optional)",
      type: "string",
      description:
        "Used when cover is a logo on solid background (e.g. Tukumi red #CC2200)",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    // Content for the project detail page
    defineField({
      name: "content",
      title: "Project Content",
      type: "array",
      of: [
        // Text block (30pt body text)
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        },
        // Single horizontal image or video
        {
          type: "object",
          name: "mediaItem",
          title: "Single Media (Image, GIF, or Video)",
          fields: [
            {
              name: "file",
              title: "Image/GIF",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "video",
              title: "Video URL (Vimeo/YouTube embed or direct .mp4)",
              type: "url",
            },
            {
              name: "caption",
              title: "Caption (optional)",
              type: "string",
            },
          ],
        },
        // Dual vertical image gallery (side by side)
        {
          type: "object",
          name: "dualMedia",
          title: "Dual Media (2 vertical images side by side)",
          fields: [
            {
              name: "left",
              title: "Left Image/GIF",
              type: "image",
              options: { hotspot: true },
            },
            {
              name: "right",
              title: "Right Image/GIF",
              type: "image",
              options: { hotspot: true },
            },
          ],
        },
      ],
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
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
