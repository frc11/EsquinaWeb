"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import {
  FUN_GALLERY_PATH,
  useFunGalleryReturnOnMount,
} from "@/lib/fun-gallery-return";
import { useLocale } from "@/lib/i18n";
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
  const { isPreloaderDone } = usePreloader();
  const { t } = useLocale();
  const pathname = usePathname();

  /*
    El link de vuelta aparece SOLO si a ESTE proyecto se llegó desde la Fun
    Gallery. La anotación la deja la galería al navegar y vive en la pestaña, no
    en el visitante: quien abre el proyecto desde Work, desde el menú o desde un
    link pegado no la tiene y no ve nada distinto. Se lee recién al montar, que
    es cuando existe `sessionStorage`, así que el servidor manda siempre la
    página sin el link y el cliente lo agrega antes de pintar.
  */
  const cameFromGallery = useFunGalleryReturnOnMount() === pathname;

  return (
    <motion.main
      className="min-h-screen overflow-visible"
      initial={{ opacity: 0 }}
      animate={
        isPreloaderDone
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ── Two-column editorial layout ──────────────────── */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 overflow-visible px-6 md:px-12 py-12 md:py-16">
        {/* LEFT COLUMN — Sticky Meta Info */}
        <div className="w-full md:w-[240px] flex-shrink-0 md:sticky md:top-48 self-start flex flex-col">
          <div className="font-body text-[17px] uppercase leading-relaxed text-off-black space-y-1">
            <p>{project.category}</p>
            <p>{project.services}</p>
            <p>{project.year}</p>
          </div>

          <h1 className="font-display text-[40px] uppercase leading-[1.05] tracking-tight text-off-black mt-24">
            {project.title}
          </h1>

          {/* Cuelga del título, con la escala y el gris de los links
              secundarios de la navegación de abajo: es una salida a mano, no un
              elemento que compita con el proyecto. */}
          {cameFromGallery && (
            <Link
              href={FUN_GALLERY_PATH}
              className="mt-12 w-fit font-body text-[13px] uppercase text-gray-brand tracking-wider hover:text-off-black transition-colors duration-300"
            >
              ← {t.work.backToGallery}
            </Link>
          )}
        </div>

        {/* RIGHT COLUMN — Main Content Area (slide-up only here, not on the sticky ancestor) */}
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={
            isPreloaderDone
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectContentRenderer content={project.content || []} />

          {/* ── Bottom Navigation (inside the content column) ──
              Living inside this column instead of as a sibling of the flex row
              makes the two-column row — the sticky aside's containing block —
              span the full page height. The aside then stays pinned to the
              bottom instead of drifting up once the shorter image stack ended. */}
          <nav className="mt-24 flex items-center justify-between border-t border-off-black/20 py-12">
        {/* Left / Center — All Projects link */}
        <Link
          href="/work"
          className="font-body text-[13px] uppercase text-gray-brand tracking-wider hover:text-off-black transition-colors duration-300"
        >
          {t.work.allProjects}
        </Link>

        {/* Right — Next Project */}
        {nextProject ? (
          <Link
            href={`/work/${nextProject.slug.current}`}
            className="group text-right"
          >
            <span className="font-body text-[13px] uppercase text-gray-brand tracking-wider block mb-1">
              {t.work.next} →
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
              {t.work.next} →
            </span>
            <span className="font-display text-[24px] uppercase text-off-black group-hover:text-gray-brand transition-colors duration-300">
              {prevProject.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
          </nav>
        </motion.div>
      </div>
    </motion.main>
  );
}
