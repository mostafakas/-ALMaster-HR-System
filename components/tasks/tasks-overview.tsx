"use client";

import * as React from "react";
import {
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
} from "date-fns";

import { TaskStatsGrid } from "./task-stats-grid";
import { TaskOverviewToolbar } from "./task-overview-toolbar";
import { TaskPeriodNavigator } from "./task-period-navigator";
import { TaskViewSwitcher } from "./task-view-switcher";
import { TaskBoardView, type BoardDropPosition } from "./task-board-view";
import { TaskListView } from "./task-list-view";
import { TaskCalendarView } from "./task-calendar-view";
import { SetTaskModal } from "./set-task-modal";
import { TaskDetailsModal } from "./task-details-modal";
import { FilterTasksModal } from "./filter-tasks-modal";
import {
  MOCK_TASK_RECORDS,
  buildCalendarFiller,
} from "@/lib/data/tasks-mock";
import type {
  TaskCalendarRange,
  TaskRecord,
  TaskStatus,
  TaskViewMode,
} from "@/lib/types/task";
import type { TaskFilterValues } from "@/lib/validations/task";

const DEFAULT_DATE = new Date(2026, 2, 19); // March 19, 2026 — "Today" in the design.

/**
 * AlMaster Tasks "Home [Overview]" page.
 *
 * This is the orchestrator that:
 *  1. Holds the list of tasks (mock in this build).
 *  2. Filters them by status / period / explicit filter values.
 *  3. Renders the right view variant.
 *  4. Owns the three modals.
 */
export function TasksOverview() {
  /* Seed state with the real mock records plus synthesised filler tasks
   * for the default month. The filler lives in real state — that way the
   * calendar drag-and-drop actually mutates them. As the user navigates
   * to other months the effect below tops up filler for any month we
   * haven't visited yet. */
  const [tasks, setTasks] = React.useState<TaskRecord[]>(() => [
    ...MOCK_TASK_RECORDS,
    ...buildCalendarFiller(DEFAULT_DATE),
  ]);
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">(
    "all"
  );
  const [viewMode, setViewMode] = React.useState<TaskViewMode>("board");
  const [range, setRange] = React.useState<TaskCalendarRange>("month");
  const [anchor, setAnchor] = React.useState<Date>(DEFAULT_DATE);

  const [setTaskOpen, setSetTaskOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskRecord | undefined>();
  const [detailsTask, setDetailsTask] = React.useState<TaskRecord | null>(null);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<TaskFilterValues>({});

  /* Ensure each visited month has its filler tasks in real state — so
   * dragging them to a different day persists. Re-uses ids of the form
   * `cal-YYYY-M-D-i` so we don't duplicate on re-visit. */
  React.useEffect(() => {
    setTasks((prev) => {
      const monthKey = `cal-${anchor.getFullYear()}-${anchor.getMonth() + 1}-`;
      if (prev.some((t) => t.id.startsWith(monthKey))) return prev;
      return [...prev, ...buildCalendarFiller(anchor)];
    });
  }, [anchor]);

  /* ── Derived: tasks for stat cards (period-only filter) ── */
  const periodFiltered = React.useMemo(() => {
    return tasks.filter((task) => withinPeriod(task, anchor, range));
  }, [tasks, anchor, range]);

  /* ── Derived: tasks shown in body (period + status + filters) ── */
  const visibleTasks = React.useMemo(() => {
    return periodFiltered.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;

      if (
        filters.status &&
        filters.status.length > 0 &&
        !filters.status.includes(task.status)
      )
        return false;
      if (
        filters.weight &&
        filters.weight.length > 0 &&
        !filters.weight.includes(task.weight)
      )
        return false;
      if (
        filters.priority &&
        filters.priority.length > 0 &&
        !filters.priority.includes(task.priority)
      )
        return false;
      if (
        filters.projects &&
        filters.projects.length > 0 &&
        !filters.projects.includes(task.project)
      )
        return false;
      if (
        filters.departments &&
        filters.departments.length > 0 &&
        !filters.departments.includes(task.department)
      )
        return false;
      if (filters.assigner) {
        const q = filters.assigner.toLowerCase();
        if (
          !task.createdBy.name.toLowerCase().includes(q) &&
          !task.createdBy.role.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.assignee) {
        const q = filters.assignee.toLowerCase();
        if (
          !task.assignees.some(
            (a) =>
              a.name.toLowerCase().includes(q) ||
              a.role.toLowerCase().includes(q)
          )
        )
          return false;
      }
      if (filters.date) {
        try {
          if (!isSameDay(parseISO(task.dueDate), filters.date as Date))
            return false;
        } catch {
          /* ignore */
        }
      }
      return true;
    });
  }, [periodFiltered, statusFilter, filters]);

  const handleOpenSetTask = (status?: TaskStatus) => {
    setEditingTask(undefined);
    setSetTaskOpen(true);
    if (status) setStatusFilter(status);
  };

  const handleEditTask = (task: TaskRecord) => {
    setDetailsTask(null);
    setEditingTask(task);
    setSetTaskOpen(true);
  };

  const handleMarkDone = (task: TaskRecord) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t))
    );
    setDetailsTask(null);
  };

  const handleMoveTaskStatus = (taskId: string, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  /**
   * Reorder a task into a specific slot in the kanban. The dragged task
   * is removed from its previous position, its status updated to the
   * target column, and re-inserted before/after the anchor card.
   */
  const handleReorderTask = (
    taskId: string,
    target: BoardDropPosition
  ) => {
    setTasks((prev) => {
      const dragged = prev.find((t) => t.id === taskId);
      if (!dragged) return prev;
      const without = prev.filter((t) => t.id !== taskId);
      const updated: TaskRecord = { ...dragged, status: target.status };
      if (target.kind === "empty") {
        return [...without, updated];
      }
      const idx = without.findIndex((t) => t.id === target.cardId);
      if (idx === -1) return [...without, updated];
      const insertAt = target.kind === "before" ? idx : idx + 1;
      return [
        ...without.slice(0, insertAt),
        updated,
        ...without.slice(insertAt),
      ];
    });
  };

  const handleMoveTaskToDay = (
    taskId: string,
    nextDay: Date,
    hour?: number
  ) => {
    const iso = `${nextDay.getFullYear()}-${String(
      nextDay.getMonth() + 1
    ).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated: TaskRecord = { ...t, dueDate: iso };
        if (hour !== undefined) {
          /* Preserve the task's existing duration when the user drops it
           * at a new hour in the Day view. */
          const oldStart = t.startTime
            ? parseInt(t.startTime.split(":")[0]!, 10)
            : 8;
          const oldEnd = t.endTime
            ? parseInt(t.endTime.split(":")[0]!, 10)
            : oldStart + 1;
          const duration = Math.max(1, oldEnd - oldStart);
          updated.startTime = `${hour}:00`;
          updated.endTime = `${Math.min(20, hour + duration)}:00`;
        }
        return updated;
      })
    );
  };

  return (
    <div className="w-full px-6 py-6 flex flex-col gap-6 bg-white overflow-x-hidden">
      {/* Section header + period toggle */}
      <div className="flex flex-col gap-5 shrink-0">
        <TaskOverviewToolbar
          range={range}
          onRangeChange={setRange}
          onFilters={() => setFilterOpen(true)}
          onCreateTask={() => handleOpenSetTask()}
        />
        <TaskStatsGrid
          tasks={periodFiltered}
          selectedStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />
      </div>

      {/* <div className="h-px bg-border w-full shrink-0" /> */}

      {/* Date navigator + view switcher */}
      <div className="flex items-center justify-between gap-3 shrink-0 bg-white">
        <TaskPeriodNavigator
          value={anchor}
          onChange={setAnchor}
          range={range}
        />
        <TaskViewSwitcher value={viewMode} onChange={setViewMode} />
      </div>

      {/* Active view */}
      <div className="h-[85vh] w-full overflow-y-auto overflow-x-hidden no-scrollbar rounded-3xl pb-[7px]">
        {viewMode === "board" && (
          <TaskBoardView
            tasks={visibleTasks}
            onCreateInStatus={handleOpenSetTask}
            onOpenTask={setDetailsTask}
            onMoveTask={handleMoveTaskStatus}
            onReorderTask={handleReorderTask}
          />
        )}
        {viewMode === "list" && (
          <TaskListView tasks={visibleTasks} onOpenTask={setDetailsTask} />
        )}
        {viewMode === "calendar" && (
          <TaskCalendarView
            tasks={visibleTasks}
            range={range}
            anchor={anchor}
            onOpenTask={setDetailsTask}
            onMoveTaskToDay={handleMoveTaskToDay}
          />
        )}
      </div>

      {/* Modals */}
      <SetTaskModal
        open={setTaskOpen}
        onOpenChange={(v) => {
          setSetTaskOpen(v);
          if (!v) setEditingTask(undefined);
        }}
        task={editingTask}
      />
      <TaskDetailsModal
        open={Boolean(detailsTask)}
        onOpenChange={(v) => {
          if (!v) setDetailsTask(null);
        }}
        task={detailsTask}
        onEdit={handleEditTask}
        onMarkAsDone={handleMarkDone}
      />
      <FilterTasksModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        defaultValues={filters}
        onApply={setFilters}
        onReset={() => setFilters({})}
      />
    </div>
  );
}

function withinPeriod(
  task: TaskRecord,
  anchor: Date,
  range: TaskCalendarRange
): boolean {
  let due: Date;
  try {
    due = parseISO(task.dueDate);
  } catch {
    return true;
  }
  if (range === "month") {
    return isWithinInterval(due, {
      start: startOfMonth(anchor),
      end: endOfMonth(anchor),
    });
  }
  if (range === "week") {
    return isWithinInterval(due, {
      start: startOfWeek(anchor, { weekStartsOn: 6 }),
      end: endOfWeek(anchor, { weekStartsOn: 6 }),
    });
  }
  return isSameDay(due, anchor);
}
