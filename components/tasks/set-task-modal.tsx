"use client";

import * as React from "react";
import {
  X,
  Calendar as CalendarIcon,
  Plus,
  Search,
} from "lucide-react";
import { useForm, Controller, SubmitHandler, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import { FileUpload } from "@/components/ui/file-upload";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Typography } from "@/components/ui/typography";
import { taskSchema, type TaskValues } from "@/lib/validations/task";
import { submitTask } from "@/lib/api-service";
import { cn } from "@/lib/utils";
import {
  TASK_DEPARTMENT_META,
  TASK_PROJECT_LABELS,
  TASK_WEIGHT_LABELS,
  type TaskDepartmentKey,
  type TaskProjectKey,
  type TaskRecord,
  type TaskWeight,
} from "@/lib/types/task";
import { TASK_MEMBERS } from "@/lib/data/tasks-mock";

export interface SetTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, modal switches to edit mode with the task's values. */
  task?: TaskRecord;
  /** Optional default status (used when triggered from a board column). */
  defaultStatus?: TaskRecord["status"];
}

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

/**
 * "Set New Task" / "Edit Task" modal.
 *
 * Matches the Figma frames (Set: 145:67641, Edit: 145:68... — with the
 * extra Project / Cost / Weight / Department fields, attachments list,
 * and freelancer cost toggle).
 */
export function SetTaskModal({
  open,
  onOpenChange,
  task,
  defaultStatus,
}: SetTaskModalProps) {
  const isEdit = Boolean(task);
  const [searchQuery, setSearchQuery] = React.useState("");

  const form = useForm<TaskValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? "low",
      weight: task?.weight ?? "normal",
      project: task?.project ?? "",
      department: task?.department ?? "",
      cost: task?.cost?.toString() ?? "",
      costFreelancer: task?.costFreelancer ?? false,
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      assignees: task?.assignees.map((a) => a.id) ?? [],
      attachments: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;
  const selectedAssignees = useWatch({ control, name: "assignees" }) ?? [];

  React.useEffect(() => {
    if (open) {
      reset({
        title: task?.title ?? "",
        description: task?.description ?? "",
        priority: task?.priority ?? "low",
        weight: task?.weight ?? "normal",
        project: task?.project ?? "",
        department: task?.department ?? "",
        cost: task?.cost?.toString() ?? "",
        costFreelancer: task?.costFreelancer ?? false,
        dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
        assignees: task?.assignees.map((a) => a.id) ?? [],
        attachments: [],
      });
    }
  }, [open, task, reset, defaultStatus]);

  const onSubmit: SubmitHandler<TaskValues> = async (data) => {
    await submitTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate?.toISOString(),
      assignees: data.assignees,
      project: data.project,
      department: data.department,
      weight: data.weight,
      cost: data.cost ? Number(data.cost) : undefined,
      costFreelancer: data.costFreelancer,
    });
    reset();
    onOpenChange(false);
  };

  const filteredEmployees = TASK_MEMBERS.filter(
    (e) =>
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAssignee = (id: string) => {
    const next = selectedAssignees.includes(id)
      ? selectedAssignees.filter((existing) => existing !== id)
      : [...selectedAssignees, id];
    setValue("assignees", next, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-foreground/70 backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[507px] max-w-[507px] p-0 gap-0 overflow-hidden border-none rounded-[16px] bg-muted shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-7 pb-3 flex flex-row items-center justify-between shrink-0">
          <div className="flex flex-col gap-1 items-start">
            <Typography className="text-foreground text-[20px] font-bold leading-[22.4px]">
              {isEdit ? "Edit Task" : "Set New Task"}
            </Typography>
            <Typography className="text-muted-foreground text-[14px] leading-[22.4px]">
              {isEdit
                ? "Update the task details and assignment."
                : "Assign a new task to your company team members."}
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

        {/* Body */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar min-h-0">
          <div className="px-7 pt-3 pb-10 flex flex-col gap-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id="set-task-form"
              className="flex flex-col gap-6"
            >
              <FormField label="Task Title" error={errors.title?.message}>
                <Input
                  placeholder="Review Q1 Performance Reports"
                  className={cn(modalInput, errors.title && "ring-1 ring-destructive")}
                  {...register("title")}
                />
              </FormField>

              <FormField
                label="Description"
                error={errors.description?.message}
              >
                <textarea
                  placeholder="Analyze team performance metrics and prepare feedback for quarterly reviews."
                  className={cn(
                    modalInput,
                    "min-h-[88px] resize-none py-3",
                    errors.description && "ring-1 ring-destructive"
                  )}
                  {...register("description")}
                />
              </FormField>

              {/* Attachments — either existing list or upload zone */}
              {isEdit && task?.attachments && task.attachments.length > 0 ? (
                <AttachmentsList task={task} />
              ) : (
                <FileUpload
                  label="Attachments"
                  hint="PDF, Word, Excel, Images (max. 50MB)"
                  onChange={(file) =>
                    setValue("attachments", file ? [file] : [])
                  }
                  className="w-full"
                />
              )}

              {/* Priority + Due Date row */}
              <div className="flex gap-3 w-full items-start">
                <FormField label="Priority" error={errors.priority?.message}>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? "low"}
                      >
                        <SelectTrigger
                          className={cn(
                            modalSelectTrigger,
                            errors.priority && "ring-1 ring-destructive"
                          )}
                        >
                          <SelectValue placeholder="Select Priority" />
                        </SelectTrigger>
                        <SelectContent
                          alignItemWithTrigger={false}
                          side="bottom"
                          sideOffset={6}
                          className="bg-secondary/90 backdrop-blur-[6px] rounded-[8px] border-none shadow-2xl p-2 w-(--anchor-width) flex flex-col gap-1"
                        >
                          <PriorityItem
                            value="low"
                            color="success"
                            label="Low"
                          />
                          <PriorityItem
                            value="medium"
                            color="warning"
                            label="Medium"
                          />
                          <PriorityItem
                            value="high"
                            color="destructive"
                            label="High"
                          />
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField label="Due Date" error={errors.dueDate?.message}>
                  <Controller
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="ghost"
                              className={cn(
                                modalSelectTrigger,
                                "w-full",
                                field.value ? "text-foreground" : "text-muted-foreground",
                                errors.dueDate && "ring-1 ring-destructive"
                              )}
                            >
                              <span className="font-bold">
                                {field.value
                                  ? format(field.value as Date, "dd/MM/yyyy")
                                  : "dd/mm/yyyy"}
                              </span>
                              <CalendarIcon className="size-3.5 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <PopoverContent
                          className="w-auto p-0 border-none shadow-xl"
                          align="end"
                        >
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
                </FormField>
              </div>

              {/* Project + Cost row */}
              <div className="flex gap-3 w-full items-start">
                <FormField label="Project">
                  <Controller
                    control={control}
                    name="project"
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <SelectTrigger className={modalSelectTrigger}>
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                        <SelectContent
                          alignItemWithTrigger={false}
                          side="bottom"
                          sideOffset={6}
                          className="bg-secondary/90 backdrop-blur-[6px] rounded-[8px] border-none shadow-2xl p-2 w-(--anchor-width) flex flex-col gap-1"
                        >
                          {PROJECT_OPTIONS.map(([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className="rounded-[8px] px-3 h-8 focus:bg-primary/10 transition-colors cursor-pointer outline-none"
                            >
                              <Typography className="text-foreground text-[12px]">
                                {label}
                              </Typography>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Cost"
                  trailing={
                    <Controller
                      control={control}
                      name="costFreelancer"
                      render={({ field }) => (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <Typography className="text-muted-foreground text-[10px]">
                            For Freelancer
                          </Typography>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            size="sm"
                          />
                        </label>
                      )}
                    />
                  }
                >
                  <Input
                    type="number"
                    placeholder="20,000 EGP"
                    className={modalInput}
                    {...register("cost")}
                  />
                </FormField>
              </div>

              {/* Weight (single column) */}
              <FormField label="Weight">
                <Controller
                  control={control}
                  name="weight"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value ?? "normal"}>
                      <SelectTrigger className={modalSelectTrigger}>
                        <SelectValue placeholder="Select Weight" />
                      </SelectTrigger>
                      <SelectContent
                        alignItemWithTrigger={false}
                        side="bottom"
                        sideOffset={6}
                        className="bg-secondary/90 backdrop-blur-[6px] rounded-[8px] border-none shadow-2xl p-2 w-(--anchor-width) flex flex-col gap-1"
                      >
                        {WEIGHT_OPTIONS.map(([value, label]) => (
                          <SelectItem
                            key={value}
                            value={value}
                            className="rounded-[8px] px-3 h-8 focus:bg-primary/10 cursor-pointer outline-none"
                          >
                            <Typography className="text-foreground text-[12px]">
                              {label}
                            </Typography>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              {/* Assign to (Figma 75:2832) */}
              <FormField
                label="Assign to"
                error={errors.assignees?.message as string | undefined}
              >
                <div
                  className={cn(
                    "w-full h-[256px] bg-background border border-secondary rounded-[8px] flex flex-col p-4 gap-2 overflow-hidden",
                    errors.assignees && "ring-1 ring-destructive"
                  )}
                >
                  <div className="h-9 bg-secondary flex items-center gap-2 px-3 rounded-[8px] shrink-0">
                    <Search className="size-3 text-muted-foreground" />
                    <input
                      className="bg-transparent border-none outline-none text-[12px] font-bold text-foreground placeholder:text-muted-foreground w-full"
                      placeholder="Search by name or role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto no-scrollbar -mx-4">
                    <div className="flex flex-col px-4">
                      {filteredEmployees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => toggleAssignee(emp.id)}
                          className="flex items-center gap-3 h-14 rounded-[8px] cursor-pointer px-4 -mx-4 hover:bg-secondary/40 transition-colors"
                        >
                          <Checkbox
                            checked={selectedAssignees.includes(emp.id)}
                            onCheckedChange={() => {}}
                            className="size-3 rounded-[2px]"
                          />
                          <Avatar className="size-10 rounded-full">
                            <AvatarImage src={emp.avatar} />
                            <AvatarFallback>{emp.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col justify-start min-w-0 flex-1">
                            <Typography className="text-foreground text-[14px] leading-4 truncate">
                              {emp.name}
                            </Typography>
                            <Typography className="text-muted-foreground text-[12px] leading-4 truncate">
                              {emp.role}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {selectedAssignees.length > 0 && (
                  <Typography className="text-muted-foreground text-[11px] mt-2">
                    {selectedAssignees.length} Members selected
                  </Typography>
                )}
              </FormField>

              {/* Department(s) */}
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <Typography className="text-foreground text-[14px] leading-[22.4px]">
                    Department(s)
                  </Typography>
                  <Typography className="text-muted-foreground text-[10px] leading-[14px]">
                    Auto based on Assignee(s)
                  </Typography>
                </div>
                <Controller
                  control={control}
                  name="department"
                  render={({ field }) => (
                    <div className="flex flex-wrap gap-2">
                      {DEPARTMENT_OPTIONS.map(([value, meta]) => {
                        const active = field.value === value;
                        return (
                          <button
                            type="button"
                            key={value}
                            onClick={() => field.onChange(value)}
                            className={cn(
                              "px-3 py-1 rounded-[6px] text-[12px] font-bold transition-all",
                              active
                                ? `${meta.solidBg} text-white`
                                : `${meta.tintBg} ${meta.tintFg}`
                            )}
                          >
                            {meta.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                />
              </div>

              {/* Footer */}
              <div className="flex gap-2 w-full items-center mt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="bg-secondary hover:bg-secondary/80 h-10 px-5 rounded-[12px] text-foreground text-[12px] font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="set-task-form"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary hover:bg-primary/90 h-10 px-5 rounded-[12px] text-white text-[12px] font-bold flex items-center justify-center gap-2"
                >
                  {!isEdit && <Plus className="size-3.5" strokeWidth={2.5} />}
                  <span>{isEdit ? "Save Changes" : "Set Task"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

const modalInput =
  "bg-secondary border-none h-10 px-4 py-0 rounded-[8px] text-[12px] font-bold text-foreground placeholder:text-muted-foreground placeholder:font-bold focus-visible:ring-0 w-full transition-all";

const modalSelectTrigger =
  "h-10! bg-secondary border-none px-4 py-0 rounded-[8px] text-[12px] font-bold! outline-none w-full! shadow-none transition-all justify-between [&>svg]:size-3.5 [&>svg]:text-muted-foreground data-[placeholder]:text-muted-foreground text-foreground";

function FormField({
  label,
  trailing,
  error,
  children,
}: {
  label: string;
  trailing?: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5 flex-1 relative w-full">
      <div className="flex items-center justify-between w-full">
        <Typography className="text-foreground text-[14px] leading-[22.4px]">
          {label}
        </Typography>
        {trailing}
      </div>
      {children}
      {error && (
        <span className="text-destructive text-[10px] font-bold">{error}</span>
      )}
    </div>
  );
}

function PriorityItem({
  value,
  color,
  label,
}: {
  value: string;
  color: "success" | "warning" | "destructive";
  label: string;
}) {
  const styles: Record<typeof color, { fg: string; bg: string; ring: string }> =
    {
      success: { fg: "text-success", bg: "bg-success", ring: "focus:bg-success/10" },
      warning: { fg: "text-warning", bg: "bg-warning", ring: "focus:bg-warning/10" },
      destructive: {
        fg: "text-destructive",
        bg: "bg-destructive",
        ring: "focus:bg-destructive/10",
      },
    };
  const s = styles[color];
  return (
    <SelectItem
      value={value}
      className={cn(
        "rounded-[8px] px-3 h-8 cursor-pointer outline-none transition-colors",
        s.ring
      )}
    >
      <div className="flex items-center gap-2">
        <span className={cn("size-2 rounded-full", s.bg)} />
        <span className={cn("font-bold text-[14px] leading-4", s.fg)}>
          {label}
        </span>
      </div>
    </SelectItem>
  );
}

function AttachmentsList({ task }: { task: TaskRecord }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Typography className="text-foreground text-[14px] leading-[22.4px]">
        Attachments
      </Typography>
      <div className="flex flex-col gap-2">
        {task.attachments?.map((att, i) => (
          <div
            key={att.id}
            className="flex items-center justify-between bg-background border border-secondary rounded-[8px] p-2.5"
          >
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                {att.type.toUpperCase()}
              </div>
              <div className="flex flex-col">
                <Typography className="text-foreground text-[12px]">
                  {att.name}
                </Typography>
                <Typography className="text-muted-foreground text-[10px]">
                  {att.type.toUpperCase()} • {att.size}
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <div className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                {att.pages ?? i + 1}
              </div>
              <button
                type="button"
                className="size-6 rounded-md bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
              >
                <X className="size-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
