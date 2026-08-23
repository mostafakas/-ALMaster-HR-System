"use client";

import * as React from "react";
import { ProjectCard } from "./project-card";
import type { ProjectRecord } from "@/lib/data/projects";

interface ProjectsGridProps {
  projects: ProjectRecord[];
}

/** Responsive 1- / 2-column grid of project cards. */
export function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
