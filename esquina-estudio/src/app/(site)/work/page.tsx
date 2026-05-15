import { Metadata } from "next";
import { client } from "@/lib/sanity";
import { ALL_PROJECTS_QUERY } from "@/lib/sanity.queries";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { Project } from "@/types/project";
import WorkGrid from "@/components/sections/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work — ESQUINA ESTUDIO™",
  description:
    "Selected projects by ESQUINA ESTUDIO™. Branding, packaging design, art direction, illustration and photography.",
};

async function getProjects(): Promise<Project[]> {
  try {
    if (!client) return MOCK_PROJECTS;

    const projects = await client.fetch(ALL_PROJECTS_QUERY, {}, {
      next: { revalidate: 60 },
    });

    if (!projects || projects.length === 0) {
      return MOCK_PROJECTS;
    }

    return projects;
  } catch {
    return MOCK_PROJECTS;
  }
}

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <main className="-mt-[72px] pt-[72px]">
      <WorkGrid projects={projects} />
    </main>
  );
}
