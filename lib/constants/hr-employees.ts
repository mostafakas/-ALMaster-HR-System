import type {
  EmployeeStatus,
  EmployeeFilterItem,
  DepartmentData,
} from "@/lib/types/hr-employee";

export const HR_STATUS_CONFIG: Record<
  EmployeeStatus,
  { color: string; bg: string }
> = {
  Online: { color: "#00b927", bg: "bg-[#00b927]/10" },
  Meeting: { color: "#f38328", bg: "bg-[#f38328]/10" },
  Break: { color: "#707070", bg: "bg-[#707070]/10" },
  IDLE: { color: "#f55050", bg: "bg-[#f55050]/10" },
  Offline: { color: "#707070", bg: "bg-muted" },
};

export const HR_EMPLOYEE_FILTERS: EmployeeFilterItem[] = [
  {
    label: "All Employees",
    active: true,
    color: "bg-primary",
    textColor: "text-white",
  },
  {
    label: "Online",
    active: false,
    color: "bg-success/10",
    textColor: "text-success",
  },
  {
    label: "Meeting",
    active: false,
    color: "bg-warning/10",
    textColor: "text-warning",
  },
  {
    label: "Break",
    active: false,
    color: "bg-muted/10",
    textColor: "text-muted-foreground",
  },
  {
    label: "IDLE",
    active: false,
    color: "bg-destructive/10",
    textColor: "text-destructive",
  },
  {
    label: "Offline",
    active: false,
    color: "bg-secondary",
    textColor: "text-foreground",
  },
];

export const HR_DEPARTMENTS_MOCK: DepartmentData[] = [
  {
    id: "dept-1",
    name: "Graphic Design Team",
    employeesCount: 3,
    onlineCount: 1,
    color: "#00B927",
    bg: "rgba(0, 185, 39, 0.1)",
    employees: [
      {
        id: "emp-1",
        name: "Daniel Brown",
        role: "Head of Programming",
        status: "IDLE",
        isFreelance: false,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
      {
        id: "emp-2",
        name: "Daniel Brown",
        role: "Team Leader",
        status: "Online",
        isFreelance: false,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
      {
        id: "emp-3",
        name: "Daniel Brown",
        role: "Programmer",
        status: "Break",
        isFreelance: true,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
    ],
  },
  {
    id: "dept-2",
    name: "Content Team",
    employeesCount: 4,
    onlineCount: 2,
    color: "#F55050",
    bg: "rgba(245, 80, 80, 0.1)",
    employees: [],
  },
  {
    id: "dept-3",
    name: "Artificial Intelligence Team",
    employeesCount: 3,
    onlineCount: 2,
    color: "#AA00FF",
    bg: "rgba(170, 0, 255, 0.1)",
    employees: [
      {
        id: "emp-4",
        name: "Daniel Brown",
        role: "Head of AI",
        status: "Online",
        isFreelance: false,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
      {
        id: "emp-5",
        name: "Daniel Brown",
        role: "Team Leader",
        status: "Meeting",
        isFreelance: false,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
      {
        id: "emp-6",
        name: "Daniel Brown",
        role: "AI Engineer",
        status: "Online",
        isFreelance: true,
        avatar: "https://ui.shadcn.com/avatars/01.png",
      },
    ],
  },
];
