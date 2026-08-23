"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  TASK_STATUS_META,
  type TaskRecord,
  type TaskStatus,
} from "@/lib/types/task";
import { TaskBoardCard } from "./task-board-card";
import { TASK_DRAG_MIME, useTaskDrag } from "./use-task-drag";

/**
 * Drop position identifies WHERE the dragged card will land:
 *  • before/after a sibling card (the indicator renders directly
 *    above or below the sibling), or
 *  • at the bottom of an empty stretch of column (the indicator
 *    renders at the foot of the column).
 */
export type BoardDropPosition =
  | { kind: "before"; status: TaskStatus; cardId: string }
  | { kind: "after"; status: TaskStatus; cardId: string }
  | { kind: "empty"; status: TaskStatus };

export interface TaskBoardViewProps {
  tasks: TaskRecord[];
  onCreateInStatus?: (status: TaskStatus) => void;
  onOpenTask?: (task: TaskRecord) => void;
  /** Status-only move — kept for callers that don't care about order. */
  onMoveTask?: (taskId: string, nextStatus: TaskStatus) => void;
  /** Status + order move — used by the new drag-with-indicator flow. */
  onReorderTask?: (taskId: string, target: BoardDropPosition) => void;
}

const COLUMNS: TaskStatus[] = [
  "todo",
  "in-progress",
  "waiting-review",
  "completed",
  "overdue",
];

/**
 * Kanban / "Board" view (Figma board frame).
 *
 * Adds card-level reorder: hovering over the top half of a card shows a
 * blue indicator above it (drop before); the bottom half shows it below
 * (drop after). Dropping anywhere else in the column body falls back to
 * "append".
 */
export function TaskBoardView({
  tasks,
  onCreateInStatus,
  onOpenTask,
  onMoveTask,
  onReorderTask,
}: TaskBoardViewProps) {
  const drag = useTaskDrag();
  const [dropPosition, setDropPosition] =
    React.useState<BoardDropPosition | null>(null);

  // Reset the indicator when the drag ends without a drop happening.
  React.useEffect(() => {
    if (drag.draggingId === null) setDropPosition(null);
  }, [drag.draggingId]);

  const grouped = React.useMemo(() => {
    const result: Record<TaskStatus, TaskRecord[]> = {
      todo: [],
      "in-progress": [],
      "waiting-review": [],
      completed: [],
      overdue: [],
    };
    for (const task of tasks) result[task.status].push(task);
    return result;
  }, [tasks]);

  /** Commits a drop using the most specific handler available, then
   * explicitly tells the drag hook to clear its `draggingId` — the
   * source card's DOM node gets reparented by the state update and the
   * browser's `dragend` event sometimes doesn't fire on it. Without
   * this the original card stays at 40 % opacity until the next drag. */
  const commitDrop = React.useCallback(
    (taskId: string, position: BoardDropPosition) => {
      if (onReorderTask) {
        onReorderTask(taskId, position);
      } else if (onMoveTask) {
        onMoveTask(taskId, position.status);
      }
      drag.endDrag();
    },
    [onReorderTask, onMoveTask, drag]
  );

  return (
    <div className="w-full h-full overflow-x-auto no-scrollbar">
      <div className="flex gap-3 min-w-fit h-full px-1">
        {COLUMNS.map((status) => (
          <TaskBoardColumn
            key={status}
            status={status}
            tasks={grouped[status]}
            onAdd={onCreateInStatus}
            onOpenTask={onOpenTask}
            draggingId={drag.draggingId}
            dragHandlers={drag.dragHandlers}
            dropPosition={dropPosition}
            setDropPosition={setDropPosition}
            commitDrop={commitDrop}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Column ───────────────────────────────────────────────────────── */

interface TaskBoardColumnProps {
  status: TaskStatus;
  tasks: TaskRecord[];
  onAdd?: (status: TaskStatus) => void;
  onOpenTask?: (task: TaskRecord) => void;
  draggingId: string | null;
  dragHandlers: ReturnType<typeof useTaskDrag>["dragHandlers"];
  dropPosition: BoardDropPosition | null;
  setDropPosition: (next: BoardDropPosition | null) => void;
  commitDrop: (taskId: string, position: BoardDropPosition) => void;
}

function TaskBoardColumn({
  status,
  tasks,
  onAdd,
  onOpenTask,
  draggingId,
  dragHandlers,
  dropPosition,
  setDropPosition,
  commitDrop,
}: TaskBoardColumnProps) {
  const meta = TASK_STATUS_META[status];

  /** Column-level drag-over: only fires when a card's own handler hasn't
   * already claimed the event (cards call `stopPropagation`). We only
   * switch to the "empty" indicator if there is no card-based position
   * yet — otherwise the user briefly hovering the gap between two cards
   * would clobber the precise before/after position they had on a card.
   */
  const handleColumnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dropPosition || dropPosition.status !== status) {
      setDropPosition({ kind: "empty", status });
    }
  };

  const handleColumnDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const id =
      e.dataTransfer.getData(TASK_DRAG_MIME) ||
      e.dataTransfer.getData("text/plain");
    if (id && dropPosition) {
      commitDrop(id, dropPosition);
    } else if (id) {
      commitDrop(id, { kind: "empty", status });
    }
    setDropPosition(null);
  };

  const isHoverThisColumn =
    dropPosition?.status === status && draggingId !== null;
  const emptyIndicator =
    dropPosition?.kind === "empty" && dropPosition.status === status;

  return (
    <div className="flex flex-col gap-3 w-[350px]  ">
      {/* Column header */}
      <div className="flex items-center justify-between px-3 ">
        <div className="flex items-center gap-2">
          <span
            className={cn("size-2 rounded-full", meta.dot)}
            aria-hidden="true"
          />
          <Typography
            className="text-[14px] leading-[14px]"
            style={{ color: meta.cssVar }}
          >
            {meta.label}
          </Typography>
          <div
            className="flex items-center justify-center px-1.5 py-0.5 rounded-full text-[12px] leading-[14px] min-w-6  "
            style={{
              backgroundColor: meta.cssTintVar,
              color: meta.cssVar,
            }}
          >
            {tasks.length}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onAdd?.(status)}
          className="size-5 flex items-center justify-center rounded-md hover:bg-muted transition-colors outline-none"
          style={{ color: meta.cssVar }}
          aria-label={`Add task to ${meta.label}`}
        >
          <Plus className="size-3" strokeWidth={2.4} />
        </button>
      </div>

      {/* Column body */}
      <div
        onDragOver={handleColumnDragOver}
        onDrop={handleColumnDrop}
        className={cn(
          "flex flex-col gap-2 p-3 rounded-[12px] transition-all flex-1",
          meta.tintBg,
          isHoverThisColumn && "ring-1 ring-inset"
        )}
        style={
          isHoverThisColumn
            ? { boxShadow: `inset 0 0 0 1px ${meta.cssVar}` }
            : undefined
        }
      >
        {status === "todo" && (
          <button
            type="button"
            onClick={() => onAdd?.(status)}
            className={cn(
              "h-[118px] w-full rounded-[8px] border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors outline-none",
              "hover:bg-background/50"
            )}
            style={{ borderColor: meta.cssVar }}
          >
            <Plus className="size-3.5" style={{ color: meta.cssVar }} />
            <Typography
              className="text-[14px] leading-[20px]"
              style={{ color: meta.cssVar }}
            >
              Click to add a new task
            </Typography>
          </button>
        )}

        {/* Indicators are siblings of the card wrappers — that way the
          * column's `gap-2` adds 8 px of breathing room above AND below
          * the indicator, so a "drop between A and B" reads as one
          * single line centered in the gap regardless of whether the
          * dropPosition refers to "after A" or "before B". */}
        {tasks.map((task) => {
          const cardBefore =
            dropPosition?.kind === "before" &&
            "cardId" in dropPosition &&
            dropPosition.cardId === task.id;
          const cardAfter =
            dropPosition?.kind === "after" &&
            "cardId" in dropPosition &&
            dropPosition.cardId === task.id;
          return (
            <React.Fragment key={task.id}>
              {cardBefore && <DropIndicator color={meta.cssVar} />}
              <DraggableCard
                task={task}
                status={status}
                onOpenTask={onOpenTask}
                isDragging={draggingId === task.id}
                dragHandlers={dragHandlers(task.id)}
                dropPosition={dropPosition}
                setDropPosition={setDropPosition}
                commitDrop={commitDrop}
              />
              {cardAfter && <DropIndicator color={meta.cssVar} />}
            </React.Fragment>
          );
        })}

        {emptyIndicator && draggingId !== null && (
          <DropIndicator color={meta.cssVar} />
        )}

        {tasks.length === 0 && status !== "todo" && !emptyIndicator && (
          <div className="flex-1 flex items-start justify-center py-8">
            <Typography className="text-[12px] text-muted-foreground">
              Drop tasks here
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Draggable card (drag source + drop target with position detection) ── */

interface DraggableCardProps {
  task: TaskRecord;
  status: TaskStatus;
  onOpenTask?: (task: TaskRecord) => void;
  isDragging: boolean;
  dragHandlers: ReturnType<
    ReturnType<typeof useTaskDrag>["dragHandlers"]
  >;
  dropPosition: BoardDropPosition | null;
  setDropPosition: (next: BoardDropPosition | null) => void;
  commitDrop: (taskId: string, position: BoardDropPosition) => void;
}

function DraggableCard({
  task,
  status,
  onOpenTask,
  isDragging,
  dragHandlers,
  dropPosition,
  setDropPosition,
  commitDrop,
}: DraggableCardProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const kind: "before" | "after" =
      e.clientY < midY ? "before" : "after";
    if (
      !dropPosition ||
      dropPosition.kind !== kind ||
      ("cardId" in dropPosition && dropPosition.cardId !== task.id)
    ) {
      setDropPosition({ kind, status, cardId: task.id });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id =
      e.dataTransfer.getData(TASK_DRAG_MIME) ||
      e.dataTransfer.getData("text/plain");
    if (!id || id === task.id) {
      setDropPosition(null);
      return;
    }
    const target =
      dropPosition && "cardId" in dropPosition
        ? dropPosition
        : ({
          kind: "after" as const,
          status,
          cardId: task.id,
        } satisfies BoardDropPosition);
    commitDrop(id, target);
    setDropPosition(null);
  };

  return (
    <div onDragOver={handleDragOver} onDrop={handleDrop}>
      <TaskBoardCard
        task={task}
        onView={onOpenTask}
        isDragging={isDragging}
        dragHandlers={dragHandlers}
      />
    </div>
  );
}

/* ─── Indicator: thin coloured line, 80% of the column width ──────── */

function DropIndicator({ color }: { color: string }) {
  return (
    <div className="flex justify-center" aria-hidden="true">
      <span
        className="h-[2px] w-4/5 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
