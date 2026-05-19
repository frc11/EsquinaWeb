"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
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
  const pageRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    const restoreStyles: Array<() => void> = [];
    let element = page.parentElement;

    while (element && element !== document.body) {
      const styles = window.getComputedStyle(element);
      const hasStickyBlockingOverflow = [
        styles.overflow,
        styles.overflowX,
        styles.overflowY,
      ].some((value) => value === "hidden" || value === "clip");

      if (hasStickyBlockingOverflow) {
        const target = element;
        const previousOverflow = target.style.overflow;
        const previousOverflowX = target.style.overflowX;
        const previousOverflowY = target.style.overflowY;

        target.style.overflow = "visible";
        target.style.overflowX = "visible";
        target.style.overflowY = "visible";

        restoreStyles.push(() => {
          target.style.overflow = previousOverflow;
          target.style.overflowX = previousOverflowX;
          target.style.overflowY = previousOverflowY;
        });
      }

      element = element.parentElement;
    }

    return () => {
      restoreStyles.forEach((restoreStyle) => restoreStyle());
    };
  }, []);

  return (
    <motion.main
      ref={pageRef}
      className="min-h-screen overflow-visible"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Two-column editorial layout ──────────────────── */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 overflow-visible px-6 md:px-12 py-12 md:py-16">
        {/* LEFT COLUMN — Sticky Meta Info */}
        <div className="w-full md:w-[240px] flex-shrink-0 md:sticky md:top-32 self-start flex flex-col">
          <div className="font-body text-[17px] uppercase leading-relaxed text-off-black space-y-1">
            <p>{project.category}</p>
            <p>{project.services}</p>
            <p>{project.year}</p>
          </div>

          <h1 className="font-display text-[40px] uppercase leading-[1.05] tracking-tight text-off-black mt-24">
            {project.title}
          </h1>
        </div>

        {/* RIGHT COLUMN — Main Content Area */}
        <div className="flex-1 w-full">
          <ProjectContentRenderer content={project.content || []} />
        </div>
      </div>

      {/* ── Bottom Navigation ────────────────────────────── */}
      <nav className="flex items-center justify-between py-12 border-t border-off-black/20 mt-24 mx-6 md:mx-12">
        {/* Left / Center — All Projects link */}
        <Link
          href="/work"
          className="font-body text-[13px] uppercase text-gray-brand tracking-wider hover:text-off-black transition-colors duration-300"
        >
          All Projects
        </Link>

        {/* Right — Next Project */}
        {nextProject ? (
          <Link
            href={`/work/${nextProject.slug.current}`}
            className="group text-right"
          >
            <span className="font-body text-[13px] uppercase text-gray-brand tracking-wider block mb-1">
              Next →
            </span>
            <span className="font-display text-[24px] uppercase text-off-black group-hover:text-gray-brand transition-colors duration-300">
              {nextProject.title}
            </span>
          </Link>
        ) : prevProject ? (
          <Link
            href={`/work/${prevProject.slug.current}`}
            className="group text-right"
          >
            <span className="font-body text-[13px] uppercase text-gray-brand tracking-wider block mb-1">
              Next →
            </span>
            <span className="font-display text-[24px] uppercase text-off-black group-hover:text-gray-brand transition-colors duration-300">
              {prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </motion.main>
  );
}
