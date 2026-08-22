"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types/project";
import { urlFor } from "@/lib/sanity";
import { projectText } from "@/lib/project-text";
import { useLocale } from "@/lib/i18n";

interface ProjectCardProps {
  project: Project;
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

export default function ProjectCard({ project }: ProjectCardProps) {
  const { locale } = useLocale();
  const title = projectText(project, locale, "title");
  const category = projectText(project, locale, "category");
  const services = projectText(project, locale, "services");

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
        ? urlFor(project.coverImage).width(1200).height(960).url()
        : null;
  const contrastClass = getContrastClass(project.coverColor);

  return (
    <Link href={`/work/${project.slug.current}`} className="group block h-full">
      {/*
        La portada lleva el 5:4 propio debajo de `lg`, porque ahí la celda ya no
        lo impone: el texto pasa a vivir DEBAJO. De `lg` para arriba sigue
        llenando la celda, que es la que trae el ratio.
      */}
      <div
        className="relative aspect-[5/4] cursor-none overflow-hidden lg:aspect-auto lg:h-full"
        style={{ backgroundColor: project.coverColor || "transparent" }}
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
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

        {/*
          El overlay de hover es de escritorio y de `lg` para arriba: en touch
          el hover no existe, y este bloque tapa la portada entera con el
          `coverColor`, así que dejarlo «siempre visible» en mobile equivaldría
          a no mostrar nunca la portada. En mobile el mismo texto va debajo.
        */}
        <motion.div
          className={`absolute inset-0 hidden flex-col justify-between px-[9%] py-[11%] lg:flex ${contrastClass}`}
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
              {title}
            </h2>
            <p className="mt-6">
              {category}
            </p>
            <p className="mt-6 max-w-[220px]">
              {services}
            </p>
          </div>

          <div className="font-body text-[17px] uppercase leading-none">
            <p>
              {project.year}
            </p>
          </div>
        </motion.div>
      </div>

      {/*
        El texto del overlay, **siempre visible**, debajo de la portada (§3.2 de
        M1: el hover no existe en touch). Mismo contenido y mismo orden que el
        overlay; lo que cambia es la escala —15 px en vez de 17— y el aire, que
        acá es de lectura corrida y no de composición sobre una portada. El año
        comparte renglón con el número, que es donde queda sin pedir una línea
        propia.
      */}
      <div className="mt-3 font-body text-[15px] uppercase leading-[1.25] text-off-black lg:hidden">
        <p className="flex items-baseline justify-between gap-3">
          <span>{project.projectNumber}</span>
          <span>{project.year}</span>
        </p>
        <h2 className="mt-2 font-medium">{title}</h2>
        <p className="mt-1">{category}</p>
        <p className="mt-1">{services}</p>
      </div>
    </Link>
  );
}
