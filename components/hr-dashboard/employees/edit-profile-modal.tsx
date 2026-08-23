"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const editProfileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(6, "Phone number is required"),
  department: z.string().min(1, "Department is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  levelOfAuthority: z.string().min(1, "Level of authority is required"),
});

type EditProfileValues = z.infer<typeof editProfileSchema>;

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<EditProfileValues>;
  onSave?: (values: EditProfileValues) => void;
}

const DEPARTMENTS = [
  "Graphic Design Department",
  "Programming Department",
  "Content Department",
  "Marketing Department",
  "HR Department",
];

const JOB_TITLES = [
  "Content Manager",
  "Senior Developer",
  "UI Designer",
  "Team Lead",
  "Project Manager",
  "HR Specialist",
];

const AUTHORITY_LEVELS = [
  "Super Admin",
  "Admin",
  "Team Lead",
  "Senior",
  "Mid-Level",
  "Junior",
];

export function EditProfileModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditProfileModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditProfileValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      department: initialData?.department ?? "",
      jobTitle: initialData?.jobTitle ?? "",
      levelOfAuthority: initialData?.levelOfAuthority ?? "",
    },
  });

  React.useEffect(() => {
    if (open && initialData) {
      reset({
        fullName: initialData.fullName ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        department: initialData.department ?? "",
        jobTitle: initialData.jobTitle ?? "",
        levelOfAuthority: initialData.levelOfAuthority ?? "",
      });
    }
  }, [open, initialData, reset]);

  const onSubmit = (values: EditProfileValues) => {
    onSave?.(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[rgba(52,52,52,0.7)] backdrop-blur-[2px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[560px] max-w-[560px] p-0 gap-0 overflow-hidden border-none rounded-2xl bg-background shadow-2xl flex flex-col"
      >
          <div className="bg-background rounded-2xl w-full flex flex-col overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground leading-6">
                  Edit Profile
                </h2>
                <p className="text-xs font-bold text-muted-foreground leading-5 mt-0.5">
                  Update employee information and account details.
                </p>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="size-8 bg-secondary rounded-lg flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                <X className="size-3.5 text-foreground" />
              </button>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
              <div className="px-[24px] py-[20px] flex flex-col gap-[16px]">
                {/* Row 1: Full Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                      Full Name
                    </Label>
                    <input
                      {...register("fullName")}
                      placeholder="Enter full name"
                      className={cn(
                        "h-10 w-full bg-muted border rounded-lg px-3 text-sm font-bold text-foreground placeholder:text-muted placeholder:font-bold outline-none transition-colors",
                        errors.fullName
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary/40",
                      )}
                    />
                    {errors.fullName && (
                      <span className="text-[10px] font-bold text-destructive">
                        {errors.fullName.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                      Email Address
                    </Label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="Enter email address"
                      className={cn(
                        "h-10 w-full bg-muted border rounded-lg px-3 text-sm font-bold text-foreground placeholder:text-muted placeholder:font-bold outline-none transition-colors",
                        errors.email
                          ? "border-destructive focus:border-destructive"
                          : "border-border focus:border-primary/40",
                      )}
                    />
                    {errors.email && (
                      <span className="text-[10px] font-bold text-destructive">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                </div>


                {/* Row 2: Phone */}
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                    Phone Number
                  </Label>
                  <input
                    {...register("phone")}
                    placeholder="+20 1012345678"
                    className={cn(
                      "h-10 w-full bg-muted border rounded-lg px-3 text-sm font-bold text-foreground placeholder:text-muted placeholder:font-bold outline-none transition-colors",
                      errors.phone
                        ? "border-destructive focus:border-destructive"
                        : "border-border focus:border-primary/40",
                    )}
                  />
                  {errors.phone && (
                    <span className="text-[10px] font-bold text-destructive">
                      {errors.phone.message}
                    </span>
                  )}
                </div>


                {/* Row 3: Department + Job Title + Level */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                      Department
                    </Label>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={cn(
                              "h-10 bg-muted border rounded-lg px-3 text-sm font-bold text-foreground outline-none transition-colors",
                              errors.department
                                ? "border-destructive"
                                : "border-border",
                            )}
                          >
                            <SelectValue placeholder="Select dept." />
                          </SelectTrigger>

                          <SelectContent>
                            {DEPARTMENTS.map((d) => (
                              <SelectItem key={d} value={d}>
                                {d}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.department && (
                      <span className="text-[10px] font-bold text-destructive">
                        {errors.department.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                      Job Title
                    </Label>
                    <Controller
                      name="jobTitle"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={cn(
                              "h-10 bg-muted border rounded-lg px-3 text-sm font-bold text-foreground outline-none transition-colors",
                              errors.jobTitle
                                ? "border-destructive"
                                : "border-border",
                            )}
                          >
                            <SelectValue placeholder="Select title" />
                          </SelectTrigger>

                          <SelectContent>
                            {JOB_TITLES.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.jobTitle && (
                      <span className="text-[10px] font-bold text-destructive">
                        {errors.jobTitle.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs font-bold text-muted-foreground leading-[14px]">
                      Level of Authority
                    </Label>
                    <Controller
                      name="levelOfAuthority"
                      control={control}
                      render={({ field }) => (
                        <Select value={field.value ?? ""} onValueChange={field.onChange}>
                          <SelectTrigger
                            className={cn(
                              "h-10 bg-muted border rounded-lg px-3 text-sm font-bold text-foreground outline-none transition-colors",
                              errors.levelOfAuthority
                                ? "border-destructive"
                                : "border-border",
                            )}
                          >
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>

                          <SelectContent>
                            {AUTHORITY_LEVELS.map((l) => (
                              <SelectItem key={l} value={l}>
                                {l}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.levelOfAuthority && (
                      <span className="text-[11px] font-bold text-[#F55050]">
                        {errors.levelOfAuthority.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="h-10 px-5 rounded-xl border border-border bg-background text-sm font-bold text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
      </DialogContent>
    </Dialog>
  );
}
