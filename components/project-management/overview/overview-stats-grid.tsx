"use client";

import * as React from "react";
import { List } from "lucide-react";
import { OverviewStatCard } from "./overview-stat-card";
import { ProjectProgressBar } from "@/components/project-management/projects/project-progress-bar";
import { ProjectMemberStack } from "@/components/project-management/projects/project-member-stack";
import type { ProjectRecord } from "@/lib/data/projects";

interface OverviewStatsGridProps {
  project: ProjectRecord;
}

/** 4-up stat grid: Total Tasks, Progress, Team, Budget Used. */
export function OverviewStatsGrid({ project }: OverviewStatsGridProps) {
  const { taskCounts, progress, members, budget } = project;
  const completionPct = Math.round(
    (taskCounts.completed / Math.max(1, taskCounts.total)) * 100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
      {/* Total Tasks */}
      <OverviewStatCard label="Total Tasks" icon={List}>
        <div className="text-2xl font-bold text-foreground">
          {taskCounts.total}
        </div>
        <div className="text-sm font-bold text-foreground">
          {taskCounts.completed} Completed ({completionPct}%)
        </div>
      </OverviewStatCard>

      {/* Progress */}
      <OverviewStatCard label="Progress" icon={List}>
        <div className="text-2xl font-bold text-foreground">{progress}%</div>
        <ProjectProgressBar value={progress} />
      </OverviewStatCard>

      {/* Team */}
      <OverviewStatCard label="Team" icon={List}>
        <div className="text-2xl font-bold text-foreground">
          {members.length}
        </div>
        <ProjectMemberStack members={members} />
      </OverviewStatCard>

      {/* Budget Used */}
      <OverviewStatCard label="Budget Used" icon={List}>
        <div className="flex items-baseline gap-1">
          <span className="text-sm font-bold text-destructive">
            {budget.currency}
          </span>
          <span className="text-2xl font-bold text-destructive">
            {budget.spent.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <span className="text-foreground">of</span>
          <span className="text-foreground">
            {budget.currency} {budget.total.toLocaleString()}
          </span>
        </div>
      </OverviewStatCard>
    </div>
  );
}
