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

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
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
          className="aspect-square cursor-none overflow-hidden"
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </motion.div>
  );
}
