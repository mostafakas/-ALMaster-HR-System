/**
 * Mock data for the PM "Employees' Target" page (frames 2126:46100 etc).
 *
 * Drives the left employee-picker sidebar and the per-employee target
 * widgets (Target Progress card, Recent Activities, Tasks Breakdown).
 */

import type { TaskMember } from "@/lib/types/task";

export type EmployeeOnlineStatus = "online" | "offline";

export interface EmployeeTargetActivity {
  id: string;
  actor: string;
  /** What changed — e.g. "landing page" */
  subject: string;
  /** Status the task was moved to — e.g. "Waiting Review" */
  status: string;
  /** Tailwind class for the coloured status mention. */
  statusTone: string;
  /** Relative time string — kept static for the mock. */
  ago: string;
}

export interface EmployeeTargetRecord {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: EmployeeOnlineStatus;
  team: string;
  /** 0–100 progress of the employee's target this month. */
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  /** When > 0 a red "Overdue Tasks" badge appears next to the percent. */
  overdueTasks: number;
  /** When true the row gets a green "Bonus Tasks" badge (over 100% achievers). */
  bonusTasks?: number;
  /** Total stat tile (top of main panel). */
  totalTasks: number;
  /** Per-status counts (top stat strip + breakdown card). */
  counts: {
    todo: number;
    inProgress: number;
    waitingReview: number;
    completed: number;
    overdue: number;
  };
  /** Latest activity entries — newest first. */
  activities: EmployeeTargetActivity[];
}

export interface EmployeeTeamGroup {
  /** Section title — "You" / "Programming Team" / etc. */
  label: string;
  /** Whether the group is initially open. */
  defaultOpen?: boolean;
  members: EmployeeTargetRecord[];
}

/* ─── Members ───────────────────────────────────────────────────────── */

const AVATAR = "https://ui.shadcn.com/avatars/01.png";

const baseActivities = (name: string): EmployeeTargetActivity[] => [
  {
    id: "a1",
    actor: name,
    subject: "landing page",
    status: "Waiting Review",
    statusTone: "text-warning",
    ago: "10 minutes ago",
  },
  {
    id: "a2",
    actor: name,
    subject: "landing page",
    status: "Waiting Review",
    statusTone: "text-warning",
    ago: "10 minutes ago",
  },
];

const buildEmployee = (
  id: string,
  team: string,
  progress: number,
  overdueTasks = 0,
  bonusTasks?: number
): EmployeeTargetRecord => ({
  id,
  name: "",
  role: "Company Super Admin",
  avatar: AVATAR,
  status: "online",
  team,
  progress,
  tasksCompleted: 32,
  tasksTotal: 40,
  overdueTasks,
  bonusTasks,
  totalTasks: 238,
  counts: {
    todo: 126,
    inProgress: 12,
    waitingReview: 12,
    completed: 16,
    overdue: 12,
  },
  activities: baseActivities(""),
});

export const EMPLOYEE_TARGET_TEAMS: EmployeeTeamGroup[] = [
  {
    label: "You",
    defaultOpen: true,
    members: [buildEmployee("you-1", "You", 65)],
  },
  {
    label: "Programming Team",
    defaultOpen: true,
    members: [
      buildEmployee("pt-1", "Programming Team", 65, 2),
      buildEmployee("pt-2", "Programming Team", 65, 2),
      buildEmployee("pt-3", "Programming Team", 65, 2),
    ],
  },
  {
    label: "Graphic Design Team",
    defaultOpen: true,
    members: [
      {
        ...buildEmployee("gd-1", "Graphic Design Team", 125, 0, 10),
        tasksCompleted: 50,
        tasksTotal: 40,
      },
      buildEmployee("gd-2", "Graphic Design Team", 65, 2),
    ],
  },
  {
    label: "Graphic Design Team",
    defaultOpen: false,
    members: [],
  },
];

/**
 * Flat employee list — order matches sidebar display order so we can
 * pick a default selection by id.
 */
export const EMPLOYEE_TARGET_LIST: EmployeeTargetRecord[] =
  EMPLOYEE_TARGET_TEAMS.flatMap((g) => g.members);

export const DEFAULT_SELECTED_EMPLOYEE_ID = "pt-1";

/* ─── Member adapter so existing task views can reuse this person ──── */

export function toTaskMember(emp: EmployeeTargetRecord): TaskMember {
  return {
    id: emp.id,
    name: emp.name,
    role: emp.role,
    avatar: emp.avatar,
  };
}
