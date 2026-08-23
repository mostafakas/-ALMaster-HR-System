"use client";

import * as React from "react";
import { DepartmentPanel } from "@/components/hr-dashboard/departments/department-panel";
import { DepartmentDetail } from "@/components/hr-dashboard/departments/department-detail";

export default function DepartmentsPage() {
  const [activeDepartmentId, setActiveDepartmentId] =
    React.useState("programming");

  return (
    <>
      <DepartmentPanel
        activeDepartmentId={activeDepartmentId}
        onSelect={setActiveDepartmentId}
      />
      <main className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
        <DepartmentDetail departmentId={activeDepartmentId} />
      </main>
    </>
  );
}
