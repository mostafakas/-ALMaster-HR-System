"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, Code, User } from "lucide-react";
import { UseFormReturn, Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { PermSwitch } from "@/components/ui/perm-switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EmployeeValues } from "@/lib/validations/employee";

interface EmploymentInfoTabProps {
  form: UseFormReturn<EmployeeValues>;
}

const PERMISSIONS = [
  {
    category: "User Management",
    id: "user-management-1",
    items: [
      { id: "createUsers", title: "Create Users", description: "Add new users to the system", default: true },
      { id: "editUsers", title: "Edit Users", description: "Modify user information", default: true },
      { id: "deleteUsers", title: "Delete Users", description: "Remove users from the system", default: true },
    ],
  },
  {
    category: "Role Management",
    id: "role-management",
    items: [
      { id: "manageRoles", title: "Manage Roles", description: "Create, edit, and delete roles", default: true },
    ],
  },
  {
    category: "Reports",
    id: "reports",
    items: [
      { id: "viewReports", title: "View Reports", description: "Access all system reports", default: true },
      { id: "downloadReports", title: "Download Reports", description: "Download reports locally", default: true },
    ],
  },
  {
    category: "Tasks Management",
    id: "tasks-management",
    items: [
      { id: "setTasks", title: "Set Tasks", description: "Assign tasks to team members", default: true },
      { id: "viewTasks", title: "View Tasks", description: "Access all system tasks", default: false },
    ],
  },
  {
    category: "System",
    id: "system",
    items: [
      { id: "systemSettings", title: "System Settings", description: "Access and modify system settings", default: true },
    ],
  },
  {
    category: "Payroll",
    id: "payroll",
    items: [
      { id: "viewSalary", title: "View Salary", description: "See employee salary information", default: true },
      { id: "editSalary", title: "Edit Salary", description: "Modify salary information", default: false },
    ],
  },
];

const inputCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] text-[#343434] font-bold focus-visible:ring-0 outline-none w-full shadow-none";

const selectTriggerCls =
  "bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] text-[12px] font-bold text-[#343434] outline-none w-full shadow-none";

const selectContentCls = "bg-white rounded-[10px] border-[#EDF2F7] shadow-xl p-1";
const selectItemCls = "text-[12px] font-bold py-2.5 focus:bg-[#0047FF]/10 rounded-[6px]";

function FormField({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-[6px] items-start", className ?? "w-full")}>
      <Label className="text-[#343434] text-[14px] font-bold leading-[22.4px]">{label}</Label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography className="text-[#343434] text-[16px] font-bold leading-[22.4px] pt-[4px]">
      {children}
    </Typography>
  );
}

function Divider() {
  return <div className="h-px bg-[#EDF2F7] w-full" />;
}

function DatePickerField({ value, onChange }: { value?: Date; onChange: (d: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger className="w-full">
        <div className={cn(
          "w-full bg-[#EDF2F7] border-none h-[40px] px-[16px] rounded-[8px] flex items-center justify-between font-bold text-[12px] cursor-pointer",
          value ? "text-[#343434]" : "text-[#707070]"
        )}>
          {value ? format(value, "dd/MM/yyyy") : "dd/mm/yyyy"}
          <CalendarIcon className="size-[12px] text-[#707070]" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-2xl" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          className="bg-white rounded-[12px]"
        />
      </PopoverContent>
    </Popover>
  );
}

export function EmploymentInfoTab({ form }: EmploymentInfoTabProps) {
  const { register, control, formState: { errors } } = form;
  const [showPermissions, setShowPermissions] = React.useState(true);

  return (
    <div className="flex flex-col gap-[24px] w-full">

      {/* ── Position ── */}
      <SectionTitle>Position & Role</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        {/* Job Title */}
        <FormField label="Job Title">
          <Input className={inputCls} {...register("jobTitle")} placeholder="Frontend Developer" />
          {errors.jobTitle && (
            <span className="text-[10px] text-destructive font-bold">{errors.jobTitle.message}</span>
          )}
        </FormField>

        {/* Seniority */}
        <FormField label="Seniority Level">
          <Controller
            control={control}
            name="seniorityLevel"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="intern" className={selectItemCls}>Intern</SelectItem>
                  <SelectItem value="junior" className={selectItemCls}>Junior</SelectItem>
                  <SelectItem value="mid" className={selectItemCls}>Mid-level</SelectItem>
                  <SelectItem value="senior" className={selectItemCls}>Senior</SelectItem>
                  <SelectItem value="lead" className={selectItemCls}>Lead</SelectItem>
                  <SelectItem value="manager" className={selectItemCls}>Manager</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Department */}
        <FormField label="Department">
          <Controller
            control={control}
            name="departmentId"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <div className="flex items-center gap-[6px]">
                    <Code className="size-[12px] text-[#0047FF]" />
                    <SelectValue placeholder="Select department" />
                  </div>
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="eng" className={selectItemCls}>Engineering</SelectItem>
                  <SelectItem value="design" className={selectItemCls}>Design</SelectItem>
                  <SelectItem value="content" className={selectItemCls}>Content</SelectItem>
                  <SelectItem value="ai" className={selectItemCls}>AI</SelectItem>
                  <SelectItem value="hr" className={selectItemCls}>HR</SelectItem>
                  <SelectItem value="finance" className={selectItemCls}>Finance</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Role / Authority */}
        <FormField label="Role (Authority Level)">
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <div className="flex items-center gap-[6px]">
                    <User className="size-[12px] text-[#F55050]" />
                    <SelectValue placeholder="Select role" />
                  </div>
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="user" className={selectItemCls}>Employee</SelectItem>
                  <SelectItem value="admin" className={selectItemCls}>Admin</SelectItem>
                  <SelectItem value="super-admin" className={selectItemCls}>Super Admin</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>
      </div>

      <Divider />

      {/* ── Contract & Schedule ── */}
      <SectionTitle>Contract & Schedule</SectionTitle>

      <div className="grid grid-cols-2 gap-[12px]">
        {/* Contract Type */}
        <FormField label="Contract Type">
          <Controller
            control={control}
            name="contractType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="full-time" className={selectItemCls}>Full-time</SelectItem>
                  <SelectItem value="part-time" className={selectItemCls}>Part-time</SelectItem>
                  <SelectItem value="freelance" className={selectItemCls}>Freelance</SelectItem>
                  <SelectItem value="internship" className={selectItemCls}>Internship</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Work Location */}
        <FormField label="Work Location">
          <Controller
            control={control}
            name="workLocation"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <SelectTrigger className={selectTriggerCls}>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className={selectContentCls}>
                  <SelectItem value="onsite" className={selectItemCls}>On-site</SelectItem>
                  <SelectItem value="remote" className={selectItemCls}>Remote</SelectItem>
                  <SelectItem value="hybrid" className={selectItemCls}>Hybrid</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </FormField>

        {/* Join Date */}
        <FormField label="Join Date">
          <Controller
            control={control}
            name="joinDate"
            render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>

        {/* Probation End Date */}
        <FormField label="Probation End Date">
          <Controller
            control={control}
            name="probationEndDate"
            render={({ field }) => (
              <DatePickerField value={field.value} onChange={field.onChange} />
            )}
          />
        </FormField>

        {/* Working Hours */}
        <FormField label="Working Hours From">
          <Input className={inputCls} {...register("workingHoursFrom")} placeholder="09:00 AM" />
        </FormField>

        <FormField label="Working Hours To">
          <Input className={inputCls} {...register("workingHoursTo")} placeholder="05:00 PM" />
        </FormField>
      </div>

      <Divider />

      {/* ── Permissions ── */}
      <div
        className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
        onClick={() => setShowPermissions(!showPermissions)}
      >
        <div className="flex items-center gap-[8px]">
          <SectionTitle>Role&apos;s Permissions</SectionTitle>
          <Typography className="text-[#0047FF] text-[13px] font-bold underline cursor-pointer">
            Edit
          </Typography>
        </div>
        <svg
          className={cn("size-[16px] text-[#343434] transition-transform", showPermissions && "rotate-180")}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {showPermissions && (
        <div className="flex flex-col gap-[20px] w-full">
          {PERMISSIONS.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-[8px] w-full items-start">
              <Typography className="text-[#343434] text-[14px] font-bold leading-[22.4px]">
                {cat.category}
              </Typography>
              <div className="flex flex-col gap-[6px] w-full">
                {cat.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#EDF2F7] px-[12px] py-[10px] rounded-[8px] flex items-center justify-between w-full"
                  >
                    <div className="flex flex-col items-start gap-[2px]">
                      <Typography className="text-[#343434] text-[13px] font-bold leading-[16px]">
                        {item.title}
                      </Typography>
                      <Typography className="text-[#707070] text-[11px] font-bold leading-[14px]">
                        {item.description}
                      </Typography>
                    </div>
                    <Controller
                      control={control}
                      name={`permissions.${item.id}` as any}
                      defaultValue={item.default}
                      render={({ field }) => (
                        <PermSwitch
                          checked={!!field.value}
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
      )}
    </div>
  );
}
