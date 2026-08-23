/**
 * Task domain types shared across the AlMaster Tasks module.
 *
 * Mirrors the Figma "Home [Overview]" frame (node 2126:34403) and its
 * derivatives (Board / List / Calendar / Modals).
 *
 * Two surface area shapes coexist:
 *   - {@link Task} — the legacy compact shape used by the per-project
 *     PM views (KanbanBoard, TaskTable, TaskCalendar).
 *   - {@link TaskRecord} — the richer record used by the global
 *     "AlMaster Tasks" home overview (stats, modals, calendar variants).
 *
 * `toLegacyTask` adapts the rich record to the compact shape so existing
 * views can keep rendering without forking implementations.
 */

/* ─── Legacy compact shape (unchanged) ─────────────────────────────── */

export interface TaskAssignee {
  name: string;
  image: string;
}

export interface TaskCreator {
  name: string;
  image: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  department: string;
  status: "To Do" | "In Progress" | "Waiting Review" | "Done";
  assignees: TaskAssignee[];
  dueDate: string;
  creator: TaskCreator;
}

export type TaskView = "board" | "list" | "calendar";

/* ─── Rich shape used by AlMaster Tasks overview ───────────────────── */

export type TaskStatus =
  | "todo"
  | "in-progress"
  | "waiting-review"
  | "completed"
  | "overdue";

export type TaskPriority = "low" | "medium" | "high";

export type TaskWeight = "minor" | "average" | "normal" | "master";

export type TaskDepartmentKey =
  | "content-writing"
  | "programming"
  | "design"
  | "artificial-intelligence"
  | "marketing"
  | "finance";

export type TaskProjectKey =
  | "diyar-platform"
  | "maiyah-app"
  | "kim-alzaem"
  | "mobsoft-app";

export interface TaskMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface TaskAttachment {
  id: string;
  name: string;
  size: string;
  pages?: number;
  type: "pdf" | "doc" | "image" | "other";
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface TaskRecord {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  weight: TaskWeight;
  project: TaskProjectKey;
  department: TaskDepartmentKey;
  cost?: number;
  costFreelancer?: boolean;
  /** ISO date string (yyyy-mm-dd) used for sorting/filtering. */
  dueDate: string;
  startTime?: string;
  endTime?: string;
  createdBy: TaskMember;
  assignees: TaskMember[];
  attachments?: TaskAttachment[];
  comments?: TaskComment[];
}

export type TaskViewMode = "board" | "list" | "calendar";
export type TaskCalendarRange = "month" | "week" | "day";

/* ─── Status / project / department metadata (lookup tables) ────────── */

export const TASK_STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    subtitle: string;
    /** Solid bg utility — used in stat cards. */
    solidBg: string;
    /** Text against solid bg. */
    solidFg: string;
    /** Tinted bg utility — used in badges and column body. */
    tintBg: string;
    /** Text against tinted bg. */
    tintFg: string;
    /** Solid dot utility. */
    dot: string;
    /** CSS color token usable in inline style (border-left, etc). */
    cssVar: string;
    /** CSS color token for tinted bg, inline style. */
    cssTintVar: string;
  }
> = {
  todo: {
    label: "To do",
    subtitle: "Not Started Yet",
    solidBg: "bg-purple",
    solidFg: "text-white",
    tintBg: "bg-purple-10",
    tintFg: "text-purple",
    dot: "bg-purple",
    cssVar: "var(--color-purple)",
    cssTintVar: "var(--color-purple-10)",
  },
  "in-progress": {
    label: "In progress",
    subtitle: "Currently Being Executed",
    solidBg: "bg-primary",
    solidFg: "text-primary-foreground",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    dot: "bg-primary",
    cssVar: "var(--primary)",
    cssTintVar: "var(--color-primary-10)",
  },
  "waiting-review": {
    label: "Waiting Review",
    subtitle: "Awaits Managers Approve",
    solidBg: "bg-warning",
    solidFg: "text-warning-foreground",
    tintBg: "bg-warning/10",
    tintFg: "text-warning",
    dot: "bg-warning",
    cssVar: "var(--warning)",
    cssTintVar: "var(--color-warning-10)",
  },
  completed: {
    label: "Completed",
    subtitle: "Done Successfully",
    solidBg: "bg-success",
    solidFg: "text-success-foreground",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
    cssVar: "var(--success)",
    cssTintVar: "var(--color-success-10)",
  },
  overdue: {
    label: "Overdue",
    subtitle: "Due Time Passed",
    solidBg: "bg-destructive",
    solidFg: "text-destructive-foreground",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
    cssVar: "var(--destructive)",
    cssTintVar: "var(--color-destructive-10)",
  },
};

export const TASK_PROJECT_LABELS: Record<TaskProjectKey, string> = {
  "diyar-platform": "Diyar Platform",
  "maiyah-app": "Maiyah App",
  "kim-alzaem": "Kim AlZaem",
  "mobsoft-app": "MobSoft App",
};

export const TASK_DEPARTMENT_META: Record<
  TaskDepartmentKey,
  { label: string; tintBg: string; tintFg: string; solidBg: string; cssVar: string }
> = {
  "content-writing": {
    label: "Content Writing",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    solidBg: "bg-destructive",
    cssVar: "var(--destructive)",
  },
  programming: {
    label: "Programming",
    tintBg: "bg-primary/10",
    tintFg: "text-primary",
    solidBg: "bg-primary",
    cssVar: "var(--primary)",
  },
  design: {
    label: "Design",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    solidBg: "bg-success",
    cssVar: "var(--success)",
  },
  "artificial-intelligence": {
    label: "Artificial Intelligence",
    tintBg: "bg-purple-10",
    tintFg: "text-purple",
    solidBg: "bg-purple",
    cssVar: "var(--color-purple)",
  },
  marketing: {
    label: "Marketing",
    tintBg: "bg-warning/10",
    tintFg: "text-warning",
    solidBg: "bg-warning",
    cssVar: "var(--warning)",
  },
  finance: {
    label: "Finance",
    tintBg: "bg-info-10",
    tintFg: "text-info",
    solidBg: "bg-info",
    cssVar: "var(--color-info)",
  },
};

export const TASK_PRIORITY_META: Record<
  TaskPriority,
  { label: string; tintBg: string; tintFg: string; dot: string }
> = {
  low: {
    label: "Low",
    tintBg: "bg-success/10",
    tintFg: "text-success",
    dot: "bg-success",
  },
  medium: {
    label: "Medium",
    tintBg: "bg-warning/10",
    tintFg: "text-warning",
    dot: "bg-warning",
  },
  high: {
    label: "High",
    tintBg: "bg-destructive/10",
    tintFg: "text-destructive",
    dot: "bg-destructive",
  },
};

export const TASK_WEIGHT_LABELS: Record<TaskWeight, string> = {
  minor: "Minor",
  average: "Average",
  normal: "Normal",
  master: "Master",
};

/* ─── Adapter for legacy views ─────────────────────────────────────── */

const LEGACY_STATUS_MAP: Record<TaskStatus, Task["status"]> = {
  todo: "To Do",
  "in-progress": "In Progress",
  "waiting-review": "Waiting Review",
  completed: "Done",
  overdue: "Waiting Review",
};

export function toLegacyTask(record: TaskRecord): Task {
  return {
    id: record.id,
    title: record.title,
    project: TASK_PROJECT_LABELS[record.project],
    department: TASK_DEPARTMENT_META[record.department].label,
    status: LEGACY_STATUS_MAP[record.status],
    dueDate: legacyDate(record.dueDate),
    assignees: record.assignees.map((a) => ({
      name: a.name,
      image: a.avatar ?? "",
    })),
    creator: {
      name: record.createdBy.name,
      image: record.createdBy.avatar ?? "",
    },
  };
}

function legacyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}
