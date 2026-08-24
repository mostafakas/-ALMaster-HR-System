"use client";

import * as React from "react";
import Image from "next/image";
import { Search, ChevronDown, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

import { useGetEmployeesQuery } from "@/lib/store/services/employeeApi";

// Swap this function body for an API call when backend is ready.
// Signature stays the same: (query, departments) => filtered departments.
function filterDepartments(query: string, deps: Department[]): Department[] {
  const q = query.toLowerCase().trim();
  if (!q) return deps;
  return deps
    .map((dept) => ({
      ...dept,
      employees: dept.employees.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      ),
    }))
    .filter((dept) => dept.employees.length > 0);
}

type EmployeeStatus = "Online" | "Meeting" | "Break" | "IDLE" | "Offline";

const STATUS_CONFIG: Record<EmployeeStatus, { label: string; color: string; bg: string; dot: string }> = {
  Online: { label: "Online", color: "var(--success)", bg: "bg-success/10", dot: "bg-success" },
  Meeting: { label: "Meeting", color: "var(--warning)", bg: "bg-warning/10", dot: "bg-warning" },
  Break: { label: "Break", color: "var(--muted-foreground)", bg: "bg-muted", dot: "bg-muted-foreground" },
  IDLE: { label: "IDLE", color: "var(--destructive)", bg: "bg-destructive/10", dot: "bg-destructive" },
  Offline: { label: "Offline", color: "var(--muted-foreground)", bg: "bg-muted", dot: "bg-muted-foreground" },
};


interface Employee {
  id: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  avatar?: string;
  originalData?: any;
}

interface Department {
  name: string;
  employees: Employee[];
}

const AVATAR_DEFAULT = "https://ui.shadcn.com/avatars/01.png";

interface EmployeeListPanelProps {
  selectedEmployeeId?: string;
  onSelectEmployee: (employee: Employee) => void;
  onAddEmployee?: () => void;
}

/* ─── Avatar ──────────────────────────────────────────────────────────── */
function EmployeeAvatar({ src, status }: { src?: string; status: EmployeeStatus }) {
  return (
    <div className="relative shrink-0 size-10" data-node-id="137:6770">
      <div className="size-full rounded-[20px] overflow-hidden relative">
        <Image
          src={src || AVATAR_DEFAULT}
          alt=""
          fill
          className="object-cover object-top"
          sizes="40px"
        />
      </div>
      <div
        className={cn("absolute size-[6.667px] rounded-full z-10 border border-white", STATUS_CONFIG[status]?.dot || STATUS_CONFIG.Offline.dot)}
        style={{ bottom: "1.67px", right: "1.67px" }}
        data-node-id="137:6771"
      />
    </div>
  );
}

/* ─── Employee Card ───────────────────────────────────────────────────── */
const EmployeeCard = React.memo(function EmployeeCard({
  employee,
  isYou = false,
  isSelected = false,
  onClick,
}: {
  employee: Employee;
  isYou?: boolean;
  isSelected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-start justify-between w-full p-3 rounded-lg transition-colors duration-200 cursor-pointer border-none text-left",
        isYou
          ? "bg-primary/10 border-l-4 border-solid border-primary"
          : isSelected
            ? "bg-primary/5"
            : "bg-secondary hover:bg-secondary/80"
      )}

    >
      {/* Left: avatar + name/role */}
      <div className="flex items-center gap-2 shrink-0">
        <EmployeeAvatar src={employee.avatar} status={employee.status || "Offline"} />
        <div className="flex flex-col gap-1 items-start">
          <div className="flex items-center gap-1">
            <Typography as="span" className="text-sm font-bold text-foreground leading-[16px] whitespace-nowrap">
              {employee.name}
            </Typography>
          </div>
          <Typography as="span" className="text-xs font-bold text-muted-foreground leading-[16px] whitespace-nowrap">
            {employee.role}
          </Typography>
        </div>

      </div>

      {/* Right: status badge */}
      <div
        className={cn(
          "flex items-center justify-center px-1.5 py-[3px] rounded-[6px] shrink-0",
          (STATUS_CONFIG[employee.status] || STATUS_CONFIG.Offline).bg
        )}
      >
        <Typography
          as="span"
          className="text-[10px] font-bold leading-[14px] whitespace-nowrap"
          style={{ color: (STATUS_CONFIG[employee.status] || STATUS_CONFIG.Offline).color }}
        >
          {(STATUS_CONFIG[employee.status] || STATUS_CONFIG.Offline).label}
        </Typography>
      </div>
    </button>
  );
});

/* ─── Section chevron ─────────────────────────────────────────────────── */
function SectionChevron({ expanded }: { expanded: boolean }) {
  return (
    <div
      className="flex items-center justify-center shrink-0 transition-transform duration-200"
      style={{ transform: expanded ? "scaleY(-1)" : "scaleY(1)" }}
    >
      <ChevronDown className="size-4 text-foreground" />
    </div>

  );
}

/* ─── List Section ────────────────────────────────────────────────────── */
function ListSection({
  title,
  employees,
  isExpanded,
  onToggle,
  onSelectEmployee,
  selectedEmployeeId,
}: {
  title: string;
  employees: Employee[];
  isExpanded: boolean;
  onToggle: () => void;
  onSelectEmployee: (emp: Employee) => void;
  selectedEmployeeId?: string;
}) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <Typography as="span" className="text-sm font-bold text-foreground leading-[16px]">
          {title}
        </Typography>

        <SectionChevron expanded={isExpanded} />
      </button>

      {isExpanded && employees.length > 0 && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {employees.map((emp) => (
            <EmployeeCard
              key={emp.id}
              employee={emp}
              isSelected={emp.id === selectedEmployeeId}
              onClick={() => onSelectEmployee(emp)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Panel ──────────────────────────────────────────────────────── */
export function EmployeeListPanel({
  selectedEmployeeId,
  onSelectEmployee,
  onAddEmployee,
}: EmployeeListPanelProps) {
  const [search, setSearch] = React.useState("");
  const [expandedDepts, setExpandedDepts] = React.useState<Record<string, boolean>>({
    "Programming Team": true,
  });

  const { data: apiData, isLoading } = useGetEmployeesQuery();

  const departments = React.useMemo(() => {
    if (!apiData || !apiData.items) return [];
    const grouped: Record<string, Employee[]> = {};
    
    apiData.items.forEach((item: any) => {
      const deptName = item.department?.name || "Unassigned";
      if (!grouped[deptName]) grouped[deptName] = [];
      grouped[deptName].push({
        id: item.id,
        name: item.fullName || "Unknown",
        role: item.jobTitle || item.role || "Employee",
        status: "Online", // Or logic to map status
        originalData: item
      });
    });

    return Object.entries(grouped).map(([name, employees]) => ({ name, employees }));
  }, [apiData]);

  const debouncedSearch = useDebounce(search, 300);
  const visibleDepartments = React.useMemo(
    () => filterDepartments(debouncedSearch, departments),
    [debouncedSearch, departments]
  );
  const isSearching = debouncedSearch.trim().length > 0;

  const toggleSection = (name: string) =>
    setExpandedDepts((prev) => ({ ...prev, [name]: !prev[name] }));

  const ME: Employee = {
    id: "me",
    name: "Daniel Brown",
    role: "Company Super Admin",
    status: "Online",
    avatar: AVATAR_DEFAULT,
  };

  return (
    <div className="w-[440px] shrink-0 bg-background border-r border-border flex flex-col h-full overflow-hidden">

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col px-4 py-8">

        {/* ── Header block ── */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Typography as="span" className="text-2xl font-bold text-foreground leading-[20px] whitespace-nowrap">
                Employees
              </Typography>
            </div>
            <button
              onClick={onAddEmployee}
              className="h-9 px-3 bg-primary hover:bg-primary/90 rounded-lg text-primary-foreground text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <UserPlus className="size-3" />
              New Employee
            </button>
          </div>

          <div className="h-px w-full bg-border" />
        </div>

        {/* ── Content block (gap-16 matches Figma) ── */}
        <div className="flex flex-col gap-4 mt-5">

          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              placeholder="Search Employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-secondary rounded-lg pl-8 pr-3 text-xs font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold outline-none border border-transparent focus:border-primary/20 focus:bg-background transition-all"
            />
          </div>


          {/* You section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between w-full">
              <Typography as="span" className="text-sm font-bold text-foreground leading-[16px]">You</Typography>
              <SectionChevron expanded={true} />
            </div>

            <EmployeeCard
              employee={ME}
              isYou
              onClick={() => onSelectEmployee(ME)}
            />
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Departments */}
          {visibleDepartments.length === 0 ? (
            <Typography as="p" className="text-xs font-bold text-muted text-center py-2">
              No employees found
            </Typography>
          ) : (

            visibleDepartments.map((dept, idx) => (
              <React.Fragment key={dept.name}>
                <ListSection
                  title={dept.name}
                  employees={dept.employees}
                  isExpanded={isSearching || (expandedDepts[dept.name] ?? false)}
                  onToggle={() => toggleSection(dept.name)}
                  onSelectEmployee={onSelectEmployee}
                  selectedEmployeeId={selectedEmployeeId}
                />
                {idx < visibleDepartments.length - 1 && (
                  <div className="h-px w-full bg-border" />
                )}
              </React.Fragment>
            ))
          )}

        </div>
      </div>
    </div>
  );
}

export type { Employee, EmployeeStatus };
