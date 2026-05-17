"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { urlFor } from "@/lib/sanity";

interface ProjectCardProps {
  project: Project;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ProjectCard({ project }: ProjectCardProps) {
  const imageUrl =
    typeof project.coverImage === "string"
      ? project.coverImage
      : project.coverImage
        ? urlFor(project.coverImage).width(1200).height(1600).url()
        : null;

  return (
    <Link href={`/work/${project.slug.current}`} className="group block h-full">
      <div
        className="relative h-full cursor-none overflow-hidden"
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

        {!imageUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none font-display text-[80px] font-bold text-off-white/20">
              {project.projectNumber}
            </span>
          </div>
        )}

        <motion.div
          className="absolute inset-0 flex flex-col justify-between bg-beige p-8"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="font-body text-[17px] uppercase leading-[1.15] text-off-black">
            <p className="leading-none">
              {project.projectNumber}
            </p>
            <h2 className="mt-6 font-body text-[17px] font-medium leading-[1.15] text-off-black">
              {project.title}
            </h2>
            <p className="mt-6 text-off-black">
              {project.category}
            </p>
            <p className="mt-6 max-w-[220px] text-off-black">
              {project.services}
            </p>
          </div>

          <div className="font-body text-[17px] uppercase leading-none text-off-black">
            <p>
              {project.year}
            </p>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
