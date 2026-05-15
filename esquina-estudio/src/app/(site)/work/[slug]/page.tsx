import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/lib/sanity";
import { ALL_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY } from "@/lib/sanity.queries";
import { MOCK_PROJECTS, getMockProjectBySlug } from "@/lib/mock-data";
import { Project } from "@/types/project";
import ProjectDetailClient from "./ProjectDetailClient";

/* ── Static params generation ──────────────────────────────── */
export async function generateStaticParams() {
  try {
    if (!client) return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const projects = await client.fetch<any[]>(
      `*[_type == "project"]{ "slug": slug.current }`
    );

    if (!projects || projects.length === 0) {
      return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));
    }

    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));
  }
}

/* ── Dynamic metadata ──────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found — ESQUINA ESTUDIO™" };
  }

  return {
    title: `${project.title} — ESQUINA ESTUDIO™`,
    description: `${project.category} — ${project.services}`,
  };
}

/* ── Data fetching helper ──────────────────────────────────── */
async function getProject(slug: string): Promise<Project | null> {
  try {
    if (!client) {
      return getMockProjectBySlug(slug) ?? null;
    }

    const project = await client.fetch(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } }
    );

    if (!project) {
      return getMockProjectBySlug(slug) ?? null;
    }

    return project;
  } catch {
    return getMockProjectBySlug(slug) ?? null;
  }
}

/* ── Page component ────────────────────────────────────────── */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  // Find prev/next projects for navigation
  let allProjects: Project[] = [];
  try {
    if (client) {
      allProjects = await client.fetch(ALL_PROJECTS_QUERY, {}, {
        next: { revalidate: 60 },
      });
    }
  } catch {
    // ignore
  }
  if (!allProjects || allProjects.length === 0) {
    allProjects = MOCK_PROJECTS;
  }

  const currentIndex = allProjects.findIndex(
    (p) => p.slug.current === slug
  );
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  return (
    <ProjectDetailClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
    />
  );
}
