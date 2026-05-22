"use client";

import { motion } from "framer-motion";
import { usePreloader } from "@/components/providers/PreloaderProvider";
import { Project } from "@/types/project";
import ProjectCard from "./ProjectCard";

interface WorkGridProps {
  projects: Project[];
}

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const DIRECTIONS = [
  { x: -60, y: 0 },
  { x: 60, y: 0 },
  { x: 0, y: 60 },
] as const;

export default function WorkGrid({ projects }: WorkGridProps) {
  const { isPreloaderDone } = usePreloader();

  return (
    <div className="flex flex-wrap gap-6 bg-off-white p-6">
      {projects.map((project, index) => {
        const initialDirection = DIRECTIONS[index % DIRECTIONS.length];

        return (
          <motion.div
            key={project._id}
            className="h-[350px] min-w-[300px] flex-[1_1_calc(33.333%-1.5rem)] overflow-hidden cursor-none md:min-w-[calc(33.333%-1.5rem)]"
            initial={{ opacity: 0, ...initialDirection }}
            whileInView={
              isPreloaderDone
                ? { opacity: 1, x: 0, y: 0 }
                : { opacity: 0, ...initialDirection }
            }
            viewport={{ once: true, margin: "0px 0px -100px 0px" }}
            transition={{
              duration: 0.8,
              ease: EASE,
              delay: index < 3 ? index * 0.1 : 0,
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        );
      })}
    </div>
  );
}
