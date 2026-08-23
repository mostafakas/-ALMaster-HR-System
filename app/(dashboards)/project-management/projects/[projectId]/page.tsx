"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { ProjectSubHeader } from "@/components/project-management/projects/project-sub-header";
import { OverviewStatsGrid } from "@/components/project-management/overview/overview-stats-grid";
import { ProjectDetailsCard } from "@/components/project-management/overview/project-details-card";
import { TasksBreakdownCard } from "@/components/project-management/overview/tasks-breakdown-card";
import { getProjectById } from "@/lib/data/projects";

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);
  const project = getProjectById(projectId);

  if (!project) notFound();

  return (
    <div className="flex-1 p-6 flex flex-col gap-10 overflow-auto">
      <ProjectSubHeader
        projectId={projectId}
        title={project.title}
        description={project.description}
        status={project.status}
      />

      <OverviewStatsGrid project={project} />

      <div className="h-px bg-secondary w-full" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 grow overflow-hidden">
        <ProjectDetailsCard project={project} />
        <TasksBreakdownCard project={project} />
      </div>
    </div>
  );
}
