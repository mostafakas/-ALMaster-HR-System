"use client";

import * as React from "react";
import { ProjectSubHeader } from "@/components/project-management/projects/project-sub-header";
import { TaskStatsGrid } from "@/components/tasks/task-stats-grid";
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
import {
  type TaskCalendarRange,
  type TaskRecord,
  type TaskStatus,
  type TaskViewMode,
} from "@/lib/types/task";
import type { TaskFilterValues } from "@/lib/validations/task";
import { getProjectMeta } from "@/lib/data/projects";

const DEFAULT_DATE = new Date(2026, 2, 19);

/**
 * Per-project Tasks page — same modular components as the global
 * AlMaster Tasks overview but pre-scoped to a single project.
 */
export default function ProjectTasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params);
  const meta = getProjectMeta(projectId);

  const [tasks, setTasks] = React.useState<TaskRecord[]>(() => {
    const base = meta.key
      ? MOCK_TASK_RECORDS.filter((t) => t.project === meta.key)
      : MOCK_TASK_RECORDS;
    return [...base, ...buildCalendarFiller(DEFAULT_DATE)];
  });

  const [statusFilter, setStatusFilter] = React.useState<TaskStatus | "all">(
    "all"
  );
  const [viewMode, setViewMode] = React.useState<TaskViewMode>("board");
  const [range, setRange] = React.useState<TaskCalendarRange>("month");
  const [anchor, setAnchor] = React.useState<Date>(DEFAULT_DATE);

  // Top up filler for unvisited months — same pattern as TasksOverview.
  React.useEffect(() => {
    setTasks((prev) => {
      const monthKey = `cal-${anchor.getFullYear()}-${anchor.getMonth() + 1}-`;
      if (prev.some((t) => t.id.startsWith(monthKey))) return prev;
      return [...prev, ...buildCalendarFiller(anchor)];
    });
  }, [anchor]);

  const [setTaskOpen, setSetTaskOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<TaskRecord | undefined>();
  const [detailsTask, setDetailsTask] = React.useState<TaskRecord | null>(null);
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<TaskFilterValues>({});

  const visibleTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      if (statusFilter !== "all" && t.status !== statusFilter) return false;
      if (filters.priority && filters.priority.length > 0 && !filters.priority.includes(t.priority))
        return false;
      if (filters.weight && filters.weight.length > 0 && !filters.weight.includes(t.weight))
        return false;
      if (
        filters.departments &&
        filters.departments.length > 0 &&
        !filters.departments.includes(t.department)
      )
        return false;
      return true;
    });
  }, [tasks, statusFilter, filters]);

  return (
    <div className="flex-1 h-full overflow-hidden p-6 flex flex-col gap-8">
      <div className="shrink-0">
        <ProjectSubHeader
          projectId={projectId}
          title={meta.title}
          description={meta.description}
        />
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6">
        <div className="shrink-0">
          <TaskOverviewToolbar
            title="Project Tasks"
            range={range}
            onRangeChange={setRange}
            onFilters={() => setFilterOpen(true)}
            onCreateTask={() => {
              setEditingTask(undefined);
              setSetTaskOpen(true);
            }}
          />
        </div>

        <div className="shrink-0">
          <TaskStatsGrid
            tasks={tasks}
            selectedStatus={statusFilter}
            onSelectStatus={setStatusFilter}
          />
        </div>

        {/* <div className="h-px bg-border w-full shrink-0" /> */}

        <div className="flex items-center justify-between gap-3 shrink-0">
          <TaskPeriodNavigator
            value={anchor}
            onChange={setAnchor}
            range={range}
          />
          <TaskViewSwitcher value={viewMode} onChange={setViewMode} />
        </div>

        <div className="h-[85vh] overflow-y-auto overflow-x-hidden no-scrollbar rounded-3xl pb-[7px]">
          {viewMode === "board" && (
            <TaskBoardView
              tasks={visibleTasks}
              onCreateInStatus={(status) => {
                setStatusFilter(status);
                setEditingTask(undefined);
                setSetTaskOpen(true);
              }}
              onOpenTask={setDetailsTask}
              onMoveTask={(taskId, nextStatus) =>
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId ? { ...t, status: nextStatus } : t
                  )
                )
              }
              onReorderTask={(taskId, target: BoardDropPosition) => {
                setTasks((prev) => {
                  const dragged = prev.find((t) => t.id === taskId);
                  if (!dragged) return prev;
                  const without = prev.filter((t) => t.id !== taskId);
                  const updated: TaskRecord = {
                    ...dragged,
                    status: target.status,
                  };
                  if (target.kind === "empty") return [...without, updated];
                  const idx = without.findIndex(
                    (t) => t.id === target.cardId
                  );
                  if (idx === -1) return [...without, updated];
                  const insertAt =
                    target.kind === "before" ? idx : idx + 1;
                  return [
                    ...without.slice(0, insertAt),
                    updated,
                    ...without.slice(insertAt),
                  ];
                });
              }}
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
              onMoveTaskToDay={(taskId, nextDay, hour) => {
                const iso = `${nextDay.getFullYear()}-${String(
                  nextDay.getMonth() + 1
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
                  })
                );
              }}
            />
          )}
        </div>
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
        onEdit={(task) => {
          setDetailsTask(null);
          setEditingTask(task);
          setSetTaskOpen(true);
        }}
        onMarkAsDone={(task) => {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === task.id ? { ...t, status: "completed" } : t
            )
          );
          setDetailsTask(null);
        }}
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
