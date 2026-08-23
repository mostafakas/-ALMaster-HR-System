/**
 * Mock data for the AlMaster Tasks "Home [Overview]" page.
 *
 * Provides a deterministic dataset that fills every status column, the list
 * table, and the Month / Week / Day calendar views from the Figma design.
 */

import type { TaskMember, TaskRecord } from "@/lib/types/task";

export const TASK_MEMBERS: TaskMember[] = [
  {
    id: "u1",
    name: "Daniel Brown",
    role: "Super Admin",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  {
    id: "u2",
    name: "Matt Scott",
    role: "UI/UX Designer",
    avatar: "https://ui.shadcn.com/avatars/02.png",
  },
  {
    id: "u3",
    name: "Daniel Scott",
    role: "Content Creator",
    avatar: "https://ui.shadcn.com/avatars/03.png",
  },
  {
    id: "u4",
    name: "John Smith",
    role: "Content Manager",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },
  {
    id: "u5",
    name: "Sarah Johnson",
    role: "AI Engineer",
    avatar: "https://ui.shadcn.com/avatars/05.png",
  },
];

const byId = (id: string): TaskMember =>
  TASK_MEMBERS.find((m) => m.id === id) ?? TASK_MEMBERS[0];

let nextId = 1;
const id = () => `task-${nextId++}`;

export const MOCK_TASK_RECORDS: TaskRecord[] = [
  // ── To Do ──────────────────────────────────────────────────────────
  {
    id: id(),
    title: "Review The Latest Article",
    description:
      "Review the latest editorial submissions for the Diyar Platform launch.",
    status: "todo",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "content-writing",
    cost: 0,
    dueDate: "2026-03-19",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Editorial polish pass.",
    status: "todo",
    priority: "low",
    weight: "minor",
    project: "diyar-platform",
    department: "content-writing",
    dueDate: "2026-03-02",
    createdBy: byId("u1"),
    assignees: [byId("u2"), byId("u3"), byId("u4")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Validate AI model accuracy benchmarks.",
    status: "todo",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-03-02",
    createdBy: byId("u5"),
    assignees: [byId("u1"), byId("u3"), byId("u4")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Polish navigation bar interactions.",
    status: "todo",
    priority: "low",
    weight: "average",
    project: "maiyah-app",
    department: "content-writing",
    dueDate: "2026-03-02",
    createdBy: byId("u2"),
    assignees: [byId("u1"), byId("u4"), byId("u5")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Model dataset audit.",
    status: "todo",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-03-02",
    createdBy: byId("u5"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },

  // ── In Progress ────────────────────────────────────────────────────
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Implement dashboard charts.",
    status: "in-progress",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "content-writing",
    cost: 25000,
    costFreelancer: true,
    dueDate: "2026-03-02",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
    attachments: [
      {
        id: "att-1",
        name: "Marketing Notes Jan 2026.docx",
        size: "256 KB",
        pages: 2,
        type: "doc",
      },
      {
        id: "att-2",
        name: "Marketing Notes Jan 2026.docx",
        size: "256 KB",
        pages: 2,
        type: "doc",
      },
    ],
    comments: [
      {
        id: "c-1",
        authorId: "u3",
        authorName: "Daniel Scott",
        authorRole: "Content Writer",
        authorAvatar: "https://ui.shadcn.com/avatars/03.png",
        content: "When will you finish this task?",
        createdAt: "9:13 AM",
      },
      {
        id: "c-2",
        authorId: "u1",
        authorName: "Daniel Brown",
        authorRole: "Super Admin",
        authorAvatar: "https://ui.shadcn.com/avatars/01.png",
        content: "I will hand it off to you in 2 hours",
        createdAt: "9:13 AM",
      },
      {
        id: "c-3",
        authorId: "u3",
        authorName: "Daniel Scott",
        authorRole: "Content Writer",
        authorAvatar: "https://ui.shadcn.com/avatars/03.png",
        content:
          "Don't forget to mark it as done as I can review it shortly.",
        createdAt: "9:13 AM",
      },
    ],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Iterate on AI inference latency tuning.",
    status: "in-progress",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-03-02",
    createdBy: byId("u5"),
    assignees: [byId("u1"), byId("u4")],
  },

  // ── Waiting Review ─────────────────────────────────────────────────
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Awaiting manager review.",
    status: "waiting-review",
    priority: "medium",
    weight: "average",
    project: "diyar-platform",
    department: "content-writing",
    dueDate: "2026-03-02",
    createdBy: byId("u4"),
    assignees: [byId("u1")],
  },

  // ── Completed ──────────────────────────────────────────────────────
  {
    id: id(),
    title: "Review The Latest Article",
    description: "AI module shipped.",
    status: "completed",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-03-02",
    createdBy: byId("u5"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Released the editorial guidelines.",
    status: "completed",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "content-writing",
    dueDate: "2026-03-02",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Final AI inference suite.",
    status: "completed",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-03-02",
    createdBy: byId("u5"),
    assignees: [byId("u1")],
  },

  // ── Overdue ────────────────────────────────────────────────────────
  {
    id: id(),
    title: "Review The Latest Article",
    description: "Overdue editorial review.",
    status: "overdue",
    priority: "high",
    weight: "average",
    project: "diyar-platform",
    department: "content-writing",
    dueDate: "2026-02-26",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },

  // ── Extra entries to fill the list / calendar density ──────────────
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Maiyah programming sprint task.",
    status: "completed",
    priority: "medium",
    weight: "average",
    project: "maiyah-app",
    department: "programming",
    dueDate: "2026-02-11",
    createdBy: byId("u2"),
    assignees: [byId("u1"), byId("u3"), byId("u4")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Design polish for Diyar.",
    status: "in-progress",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "design",
    dueDate: "2026-02-11",
    createdBy: byId("u2"),
    assignees: [byId("u1"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "AI evaluation pass for Maiyah.",
    status: "todo",
    priority: "high",
    weight: "master",
    project: "maiyah-app",
    department: "artificial-intelligence",
    dueDate: "2026-02-11",
    createdBy: byId("u5"),
    assignees: [byId("u1")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Marketing brief writing.",
    status: "in-progress",
    priority: "medium",
    weight: "average",
    project: "maiyah-app",
    department: "marketing",
    dueDate: "2026-02-11",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Design polish for Diyar.",
    status: "overdue",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "design",
    dueDate: "2026-02-11",
    createdBy: byId("u1"),
    assignees: [byId("u4")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Finance reconciliation.",
    status: "todo",
    priority: "low",
    weight: "minor",
    project: "diyar-platform",
    department: "finance",
    dueDate: "2026-02-11",
    createdBy: byId("u4"),
    assignees: [byId("u1")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "AI checklist pass.",
    status: "in-progress",
    priority: "high",
    weight: "master",
    project: "diyar-platform",
    department: "artificial-intelligence",
    dueDate: "2026-02-11",
    createdBy: byId("u5"),
    assignees: [byId("u1"), byId("u2"), byId("u3")],
  },
  {
    id: id(),
    title: "Review The Latest Article content",
    description: "Marketing campaign report.",
    status: "completed",
    priority: "medium",
    weight: "normal",
    project: "diyar-platform",
    department: "marketing",
    dueDate: "2026-02-11",
    createdBy: byId("u4"),
    assignees: [byId("u1"), byId("u2")],
  },
];

/* ─── Synthesised tasks per day for calendar density ────────────────── */

const calendarLabels = [
  "Landing Page Review",
  "Start new Campaign",
  "Write New Report",
];

const calendarStatuses: TaskRecord["status"][] = [
  "todo",
  "in-progress",
  "completed",
];

/* Varying duration cycle (in hours) for synthetic tasks so the Day view
 * shows multi-hour spans like the Figma reference (1h / 1h / 3h / 1h / 5h). */
const calendarDurations = [1, 1, 3, 1, 5, 1, 2];

/** Generates synthetic mini-tasks for the Month calendar grid so each cell
 * shows a small set of varied entries — mirrors the Figma density. */
export function buildCalendarFiller(month: Date): TaskRecord[] {
  const year = month.getFullYear();
  const m = month.getMonth();
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const filler: TaskRecord[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const slots = (day % 4) + 1;
    let hourCursor = 8;
    for (let i = 0; i < slots; i++) {
      const dur =
        calendarDurations[(day + i) % calendarDurations.length] ?? 1;
      // Stop generating once we run past 7 PM.
      if (hourCursor + dur > 20) break;
      filler.push({
        id: `cal-${year}-${m + 1}-${day}-${i}`,
        title: calendarLabels[(day + i) % calendarLabels.length],
        description: "",
        status: calendarStatuses[(day + i) % calendarStatuses.length],
        priority: "medium",
        weight: "normal",
        project: "diyar-platform",
        department: "content-writing",
        dueDate: `${year}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        startTime: `${hourCursor}:00`,
        endTime: `${hourCursor + dur}:00`,
        createdBy: byId("u1"),
        assignees: [byId(`u${((day + i) % 5) + 1}`)],
      });
      hourCursor += dur;
    }
  }
  return filler;
}
