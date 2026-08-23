"use client";

import * as React from "react";
import { Eye, Calendar as CalendarIcon, ChevronDown } from "lucide-react";
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

export interface TaskBoardCardProps {
  task: TaskRecord;
  onView?: (task: TaskRecord) => void;
  /** Native HTML5 drag handlers from useTaskDrag(). */
  dragHandlers?: React.HTMLAttributes<HTMLDivElement> & { draggable?: boolean };
  /** Renders the card faded — used while it's being dragged. */
  isDragging?: boolean;
}

/**
 * Single board card (Figma board frame).
 *
 * Layout:
 *  Row 1: title  + eye (view) icon
 *  Row 2: project (primary text) + department badge
 *  Row 3: status pill + due date
 *  Row 4: "By" creator avatar + "To" assignee avatars
 */
export const TaskBoardCard = React.memo(function TaskBoardCard({
  task,
  onView,
  dragHandlers,
  isDragging,
}: TaskBoardCardProps) {
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

  // Guard against the click that fires immediately after a drag.
  const justDragged = React.useRef(false);
  const handleClick = () => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    onView?.(task);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      {...dragHandlers}
      onDragStart={(e) => {
        justDragged.current = true;
        dragHandlers?.onDragStart?.(e);
      }}
      className={cn(
        "bg-background border-l-[3px] rounded-[8px] p-3 flex flex-col gap-2 w-full text-left cursor-grab active:cursor-grabbing transition-all",
        "hover:shadow-md outline-none",
        isDragging && "opacity-40"
      )}
      style={{ borderLeftColor: status.cssVar }}
    >
      {/* Header rows */}
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Typography className="text-[14px] leading-[20px] text-foreground truncate flex-1">
            {task.title}
          </Typography>
          <Eye
            className="size-3.5 text-muted-foreground shrink-0 mt-0.5"
            strokeWidth={2}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Typography className="text-[12px] leading-[20px] text-primary truncate">
            {projectLabel}
          </Typography>
          <div
            className={cn(
              "px-1.5 py-0.5 rounded-[4px] shrink-0 max-w-[120px]",
              department.solidBg
            )}
          >
            <Typography className="text-[10px] leading-[14px] text-white truncate">
              {department.label}
            </Typography>
          </div>
        </div>
      </div>

      {/* Status pill + date row */}
      <div className="flex h-5 items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1 px-1.5 py-0.5 rounded-[6px]",
            status.tintBg,
            status.tintFg
          )}
        >
          <Typography as="span" className="text-[12px] leading-[14px]">
            {status.label}
          </Typography>
          <ChevronDown className="size-2 shrink-0" strokeWidth={3} />
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <CalendarIcon className="size-2.5 shrink-0" strokeWidth={2.4} />
          <Typography
            as="span"
            className="text-[12px] leading-[20px] tabular-nums whitespace-nowrap"
          >
            {formattedDate}
          </Typography>
        </div>
      </div>

      {/* Creator + assignees row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Typography
            as="span"
            className="text-[12px] leading-[20px] text-muted-foreground"
          >
            By:
          </Typography>
          <Avatar className="size-5">
            <AvatarImage src={task.createdBy.avatar} />
            <AvatarFallback className="text-[8px]">
              {task.createdBy.name[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-1">
          <Typography
            as="span"
            className="text-[12px] leading-[20px] text-muted-foreground"
          >
            To:
          </Typography>
          <div className="flex items-center pr-[5px]">
            {task.assignees.slice(0, 3).map((a, i) => (
              <Avatar
                key={a.id}
                className="size-5 border border-background"
                style={{
                  marginLeft: i === 0 ? 0 : -5,
                  zIndex: task.assignees.length - i,
                }}
              >
                <AvatarImage src={a.avatar} />
                <AvatarFallback className="text-[8px]">
                  {a.name[0]}
                </AvatarFallback>
              </Avatar>
            ))}
            {task.assignees.length > 3 && (
              <div
                className="size-5 rounded-full bg-secondary border border-background flex items-center justify-center"
                style={{ marginLeft: -5 }}
              >
                <Typography as="span" className="text-[8px] text-muted-foreground">
                  +{task.assignees.length - 3}
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
