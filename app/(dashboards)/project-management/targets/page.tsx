import { EmployeesTargetView } from "@/components/project-management/targets/employees-target-view";

export const metadata = {
  title: "Employees' Target — AlMaster PM",
  description:
    "Track each employee's monthly target — pick a team member, review their stat cards, target progress and calendar / list / board of tasks.",
};

export default function MyTargetPage() {
  return <EmployeesTargetView />;
}
