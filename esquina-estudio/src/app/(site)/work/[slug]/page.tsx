import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client, urlFor } from "@/lib/sanity";
import { ALL_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY } from "@/lib/sanity.queries";
import { MOCK_PROJECTS, getMockProjectBySlug } from "@/lib/mock-data";
import { Project } from "@/types/project";
import ProjectDetailClient from "./ProjectDetailClient";

export async function generateStaticParams() {
  try {
    if (!client) return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));

    const projects = await client.fetch<Array<{ slug: string }>>(
      `*[_type == "project"]{ "slug": slug.current }`,
    );

    if (!projects || projects.length === 0) {
      return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));
    }

    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return MOCK_PROJECTS.map((p) => ({ slug: p.slug.current }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const description = `${project.category} — ${project.services}`;
  const coverImageUrl = project.coverImage
    ? urlFor(project.coverImage).width(1200).height(630).url()
    : "";

  return {
    title: project.title,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
      images: coverImageUrl
        ? [
            {
              url: coverImageUrl,
              width: 1200,
              height: 630,
              alt: project.title,
            },
          ]
        : undefined,
    },
  };
}

async function getProject(slug: string): Promise<Project | null> {
  try {
    if (!client) {
      return getMockProjectBySlug(slug) ?? null;
    }

    const project = await client.fetch(
      PROJECT_BY_SLUG_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );

    if (!project) {
      return getMockProjectBySlug(slug) ?? null;
    }

    return project;
  } catch {
    return getMockProjectBySlug(slug) ?? null;
  }
}

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

  let allProjects: Project[] = [];
  try {
    if (client) {
      allProjects = await client.fetch(ALL_PROJECTS_QUERY, {}, {
        next: { revalidate: 60 },
      });
    }
  } catch {
    // Fallback handled below.
  }

  if (!allProjects || allProjects.length === 0) {
    allProjects = MOCK_PROJECTS;
  }

  const currentIndex = allProjects.findIndex((p) => p.slug.current === slug);
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
