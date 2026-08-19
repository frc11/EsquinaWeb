"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

interface WorkGridProps {
  projects: Project[];
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Duracion de entrada de cada tarjeta. El stagger se deriva de ella (mitad)
// para que la tarjeta n+1 arranque cuando la n va por la mitad de su animacion:
// asi la secuencia se solapa y no se puede desincronizar al retocar un solo numero.
const ITEM_DURATION = 0.45;
const ITEM_STAGGER = ITEM_DURATION / 2;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: ITEM_STAGGER } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: ITEM_DURATION, ease: EASE } },
};

export default function WorkGrid({ projects }: WorkGridProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { isPreloaderDone } = usePreloader();
  const reduce = useReducedMotion();
  const reveal = isPreloaderDone && inView;

  return (
    <motion.div
      ref={ref}
      className="grid grid-cols-1 gap-6 bg-off-white p-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={reduce ? undefined : containerVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : reveal ? "visible" : "hidden"}
    >
      {projects.map((project) => (
        <motion.div
          key={project._id}
          variants={reduce ? undefined : itemVariants}
          className="aspect-[5/4] cursor-none overflow-hidden"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
