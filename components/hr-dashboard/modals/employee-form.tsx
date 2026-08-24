"use client";

import * as React from "react";
import {
  ChevronDown,
  Code,
  User,
  Palette,
  Megaphone,
  Image as ImageIcon,
} from "lucide-react";
import { Controller, Control, FieldPath, UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PermSwitch } from "@/components/ui/perm-switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { type EmployeeValues } from "@/lib/validations/employee";
import { useDisclosure } from "@/hooks/state/use-disclosure";
import { FormFieldWrapper } from "@/components/shared/form/form-field-wrapper";
import { useGetDepartmentsQuery } from "@/lib/store/services/departmentApi";

interface EmployeeFormProps {
  form: UseFormReturn<EmployeeValues>;
  isEditMode: boolean;
}

export function EmployeeForm({ form, isEditMode }: EmployeeFormProps) {
  const { register, control, formState: { errors } } = form;
  const {
    isOpen: isPermissionsExpanded,
    onToggle: togglePermissions,
    setIsOpen: setIsPermissionsExpanded,
  } = useDisclosure(isEditMode);

  React.useEffect(() => {
    setIsPermissionsExpanded(isEditMode);
  }, [isEditMode, setIsPermissionsExpanded]);

  return (
    <>
      {/* Employee's Data Section */}
      <div className="flex flex-col gap-4 items-start">
        <Typography className="text-foreground text-[18px] font-bold leading-[22.4px] font-janna">
          Employee's Data
        </Typography>

        <div className="flex flex-col gap-3 items-center w-full">
          {/* Photo Upload */}
          <div className="flex flex-col gap-2 items-center">
            <div className="size-[116px] rounded-full overflow-hidden flex items-center justify-center relative bg-secondary">
              {isEditMode ? (
                <Avatar className="size-full">
                  <AvatarImage src="https://ui.shadcn.com/avatars/03.png" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              ) : (
                <ImageIcon className="size-[24px] text-muted-foreground opacity-40" />
              )}
            </div>
            <Typography className="text-primary text-[14px] font-bold leading-[22.4px] cursor-pointer hover:underline font-janna">
              {isEditMode ? "Change Image" : "Upload Image"}
            </Typography>
          </div>

          {/* Basic Fields */}
          <div className="flex flex-col gap-3 w-full">
            <FormFieldWrapper label="Full Name" error={errors.fullName?.message}>
              <Input
                placeholder="Ex. John Smith"
                className={cn(
                  "bg-secondary border-none h-10 px-4 py-0 rounded-lg text-[12px] font-bold text-foreground focus-visible:ring-0 w-full placeholder:text-muted-foreground placeholder:font-bold placeholder:font-janna font-janna leading-[22.4px] placeholder:leading-[22.4px] transition-all",
                  errors.fullName && "ring-1 ring-destructive"
                )}
                {...register("fullName")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Email Address" error={errors.email?.message}>
              <Input
                placeholder="Ex. johnsmith@almaster.com"
                className={cn(
                  "bg-secondary border-none h-10 px-4 py-0 rounded-lg text-[12px] font-bold text-foreground focus-visible:ring-0 w-full placeholder:text-muted-foreground placeholder:font-bold placeholder:font-janna font-janna leading-[22.4px] placeholder:leading-[22.4px] transition-all",
                  errors.email && "ring-1 ring-destructive"
                )}
                {...register("email")}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Phone Number" error={errors.phoneNumber?.message}>
              <div className="flex gap-1.5 w-full relative">
                <Controller
                  control={control}
                  name="countryCode"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? "+966"}>
                      <SelectTrigger className="h-10! bg-secondary border-none px-3 py-0 rounded-lg flex items-center gap-2 shrink-0 font-janna font-bold! shadow-none outline-none w-fit group">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[16px]">
                            {field.value === "+966" ? "🇸🇦" : field.value === "+971" ? "🇦🇪" : "🇸🇦"}
                          </span>
                          <span className="text-foreground text-[14px] font-bold!">{field.value || "+966"}</span>
                          <ChevronDown className="size-[14px] text-muted-foreground transition-transform group-data-open:rotate-180" strokeWidth={3} />
                        </div>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={6} className="bg-white rounded-xl border border-border shadow-lg p-2 w-fit flex flex-col gap-1 font-janna font-bold">
                        <SelectItem value="+966" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground font-bold text-[14px]">
                          <div className="flex items-center gap-1.5"><span>🇸🇦</span><span>+966</span></div>
                        </SelectItem>
                        <SelectItem value="+971" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground font-bold text-[14px]">
                          <div className="flex items-center gap-1.5"><span>🇦🇪</span><span>+971</span></div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <Input
                  placeholder="Ex. 1231 4567 589"
                  className={cn(
                    "bg-secondary border-none h-10 px-4 py-0 rounded-lg text-[12px] font-bold text-foreground focus-visible:ring-0 flex-1 placeholder:text-muted-foreground placeholder:font-bold placeholder:font-janna font-janna leading-[22.4px] placeholder:leading-[22.4px] transition-all",
                    errors.phoneNumber && "ring-1 ring-destructive"
                  )}
                  {...register("phoneNumber")}
                />
              </div>
            </FormFieldWrapper>

            <div className="flex gap-3 w-full">
              <FormFieldWrapper label="Job Title" error={errors.jobTitle?.message} className="flex-1">
                <Input
                  placeholder="Ex. Frontend developer"
                  className={cn(
                    "bg-secondary border-none h-10 px-4 py-0 rounded-lg text-[12px] font-bold text-foreground focus-visible:ring-0 w-full placeholder:text-muted-foreground placeholder:font-bold placeholder:font-janna font-janna leading-[22.4px] placeholder:leading-[22.4px] transition-all",
                    errors.jobTitle && "ring-1 ring-destructive"
                  )}
                  {...register("jobTitle")}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Seniority level" error={errors.seniorityLevel?.message} className="flex-1">
                <Controller
                  control={control}
                  name="seniorityLevel"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                      <SelectTrigger className={cn(
                        "h-10! bg-secondary border-none px-4 py-0 rounded-xl text-[12px] font-bold! outline-none w-full! shadow-none font-janna leading-[22.4px] transition-all justify-between [&>svg]:size-[14px] [&>svg]:text-muted-foreground",
                        field.value ? "text-foreground" : "text-muted-foreground",
                        errors.seniorityLevel && "ring-1 ring-destructive"
                      )}>
                        <SelectValue placeholder="Select level" className="placeholder:text-muted-foreground font-bold!" />
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={6} className="bg-white rounded-xl border border-border shadow-lg p-2 w-(--anchor) flex flex-col gap-1 font-janna font-bold">
                        <SelectItem value="Junior" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground font-bold text-[14px]">Junior</SelectItem>
                        <SelectItem value="Mid" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground font-bold text-[14px]">Mid</SelectItem>
                        <SelectItem value="Senior" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground font-bold text-[14px]">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormFieldWrapper>
            </div>

            <div className="flex gap-3 w-full">
              <FormFieldWrapper label="Department" error={errors.departmentId?.message} className="flex-1">
                <Controller
                  control={control}
                  name="departmentId"
                  render={({ field }) => {
                    const { data: deptData } = useGetDepartmentsQuery();
                    const depts = deptData?.items || [];
                    const selectedDept = depts.find(d => d.id === field.value);
                    
                    return (
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <SelectTrigger className={cn(
                        "h-10! bg-secondary border-none px-4 py-0 rounded-xl text-[12px] font-bold! outline-none w-full! shadow-none font-janna leading-[22.4px] transition-all justify-between [&>svg]:size-[14px] [&>svg]:text-muted-foreground",
                        field.value ? "text-primary" : "text-muted-foreground",
                        errors.departmentId && "ring-1 ring-destructive"
                      )}>
                        <div className="flex items-center gap-1.5">
                          <Code className={cn("size-[14px]", field.value ? "text-primary" : "text-muted-foreground")} />
                          <SelectValue placeholder="Select Department" className="placeholder:text-muted-foreground font-bold!" />
                        </div>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={6} className="bg-white rounded-xl border border-border shadow-lg p-2 w-(--anchor) flex flex-col gap-1 font-janna font-bold max-h-48 overflow-y-auto">
                        {depts.map(dept => (
                          <SelectItem key={dept.id} value={dept.id} className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-foreground data-[state=checked]:font-bold text-[14px]">
                            <div className="flex items-center gap-1.5"><Code className="size-[14px]" /><span>{dept.name}</span></div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}}
                />
              </FormFieldWrapper>
              <FormFieldWrapper label="Role (Authority level)" error={errors.role?.message} className="flex-1">
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className={cn(
                        "h-10! bg-secondary border-none px-4 py-0 rounded-lg text-[12px] font-bold! outline-none w-full! shadow-none font-janna leading-[22.4px] transition-all justify-between [&>svg]:size-[14px] [&>svg]:text-muted-foreground",
                        field.value === "Employee" && "text-destructive",
                        field.value === "Manager" && "text-success",
                        field.value === "Admin" && "text-primary",
                        !field.value && "text-muted-foreground",
                        errors.role && "ring-1 ring-destructive"
                      )}>
                        <div className="flex items-center gap-1.5">
                          <User className={cn("size-[14px]",
                            field.value === "Employee" ? "text-destructive" :
                              field.value === "Manager" ? "text-success" :
                                field.value === "Admin" ? "text-primary" : "text-muted-foreground"
                          )} />
                          <SelectValue placeholder="Select Role" className="placeholder:text-muted-foreground font-bold!" />
                        </div>
                      </SelectTrigger>
                      <SelectContent alignItemWithTrigger={false} side="bottom" sideOffset={6} className="bg-white rounded-xl border border-border shadow-lg p-2 w-(--anchor) flex flex-col gap-1 font-janna font-bold">
                        <SelectItem value="Employee" className="rounded-lg px-3 h-8 focus:bg-destructive/5 data-[state=checked]:bg-destructive/5 data-[state=checked]:text-destructive transition-colors cursor-pointer outline-none text-destructive font-bold text-[14px]">Employee</SelectItem>
                        <SelectItem value="Manager" className="rounded-lg px-3 h-8 focus:bg-success/5 data-[state=checked]:bg-success/5 data-[state=checked]:text-success transition-colors cursor-pointer outline-none text-success font-bold text-[14px]">Manager</SelectItem>
                        <SelectItem value="Admin" className="rounded-lg px-3 h-8 focus:bg-primary/5 data-[state=checked]:bg-primary/5 data-[state=checked]:text-primary transition-colors cursor-pointer outline-none text-primary font-bold text-[14px]">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormFieldWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Role's Permissions Section */}
      <div className="flex flex-col gap-4 items-start w-full">
        <div
          className="flex items-center justify-between w-full cursor-pointer hover:opacity-80 transition-opacity"
          onClick={togglePermissions}
        >
          <div className="flex items-center gap-2">
            <Typography className="text-foreground text-[18px] font-bold leading-[22.4px] font-janna">
              Role's Permissions
            </Typography>
            {isEditMode && (
              <Typography className="text-primary text-[14px] font-bold leading-[22.4px] font-janna">
                Edit
              </Typography>
            )}
          </div>
          <div className={cn("transition-transform duration-300", isPermissionsExpanded ? "rotate-180" : "rotate-0")}>
            <ChevronDown className="size-[20px] text-foreground" strokeWidth={2.5} />
          </div>
        </div>

        {isPermissionsExpanded && (
          <div className="flex flex-col gap-4 w-full animate-in fade-in slide-in-from-top-2 duration-300">
            <PermissionGroup title="User Management">
              <PermissionRow title="Create Users" description="Add new users to the system" control={control} name="permissions.createUsers" />
              <PermissionRow title="Edit Users" description="Modify user information" control={control} name="permissions.editUsers" />
              <PermissionRow title="Delete Users" description="Remove users from the system" control={control} name="permissions.deleteUsers" />
            </PermissionGroup>
            <PermissionGroup title="Role Management">
              <PermissionRow title="Manage Roles" description="Create, edit, and delete roles" control={control} name="permissions.manageRoles" />
            </PermissionGroup>
            <PermissionGroup title="Management">
              <PermissionRow title="View Reports" description="Access all system reports" control={control} name="permissions.viewReports" />
              <PermissionRow title="Download Reports" description="Download reports locally to their device" control={control} name="permissions.downloadReports" />
            </PermissionGroup>
            <PermissionGroup title="Tasks Management">
              <PermissionRow title="Set Tasks" description="Download reports locally to their device" control={control} name="permissions.setTasks" />
              <PermissionRow title="View Tasks" description="Access all system reports" control={control} name="permissions.viewTasks" />
            </PermissionGroup>
            <PermissionGroup title="System">
              <PermissionRow title="System Settings" description="Access system settings and modify them" control={control} name="permissions.systemSettings" />
            </PermissionGroup>
            <PermissionGroup title="Organization">
              <PermissionRow title="Manage Departments" description="Create and edit departments" control={control} name="permissions.manageDepartments" />
            </PermissionGroup>
            <PermissionGroup title="Payroll">
              <PermissionRow title="View Salary" description="See employee salary information" control={control} name="permissions.viewSalary" />
              <PermissionRow title="Edit Salary" description="Modify salary information" control={control} name="permissions.editSalary" />
            </PermissionGroup>
            <PermissionGroup title="Archives">
              <PermissionRow title="Chats Archive" description="view and download any chat" control={control} name="permissions.chatsArchive" />
              <PermissionRow title="Tasks Archive" description="view and download any task" control={control} name="permissions.tasksArchive" />
            </PermissionGroup>
            <PermissionGroup title="Documents">
              <PermissionRow title="Manage Documents" description="Upload and manage documents" control={control} name="permissions.manageDocuments" />
            </PermissionGroup>
          </div>
        )}
      </div>
    </>
  );
}

const PermissionGroup = React.memo(function PermissionGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      <Typography className="text-foreground text-[16px] font-bold leading-[22.4px] font-janna">
        {title}
      </Typography>
      <div className="flex flex-col gap-2 w-full">
        {children}
      </div>
    </div>
  );
});

const PermissionRow = React.memo(function PermissionRow({
  title,
  description,
  control,
  name,
}: {
  title: string;
  description: string;
  control: Control<EmployeeValues>;
  name: FieldPath<EmployeeValues>;
}) {
  return (
    <div className="bg-secondary flex items-center justify-between px-3 py-2 rounded-lg w-full gap-2">
      <div className="flex flex-col items-start gap-1.5 flex-1">
        <Typography className="text-foreground text-[14px] font-bold leading-[14px] text-left">
          {title}
        </Typography>
        <Typography className="text-muted-foreground text-[12px] font-bold leading-[14px] text-left">
          {description}
        </Typography>
      </div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <PermSwitch
            checked={!!field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
});
