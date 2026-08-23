"use client";

import * as React from "react";
import Link from "next/link";
import { Briefcase, Calendar, Users as UsersIcon, ChevronRight } from "lucide-react";
import { ProjectStatusBadge } from "./project-status-badge";
import { ProjectProgressBar } from "./project-progress-bar";
import { ProjectMemberStack } from "./project-member-stack";
import type { ProjectRecord } from "@/lib/data/projects";

interface ProjectCardProps {
  project: ProjectRecord;
}

/** Card shown in the Projects listing grid. */
export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/project-management/projects/${project.id}`}>
      <div className="bg-background border border-border rounded-xl p-6 flex flex-col gap-6 hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all group">
        {/* Header: icon + status badge */}
        <div className="flex items-start justify-between">
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Briefcase className="size-6" />
          </div>
          <ProjectStatusBadge status={project.status} />
        </div>

        {/* Title + description */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Timeline + team count + progress */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="size-3.5" />
              <span>{project.timeline}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-3.5" />
              <span>{project.members.length} members</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-foreground">Progress</span>
              <span className="text-primary">{project.progress}%</span>
            </div>
            <ProjectProgressBar value={project.progress} />
          </div>
        </div>

        {/* Footer: avatars + view details */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <ProjectMemberStack members={project.members} />
          <div className="flex items-center gap-1 text-primary text-sm font-bold">
            View Details
            <ChevronRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
