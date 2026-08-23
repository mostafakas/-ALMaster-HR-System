"use client";

import * as React from "react";
import { Filter, Plus } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { TaskPeriodToggle } from "./task-period-toggle";
import type { TaskCalendarRange } from "@/lib/types/task";

export interface TaskOverviewToolbarProps {
  title?: string;
  range: TaskCalendarRange;
  onRangeChange: (range: TaskCalendarRange) => void;
  onFilters: () => void;
  onCreateTask: () => void;
}

/**
 * "AlMaster Tasks" toolbar (Figma 2126:32837):
 *
 *  ┌──────────────────────────────────────────────────────────────┐
 *  │ AlMaster Tasks    [Month][Week][Day] [Filters]  [+ Set Task] │
 *  └──────────────────────────────────────────────────────────────┘
 *
 * Title: 22px bold, leading-[20px], text-foreground
 * Right cluster gap: 12px
 *  Filters:  h-[40px] px-[12px] py-[16px] rounded-[8px] bg-secondary
 *  Set Task: h-[40px] px-[20px] py-[16px] rounded-[12px] bg-primary
 */
export function TaskOverviewToolbar({
  title = "AlMaster Tasks",
  range,
  onRangeChange,
  onFilters,
  onCreateTask,
}: TaskOverviewToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full ">
      <Typography
        as="h1"
        className="text-[22px] leading-[20px] text-foreground "
      >
        {title}
      </Typography>

      <div className="flex items-center gap-3 ">
        <TaskPeriodToggle value={range} onChange={onRangeChange} />

        <button
          type="button"
          onClick={onFilters}
          className="h-10 px-3 rounded-[8px] bg-secondary flex items-center gap-1.5 transition-colors hover:bg-muted outline-none"
        >
          <Filter className="size-3 text-muted-foreground" strokeWidth={2.2} />
          <Typography className="text-[12px] leading-[22.4px] text-muted-foreground">
            Filters
          </Typography>
        </button>

        <button
          type="button"
          onClick={onCreateTask}
          className="h-10 px-5 rounded-[12px] bg-primary flex items-center gap-2 transition-colors hover:bg-primary/90 outline-none"
        >
          <Plus
            className="size-3.5 text-primary-foreground"
            strokeWidth={2.5}
          />
          <Typography className="text-[12px] leading-[22.4px] text-primary-foreground">
            Set Task
          </Typography>
        </button>
      </div>
    </div>
  );
}
