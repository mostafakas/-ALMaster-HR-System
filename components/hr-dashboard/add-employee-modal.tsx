"use client";

import * as React from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { employeeSchema, type EmployeeValues } from "@/lib/validations/employee";
import { useAddEmployeeMutation } from "@/lib/store/services/employeeApi";
import { useFormMutation } from "@/hooks/form/use-form-mutation";
import { BaseModal } from "@/components/hr-dashboard/modals/base-modal";
import { EmployeeForm } from "@/components/hr-dashboard/modals/employee-form";

const EMPTY_FORM_VALUES: EmployeeValues = {
  fullName: "",
  email: "",
  phoneNumber: "",
  countryCode: "+966",
  jobTitle: "",
  seniorityLevel: "",
  departmentId: "",
  role: "",
  permissions: {
    createUsers: false,
    editUsers: false,
    deleteUsers: false,
    manageRoles: false,
    viewReports: false,
    downloadReports: false,
    setTasks: false,
    viewTasks: false,
    systemSettings: false,
    manageDepartments: false,
    viewSalary: false,
    editSalary: false,
    chatsArchive: false,
    tasksArchive: false,
    manageDocuments: false,
  },
};

export function AddEmployeeModal({
  open,
  onOpenChange,
  initialData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: EmployeeValues;
}) {
  const isEditMode = !!initialData;

  const form = useForm<EmployeeValues>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData ?? EMPTY_FORM_VALUES,
  });

  const { control, reset } = form;
  const fullName = useWatch({ control, name: "fullName" });
  
  const [addEmployee, { isLoading }] = useAddEmployeeMutation();

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await addEmployee(values).unwrap();
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  });

  React.useEffect(() => {
    if (open) {
      reset(initialData ?? EMPTY_FORM_VALUES);
    }
  }, [open, initialData, reset]);

  return (
    <BaseModal
      open={open}
      onOpenChange={onOpenChange}
      contentClassName="sm:max-w-[507px] max-w-[507px]"
      title={
        isEditMode ? (
          <>
            Edit Employee: <span className="text-primary">{fullName || "Profile"}</span>
          </>

        ) : (
          "Add New Employee"
        )
      }
      subtitle={
        isEditMode
          ? "Modify the details of your company team member ."
          : "Add a new employee to your company teams ."
      }
      footer={
        <div className="flex gap-2 w-full">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-secondary hover:bg-secondary/80 border-none text-foreground px-5 h-10 rounded-xl font-bold text-[12px] flex-none transition-colors font-janna shadow-none"
            variant="ghost"
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="add-employee-form"
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-10 rounded-xl font-bold text-[12px] shadow-none transition-all active:scale-[0.98] font-janna"
            disabled={isLoading}
          >

            {isLoading ? (
              <Loader2 className="size-3 animate-spin" strokeWidth={2.5} />
            ) : (
              <UserPlus className="size-3" strokeWidth={2.5} />
            )}
            {isEditMode
              ? isLoading ? "Saving..." : "Save Changes"
              : isLoading ? "Adding..." : "Add Employee"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} id="add-employee-form" className="flex flex-col gap-6">
        <EmployeeForm form={form} isEditMode={isEditMode} />
      </form>
    </BaseModal>
  );
}
