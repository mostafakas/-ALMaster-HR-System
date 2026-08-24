"use client";

import * as React from "react";
import {
  Shield,
  ShieldCheck,
  Users,
  Building2,
  Crown,
  UserCheck,
  User,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Permissions } from "@/lib/validations/role";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setActiveRoleId } from "@/lib/store/slices/roles-slice";
import { openModal } from "@/lib/store/slices/ui-slice";

export interface RoleData {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  theme: "primary" | "warning" | "success" | "ai" | "destructive" | "info";
  icon: React.ElementType;
  membersCount: number;
  permissions: Permissions;
}


export const TOTAL_PERMISSIONS = 15;

export function countActivePermissions(permissions: Permissions): number {
  return Object.values(permissions).filter(Boolean).length;
}

export const rolesData: RoleData[] = [
  {
    id: "almaster-ceo",
    name: "AlMaster CEO",
    level: 5,
    theme: "primary",
    icon: Building2,
    membersCount: 0,
    permissions: {
      createUsers: true,
      editUsers: true,
      deleteUsers: true,
      manageRoles: true,
      viewReports: true,
      downloadReports: true,
      setTasks: true,
      viewTasks: true,
      systemSettings: true,
      manageDepartments: true,
      viewSalary: true,
      editSalary: true,
      chatsArchive: true,
      tasksArchive: true,
      manageDocuments: true,
    },
  },
  {
    id: "hr-manager",
    name: "HR Manager",
    level: 4,
    theme: "warning",
    icon: Users,
    membersCount: 0,
    permissions: {
      createUsers: true,
      editUsers: true,
      deleteUsers: true,
      manageRoles: true,
      viewReports: true,
      downloadReports: true,
      setTasks: true,
      viewTasks: true,
      systemSettings: false,
      manageDepartments: true,
      viewSalary: true,
      editSalary: false,
      chatsArchive: false,
      tasksArchive: true,
      manageDocuments: true,
    },
  },
  {
    id: "supervisor",
    name: "Supervisor",
    level: 3,
    theme: "success",
    icon: UserCheck,
    membersCount: 0,
    permissions: {
      createUsers: true,
      editUsers: true,
      deleteUsers: false,
      manageRoles: false,
      viewReports: true,
      downloadReports: true,
      setTasks: true,
      viewTasks: true,
      systemSettings: false,
      manageDepartments: false,
      viewSalary: true,
      editSalary: false,
      chatsArchive: false,
      tasksArchive: false,
      manageDocuments: true,
    },
  },
  {
    id: "team-leader",
    name: "Team Leader",
    level: 2,
    theme: "ai",
    icon: Crown,
    membersCount: 0,
    permissions: {
      createUsers: false,
      editUsers: true,
      deleteUsers: false,
      manageRoles: false,
      viewReports: true,
      downloadReports: false,
      setTasks: true,
      viewTasks: true,
      systemSettings: false,
      manageDepartments: false,
      viewSalary: false,
      editSalary: false,
      chatsArchive: true,
      tasksArchive: true,
      manageDocuments: false,
    },
  },
  {
    id: "employee",
    name: "Employee",
    level: 1,
    theme: "destructive",
    icon: User,
    membersCount: 0,
    permissions: {
      createUsers: false,
      editUsers: false,
      deleteUsers: false,
      manageRoles: false,
      viewReports: false,
      downloadReports: false,
      setTasks: false,
      viewTasks: true,
      systemSettings: false,
      manageDepartments: false,
      viewSalary: false,
      editSalary: false,
      chatsArchive: false,
      tasksArchive: false,
      manageDocuments: true,
    },
  },
];


export function RolePanel() {
  const dispatch = useAppDispatch();
  const activeRoleId = useAppSelector((state) => state.roles.activeRoleId);

  return (
    <div className="w-[356px] shrink-0 flex flex-col gap-[20px] px-[16px] py-[32px] border-r border-border bg-muted overflow-y-auto no-scrollbar">

      {/* Header */}
      <div className="flex flex-col gap-[20px] w-full shrink-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-[8px] items-center shrink-0">
            <div className="bg-secondary size-[36px] flex items-center justify-center rounded-[8px] shrink-0">
              <Shield className="size-[16px] text-muted-foreground" />
            </div>
            <p className="font-bold text-[22px] text-foreground leading-[20px] whitespace-nowrap">
              Roles
            </p>
          </div>

          <button
            onClick={() => dispatch(openModal("create-role"))}
            className="bg-primary h-[36px] flex gap-[8px] items-center justify-center px-[12px] rounded-[8px] cursor-pointer hover:bg-primary/90 transition-colors shrink-0">
            <Plus className="size-[10px] text-primary-foreground" />
            <span className="font-bold text-[12px] text-primary-foreground leading-[22.4px] whitespace-nowrap">
              New Role
            </span>
          </button>

        </div>
        <div className="h-px bg-border w-full" />
      </div>


      {/* Role Cards */}
      <div className="flex flex-col gap-[8px]">
        {rolesData.map((role) => {
          const isActive = activeRoleId === role.id;
          const activeCount = countActivePermissions(role.permissions);
          return (
            <RoleCard
              key={role.id}
              role={role}
              isActive={isActive}
              activeCount={activeCount}
              onSelect={(id) => dispatch(setActiveRoleId(id))}
            />
          );
        })}
      </div>
    </div>
  );
}

export const ROLE_THEME_COLORS: Record<
  RoleData["theme"],
  { color: string; iconBg: string }
> = {
  primary:     { color: "var(--primary)",     iconBg: "var(--color-primary-10)" },
  warning:     { color: "var(--warning)",     iconBg: "var(--color-warning-10)" },
  success:     { color: "var(--success)",     iconBg: "var(--color-success-10)" },
  ai:          { color: "var(--color-ai)",    iconBg: "var(--color-ai-10)" },
  destructive: { color: "var(--destructive)", iconBg: "var(--color-destructive-10)" },
  info:        { color: "var(--color-info)",  iconBg: "var(--color-info-10)" },
};

const themeBgStyles: Record<string, string> = {
  primary: "bg-primary/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
  ai: "bg-ai/10",
  destructive: "bg-destructive/10",
  info: "bg-info/10",
};

const themeTextStyles: Record<string, string> = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  ai: "text-ai",
  destructive: "text-destructive",
  info: "text-info",
};

const themeBorderStyles: Record<string, string> = {
  primary: "border-primary",
  warning: "border-warning",
  success: "border-success",
  ai: "border-ai",
  destructive: "border-destructive",
  info: "border-info",
};

function RoleCard({
  role,
  isActive,
  activeCount,
  onSelect,
}: {
  role: RoleData;
  isActive: boolean;
  activeCount: number;
  onSelect: (id: string) => void;
}) {

  return (
    <button
      onClick={() => onSelect(role.id)}
      className={cn(
        "w-full flex items-center gap-[12px] px-[12px] py-[11px] rounded-[8px] text-left transition-all duration-200 cursor-pointer border-l-[3px]",
        isActive ? "bg-muted" : "bg-secondary",
        isActive ? themeBorderStyles[role.theme] : "border-l-transparent",
      )}>

      {/* Role Icon */}
      <div
        className={cn(
          "size-[48px] rounded-[10.667px] flex items-center justify-center shrink-0",
          themeBgStyles[role.theme]
        )}>
        <role.icon className={cn("size-[16px]", themeTextStyles[role.theme])} />
      </div>

      {/* Role Info */}
      <div className="flex flex-col gap-[6px] flex-1 min-w-0">
        {/* Row 1: Name + Level badge */}
        <div className="flex items-center justify-between w-full">
          <p
            className={cn(
              "font-bold text-[14px] leading-[16px] whitespace-nowrap",
              themeTextStyles[role.theme]
            )}>
            {role.name}
          </p>
          <div
            className={cn(
              "flex gap-[4px] items-center justify-center px-[6px] py-[4px] rounded-[4px] shrink-0",
              themeBgStyles[role.theme]
            )}>
            <Shield className={cn("size-[10px]", themeTextStyles[role.theme])} />
            <span
              className={cn("font-bold text-[10px] leading-[14px]", themeTextStyles[role.theme])}>
              Level {role.level}
            </span>
          </div>
        </div>


        {/* Row 2: Permissions + Members */}
        <div className="flex items-center justify-between w-full h-[16px]">
          <div className="flex gap-[4px] items-center">
            <ShieldCheck className="size-[12px] text-muted-foreground" />
            <span className="font-bold text-[12px] text-muted-foreground leading-[24px]">
              {activeCount}/{TOTAL_PERMISSIONS} Permissions
            </span>
          </div>

          <div className="flex gap-[4px] items-center justify-center">
            <Users className="size-[12px] text-muted-foreground" />
            <span className="font-bold text-[12px] text-muted-foreground leading-[24px]">
              {role.membersCount}{" "}
              {role.membersCount === 1 ? "member" : "members"}
            </span>
          </div>

        </div>
      </div>
    </button>
  );
}
