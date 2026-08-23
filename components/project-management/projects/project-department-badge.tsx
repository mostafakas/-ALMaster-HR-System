"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ProjectDepartmentBadge as Dept } from "@/lib/data/projects";

const THEME_STYLES: Record<Dept["theme"], string> = {
  primary: "bg-primary hover:bg-primary",
  warning: "bg-warning hover:bg-warning",
  success: "bg-success hover:bg-success",
  ai: "bg-ai hover:bg-ai",
  purple: "bg-purple hover:bg-purple",
  destructive: "bg-destructive hover:bg-destructive",
  info: "bg-info hover:bg-info",
};

export function ProjectDepartmentBadge({
  department,
  className,
}: {
  department: Dept;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "text-white text-sm font-bold rounded px-2 py-0.5 border-none",
        THEME_STYLES[department.theme],
        className
      )}
    >
      {department.label}
    </Badge>
  );
}
