"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectStatus } from "@/lib/data/projects";

const STATUS_STYLES: Record<ProjectStatus, string> = {
  "In Progress": "bg-success/10 text-success",
  Planning: "bg-purple/10 text-purple",
  "On Hold": "bg-warning/10 text-warning",
  Completed: "bg-primary/10 text-primary",
};

export function ProjectStatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "border-none font-bold px-3 py-1 rounded-full",
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </Badge>
  );
}
