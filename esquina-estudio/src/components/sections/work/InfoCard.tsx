"use client";

import { Project } from "@/types/project";
import { motion } from "framer-motion";

interface InfoCardProps {
  project: Project;
}

export default function InfoCard({ project }: InfoCardProps) {
  return (
    <motion.div
      className="bg-beige border border-off-black p-8 aspect-[4/5] flex flex-col justify-between"
      key={project._id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="font-body text-body space-y-3">
        <span className="block text-gray-brand">{project.projectNumber}</span>
        <p className="font-medium">{project.title}</p>
        <p className="text-gray-brand">{project.category}</p>
        <p className="text-gray-brand leading-snug">{project.services}</p>
        <p className="text-gray-brand">{project.year}</p>
      </div>

      {/* Bottom decorative corner mark */}
      <div className="flex justify-end items-end">
        <span className="text-[11px] font-body text-gray-brand tracking-widest uppercase">
          esquina™
        </span>
      </div>
    </motion.div>
  );
}
