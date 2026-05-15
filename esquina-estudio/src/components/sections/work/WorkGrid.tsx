"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";
import ProjectCard from "./ProjectCard";
import InfoCard from "./InfoCard";

interface WorkGridProps {
  projects: Project[];
}

export default function WorkGrid({ projects }: WorkGridProps) {
  const [hoveredProject, setHoveredProject] = useState<Project>(projects[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px] bg-off-black">
      {/* Info card — always first cell */}
      <InfoCard project={hoveredProject} />

      {/* Project image cells */}
      {projects.map((project, index) => (
        <RevealOnScroll key={project._id} delay={index * 0.1}>
          <ProjectCard project={project} onHover={setHoveredProject} />
        </RevealOnScroll>
      ))}
    </div>
  );
}
