import type { TaskProjectKey } from "@/lib/types/task";

export type ProjectStatus = "In Progress" | "Planning" | "On Hold" | "Completed";

export interface ProjectMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ProjectDepartmentBadge {
  label: string;
  theme: "primary" | "warning" | "success" | "ai" | "purple" | "destructive" | "info";
}

export interface ProjectRecord {
  id: string;
  key: TaskProjectKey | null;
  title: string;
  description: string;
  timeline: string;
  departments: ProjectDepartmentBadge[];
  members: ProjectMember[];
  progress: number;
  status: ProjectStatus;
  budget: {
    spent: number;
    total: number;
    currency: string;
  };
  taskCounts: {
    total: number;
    completed: number;
    inProgress: number;
    todo: number;
    waitingReview: number;
  };
}

const SAMPLE_MEMBERS: ProjectMember[] = [
  {
    id: "m1",
    name: "Daniel Brown",
    role: "Web Developer",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  {
    id: "m2",
    name: "Sara Khan",
    role: "UI/UX Designer",
    avatar: "https://ui.shadcn.com/avatars/02.png",
  },
  {
    id: "m3",
    name: "Omar Ali",
    role: "Backend Engineer",
    avatar: "https://ui.shadcn.com/avatars/03.png",
  },
];

export const PROJECTS: ProjectRecord[] = [
  {
    id: "diyar-platform",
    key: "diyar-platform",
    title: "Diyar Platform",
    description:
      "Software design, development, UI/UX, and technical operations.",
    timeline: "Dec 15, 2025 - Feb 24, 2026",
    departments: [
      { label: "Content Writing", theme: "destructive" },
      { label: "Artificial Intelligence", theme: "purple" },
      { label: "Design", theme: "success" },
    ],
    members: SAMPLE_MEMBERS,
    progress: 42,
    status: "In Progress",
    budget: { spent: 35000, total: 85000, currency: "SR" },
    taskCounts: {
      total: 120,
      completed: 58,
      inProgress: 18,
      todo: 40,
      waitingReview: 4,
    },
  },
  {
    id: "almaster-system",
    key: null,
    title: "AlMaster System",
    description: "Internal management system for HR and Project Management.",
    timeline: "Jan 10, 2026 - May 15, 2026",
    departments: [
      { label: "Fullstack", theme: "primary" },
      { label: "DevOps", theme: "warning" },
    ],
    members: SAMPLE_MEMBERS.slice(0, 2),
    progress: 15,
    status: "Planning",
    budget: { spent: 12000, total: 60000, currency: "SR" },
    taskCounts: {
      total: 32,
      completed: 4,
      inProgress: 8,
      todo: 18,
      waitingReview: 2,
    },
  },
];

export function getProjectById(id: string): ProjectRecord | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Same shape used by per-project Tasks page so it can scope MOCK_TASK_RECORDS. */
export function getProjectMeta(id: string): {
  key: TaskProjectKey | null;
  title: string;
  description: string;
} {
  const project = getProjectById(id);
  if (project) {
    return {
      key: project.key,
      title: project.title,
      description: project.description,
    };
  }
  return { key: null, title: "Project Tasks", description: "" };
}
