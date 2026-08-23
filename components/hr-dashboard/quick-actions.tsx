"use client"

import * as React from "react"
import { Icons } from "@/components/shared/icons"
import { cn } from "@/lib/utils"
import { AddEmployeeModal } from "./add-employee-modal";
import { SetTaskModal } from "@/components/tasks/set-task-modal";
import { NewReportModal } from "@/components/hr-dashboard/new-report-modal";
import { EmployeeReportModal } from "@/components/hr-dashboard/employee-report-modal";
import type { EmployeeReportInput } from "@/lib/report-data";

const actions = [
  {
    title: "New Task",
    description: "Set a new task to your team",
    icon: Icons.plus,
    bg: "bg-primary",
    text: "text-primary-foreground",
    descColor: "text-primary-foreground/90",
    iconBg: "bg-background",
    iconColor: "text-primary"
  },

  {
    title: "New Employee",
    description: "Add a new team member",
    icon: Icons.userPlus,
    bg: "bg-secondary",
    text: "text-primary",
    descColor: "text-muted-foreground",
    iconBg: "bg-muted",
    iconColor: "text-primary"
  },

  {
    title: "New Report",
    description: "Export an employee report",
    icon: Icons.chart,
    bg: "bg-secondary",
    text: "text-primary",
    descColor: "text-muted-foreground",
    iconBg: "bg-muted",
    iconColor: "text-primary"
  }

]

export function QuickActions() {
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  // Generated report context — feeds <EmployeeReportModal>.
  const [generatedReport, setGeneratedReport] = React.useState<{
    employee: EmployeeReportInput;
    range: { from: Date; to: Date };
  } | null>(null);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);

  const handleAction = (title: string) => {
    if (title === "New Task") setIsTaskModalOpen(true);
    if (title === "New Employee") setIsEmployeeModalOpen(true);
    if (title === "New Report") setIsReportModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-4 w-full px-6">
      <h2 className="text-[22px] font-bold text-foreground leading-[20px] font-janna">Quick Actions</h2>
      <div className="bg-muted p-2 rounded-[12px] flex items-center w-full">
        <div className="flex gap-2 items-center w-full">
          {actions.map((action, i) => (
            <div
              key={i}
              onClick={() => handleAction(action.title)}
              className={cn(
                "flex flex-1 items-center gap-3 p-2 rounded-[10px] cursor-pointer hover:scale-[1.02] transition-all",
                action.bg
              )}
            >
              <div className={cn("size-12 flex items-center justify-center rounded-[8px] shrink-0", action.iconBg)}>
                <action.icon className={cn("size-[20px]", action.iconColor)} />
              </div>
              <div className="flex flex-col items-start justify-center font-janna">
                <span className={cn("text-[16px] font-bold leading-[24px] whitespace-nowrap", action.text)}>
                  {action.title}
                </span>
                <span className={cn("text-[12px] font-bold leading-[20px] whitespace-nowrap", action.descColor)}>
                  {action.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddEmployeeModal open={isEmployeeModalOpen} onOpenChange={setIsEmployeeModalOpen} />
      <SetTaskModal open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen} />
      <NewReportModal
        open={isReportModalOpen}
        onOpenChange={setIsReportModalOpen}
        onSubmitted={({ values, employee }) => {
          // Chain into the report viewer: persist context, then open the
          // viewer modal once the form modal has finished its close transition.
          setGeneratedReport({
            employee: {
              id: employee.id,
              name: employee.name,
              avatar: employee.avatar,
            },
            range: { from: values.fromDate, to: values.toDate },
          });
          // Defer one tick so the closing animation does not collide with
          // the opening one — base-ui dialogs share an overlay layer.
          setTimeout(() => setIsViewerOpen(true), 50);
        }}
      />
      <EmployeeReportModal
        open={isViewerOpen}
        onOpenChange={(open) => {
          setIsViewerOpen(open);
          // Defer clearing the report context so the close animation can
          // play with the rendered content still in place.
          if (!open) setTimeout(() => setGeneratedReport(null), 300);
        }}
        employee={generatedReport?.employee}
        range={generatedReport?.range}
        onNewReport={() => {
          // "New Report" button in the viewer footer — re-opens the form modal.
          setTimeout(() => setIsReportModalOpen(true), 50);
        }}
      />
    </div>
  )
}
