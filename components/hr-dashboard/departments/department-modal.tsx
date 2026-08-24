"use client";

import * as React from "react";
import { X, Search, ChevronDown, Check, Plus } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAddDepartmentMutation, useUpdateDepartmentMutation } from "@/lib/store/services/departmentApi";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Typography } from "@/components/ui/typography";
import {
  departmentSchema,
  type DepartmentValues,
} from "@/lib/validations/department";
import { cn } from "@/lib/utils";

// ─── Color presets ────────────────────────────────────────────────────────────

const colorPresets = [
  { label: "Purple", value: "#6E1ADB" },
  { label: "Blue", value: "#0047FF" },
  { label: "Green", value: "#00B927" },
  { label: "Orange", value: "#F38328" },
  { label: "Red", value: "#F55050" },
  { label: "Teal", value: "#08A1BC" },
  { label: "Violet", value: "#AA00FF" },
  { label: "Dark", value: "#343434" },
];

// ─── Mock employees ───────────────────────────────────────────────────────────

const EMPLOYEES = [
  {
    id: "1",
    name: "Matt Scott",
    role: "Company Super Admin",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  {
    id: "2",
    name: "Matt Scott",
    role: "UI/UX Designer",
    avatar: "https://ui.shadcn.com/avatars/02.png",
  },
  {
    id: "3",
    name: "",
    role: "Content Creator",
    avatar: "https://ui.shadcn.com/avatars/03.png",
  },
  {
    id: "4",
    name: "Matt Scott",
    role: "Content Creator",
    avatar: "https://ui.shadcn.com/avatars/04.png",
  },
  {
    id: "5",
    name: "",
    role: "Company Super Admin",
    avatar: "https://ui.shadcn.com/avatars/05.png",
  },
  {
    id: "6",
    name: "Matt Scott",
    role: "UI/UX Designer",
    avatar: "https://ui.shadcn.com/avatars/01.png",
  },
  {
    id: "7",
    name: "Matt Scott",
    role: "Content Creator",
    avatar: "https://ui.shadcn.com/avatars/02.png",
  },
  {
    id: "8",
    name: "Matt Scott",
    role: "Content Creator",
    avatar: "https://ui.shadcn.com/avatars/03.png",
  },
];

// ─── Color Picker ─────────────────────────────────────────────────────────────

function ColorPicker({
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
  const selected = colorPresets.find((c) => c.value === value) ?? null;

  React.useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "bg-secondary h-[40px] w-full flex items-center justify-between px-[16px] rounded-[8px] transition-all",
          error && "ring-1 ring-destructive",
        )}>

        <div className="flex items-center gap-[8px]">
          {selected ? (
            <>
              <div
                className="size-[12px] rounded-[2px] shrink-0"
                style={{ backgroundColor: selected.value }}
              />
              <span
                className="text-[12px] font-bold"
                style={{ color: selected.value }}>
                {selected.label}
              </span>
            </>
          ) : (
            <span className="text-[12px] font-bold text-muted-foreground">
              Select color
            </span>
          )}

        </div>
        <ChevronDown
          className={cn(
            "size-[14px] text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />

      </button>

      {open && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 bg-secondary/90 backdrop-blur-[6px] rounded-[12px] shadow-2xl p-[8px] flex flex-col gap-[4px] z-50">
          {colorPresets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => {
                onChange(preset.value);
                setOpen(false);
              }}
              className="flex items-center justify-between px-[12px] h-[32px] rounded-[8px] hover:bg-foreground/10 transition-colors cursor-pointer">

              <div className="flex items-center gap-[8px]">
                <div
                  className="size-[12px] rounded-[2px] shrink-0"
                  style={{ backgroundColor: preset.value }}
                />
                <span
                  className="text-[12px] font-bold"
                  style={{ color: preset.value }}>
                  {preset.label}
                </span>
              </div>
              {value === preset.value && (
                <Check className="size-[12px] text-foreground" />
              )}

            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Employee checkbox list ───────────────────────────────────────────────────

function EmployeeList({
  selected,
  onChange,
  error,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  error?: string;
}) {
  const [search, setSearch] = React.useState("");
  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  );

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id],
    );
  }

  return (
    <div
      className={cn(
        "border border-border h-[256px] flex flex-col gap-[8px] p-[16px] rounded-[8px] overflow-hidden w-full",
        error && "border-destructive",
      )}>
      {/* Search */}
      <div className="bg-secondary h-[36px] flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] shrink-0">
        <Search className="size-[12px] text-muted-foreground shrink-0" />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or role..."
          className="flex-1 bg-transparent text-[12px] font-bold text-foreground placeholder:text-muted-foreground outline-none leading-[14px] font-janna"
        />

      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filtered.map((emp) => {
          const isChecked = selected.includes(emp.id);
          return (
            <button
              key={emp.id}
              type="button"
              onClick={() => toggle(emp.id)}
              className="w-full flex items-center gap-[12px] h-[56px] px-[16px] hover:bg-[#f8fafc] transition-colors rounded-[6px]">
              {/* Checkbox */}
              <div
                className={cn(
                  "size-[12px] rounded-[2px] border shrink-0 flex items-center justify-center transition-colors",
                  isChecked
                    ? "bg-primary border-primary"
                    : "border-muted-foreground",
                )}>
                {isChecked && (
                  <Check className="size-[8px] text-primary-foreground" strokeWidth={3} />
                )}

              </div>

              {/* Avatar */}
              <div className="relative size-[40px] shrink-0">
                <Avatar className="size-full rounded-full">
                  <AvatarImage src={emp.avatar} />
                  <AvatarFallback className="text-[10px] font-bold bg-secondary">
                    {emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

              </div>

              {/* Info */}
              <div className="flex flex-col gap-[4px] items-start flex-1 min-w-0">
                <span className="text-[14px] font-bold text-foreground leading-[16px] whitespace-nowrap font-janna">
                  {emp.name}
                </span>
                <span className="text-[12px] font-bold text-muted-foreground leading-[16px] whitespace-nowrap font-janna">
                  {emp.role}
                </span>
              </div>

            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-[6px] w-full items-start relative",
        className,
      )}>
      <Label className="text-foreground text-[14px] font-bold leading-[22.4px] font-janna">
        {label}
      </Label>
      {children}
      {error && (
        <span className="absolute -bottom-[18px] right-0 text-destructive text-[10px] font-bold font-janna">
          {error}
        </span>
      )}

    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    "bg-secondary border-none h-[40px] px-[16px] py-0 rounded-[8px] text-[12px] font-bold text-foreground focus-visible:ring-0 w-full placeholder:text-muted-foreground placeholder:font-bold placeholder:font-janna font-janna leading-[22.4px] transition-all",
    hasError && "ring-1 ring-destructive",
  );


// ─── Modal ────────────────────────────────────────────────────────────────────

interface DepartmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<DepartmentValues> & { id?: string };
}

export function DepartmentModal({
  open,
  onOpenChange,
  initialData,
}: DepartmentModalProps) {
  const isEdit = !!initialData?.name;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DepartmentValues>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      color: initialData?.color ?? "",
      iconFile: "",
      headIds: initialData?.headIds ?? [],
      employeeIds: initialData?.employeeIds ?? [],
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: initialData?.name ?? "",
        description: initialData?.description ?? "",
        color: initialData?.color ?? "",
        iconFile: "",
        headIds: initialData?.headIds ?? [],
        employeeIds: initialData?.employeeIds ?? [],
      });
    }
  }, [open, initialData, reset]);

  const [addDepartment, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const isSaving = isAdding || isUpdating;

  const onSubmit: SubmitHandler<DepartmentValues> = async (data) => {
    try {
      if (isEdit && initialData?.id) {
        await updateDepartment({ id: initialData.id, data }).unwrap();
      } else {
        await addDepartment(data).unwrap();
      }
      reset();
      onOpenChange(false);
    } catch (err) {
      console.error("Department save failed:", err);
    }
  };

  const iconFileRef = React.useRef<HTMLInputElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[20px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[507px] max-w-[507px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-background shadow-2xl flex flex-col max-h-[90vh]">

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0 no-scrollbar">
          <div className="flex flex-col gap-[24px] p-[28px]">
            {/* Header */}
            <div className="flex items-start justify-between w-full shrink-0">
              <div className="flex flex-col gap-[4px]">
                <p className="font-bold text-[20px] text-foreground leading-[22.4px] font-janna whitespace-nowrap">
                  {isEdit ? `Edit Department` : "Create New Department"}
                </p>
                <p className="font-bold text-[14px] text-muted-foreground leading-[22.4px] font-janna whitespace-nowrap">
                  {isEdit
                    ? "Update the details of this department."
                    : "Add a new department with managers and employees."}
                </p>
              </div>
              <div
                className="bg-secondary size-[36px] rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors shrink-0"
                onClick={() => onOpenChange(false)}>
                <X className="size-[18px] text-foreground" strokeWidth={3} />
              </div>

            </div>

            {/* Form */}
            <form
              id="department-form"
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-[40px]">
              <div className="flex flex-col gap-[12px]">
                {/* Department Name */}
                <Field label="Department Name" error={errors.name?.message}>
                  <Input
                    placeholder="Ex. Engineering, Marketing, Sales"
                    className={inputCls(!!errors.name)}
                    {...register("name")}
                  />
                </Field>

                {/* Description */}
                <Field label="Description" error={errors.description?.message}>
                  <textarea
                    placeholder="Brief description of the department's purpose and responsibilities"
                    rows={3}
                    className={cn(
                      "bg-secondary border-none h-[72px] px-[16px] py-[8px] rounded-[8px] text-[12px] font-bold text-foreground w-full resize-none outline-none placeholder:text-muted-foreground placeholder:font-bold font-janna leading-[22.4px] transition-all",
                      errors.description && "ring-1 ring-destructive",
                    )}
                    {...register("description")}
                  />
                </Field>


                {/* Color + Icon — side by side */}
                <div className="flex gap-[12px] w-full">
                  <Field
                    label="Department Color"
                    error={errors.color?.message}
                    className="flex-1">
                    <Controller
                      control={control}
                      name="color"
                      render={({ field }) => (
                        <ColorPicker
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.color?.message}
                        />
                      )}
                    />
                  </Field>

                  <Field label="Department Icon" className="flex-1">
                    <button
                      type="button"
                      onClick={() => iconFileRef.current?.click()}
                      className="bg-secondary h-[40px] w-full flex items-center justify-between px-[16px] rounded-[8px] hover:brightness-95 transition-all">
                      <span className="text-[12px] font-bold text-muted-foreground font-janna">
                        Upload an icon (SVG)
                      </span>
                      <Plus className="size-[10px] text-muted-foreground" />
                    </button>

                    <input
                      type="file"
                      accept=".svg"
                      className="hidden"
                      ref={iconFileRef}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) register("iconFile").onChange(e);
                      }}
                    />
                  </Field>
                </div>

                {/* Head */}
                <Field label="Head" error={errors.headIds?.message}>
                  <Controller
                    control={control}
                    name="headIds"
                    render={({ field }) => (
                      <EmployeeList
                        selected={field.value ?? []}
                        onChange={field.onChange}
                        error={errors.headIds?.message}
                      />
                    )}
                  />
                </Field>

                {/* Employee(s) */}
                <Field
                  label="Employee(s)"
                  error={(errors.employeeIds as any)?.message}>
                  <Controller
                    control={control}
                    name="employeeIds"
                    render={({ field }) => (
                      <EmployeeList
                        selected={field.value ?? []}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Field>
              </div>

              {/* Footer buttons — inside form so submit works */}
              <div className="flex gap-[8px] w-full">
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-secondary hover:bg-secondary/80 border-none text-foreground px-[20px] h-[40px] rounded-[12px] font-bold text-[12px] flex-none shadow-none font-janna transition-colors"
                  variant="ghost">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isSaving}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-[8px] h-[40px] rounded-[12px] font-bold text-[12px] shadow-none transition-all active:scale-[0.98] font-janna">
                  <Check className="size-[12px]" strokeWidth={3} />
                  {isEdit ? "Save Changes" : "Create Department"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
