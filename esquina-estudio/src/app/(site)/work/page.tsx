import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { ALL_PROJECTS_QUERY } from "@/lib/sanity.queries";
import {
  LOCAL_WORK_PROJECTS,
  withLocalProjectImages,
} from "@/lib/local-projects";
import { Project } from "@/types/project";
import WorkGrid from "@/components/sections/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work — ESQUINA ESTUDIO™",
  description:
    "Selected projects by ESQUINA ESTUDIO™. Branding, packaging design, art direction, illustration and photography.",
};

async function getProjects(): Promise<Project[]> {
  try {
    if (!client) return LOCAL_WORK_PROJECTS;

    const projects = await client.fetch(ALL_PROJECTS_QUERY, {}, {
      next: { revalidate: 60 },
    });

    if (!projects || projects.length === 0) {
      return LOCAL_WORK_PROJECTS;
    }

    return withLocalProjectImages(projects);
  } catch {
    return LOCAL_WORK_PROJECTS;
  }
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="-mt-[var(--header-height)] pt-[var(--header-height)]">
      <WorkGrid projects={projects} />
    </main>
  );
}
