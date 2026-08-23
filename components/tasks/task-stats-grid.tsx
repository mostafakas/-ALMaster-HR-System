"use client";

import * as React from "react";
import { TaskStatCard } from "./task-stat-card";
import { TASK_STATUS_META, type TaskRecord, type TaskStatus } from "@/lib/types/task";

export interface TaskStatsGridProps {
  tasks: TaskRecord[];
  selectedStatus?: TaskStatus | "all";
  onSelectStatus?: (status: TaskStatus | "all") => void;
}

/**
 * Six-up stat strip from the AlMaster Tasks Figma (frame 2126:34497).
 *
 * Clicking a card emits the status it represents so the parent can filter
 * the board / list / calendar accordingly. Clicking the "Total Tasks" tile
 * resets the filter to "all".
 */
export function TaskStatsGrid({
  tasks,
  selectedStatus = "all",
  onSelectStatus,
}: TaskStatsGridProps) {
  const counts = React.useMemo(() => {
    const initial: Record<TaskStatus, number> = {
      todo: 0,
      "in-progress": 0,
      "waiting-review": 0,
      completed: 0,
      overdue: 0,
    };
    for (const t of tasks) initial[t.status]++;
    return initial;
  }, [tasks]);

  const orderedStatuses: TaskStatus[] = [
    "todo",
    "in-progress",
    "waiting-review",
    "completed",
    "overdue",
  ];

  return (
    <div className="flex items-stretch gap-2 w-full pb-6 border-b-2 border-gray-200">
      <TaskStatCard
        label="Total Tasks"
        subtitle="This Month"
        value={tasks.length}
        surfaceClass="bg-secondary"
        textClass="text-foreground"
        mutedTextClass="text-foreground"
        selected={selectedStatus === "all"}
        onClick={() => onSelectStatus?.("all")}
      />
      {orderedStatuses.map((status) => {
        const meta = TASK_STATUS_META[status];
        return (
          <TaskStatCard
            key={status}
            label={meta.label}
            subtitle={meta.subtitle}
            value={counts[status]}
            surfaceClass={meta.solidBg}
            /* Hard-coded `text-white` on every coloured card — Tailwind
             * v4's `text-*-foreground` tokens sometimes resolve through
             * @theme inline to the wrong value in the compiled CSS for
             * the destructive (Overdue) card, leaving the text black.
             * Pinning to `text-white` guarantees the design intent. */
            textClass="text-white"
            mutedTextClass="text-white"
            selected={selectedStatus === status}
            onClick={() => onSelectStatus?.(status)}
          />
        );
      })}
    </div>
  );
}
