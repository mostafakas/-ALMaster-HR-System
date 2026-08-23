"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsToolbarProps {
  title?: string;
  description?: string;
  onCreateProject?: () => void;
}

/** Page-level header for the Projects listing screen. */
export function ProjectsToolbar({
  title = "Projects",
  description = "Manage and track all your active projects.",
  onCreateProject,
}: ProjectsToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm font-bold text-muted-foreground">{description}</p>
      </div>
      <Button
        onClick={onCreateProject}
        className="h-10 px-5 bg-primary hover:bg-primary/90 text-white rounded-xl gap-2 text-xs font-bold"
      >
        <Plus className="size-4" />
        Create New Project
      </Button>
    </div>
  );
}
