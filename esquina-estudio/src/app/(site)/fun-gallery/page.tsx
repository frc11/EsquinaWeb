import { Metadata } from "next";
import { randomUUID } from "crypto";
import FunGallery from "@/components/sections/gallery/FunGallery";
import { client } from "@/lib/sanity";
import { FUN_GALLERY_PROJECTS_QUERY } from "@/lib/sanity.queries";
import {
  LOCAL_WORK_PROJECTS,
  withLocalProjectImages,
} from "@/lib/local-projects";
import { Project } from "@/types/project";

export const metadata: Metadata = {
  title: "Fun Gallery - ESQUINA ESTUDIO™",
  description:
    "A free-form visual gallery from ESQUINA ESTUDIO with images, references and studio moments.",
};
export const dynamic = "force-dynamic";

async function getGalleryProjects(): Promise<Project[]> {
  try {
    if (!client) return LOCAL_WORK_PROJECTS;

    const projects = await client.fetch(
      FUN_GALLERY_PROJECTS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );

    if (!projects || projects.length === 0) {
      return LOCAL_WORK_PROJECTS;
    }

    return withLocalProjectImages(projects);
  } catch {
    return LOCAL_WORK_PROJECTS;
  }
}

export default async function FunGalleryPage() {
  const projects = await getGalleryProjects();
  const randomSeed = randomUUID();

  return <FunGallery projects={projects} randomSeed={randomSeed} />;
}
