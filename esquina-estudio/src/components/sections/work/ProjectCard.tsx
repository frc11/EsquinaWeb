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
  function getContrastClass(hexColor?: string) {
    if (!hexColor) return "text-off-black";
    const hex = hexColor.replace("#", "");
    // Handle shorthand hex like #000.
    const fullHex =
      hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "text-off-black" : "text-off-white";
  }

  const imageUrl =
    typeof project.coverImage === "string"
      ? project.coverImage
      : project.coverImage
        ? urlFor(project.coverImage).width(1200).height(1600).url()
        : null;
  const contrastClass = getContrastClass(project.coverColor);

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
          className={`absolute inset-0 flex flex-col justify-between p-8 ${contrastClass}`}
          style={{ backgroundColor: project.coverColor || "#EFEEDA" }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <div className="font-body text-[17px] uppercase leading-[1.15]">
            <p className="leading-none">
              {project.projectNumber}
            </p>
            <h2 className="mt-6 font-body text-[17px] font-medium leading-[1.15]">
              {project.title}
            </h2>
            <p className="mt-6">
              {project.category}
            </p>
            <p className="mt-6 max-w-[220px]">
              {project.services}
            </p>
          </div>

          <div className="font-body text-[17px] uppercase leading-none">
            <p>
              {project.year}
            </p>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
