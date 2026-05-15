import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const isValidProjectId = /^[a-z0-9-]+$/.test(projectId) && projectId !== "YOUR_PROJECT_ID";

export const client = isValidProjectId
  ? createClient({
      projectId,
      dataset: "production",
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = isValidProjectId && client ? imageUrlBuilder(client) : null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const urlFor = (source: any) => {
  if (!builder) {
    // Return a stub that produces an empty string — the component
    // will treat it as "no image" and show the fallback.
    return { width: () => ({ url: () => "" }), url: () => "" };
  }
  return builder.image(source);
};
