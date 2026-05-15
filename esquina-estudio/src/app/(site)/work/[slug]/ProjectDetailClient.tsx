"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import ProjectContentRenderer from "@/components/ui/ProjectContentRenderer";

interface ProjectDetailClientProps {
  project: Project;
  prevProject: Project | null;
  nextProject: Project | null;
}

export default function ProjectDetailClient({
  project,
  prevProject,
  nextProject,
}: ProjectDetailClientProps) {
  return (
    <motion.main
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Two-column layout ─────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 px-6 md:px-12 py-12 md:py-16">
        {/* Left column — sticky project meta */}
        <div className="w-full md:w-[220px] flex-shrink-0 md:sticky md:top-24 self-start">
          <div className="font-body text-body space-y-4 text-gray-brand">
            <p>{project.category}</p>
            <p className="leading-snug">{project.services}</p>
            <p>{project.year}</p>
          </div>
          <h1 className="font-display text-[40px] md:text-[52px] uppercase mt-8 text-off-black leading-[1.05] tracking-tight">
            {project.title}
          </h1>
        </div>

        {/* Right column — content */}
        <div className="flex-1 max-w-[800px]">
          <ProjectContentRenderer content={project.content || []} />
        </div>
      </div>

      {/* ── Prev / Next navigation ────────────────────────── */}
      <nav className="border-t border-off-black/10 px-6 md:px-12 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {prevProject ? (
            <Link
              href={`/work/${prevProject.slug.current}`}
              className="group text-left"
            >
              <span className="text-[13px] text-gray-brand font-body uppercase tracking-wider block mb-2">
                ← Previous
              </span>
              <span className="font-body text-body text-off-black group-hover:text-gray-brand transition-colors duration-300">
                {prevProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/work"
            className="text-[13px] text-gray-brand font-body uppercase tracking-wider hover:text-off-black transition-colors duration-300 self-center"
          >
            All Projects
          </Link>

          {nextProject ? (
            <Link
              href={`/work/${nextProject.slug.current}`}
              className="group text-left md:text-right"
            >
              <span className="text-[13px] text-gray-brand font-body uppercase tracking-wider block mb-2">
                Next →
              </span>
              <span className="font-body text-body text-off-black group-hover:text-gray-brand transition-colors duration-300">
                {nextProject.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </nav>
    </motion.main>
  );
}
