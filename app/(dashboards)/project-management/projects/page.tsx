"use client";

import * as React from "react";
import { ProjectsToolbar } from "@/components/project-management/projects/projects-toolbar";
import { ProjectsGrid } from "@/components/project-management/projects/projects-grid";
import { PROJECTS } from "@/lib/data/projects";

export default function ProjectListingPage() {
  return (
    <div className="flex-1 p-6 flex flex-col gap-8">
      <ProjectsToolbar />
      <ProjectsGrid projects={PROJECTS} />
    </div>
  );
}
