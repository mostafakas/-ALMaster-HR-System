import { UserPanel } from "@/components/hr-dashboard/user-panel";
import { QuickActions } from "@/components/hr-dashboard/quick-actions";
import { EmployeeGrid } from "@/components/hr-dashboard/employee-grid";

export default function HRDashboard() {
  return (
    <>
      <UserPanel />
      <main className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
        <div className="flex-1 flex flex-col gap-[32px] pb-[100px] pt-8">
          <QuickActions />
          <EmployeeGrid />
        </div>
      </main>
    </>
  );
}
