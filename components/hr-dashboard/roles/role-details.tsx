"use client";

import * as React from "react";
import {
  ShieldCheck,
  ChevronUp,
  Palette,
  Sparkles,
  Users,
  Building2,
  Crown,
  UserCheck,
  User,
} from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ROLE_THEME_COLORS, TOTAL_PERMISSIONS, countActivePermissions, type RoleData } from "./role-panel";
import type { Permissions } from "@/lib/validations/role";

/* ─────────── permission layout ─────────── */

interface PermissionCategory {
  label: string;
  permissions: { key: keyof Permissions; label: string }[];
}

const PERMISSION_COLUMNS: PermissionCategory[][] = [
  [
    {
      label: "User Management",
      permissions: [
        { key: "createUsers", label: "Create Users" },
        { key: "editUsers", label: "Edit Users" },
        { key: "deleteUsers", label: "Delete Users" },
      ],
    },
    {
      label: "Role Management",
      permissions: [{ key: "manageRoles", label: "Manage Roles" }],
    },
    {
      label: "Tasks Management",
      permissions: [
        { key: "setTasks", label: "Set Tasks" },
        { key: "viewTasks", label: "View Tasks" },
      ],
    },
  ],
  [
    {
      label: "Reports",
      permissions: [
        { key: "viewReports", label: "View Reports" },
        { key: "downloadReports", label: "Download Reports" },
      ],
    },
    {
      label: "Organization",
      permissions: [{ key: "manageDepartments", label: "Manage Departments" }],
    },
  ],
  [
    {
      label: "System",
      permissions: [{ key: "systemSettings", label: "System Settings" }],
    },
    {
      label: "Archives",
      permissions: [
        { key: "chatsArchive", label: "Chats Archive" },
        { key: "tasksArchive", label: "Tasks Archive" },
      ],
    },
  ],
  [
    {
      label: "Payroll",
      permissions: [
        { key: "viewSalary", label: "View Salary" },
        { key: "editSalary", label: "Edit Salary" },
      ],
    },
    {
      label: "Documents",
      permissions: [{ key: "manageDocuments", label: "Manage Documents" }],
    },
  ],
];

/* ─────────── mock employee data ─────────── */

interface Employee {
  id: string;
  name: string;
  title: string;
  avatar: string;
  online: boolean;
}

interface Team {
  id: string;
  name: string;
  icon: React.ElementType;
  employees: Employee[];
}

const mockTeamsByRole: Record<string, Team[]> = {};

/* ─────────── main component ─────────── */

interface RoleDetailsProps {
  role: RoleData;
  onEdit: () => void;
}

export function RoleDetails({ role, onEdit }: RoleDetailsProps) {
  const activeCount = countActivePermissions(role.permissions);
  const teams = mockTeamsByRole[role.id] ?? [];

  return (
    <div className="flex-1 flex flex-col gap-[20px] px-[24px] py-[24px] overflow-y-auto no-scrollbar">
      {/* Section: Role & Permissions */}
      <p className="font-bold text-[22px] text-foreground leading-[20px] whitespace-nowrap shrink-0">
        Role & Permissions
      </p>


      {/* Permissions card */}
      <div className="bg-muted rounded-[16px] p-[20px] flex flex-col gap-[24px] w-full shrink-0">

        {/* Role header row */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[4px]">
            {/* Role name + level badge */}
            <div className="flex gap-[8px] items-center">
              <p className="font-bold text-[20px] leading-[22.4px] whitespace-nowrap" style={{ color: ROLE_THEME_COLORS[role.theme].color }}>
                {role.name}
              </p>
              <div
                className="flex gap-[4px] items-center justify-center px-[6px] py-[4px] rounded-[4px] shrink-0"
                style={{ backgroundColor: ROLE_THEME_COLORS[role.theme].iconBg }}
              >
                <ShieldCheck className="size-[10px]" style={{ color: ROLE_THEME_COLORS[role.theme].color }} />
                <span className="font-bold text-[10px] leading-[14px]" style={{ color: ROLE_THEME_COLORS[role.theme].color }}>
                  Level {role.level}
                </span>
              </div>
            </div>
            {/* Permissions count */}
            <div className="flex gap-[4px] items-center">
              <ShieldCheck className="size-[14px] text-muted-foreground" />
              <p className="font-bold text-[14px] text-muted-foreground leading-[22.4px]">
                {activeCount}/{TOTAL_PERMISSIONS} Permissions
              </p>
            </div>

          </div>

          {/* Edit button */}
          <button
            onClick={onEdit}
            className="bg-primary/10 h-[36px] px-[12px] rounded-[12px] flex items-center justify-center shrink-0 hover:bg-primary/15 transition-colors cursor-pointer"
          >
            <Edit2 className="size-[12px] text-primary" />
          </button>

        </div>

        {/* Permissions grid — 4 columns */}
        <div className="flex items-start justify-between w-full">
          {PERMISSION_COLUMNS.map((col, ci) => (
            <div key={ci} className="flex flex-col gap-[24px]">
              {col.map((cat) => (
                <div key={cat.label} className="flex flex-col gap-[8px]">
                  <p className="font-bold text-[16px] text-foreground leading-[22.4px] whitespace-nowrap">
                    {cat.label}
                  </p>

                  <div className="flex gap-[8px] items-start flex-wrap">
                    {cat.permissions.map((perm) => {
                      const active = role.permissions[perm.key];
                      return (
                        <span
                          key={perm.key}
                          className={cn(
                            "h-[24px] px-[8px] py-[4px] rounded-[6px] font-bold text-[12px] leading-[14px] whitespace-nowrap flex items-center",
                            active
                              ? "bg-foreground text-background"
                              : "bg-secondary text-muted-foreground",
                          )}

                        >
                          {perm.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Section: Employees with this Role */}
      <p className="font-bold text-[22px] text-foreground leading-[20px] whitespace-nowrap shrink-0">
        Employees with this Role
      </p>


      <div className="flex flex-col gap-[12px]">
        {teams.map((team) => (
          <TeamSection key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}

/* ─────────── Team section ─────────── */

function TeamSection({ team }: { team: Team }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className="bg-muted rounded-[16px] p-[16px] flex flex-col gap-[20px]">
      {/* Team header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-[10px] items-center">
          <div className="flex gap-[8px] items-center">
            <div className="bg-secondary size-[36px] flex items-center justify-center rounded-[8px] shrink-0">
              <team.icon className="size-[14px] text-muted-foreground" />
            </div>
            <p className="font-bold text-[18px] text-foreground leading-[20px] whitespace-nowrap">
              {team.name}
            </p>
          </div>

          <div className="bg-primary/10 rounded-[6px] px-[8px] py-[4px] flex items-center justify-center">
            <span className="font-bold text-[12px] text-primary leading-[14px] whitespace-nowrap">
              {team.employees.length} {team.employees.length === 1 ? "Employee" : "Employees"}
            </span>
          </div>

        </div>

        <button
          onClick={() => setCollapsed((p) => !p)}
          className="bg-secondary h-[28px] w-[36px] flex items-center justify-center rounded-[8px] hover:brightness-95 transition-all cursor-pointer shrink-0"
        >
          <ChevronUp
            className={cn("size-[16px] text-muted-foreground transition-transform", collapsed && "rotate-180")}
          />
        </button>

      </div>

      {/* Employee grid */}
      {!collapsed && (
        <div className="grid grid-cols-2 gap-[8px]">
          {team.employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────── Employee card ─────────── */

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <div className="bg-secondary p-[12px] rounded-[12px] flex items-start justify-between">

      <div className="flex gap-[8px] items-center">
        {/* Avatar with online dot */}
        <div className="relative shrink-0">
          <div className="size-[40px] rounded-full overflow-hidden border border-white shadow-sm">
            <Avatar className="size-full">
              <AvatarImage src={employee.avatar} />
              <AvatarFallback className="text-[10px] font-bold">
                {employee.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          {employee.online && (
            <div className="absolute bottom-[1.667px] right-[1.667px] size-[6.667px] bg-success rounded-full border border-background" />
          )}

        </div>

        {/* Name + title */}
        <div className="flex flex-col gap-[4px]">
          <div className="flex gap-[8px] items-center">
            <p className="font-bold text-[12px] text-foreground leading-[16px] whitespace-nowrap">
              {employee.name}
            </p>
            <Edit2 className="size-[12px] text-primary cursor-pointer hover:opacity-80 transition-colors" />
          </div>
          <p className="font-bold text-[9px] text-muted-foreground leading-[12px] whitespace-nowrap">
            {employee.title}
          </p>
        </div>

      </div>

      {/* Online badge */}
      {employee.online ? (
        <div className="bg-success/10 px-[6px] py-[3px] rounded-[6px] flex items-center justify-center shrink-0">
          <span className="font-bold text-[10px] text-success leading-[14px]">Online</span>
        </div>
      ) : (
        <div className="bg-secondary px-[6px] py-[3px] rounded-[6px] flex items-center justify-center shrink-0">
          <span className="font-bold text-[10px] text-muted-foreground leading-[14px]">Offline</span>
        </div>
      )}

    </div>
  );
}
