"use client";

import * as React from "react";
import { ChevronDown, Users } from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";
import {
  statusConfig,
  type EmployeeStatus,
} from "@/components/ui/status-dropdown";
import { DepartmentModal } from "./department-modal";

// ─── Employee mini-card ────────────────────────────────────────────────────────

interface MiniEmployeeCardProps {
  name: string;
  role: string;
  avatar?: string;
  status: EmployeeStatus;
  roleType?: "head" | "team_leader" | "member";
}

function MiniEmployeeCard({
  name,
  role,
  avatar,
  status,
  roleType = "member",
}: MiniEmployeeCardProps) {
  const cfg = statusConfig[status];
  
  const ringColor = roleType === "team_leader" ? "ring-[#f38328]" : "ring-[#0047ff]";

  return (
    <div className="bg-[#edf2f7] p-[12px] rounded-[12px] flex items-start justify-between w-full">
      <div className="flex items-center gap-[8px]">
        {/* Avatar with status dot */}
        <div className="relative size-[40px] shrink-0">
          <Avatar className={cn("size-full rounded-full ring-2", ringColor)}>
            <AvatarImage src={avatar} />
            <AvatarFallback className="bg-[#edf2f7] text-[10px] font-bold text-[#343434]">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div
            className="absolute bottom-[1.67px] right-[1.67px] size-[6.67px] rounded-full ring-1 ring-black/30"
            style={{ backgroundColor: cfg.color }}
          />
        </div>
        {/* Name + role */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] font-bold text-[#343434] leading-[16px] whitespace-nowrap">
              {name}
            </span>
            <Edit2 className="size-[12px] text-primary cursor-pointer hover:opacity-80 transition-colors" />
          </div>
          <span className="text-[12px] font-bold text-[#707070] leading-[16px] whitespace-nowrap">
            {role}
          </span>
        </div>
      </div>
      {/* Status badge */}
      <div
        className="flex items-center justify-center px-[6px] py-[3px] rounded-[6px] shrink-0 bg-[rgba(0,185,39,0.1)]">
        <span
          className="text-[10px] font-bold leading-[14px] text-[#00b927]">
          {status}
        </span>
      </div>
    </div>
  );
}

// ─── Collapsible section ──────────────────────────────────────────────────────

interface CollapsibleSectionProps {
  icon: React.ElementType;
  title: string;
  badges?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  icon: Icon,
  title,
  badges,
  children,
  defaultOpen = true,
}: CollapsibleSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <div className="bg-[#f8fafc] rounded-[16px] p-[16px] flex flex-col gap-[20px] w-full">
      {/* Header */}
      <div className="flex items-center justify-between w-full h-[36px]">
        <div className="flex items-center gap-[10px]">
          <div className="flex items-center gap-[8px]">
            <div className="size-[36px] bg-[#edf2f7] flex items-center justify-center rounded-[8px] shrink-0">
              <Icon className="size-[14px] text-[#343434]" />
            </div>
            <h3 className="font-bold text-[18px] text-[#343434] leading-[20px] whitespace-nowrap">
              {title}
            </h3>
          </div>
          {badges && (
            <div className="flex items-center gap-[6px]">{badges}</div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-[28px] w-[36px] bg-[#edf2f7] rounded-[8px] flex items-center justify-center hover:bg-[#edf2f7]/80 transition-colors cursor-pointer"
          aria-label={open ? "Collapse section" : "Expand section"}
        >
          <ChevronDown
            className={cn(
              "size-[16px] text-[#343434] transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      {/* Body */}
      {open && children}
    </div>
  );
}

import { useGetDepartmentsQuery } from "@/lib/store/services/departmentApi";
import { useGetEmployeesQuery } from "@/lib/store/services/employeeApi";

// ─── Main component ───────────────────────────────────────────────────────────

interface DepartmentDetailProps {
  departmentId: string;
}

export function DepartmentDetail({ departmentId }: DepartmentDetailProps) {
  const { data: deptData } = useGetDepartmentsQuery();
  const { data: empData } = useGetEmployeesQuery();

  const dept = deptData?.items.find((d) => d.id === departmentId);
  
  // Real employees belonging to this department
  const employees = React.useMemo(() => {
    if (!empData?.items) return [];
    return empData.items.filter((emp: any) => emp.departmentId === departmentId);
  }, [empData, departmentId]);

  const [editOpen, setEditOpen] = React.useState(false);

  if (!dept) {
    return (
      <div className="flex flex-col gap-[20px] p-[24px] pb-[100px]">
        <p className="text-muted-foreground font-bold">Please select a department</p>
      </div>
    );
  }

  const editInitialData = {
    name: dept.name,
    description: dept.description || "",
    color: "#0047ff",
    headIds: [],
    employeeIds: [],
  };
  
  const heads = employees.filter(e => e.role === "Manager" || e.role === "Admin" || e.role === "Head");
  const members = employees.filter(e => e.role !== "Manager" && e.role !== "Admin" && e.role !== "Head");

  return (
    <div className="flex flex-col gap-[20px] p-[24px] pb-[100px]">
      {/* Department title row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[12px]">
          <p className="font-bold text-[22px] leading-[20px] text-[#0047ff] whitespace-nowrap">
            {dept.name}
          </p>
          <p className="font-bold text-[14px] text-[#707070] leading-[16px]">
            {dept.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="h-[40px] bg-[#0047ff] flex items-center gap-[8px] px-[20px] rounded-[12px] hover:bg-[#0047ff]/90 transition-colors shrink-0 cursor-pointer">
          <Edit2 className="size-[12px] text-white" />
          <span className="text-[12px] font-bold text-white whitespace-nowrap">
            Edit Department
          </span>
        </button>
      </div>

      <DepartmentModal
        open={editOpen}
        onOpenChange={setEditOpen}
        initialData={editInitialData}
      />

      {/* Head of Department */}
      <CollapsibleSection
        icon={UserRound}
        title={`Head of ${dept.name.replace(" Department", "")}`}>
        {heads.length === 0 ? (
           <p className="text-xs font-bold text-muted-foreground py-2">No department head assigned.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] w-full">
            {heads.map(head => (
              <MiniEmployeeCard key={head.id} name={head.fullName || "Unknown"} role={head.jobTitle || head.role || "Manager"} avatar="" status="Online" roleType="head" />
            ))}
          </div>
        )}
      </CollapsibleSection>

      {/* Employees Section */}
      <CollapsibleSection
        icon={Users}
        title="Department Employees"
        badges={
          <>
            <div className="bg-[rgba(0,71,255,0.08)] px-[8px] py-[4px] rounded-[6px]">
              <span className="text-[12px] font-bold text-[#0047ff] leading-[14px]">
                {members.length} Employees
              </span>
            </div>
          </>
        }>

        {members.length === 0 ? (
          <p className="text-xs font-bold text-muted-foreground py-2">No employees found in this department.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] w-full">
            {members.map((member) => (
              <MiniEmployeeCard key={member.id} name={member.fullName || "Unknown"} role={member.jobTitle || member.role || "Employee"} avatar="" status="Online" roleType="member" />
            ))}
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
}

