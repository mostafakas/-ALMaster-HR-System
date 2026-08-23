"use client";

import * as React from "react";
import { ProjectSubHeader } from "@/components/project-management/projects/project-sub-header";
import { getProjectMeta } from "@/lib/data/projects";

interface SubTabPlaceholderProps {
  params: { projectId: string };
  title: string;
}

/**
 * Renders the standard project sub-header plus an empty-state card.
 * Used for the not-yet-built tabs (Activity, Team, Files).
 */
export default function SubTabPlaceholder({
  params,
  title,
}: SubTabPlaceholderProps) {
  const meta = getProjectMeta(params.projectId);

  return (
    <div className="flex-1 p-6 flex flex-col gap-10 overflow-auto">
      <ProjectSubHeader
        projectId={params.projectId}
        title={meta.title}
        description={meta.description}
      />

      <div className="flex flex-col items-center justify-center py-20 gap-4 bg-muted rounded-2xl border-2 border-dashed border-border">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground font-bold">
          This section is currently under development.
        </p>
      </div>
    </div>
  );
}
