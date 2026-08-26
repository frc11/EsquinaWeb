import { defineType, defineField } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  // Cada par EN/ES viaja en su propio fieldset para que la pantalla de edición
  // no quede en una columna plana de trece campos.
  fieldsets: [
    { name: "nameGroup", title: "Project Name (English and Spanish)" },
    { name: "categoryGroup", title: "Category (English and Spanish)" },
    { name: "servicesGroup", title: "Services (English and Spanish)" },
    {
      name: "contentGroup",
      title: "Project Content (English composition, Spanish text)",
    },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Project Name",
      type: "string",
      fieldset: "nameGroup",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEs",
      title: "Project Name in Spanish",
      type: "string",
      fieldset: "nameGroup",
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
      fieldset: "categoryGroup",
    }),
    defineField({
      name: "categoryEs",
      title: "Category in Spanish (e.g. COMIDA Y BEBIDAS)",
      type: "string",
      fieldset: "categoryGroup",
    }),
    defineField({
      name: "services",
      title: "Services (e.g. BRANDING / PACKAGING DESIGN)",
      type: "string",
      fieldset: "servicesGroup",
    }),
    defineField({
      name: "servicesEs",
      title: "Services in Spanish (e.g. BRANDING / DISEÑO DE PACKAGING)",
      type: "string",
      fieldset: "servicesGroup",
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
    // ── El cuerpo del proyecto, bilingüe por composición + texto (M6/F3) ──
    //
    // `content` es la **composición**: párrafos e imágenes mezclados, en el
    // orden en que se ven. `contentEs` es **solo el texto**. Al renderizar en
    // castellano los párrafos salen de `contentEs` y las imágenes siguen
    // saliendo de `content`, en el mismo lugar.
    //
    // No se duplica el array entero a propósito: obligaría a las clientas a
    // volver a subir todas las imágenes en el campo nuevo, y cualquier cambio
    // futuro de una foto quedaría desincronizado entre los dos idiomas.
    //
    // El emparejamiento es **por posición entre los bloques de texto**: el
    // primer párrafo de acá reemplaza al primer párrafo de allá, el segundo al
    // segundo. Los bloques de imagen no cuentan. La regla, el fallback y el
    // porqué de esta forma están en `src/lib/project-text.ts`.
    defineField({
      name: "content",
      title: "Project Content",
      type: "array",
      fieldset: "contentGroup",
      description:
        "The body of the project page: text paragraphs and image blocks, in the order they appear. This field owns the composition — the Spanish version reuses these same images, in this same order.",
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
    defineField({
      name: "contentEs",
      title: "Project Content in Spanish (text only)",
      type: "array",
      fieldset: "contentGroup",
      description:
        "Only the text paragraphs, in the same order as above: the 1st paragraph here replaces the 1st paragraph above, the 2nd replaces the 2nd, and so on. Do not add images here — they come from the field above and stay exactly where they are. Any paragraph you leave out is shown in English.",
      of: [
        {
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
        },
      ],
      // Aviso —no error— cuando sobran párrafos: los que pasan de la cuenta no
      // se muestran, porque la composición la declara `content` y un párrafo de
      // más no tiene lugar donde caer sin mover una imagen. Que se vea en el
      // Studio y no en silencio.
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const spanish = Array.isArray(value) ? value.length : 0;
          const english = Array.isArray(context.document?.content)
            ? (context.document.content as Array<{ _type?: string }>).filter(
                (block) => block?._type === "block",
              ).length
            : 0;

          if (spanish > english) {
            return `There are ${spanish} paragraphs here but only ${english} text paragraph(s) in the English field, so the last ${spanish - english} will not be shown. The order of text and images is set by the English field.`;
          }

          return true;
        }).warning(),
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
