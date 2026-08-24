"use client";

import { EmployeeListPanel } from "@/components/hr-dashboard/employees/employee-list-panel";
import { EmployeeProfilePanel } from "@/components/hr-dashboard/employees/employee-profile-panel";
import { AddEmployeeModal } from "@/components/hr-dashboard/add-employee-modal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectEmployee } from "@/lib/store/slices/employee-slice";
import { openModal, closeModal } from "@/lib/store/slices/ui-slice";
import type { Employee } from "@/lib/store/slices/employee-slice";

export default function EmployeesPage() {
  const dispatch = useAppDispatch();
  const selectedEmployee = useAppSelector((state) => state.employee.selectedEmployee);
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  return (
    <>
      <EmployeeListPanel
        selectedEmployeeId={selectedEmployee?.id}
        onSelectEmployee={(emp) => dispatch(selectEmployee(emp))}
        onAddEmployee={() => dispatch(openModal("add-employee"))}
      />

      {selectedEmployee ? (
        <EmployeeProfilePanel
          employee={{
            id: selectedEmployee.id,
            name: selectedEmployee.originalData?.fullName || selectedEmployee.name,
            role: selectedEmployee.originalData?.jobTitle || selectedEmployee.role,
            status: selectedEmployee.status,
            avatar: selectedEmployee.avatar,
            email: selectedEmployee.originalData?.email || `${selectedEmployee.name.toLowerCase().replace(" ", ".")}@almaster.co`,
            phone: selectedEmployee.originalData?.phoneNumber || "N/A",
            department: selectedEmployee.originalData?.department?.name || "Unassigned",
            jobTitle: selectedEmployee.originalData?.jobTitle || selectedEmployee.role,
            levelOfAuthority: selectedEmployee.originalData?.seniorityLevel || "Employee",
          }}
        />
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-muted-foreground font-bold">
          <p>Please select an employee to view details</p>
        </div>
      )}

      <AddEmployeeModal
        open={activeModal === "add-employee"}
        onOpenChange={(open) =>
          open ? dispatch(openModal("add-employee")) : dispatch(closeModal())
        }
      />
    </>
  );
}
