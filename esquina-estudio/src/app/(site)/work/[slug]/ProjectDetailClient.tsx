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
import { projectContent, projectText } from "@/lib/project-text";
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
  const { locale, t } = useLocale();
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
      // `svh` y no `screen` por lo mismo que el `<body>` (M3/F3): `min-h-screen`
      // es `100vh`, o sea la pantalla con la barra del navegador oculta, y en un
      // teléfono deja el documento más alto que lo que se ve. Acá la ficha
      // siempre supera el viewport, así que el piso no se nota — pero era el
      // último `100vh` del repo y la regla es no dejar ninguno.
      className="min-h-svh overflow-visible"
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
        {/* El aside ya iba arriba del contenido en una columna debajo de `md`
            (`flex-col`): lo que faltaba era la escala. */}
        <div className="w-full md:w-[240px] flex-shrink-0 md:sticky md:top-48 self-start flex flex-col">
          <div className="font-body text-[17px] uppercase leading-relaxed text-off-black space-y-1">
            <p>{projectText(project, locale, "category")}</p>
            <p>{projectText(project, locale, "services")}</p>
            <p>{project.year}</p>
          </div>

          <h1 className="mt-10 font-display text-[26px] uppercase leading-[1.05] tracking-tight text-off-black md:mt-24 md:text-[40px]">
            {projectText(project, locale, "title")}
          </h1>

          {/* Cuelga del título, con la escala y el gris de los links
              secundarios de la navegación de abajo: es una salida a mano, no un
              elemento que compita con el proyecto. */}
          {cameFromGallery && (
            <Link
              href={FUN_GALLERY_PATH}
              className="mt-8 flex w-fit items-center font-body text-[13px] uppercase text-gray-brand tracking-wider transition-colors duration-300 hover:text-off-black max-lg:min-h-[44px] md:mt-12"
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
          {/*
              El cuerpo bilingüe: los párrafos salen de `contentEs` cuando el
              sitio está en castellano y **las imágenes siguen saliendo de
              `content`, en su lugar original**. La regla de emparejamiento y el
              fallback viven en `project-text.ts`, al lado del de los otros tres
              campos: es el mismo sistema, no uno paralelo (M6/F3).
          */}
          <ProjectContentRenderer content={projectContent(project, locale)} />

          {/* ── Bottom Navigation (inside the content column) ──
              Living inside this column instead of as a sibling of the flex row
              makes the two-column row — the sticky aside's containing block —
              span the full page height. The aside then stays pinned to the
              bottom instead of drifting up once the shorter image stack ended. */}
          <nav className="mt-16 flex items-center justify-between gap-6 border-t border-off-black/20 py-10 md:mt-24 md:py-12">
        {/* Left / Center — All Projects link */}
        <Link
          href="/work"
          className="flex shrink-0 items-center font-body text-[13px] uppercase text-gray-brand tracking-wider transition-colors duration-300 hover:text-off-black max-lg:min-h-[44px]"
        >
          {t.work.allProjects}
        </Link>

        {/* Right — Next Project */}
        {nextProject ? (
          <Link
            href={`/work/${nextProject.slug.current}`}
            className="group flex flex-col items-end text-right max-lg:min-h-[44px] max-lg:justify-center"
          >
            <span className="font-body text-[13px] uppercase text-gray-brand tracking-wider block mb-1">
              {t.work.next} →
            </span>
            <span className="font-display text-[20px] uppercase text-off-black transition-colors duration-300 group-hover:text-gray-brand md:text-[24px]">
              {projectText(nextProject, locale, "title")}
            </span>
          </Link>
        ) : prevProject ? (
          <Link
            href={`/work/${prevProject.slug.current}`}
            className="group flex flex-col items-end text-right max-lg:min-h-[44px] max-lg:justify-center"
          >
            <span className="font-body text-[13px] uppercase text-gray-brand tracking-wider block mb-1">
              {t.work.next} →
            </span>
            <span className="font-display text-[20px] uppercase text-off-black transition-colors duration-300 group-hover:text-gray-brand md:text-[24px]">
              {projectText(prevProject, locale, "title")}
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
