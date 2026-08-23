"use client";

import * as React from "react";
import { ChevronDown, Eye } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  TASK_DEPARTMENT_META,
  TASK_PROJECT_LABELS,
  TASK_STATUS_META,
  type TaskRecord,
} from "@/lib/types/task";

export interface TaskListViewProps {
  tasks: TaskRecord[];
  onOpenTask?: (task: TaskRecord) => void;
}

/**
 * Table view of tasks (Figma 2126:34678).
 *
 * Columns: Task Name • Status • Project • By • To • Department • Due Date • View
 *
 * Body cells use a unified 56px row height; the header uses a 48px row
 * and a muted background per the design tokens.
 */
export function TaskListView({ tasks, onOpenTask }: TaskListViewProps) {
  return (
    <div className="w-full rounded-[14px] bg-background overflow-hidden mb-4 px-4 bg-secondary" >
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse min-w-[860px] bg-secondary">
          <thead>
            <tr className="bg-secondary h-12">
              <HeadCell>Task Name</HeadCell>
              <HeadCell sortable>Status</HeadCell>
              <HeadCell sortable>Project</HeadCell>
              <HeadCell>By</HeadCell>
              <HeadCell>To</HeadCell>
              <HeadCell sortable>Department</HeadCell>
              <HeadCell sortable>Due Date</HeadCell>
              <HeadCell className="text-center w-20">View</HeadCell>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} onOpenTask={onOpenTask} />
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-16">
                  <Typography className="text-[14px] text-muted-foreground">
                    No tasks match the current filters.
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HeadCell({
  children,
  sortable,
  className,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "text-left px-3 text-[14px] leading-[14px] font-bold first:pl-5",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortable && (
          <ChevronDown className="size-3" strokeWidth={2.2} />
        )}
      </div>
    </th>
  );
}

interface TaskRowProps {
  task: TaskRecord;
  onOpenTask?: (task: TaskRecord) => void;
}

function TaskRow({ task, onOpenTask }: TaskRowProps) {
  const status = TASK_STATUS_META[task.status];
  const department = TASK_DEPARTMENT_META[task.department];
  const projectLabel = TASK_PROJECT_LABELS[task.project];
  const formattedDate = React.useMemo(() => {
    try {
      return format(parseISO(task.dueDate), "d/M/yyyy");
    } catch {
      return task.dueDate;
    }
  }, [task.dueDate]);

  return (
    <tr className="h-14 border-t  hover:bg-muted/40 transition-colors border-gray-200 border-b-[2px] last:border-b-0 !px-4 w-[90%]">
      <td className="px-5 py-2.5 ">
        <Typography className="text-[14px] leading-[14px] text-foreground">
          {task.title}
        </Typography>
      </td>
      <td className="px-3 py-2.5">
        <div
          className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-[6px] h-6",
            status.tintBg,
            status.tintFg
          )}
        >
          <Typography as="span" className="text-[14px] leading-[14px] whitespace-nowrap">
            {status.label}
          </Typography>
          <ChevronDown className="size-2" strokeWidth={3} />
        </div>
      </td>
      <td className="px-3 py-2.5">
        <Typography className="text-[14px] leading-[14px] text-foreground">
          {projectLabel}
        </Typography>
      </td>
      <td className="px-3 py-2.5">
        <Avatar className="size-6">
          <AvatarImage src={task.createdBy.avatar} />
          <AvatarFallback className="text-[10px]">
            {task.createdBy.name[0]}
          </AvatarFallback>
        </Avatar>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center">
          {task.assignees.slice(0, 3).map((a, i) => (
            <Avatar
              key={a.id}
              className="size-6 border border-background"
              style={{ marginLeft: i === 0 ? 0 : -8, zIndex: task.assignees.length - i }}
            >
              <AvatarImage src={a.avatar} />
              <AvatarFallback className="text-[10px]">{a.name[0]}</AvatarFallback>
            </Avatar>
          ))}
          {task.assignees.length > 3 && (
            <div
              className="size-6 rounded-full bg-secondary border border-background flex items-center justify-center"
              style={{ marginLeft: -8 }}
            >
              <Typography as="span" className="text-[8px] text-muted-foreground">
                +{task.assignees.length - 3}
              </Typography>
            </div>
          )}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <div
          className={cn(
            "inline-flex items-center justify-center px-2 py-1 rounded-[6px] h-6",
            department.solidBg
          )}
        >
          <Typography as="span" className="text-[14px] leading-[14px] text-white whitespace-nowrap">
            {department.label}
          </Typography>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <Typography className="text-[14px] leading-[14px] text-muted-foreground tabular-nums">
          {formattedDate}
        </Typography>
      </td>
      <td className="px-5 py-2.5 text-center">
        <button
          type="button"
          onClick={() => onOpenTask?.(task)}
          className="size-8 mx-auto rounded-[8px] bg-primary/10 hover:bg-primary/20 transition-colors flex items-center justify-center outline-none"
        >
          <Eye className="size-3.5 text-primary" />
        </button>
      </td>
    </tr>
  );
}
