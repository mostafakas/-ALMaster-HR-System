"use client";

import { EmployeeListPanel } from "@/components/hr-dashboard/employees/employee-list-panel";
import { EmployeeProfilePanel } from "@/components/hr-dashboard/employees/employee-profile-panel";
import { AddEmployeeModal } from "@/components/hr-dashboard/add-employee-modal";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { selectEmployee } from "@/lib/store/slices/employee-slice";
import { openModal, closeModal } from "@/lib/store/slices/ui-slice";
import type { Employee } from "@/lib/store/slices/employee-slice";

const DEFAULT_EMPLOYEE: Employee = {
  id: "4",
  name: "John Smith",
  role: "Content Manager",
  status: "Online",
  avatar: "https://ui.shadcn.com/avatars/04.png",
};

export default function EmployeesPage() {
  const dispatch = useAppDispatch();
  const selectedEmployee = useAppSelector((state) => state.employee.selectedEmployee) ?? DEFAULT_EMPLOYEE;
  const activeModal = useAppSelector((state) => state.ui.activeModal);

  return (
    <>
      <EmployeeListPanel
        selectedEmployeeId={selectedEmployee.id}
        onSelectEmployee={(emp) => dispatch(selectEmployee(emp))}
        onAddEmployee={() => dispatch(openModal("add-employee"))}
      />

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

      <AddEmployeeModal
        open={activeModal === "add-employee"}
        onOpenChange={(open) =>
          open ? dispatch(openModal("add-employee")) : dispatch(closeModal())
        }
      />
    </>
  );
}
