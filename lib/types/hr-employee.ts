export type EmployeeStatus =
  | "Online"
  | "Meeting"
  | "Break"
  | "IDLE"
  | "Offline";

export interface EmployeeCardData {
  id?: string;
  name: string;
  role: string;
  status: EmployeeStatus;
  avatar?: string;
  isFreelance?: boolean;
}

export interface EmployeeFilterItem {
  label: string;
  active: boolean;
  color: string;
  textColor: string;
}

export interface DepartmentData {
  id?: string;
  name: string;
  employeesCount: number;
  onlineCount: number;
  iconName?: string;
  color: string;
  bg: string;
  employees: EmployeeCardData[];
}
