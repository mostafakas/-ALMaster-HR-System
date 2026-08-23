import type { EmployeeValues } from "@/lib/validations/employee";

export type Employee = EmployeeValues & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEmployeeRequest = EmployeeValues;
export type UpdateEmployeeRequest = {
  id: string;
  data: Partial<EmployeeValues>;
};
