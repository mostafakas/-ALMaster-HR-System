"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TasksBreakdown {
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface TasksProgressBarProps {
  tasks: TasksBreakdown;
}

/**
 * Three-part horizontal progress bar that mirrors the Figma "Tasks Status"
 * card. Hovering each segment surfaces its absolute count.
 */
export function TasksProgressBar({ tasks }: TasksProgressBarProps) {
  const total = tasks.completed + tasks.inProgress + tasks.notStarted;
  const pct = (n: number) => (total === 0 ? 0 : (n / total) * 100);

  const segments = [
    {
      key: "completed",
      label: "Completed",
      count: tasks.completed,
      color: "#0047FF",
      pct: pct(tasks.completed),
    },
    {
      key: "in-progress",
      label: "In Progress",
      count: tasks.inProgress,
      color: "#4D7DFF",
      pct: pct(tasks.inProgress),
    },
    {
      key: "not-started",
      label: "Not started yet",
      count: tasks.notStarted,
      color: "#A8C0FF",
      pct: pct(tasks.notStarted),
    },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Segmented track */}
      <div
        className="flex h-[10px] w-full overflow-hidden rounded-full bg-[#EDF2F7]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct(tasks.completed))}
        aria-label={`Tasks progress: ${tasks.completed} of ${total} completed`}
      >
        {segments.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.count} (${s.pct.toFixed(0)}%)`}
            className="h-full transition-all duration-300 hover:brightness-95 first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${s.pct}%`,
              backgroundColor: s.color,
            }}
          />
        ))}
      </div>

      {/* Legend with dot + label + count */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {segments.map((s) => (
          <div key={s.key} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span
                className={cn("size-2 rounded-full shrink-0")}
                style={{ backgroundColor: s.color }}
              />
              <span className="text-[12px] font-bold text-[#343434] leading-[14px] truncate">
                {s.label}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#707070] leading-[14px] tabular-nums">
              {s.pct.toFixed(0)}% — {s.count} {s.count === 1 ? "Task" : "Tasks"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
