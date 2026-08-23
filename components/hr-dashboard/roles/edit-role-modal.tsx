"use client";

import * as React from "react";
import { X, Check } from "lucide-react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { createRoleSchema, type CreateRoleFormData } from "@/lib/validations/role";
import { LevelDropdown, PermissionsSection } from "./create-role-modal";
import { ROLE_THEME_COLORS, type RoleData } from "./role-panel";

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleData;
}

export function EditRoleModal({ open, onOpenChange, role }: EditRoleModalProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoleFormData>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: role.name,
      level: String(role.level) as "1" | "2" | "3" | "4" | "5",
      permissions: { ...role.permissions },
    },
  });

  /* Re-seed form whenever a different role is opened */
  React.useEffect(() => {
    reset({
      name: role.name,
      level: String(role.level) as "1" | "2" | "3" | "4" | "5",
      permissions: { ...role.permissions },
    });
  }, [role, reset]);

  React.useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit: SubmitHandler<CreateRoleFormData> = async (data) => {
    console.log("Saving role changes:", data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-[#343434]/60 backdrop-blur-[12px]" />
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[534px] max-w-[534px] p-0 gap-0 border-none bg-[#F8FAFC] rounded-[16px] shadow-2xl overflow-y-auto no-scrollbar max-h-[90vh]"
      >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-[24px] p-[28px]"
          >
            {/* Header */}
            <div className="flex items-start justify-between w-full shrink-0">
              <div className="flex flex-col gap-[4px]">
                {/* "Edit Role: RoleName ○ LevelX" */}
                <div className="flex gap-[8px] items-center">
                  <p className="font-bold text-[20px] leading-[22.4px] font-janna whitespace-nowrap">
                    <span className="text-[#343434]">Edit Role: </span>
                    <span style={{ color: ROLE_THEME_COLORS[role.theme].color }}>{role.name}</span>
                  </p>
                  {/* Level badge */}
                  <div
                    className="flex gap-[4px] items-center justify-center px-[6px] py-[4px] rounded-[4px] shrink-0"
                    style={{ backgroundColor: ROLE_THEME_COLORS[role.theme].iconBg }}
                  >
                    <Shield className="size-[10px]" style={{ color: ROLE_THEME_COLORS[role.theme].color }} />
                    <span
                      className="font-bold text-[10px] leading-[14px] font-janna"
                      style={{ color: ROLE_THEME_COLORS[role.theme].color }}
                    >
                      Level {role.level}
                    </span>
                  </div>
                </div>
                <p className="font-bold text-[14px] text-[#707070] leading-[22.4px] font-janna">
                  Modify role permissions
                </p>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-[#EDF2F7] size-[36px] rounded-full flex items-center justify-center hover:bg-[#e2e8f0] transition-colors shrink-0"
              >
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
                    className={cn(
                      "bg-[#EDF2F7] h-[40px] px-[16px] rounded-[8px] font-bold text-[12px] text-[#707070] placeholder:text-[#707070] font-janna outline-none w-full transition-all",
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
                    className="bg-[#EDF2F7] hover:bg-[#e2e8f0] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-[#343434] font-janna transition-colors shrink-0"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-[#0047FF] hover:bg-[#0037CC] h-[40px] px-[20px] rounded-[12px] font-bold text-[12px] text-white font-janna flex items-center justify-center gap-[8px] transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    <Check className="size-[12px]" strokeWidth={3} />
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}
