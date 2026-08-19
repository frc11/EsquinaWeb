import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import project from "./schemas/project";
import funGalleryImage from "./schemas/funGalleryImage";

export default defineConfig({
  name: "esquina-estudio",
  title: "Esquina Estudio CMS",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: "production",
  basePath: "/studio",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [project, funGalleryImage],
  },
});
