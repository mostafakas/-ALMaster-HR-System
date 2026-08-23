"use client";

import * as React from "react";
import { X, Check, ChevronDown } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  createRoleSchema,
  type CreateRoleFormData,
} from "@/lib/validations/role";
import { PermSwitch } from "@/components/ui/perm-switch";

// Re-export for edit-role-modal backward compatibility
export { PermSwitch as RolePermSwitch };

/* ─────────── Shared pieces (re-used by edit modal too) ─────────── */

export const LEVELS = [
  { value: "1", label: "Level 1" },
  { value: "2", label: "Level 2" },
  { value: "3", label: "Level 3" },
  { value: "4", label: "Level 4" },
  { value: "5", label: "Level 5" },
] as const;

export function LevelDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = LEVELS.find((l) => l.value === value);

  React.useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "bg-[#EDF2F7] h-[40px] w-full flex items-center justify-between px-[16px] rounded-[8px] transition-all",
          error && "ring-1 ring-[#F55050]",
        )}>
        <span className="font-bold text-[12px] text-[#343434] font-janna">
          {selected?.label ?? "Select level"}
        </span>
        <ChevronDown
          className={cn(
            "size-[16px] text-[#707070] transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white rounded-[12px] shadow-lg border border-[#EDF2F7] z-50 p-[6px] flex flex-col gap-[2px]">
          {LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              onClick={() => {
                onChange(level.value);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center px-[12px] h-[36px] rounded-[8px] transition-colors font-bold text-[12px] font-janna text-left",
                value === level.value
                  ? "bg-[rgba(0,71,255,0.08)] text-[#0047FF]"
                  : "text-[#343434] hover:bg-[#F8FAFC]",
              )}>
              {level.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface PermCategory {
  label: string;
  items: {
    key: keyof CreateRoleFormData["permissions"];
    label: string;
    description: string;
  }[];
}

export const PERM_CATEGORIES: PermCategory[] = [
  {
    label: "User Management",
    items: [
      {
        key: "createUsers",
        label: "Create Users",
        description: "Add new users to the system",
      },
      {
        key: "editUsers",
        label: "Edit Users",
        description: "Modify user information",
      },
      {
        key: "deleteUsers",
        label: "Delete Users",
        description: "Remove users from the system",
      },
    ],
  },
  {
    label: "Role Management",
    items: [
      {
        key: "manageRoles",
        label: "Manage Roles",
        description: "Create, edit, and delete roles",
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        key: "viewReports",
        label: "View Reports",
        description: "Access all system reports",
      },
      {
        key: "downloadReports",
        label: "Download Reports",
        description: "Download reports locally to their device",
      },
    ],
  },
  {
    label: "Tasks Management",
    items: [
      {
        key: "setTasks",
        label: "Set Tasks",
        description: "Download reports locally to their device",
      },
      {
        key: "viewTasks",
        label: "View Tasks",
        description: "Access all system reports",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        key: "systemSettings",
        label: "System Settings",
        description: "Access system settings and modify them",
      },
    ],
  },
  {
    label: "Organization",
    items: [
      {
        key: "manageDepartments",
        label: "Manage Departments",
        description: "Create and edit departments",
      },
    ],
  },
  {
    label: "Payroll",
    items: [
      {
        key: "viewSalary",
        label: "View Salary",
        description: "See employee salary information",
      },
      {
        key: "editSalary",
        label: "Edit Salary",
        description: "Modify salary information",
      },
    ],
  },
  {
    label: "Archives",
    items: [
      {
        key: "chatsArchive",
        label: "Chats Archive",
        description: "view and download any chat",
      },
      {
        key: "tasksArchive",
        label: "Tasks Archive",
        description: "view and download any task",
      },
    ],
  },
  {
    label: "Documents",
    items: [
      {
        key: "manageDocuments",
        label: "Manage Documents",
        description: "Upload and manage documents",
      },
    ],
  },
];

/* ─────────── Permission rows ─────────── */

export function PermissionsSection({
  control,
}: {
  control: ReturnType<typeof useForm<CreateRoleFormData>>["control"];
}) {
  return (
    <div className="flex flex-col gap-[16px] w-full">
      <p className="font-bold text-[18px] text-[#343434] leading-[22.4px] font-janna whitespace-nowrap">
        Role's Permissions
      </p>
      <div className="flex flex-col gap-[16px]">
        {PERM_CATEGORIES.map((cat, ci) => (
          <div key={`${cat.label}-${ci}`} className="flex flex-col gap-[8px]">
            <p className="font-bold text-[16px] text-[#343434] leading-[22.4px] font-janna whitespace-nowrap">
              {cat.label}
            </p>
            <div className="flex flex-col gap-[8px]">
              {cat.items.map((item) => (
                <div
                  key={item.key}
                  className="bg-[#EDF2F7] flex gap-[8px] items-center px-[12px] py-[8px] rounded-[8px] w-full">
                  <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                    <p className="font-bold text-[14px] text-[#343434] leading-[14px] font-janna">
                      {item.label}
                    </p>
                    <p className="font-bold text-[12px] text-[#707070] leading-[14px] font-janna whitespace-nowrap">
                      {item.description}
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name={`permissions.${item.key}`}
                    render={({ field }) => (
                      <PermSwitch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────── Create Role Modal ─────────── */

interface CreateRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_PERMISSIONS: CreateRoleFormData["permissions"] = {
  createUsers: true,
  editUsers: true,
  deleteUsers: true,
  manageRoles: true,
  viewReports: true,
  downloadReports: true,
  setTasks: true,
  viewTasks: false,
  systemSettings: true,
  manageDepartments: true,
  viewSalary: true,
  editSalary: true,
  chatsArchive: true,
  tasksArchive: true,
  manageDocuments: true,
};

export function CreateRoleModal({ open, onOpenChange }: CreateRoleModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: { name: "", level: "1", permissions: DEFAULT_PERMISSIONS },
  });

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit: SubmitHandler<CreateRoleFormData> = async (data) => {
    console.log("Creating role:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[#343434]/60 backdrop-blur-[12px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[534px] max-w-[534px] p-0 gap-0 border-none bg-[#F8FAFC] rounded-[16px] shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-[24px] p-[28px]">
          {/* Header */}
          <div className="flex items-start justify-between w-full shrink-0">
            <div className="flex flex-col gap-[4px]">
              <p className="font-bold text-[20px] text-[#343434] leading-[22.4px] font-janna">
                Create New Role
              </p>
              <p className="font-bold text-[14px] text-[#707070] leading-[22.4px] font-janna">
                Define a new role and assign permissions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-[#EDF2F7] size-[36px] rounded-full flex items-center justify-center hover:bg-[#e2e8f0] transition-colors shrink-0">
              <X className="size-[18px] text-[#343434]" strokeWidth={2} />
            </button>
          </div>

          {/* Fields + permissions + buttons */}
          <div className="flex flex-col gap-[24px] w-full">
            {/* Fields */}
            <div className="flex flex-col gap-[12px] w-full">
              {/* Role Name */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="font-bold text-[16px] text-[#343434] leading-[22.4px] font-janna">
                  Role Name
                </label>
                <input
                  placeholder="Ex. Team Lead"
                  className={cn(
                    "bg-[#EDF2F7] h-[40px] px-[16px] rounded-[8px] font-bold text-[12px] text-[#343434] placeholder:text-[#707070] font-janna outline-none w-full transition-all",
                    errors.name && "ring-1 ring-[#F55050]",
                  )}
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-[10px] font-bold text-[#F55050] font-janna text-right">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* Authority Level */}
              <div className="flex flex-col gap-[6px] w-full">
                <label className="font-bold text-[16px] text-[#343434] leading-[22.4px] font-janna">
                  Authority level (1-5)
                </label>
                <Controller
                  control={control}
                  name="level"
                  render={({ field }) => (
                    <LevelDropdown
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.level?.message}
                    />
                  )}
                />
                <p className="font-bold text-[12px] text-[#707070] leading-[14px] font-janna whitespace-nowrap">
                  <span className="text-[#343434]">Note:</span>
                  {" Lower levels cannot manage higher authority roles"}
                </p>
              </div>
            </div>

            {/* Permissions + buttons */}
            <div className="flex flex-col gap-[40px] w-full">
              <PermissionsSection control={control} />

              {/* Footer buttons */}
              <div className="flex gap-[8px] w-full">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-[#EDF2F7] hover:bg-[#e2e8f0] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-[#343434] font-janna transition-colors shrink-0">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#0047FF] hover:bg-[#0037CC] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-white font-janna flex items-center justify-center gap-[8px] transition-all active:scale-[0.98] disabled:opacity-60">
                  <Check className="size-[12px]" strokeWidth={3} />
                  Create Role
                </button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
