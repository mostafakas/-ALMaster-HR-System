"use client";

import * as React from "react";
import { X, Search, Calendar as CalendarIcon, Filter } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import {
  TASK_DEPARTMENT_META,
  TASK_PROJECT_LABELS,
  TASK_STATUS_META,
  TASK_WEIGHT_LABELS,
  type TaskDepartmentKey,
  type TaskPriority,
  type TaskProjectKey,
  type TaskStatus,
  type TaskWeight,
} from "@/lib/types/task";
import {
  taskFilterSchema,
  type TaskFilterValues,
} from "@/lib/validations/task";

export interface FilterTasksModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: TaskFilterValues;
  onApply: (values: TaskFilterValues) => void;
  onReset: () => void;
}

const STATUS_OPTIONS = Object.entries(TASK_STATUS_META) as [
  TaskStatus,
  (typeof TASK_STATUS_META)[TaskStatus],
][];

const PROJECT_OPTIONS = Object.entries(TASK_PROJECT_LABELS) as [
  TaskProjectKey,
  string,
][];

const DEPARTMENT_OPTIONS = Object.entries(TASK_DEPARTMENT_META) as [
  TaskDepartmentKey,
  (typeof TASK_DEPARTMENT_META)[TaskDepartmentKey],
][];

const WEIGHT_OPTIONS = Object.entries(TASK_WEIGHT_LABELS) as [
  TaskWeight,
  string,
][];

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

/**
 * "Filter Tasks" modal (Figma frame screenshot 4).
 *
 * Provides search-by-name + dated + multi-select chip groups for status,
 * weight, priority, project and department.
 */
export function FilterTasksModal({
  open,
  onOpenChange,
  defaultValues,
  onApply,
  onReset,
}: FilterTasksModalProps) {
  const form = useForm<TaskFilterValues>({
    resolver: zodResolver(taskFilterSchema),
    defaultValues: defaultValues ?? {
      assigner: "",
      assignee: "",
      status: [],
      weight: [],
      priority: [],
      projects: [],
      departments: [],
    },
  });

  const { register, handleSubmit, control, reset } = form;

  React.useEffect(() => {
    if (open) {
      reset(
        defaultValues ?? {
          assigner: "",
          assignee: "",
          status: [],
          weight: [],
          priority: [],
          projects: [],
          departments: [],
        }
      );
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[507px] max-w-[507px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-muted shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-7 pb-3 flex items-center justify-between shrink-0">
          <div className="flex flex-col gap-1">
            <Typography className="text-foreground text-[20px] leading-[22.4px]">
              Filter Tasks
            </Typography>
            <Typography className="text-muted-foreground text-[14px] leading-[22.4px]">
              Select filters to narrow down the tasks displayed.
            </Typography>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-secondary size-9 rounded-full flex items-center justify-center hover:bg-secondary/70 transition-colors outline-none"
          >
            <X className="size-4.5 text-foreground" strokeWidth={3} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit((values) => {
            onApply(values);
            onOpenChange(false);
          })}
          className="flex-1 overflow-y-auto no-scrollbar px-7 pb-7 flex flex-col gap-5"
        >
          <FieldGroup label="Assigner">
            <SearchField
              placeholder="Search by name or role..."
              {...register("assigner")}
            />
          </FieldGroup>

          <FieldGroup label="Assignee">
            <SearchField
              placeholder="Search by name or role..."
              {...register("assignee")}
            />
          </FieldGroup>

          <FieldGroup label="Date">
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="ghost"
                        className="bg-secondary border-none h-10 px-4 rounded-[8px] text-[12px] font-bold w-full flex items-center justify-between hover:bg-secondary"
                      >
                        <span
                          className={
                            field.value ? "text-foreground" : "text-muted-foreground"
                          }
                        >
                          {field.value
                            ? format(field.value as Date, "dd/MM/yyyy")
                            : "dd/mm/yyyy"}
                        </span>
                        <CalendarIcon className="size-3.5 text-muted-foreground" />
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0 border-none shadow-xl">
                    <Calendar
                      mode="single"
                      selected={field.value as Date | undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </FieldGroup>

          <FieldGroup label="Status">
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <CheckboxGrid
                  values={field.value ?? []}
                  onChange={field.onChange}
                  items={STATUS_OPTIONS.map(([value, meta]) => ({
                    value,
                    label: meta.label,
                  }))}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup label="Weight">
            <Controller
              control={control}
              name="weight"
              render={({ field }) => (
                <CheckboxGrid
                  values={field.value ?? []}
                  onChange={field.onChange}
                  items={WEIGHT_OPTIONS.map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup label="Priority">
            <Controller
              control={control}
              name="priority"
              render={({ field }) => (
                <CheckboxGrid
                  values={field.value ?? []}
                  onChange={field.onChange}
                  items={PRIORITY_OPTIONS}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup label="Projects">
            <Controller
              control={control}
              name="projects"
              render={({ field }) => (
                <ChipGrid
                  values={field.value ?? []}
                  onChange={field.onChange}
                  items={PROJECT_OPTIONS.map(([value, label]) => ({
                    value,
                    label,
                    activeBg: "bg-primary",
                    inactiveBg: "bg-primary/10",
                    inactiveFg: "text-primary",
                  }))}
                />
              )}
            />
          </FieldGroup>

          <FieldGroup label="Departments">
            <Controller
              control={control}
              name="departments"
              render={({ field }) => (
                <ChipGrid
                  values={field.value ?? []}
                  onChange={field.onChange}
                  items={DEPARTMENT_OPTIONS.map(([value, meta]) => ({
                    value,
                    label: meta.label,
                    activeBg: meta.solidBg,
                    inactiveBg: meta.tintBg,
                    inactiveFg: meta.tintFg,
                  }))}
                />
              )}
            />
          </FieldGroup>

          <div className="flex gap-2 items-center pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                onReset();
                onOpenChange(false);
              }}
              className="bg-secondary hover:bg-secondary/80 h-10 px-5 rounded-[12px] text-foreground text-[12px] font-bold"
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 h-10 px-5 rounded-[12px] text-white text-[12px] font-bold flex items-center justify-center gap-2"
            >
              <Filter className="size-3.5" strokeWidth={2.5} />
              Apply Filters
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Typography className="text-foreground text-[14px] leading-[22.4px]">
        {label}
      </Typography>
      {children}
    </div>
  );
}

const SearchField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function SearchField({ className, ...props }, ref) {
    return (
      <div className="bg-secondary h-10 flex items-center gap-2 px-3 rounded-[8px]">
        <Search className="size-3 text-muted-foreground" />
        <input
          ref={ref}
          {...props}
          className={cn(
            "bg-transparent border-none outline-none text-[12px] font-bold text-foreground placeholder:text-muted-foreground w-full",
            className
          )}
        />
      </div>
    );
  }
);

function CheckboxGrid({
  items,
  values,
  onChange,
}: {
  items: { value: string; label: string }[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };
  return (
    <div className="grid grid-cols-2 gap-2 bg-background border border-secondary rounded-[8px] p-3">
      {items.map((item) => {
        const checked = values.includes(item.value);
        return (
          <label
            key={item.value}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Checkbox
              checked={checked}
              onCheckedChange={() => toggle(item.value)}
              className="size-3.5"
            />
            <Typography className="text-foreground text-[12px]">
              {item.label}
            </Typography>
          </label>
        );
      })}
    </div>
  );
}

function ChipGrid({
  items,
  values,
  onChange,
}: {
  items: {
    value: string;
    label: string;
    activeBg: string;
    inactiveBg: string;
    inactiveFg: string;
  }[];
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (value: string) => {
    onChange(
      values.includes(value)
        ? values.filter((v) => v !== value)
        : [...values, value]
    );
  };
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = values.includes(item.value);
        return (
          <button
            type="button"
            key={item.value}
            onClick={() => toggle(item.value)}
            className={cn(
              "px-3 h-8 rounded-[6px] text-[12px] font-bold transition-all",
              active ? `${item.activeBg} text-white` : `${item.inactiveBg} ${item.inactiveFg}`
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
