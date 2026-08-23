"use client";

import * as React from "react";
import { ProjectProgressBar } from "@/components/project-management/projects/project-progress-bar";
import type { ProjectRecord } from "@/lib/data/projects";

interface TasksBreakdownCardProps {
  project: ProjectRecord;
}

interface BreakdownRow {
  label: string;
  count: number;
  color: string;
}

/**
 * Right-hand card on the Project Overview page — count + percentage
 * progress bar per task status, with the total in the header pill.
 */
export function TasksBreakdownCard({ project }: TasksBreakdownCardProps) {
  const { taskCounts } = project;
  const total = Math.max(1, taskCounts.total);

  const rows: BreakdownRow[] = [
    { label: "To Do", count: taskCounts.todo, color: "var(--purple)" },
    { label: "In Progress", count: taskCounts.inProgress, color: "var(--primary)" },
    { label: "Waiting Review", count: taskCounts.waitingReview, color: "var(--warning)" },
    { label: "Done", count: taskCounts.completed, color: "var(--success)" },
  ];

  return (
    <div className="bg-muted p-6 rounded-xl flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Tasks Breakdown</h2>
        <div className="bg-purple/10 text-purple text-sm font-bold px-2 py-1.5 rounded-full min-w-[32px] text-center">
          {taskCounts.total}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {rows.map((row) => {
          const percentage = Math.round((row.count / total) * 100);
          return (
            <div key={row.label} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span className="text-foreground">{row.label}</span>
                <span className="text-foreground">{row.count} Tasks</span>
              </div>
              <div className="flex items-center gap-3">
                <ProjectProgressBar
                  value={percentage}
                  fillStyle={row.color}
                  className="flex-1"
                />
                <span className="text-xs font-bold text-muted-foreground w-8 text-right">
                  {percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
