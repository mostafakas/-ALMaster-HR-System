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

export const HR_DEPARTMENTS_MOCK: any[] = [];
