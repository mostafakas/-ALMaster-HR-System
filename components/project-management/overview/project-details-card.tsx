"use client";

import * as React from "react";
import { Calendar, Briefcase, Wallet, Users as UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectDepartmentBadge } from "@/components/project-management/projects/project-department-badge";
import { ProjectProgressBar } from "@/components/project-management/projects/project-progress-bar";
import type { ProjectRecord } from "@/lib/data/projects";

interface ProjectDetailsCardProps {
  project: ProjectRecord;
}

/**
 * Left-hand card on the Project Overview page — timeline, departments,
 * budget (with progress bar) and the project team list.
 */
export function ProjectDetailsCard({ project }: ProjectDetailsCardProps) {
  const { budget } = project;
  const spentPct = Math.round((budget.spent / Math.max(1, budget.total)) * 100);
  const remaining = budget.total - budget.spent;

  return (
    <div className="bg-muted p-6 rounded-xl flex flex-col gap-6">
      <h2 className="text-lg font-bold text-foreground">Project Details</h2>

      <div className="flex flex-col gap-6">
        {/* Timeline */}
        <DetailRow icon={Calendar} label="Timeline">
          <span className="text-sm font-bold text-foreground">
            {project.timeline}
          </span>
        </DetailRow>

        {/* Department(s) */}
        <DetailRow icon={Briefcase} label="Department(s)">
          <div className="flex items-center gap-2 flex-wrap">
            {project.departments.map((d) => (
              <ProjectDepartmentBadge key={d.label} department={d} />
            ))}
          </div>
        </DetailRow>

        {/* Budget */}
        <DetailRow icon={Wallet} label="Project Budget">
          <div className="flex items-baseline gap-1 text-sm font-bold">
            <span className="text-destructive">
              {budget.currency} {(budget.spent / 1000).toFixed(0)}K
            </span>
            <span className="text-foreground">of</span>
            <span className="text-foreground">
              {(budget.total / 1000).toFixed(0)}K
            </span>
          </div>
          <div className="max-w-[265px] mt-1">
            <ProjectProgressBar
              value={spentPct}
              fillClassName="bg-destructive"
            />
          </div>
          <div className="flex items-center justify-between max-w-[265px] text-xs font-bold mt-1">
            <span className="text-destructive">
              Spent: {budget.currency} {(budget.spent / 1000).toFixed(0)}K
            </span>
            <span className="text-foreground">
              Remaining: {budget.currency} {(remaining / 1000).toFixed(0)}K
            </span>
          </div>
        </DetailRow>

        {/* Teamwork */}
        <DetailRow icon={UsersIcon} label="Teamwork">
          <div className="flex flex-col gap-4 mt-2">
            {project.members.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-foreground">
                    {member.name}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground">
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DetailRow>
      </div>
    </div>
  );
}

/** A single icon + label + content row inside the details card. */
function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="size-3.5 text-muted-foreground mt-1" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-bold text-muted-foreground">{label}</span>
        {children}
      </div>
    </div>
  );
}
