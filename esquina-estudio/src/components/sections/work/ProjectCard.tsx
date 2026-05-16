"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { urlFor } from "@/lib/sanity";

interface ProjectCardProps {
  project: Project;
  onHover: (project: Project) => void;
}

export default function ProjectCard({ project, onHover }: ProjectCardProps) {
  const imageUrl =
    typeof project.coverImage === "string"
      ? project.coverImage
      : project.coverImage
        ? urlFor(project.coverImage).width(900).height(1125).url()
        : null;

  return (
    <Link href={`/work/${project.slug.current}`} className="group">
      <div
        className="relative overflow-hidden aspect-[4/5] cursor-none"
        onMouseEnter={() => onHover(project)}
        style={{ backgroundColor: project.coverColor || "transparent" }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}

        {/* Color fill fallback when no image — shows project initials */}
        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-off-white/20 font-display text-[80px] font-bold select-none">
              {project.projectNumber}
            </span>
          </div>
        )}

        {/* Hover overlay with project info */}
        <motion.div
          className="absolute inset-0 bg-off-black/80 flex flex-col justify-end p-6"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-off-white font-body text-body">{project.title}</p>
          <p className="text-off-white/60 font-body text-[13px] mt-1">
            {project.category}
          </p>
        </motion.div>
      </div>
    </Link>
  );
}
