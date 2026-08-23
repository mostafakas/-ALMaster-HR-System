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

import { TaskOverviewToolbar } from "@/components/tasks/task-overview-toolbar";
import { TaskPeriodNavigator } from "@/components/tasks/task-period-navigator";
import { TaskViewSwitcher } from "@/components/tasks/task-view-switcher";
import {
  TaskBoardView,
  type BoardDropPosition,
} from "@/components/tasks/task-board-view";
import { TaskListView } from "@/components/tasks/task-list-view";
import { TaskCalendarView } from "@/components/tasks/task-calendar-view";
import { SetTaskModal } from "@/components/tasks/set-task-modal";
import { TaskDetailsModal } from "@/components/tasks/task-details-modal";
import { FilterTasksModal } from "@/components/tasks/filter-tasks-modal";
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
import {
  MonthViewTabs,
  type MonthViewTab,
} from "@/components/project-management/targets/month-view-tabs";

const DEFAULT_DATE = new Date(2026, 2, 5);

/**
 * Personal Target page — Figma node 2217:11578.
 *
 * Shell layout (no employee picker / stats / breakdown):
 *
 *   Toolbar  : "Personal Target" 22/20 #343434 + Month/Week/Day + Filters + Set Task
 *   Sub-tabs : "All Tasks / To do list" — Bold 16/16, gap-40, active blue underline
 *   Period   : < March 2026 > + view switcher
 *   View     : Board / List / Calendar (reuses tasks/* components)
 */
export function PersonalTargetView() {
  const [tasks, setTasks] = React.useState<TaskRecord[]>(() => [
    ...MOCK_TASK_RECORDS,
    ...buildCalendarFiller(DEFAULT_DATE),
  ]);
  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">(
    "all",
  );
  const [viewMode, setViewMode] = React.useState<TaskViewMode>("calendar");
  const [range, setRange] = React.useState<TaskCalendarRange>("month");
  const [anchor, setAnchor] = React.useState<Date>(DEFAULT_DATE);
  const [monthTab, setMonthTab] = React.useState<MonthViewTab>("todo");

  const [setTaskOpen, setSetTaskOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskRecord | undefined>();
  const [detailsTask, setDetailsTask] = React.useState<TaskRecord | null>(null);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<TaskFilterValues>({});

  React.useEffect(() => {
    setTasks((prev) => {
      const monthKey = `cal-${anchor.getFullYear()}-${anchor.getMonth() + 1}-`;
      if (prev.some((t) => t.id.startsWith(monthKey))) return prev;
      return [...prev, ...buildCalendarFiller(anchor)];
    });
  }, [anchor]);

  const periodFiltered = React.useMemo(
    () => tasks.filter((task) => withinPeriod(task, anchor, range)),
    [tasks, anchor, range],
  );

  const visibleTasks = React.useMemo(() => {
    return periodFiltered.filter((task) => {
      if (statusFilter !== "all" && task.status !== statusFilter) return false;
      if (viewMode === "calendar" && range === "month" && monthTab === "todo") {
        if (task.status !== "todo") return false;
      }
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
  }, [periodFiltered, statusFilter, filters, viewMode, range, monthTab]);

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
      prev.map((t) => (t.id === task.id ? { ...t, status: "completed" } : t)),
    );
    setDetailsTask(null);
  };

  const handleMoveTaskStatus = (taskId: string, nextStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)),
    );
  };

  const handleReorderTask = (taskId: string, target: BoardDropPosition) => {
    setTasks((prev) => {
      const dragged = prev.find((t) => t.id === taskId);
      if (!dragged) return prev;
      const without = prev.filter((t) => t.id !== taskId);
      const updated: TaskRecord = { ...dragged, status: target.status };
      if (target.kind === "empty") return [...without, updated];
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
    hour?: number,
  ) => {
    const iso = `${nextDay.getFullYear()}-${String(
      nextDay.getMonth() + 1,
    ).padStart(2, "0")}-${String(nextDay.getDate()).padStart(2, "0")}`;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updated: TaskRecord = { ...t, dueDate: iso };
        if (hour !== undefined) {
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
      }),
    );
  };

  const showMonthTabs = viewMode === "calendar" && range === "month";

  return (
    <div className="flex-1 min-w-0 px-6 py-6 flex flex-col gap-5 bg-white overflow-x-hidden">
      <TaskOverviewToolbar
        title="Personal Target"
        range={range}
        onRangeChange={setRange}
        onFilters={() => setFilterOpen(true)}
        onCreateTask={() => handleOpenSetTask()}
      />

      {showMonthTabs && (
        <MonthViewTabs value={monthTab} onChange={setMonthTab} />
      )}

      <div className="flex items-center justify-between gap-3 shrink-0 bg-white">
        <TaskPeriodNavigator value={anchor} onChange={setAnchor} range={range} />
        <TaskViewSwitcher value={viewMode} onChange={setViewMode} />
      </div>

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
  range: TaskCalendarRange,
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
