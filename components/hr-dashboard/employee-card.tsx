"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  List,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Activity,
  Check,
  ChevronDown,
} from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { Typography } from "@/components/ui/typography";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getEmployeeRoleColor } from "@/lib/utils";
import { ScreenshotViewModal } from "./screenshot-view-modal";
import { AddEmployeeModal } from "./add-employee-modal";
import type { EmployeeStatus, EmployeeCardData } from "@/lib/types/hr-employee";
import { HR_STATUS_CONFIG } from "@/lib/constants/hr-employees";

export type { EmployeeStatus, EmployeeCardData };
export type EmployeeCardProps = EmployeeCardData;

export function EmployeeCard({
  name,
  role,
  status: initialStatus,
  avatar,
  isFreelance,
}: EmployeeCardProps) {
  const [currentStatus, setCurrentStatus] =
    React.useState<EmployeeStatus>(initialStatus);
  const [isScreenshotOpen, setIsScreenshotOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const config = HR_STATUS_CONFIG[currentStatus] || HR_STATUS_CONFIG.Offline;
  const roleStyle = getEmployeeRoleColor(role, isFreelance);

  // Dynamic role text formatting: appends (Freelancer) if isFreelance is true and not already in string
  const displayRole = React.useMemo(() => {
    if (isFreelance && !role.toLowerCase().includes("freelanc")) {
      return `${role} (Freelancer)`;
    }
    return role;
  }, [role, isFreelance]);

  const handleStatusChange = (newStatus: EmployeeStatus) => {
    setCurrentStatus(newStatus);
    console.log(`Status for ${name} changed to ${newStatus}`);
  };

  return (
    <div
      className="bg-background rounded-xl border-t-6 flex flex-col gap-5 items-center px-3 pt-5 pb-3 w-full shadow-sm hover:shadow-md transition-shadow relative"
      style={{ borderTopColor: roleStyle.color }}>

      {/* Top Section: Profile & Status */}
      <div className="flex items-start justify-between w-full h-[40px]">
        <div className="flex items-center gap-[8px]">
          <div className="relative size-[40px] shrink-0">
            <Avatar className="size-full rounded-full ring-2 ring-background">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-secondary text-[10px]">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div
              className="absolute bottom-0 right-0 size-[6.6px] rounded-full ring-2 ring-background transition-colors duration-300"
              style={{ backgroundColor: config.color }}
            />
          </div>

          <div className="flex flex-col items-start gap-[2px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-foreground leading-[16px] whitespace-nowrap">
                {name}
              </span>
              <Edit2
                className="size-3 text-primary cursor-pointer hover:opacity-80"
                onClick={() => setIsEditModalOpen(true)}
              />
            </div>
            <span className="font-bold text-xs text-muted-foreground leading-[16px] whitespace-nowrap">
              {displayRole}
            </span>
          </div>

        </div>

        {/* Dynamic Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-[4px] px-[8px] py-[4px] rounded-[6px] h-[24px] cursor-pointer hover:opacity-80 transition-all outline-none",
              config.bg,
            )}>
            <span
              className="text-[12px] font-bold leading-[14px]"
              style={{ color: config.color }}>
              {currentStatus}
            </span>
            <ChevronDown
              className="size-[16px]"
              style={{ color: config.color }}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[140px] bg-background border-border rounded-lg p-1 shadow-lg">

            {(Object.keys(HR_STATUS_CONFIG) as EmployeeStatus[]).map((s) => (
              <DropdownMenuItem
                key={s}
                onClick={() => handleStatusChange(s)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-secondary rounded-lg">

                <div className="flex items-center gap-2">
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: HR_STATUS_CONFIG[s].color }}
                  />
                  <span
                    className={cn(
                      "text-xs font-bold",
                      currentStatus === s ? "text-primary" : "text-muted-foreground",
                    )}>
                    {s}
                  </span>

                </div>
                {currentStatus === s && (
                  <Check className="size-3 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metrics Row */}
      <div className="flex gap-1 w-full">
        {[
          {
            label: "Working",
            time: "03:20:28",
            bg: "bg-[#00b927]/10",
            text: "text-[#00b927]",
          },
          {
            label: "Meeting",
            time: "03:20:28",
            bg: "bg-[#f38328]/10",
            text: "text-[#f38328]",
          },
          {
            label: "Break",
            time: "00:10:21",
            bg: "bg-[#707070]/10",
            text: "text-[#707070]",
          },
          {
            label: "IDLE",
            time: "03:20:28",
            bg: "bg-[#f55050]/10",
            text: "text-[#f55050]",
          },
        ].map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-1 rounded-[4px] h-[40px]",
              m.bg,
              m.text,
            )}>

            <Typography variant="xs" as="span" className="font-bold">
              {m.label}
            </Typography>
            <Typography
              variant="small"
              as="span"
              tabular
              className="font-bold -mt-1">
              {m.time}
            </Typography>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-0 border-t border-border w-full" />

      {/* Bottom Info & Actions Area */}
      <div className="flex flex-col gap-[8px] w-full">
        {/* Share Bar */}
        <div className="bg-primary/10 rounded-lg px-3 py-1.5 h-8 flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="size-3 text-primary" />
            <span className="text-xs font-bold text-primary leading-[20px]">
              Screenshot was shared
            </span>
          </div>
          <span
            className="text-xs font-bold text-primary cursor-pointer hover:underline"
            onClick={() => setIsScreenshotOpen(true)}>
            View
          </span>
        </div>

        {/* Screenshot Viewer Modal */}
        <ScreenshotViewModal
          open={isScreenshotOpen}
          onOpenChange={setIsScreenshotOpen}
          timestamp="12:08:56 PM"
        />

        {/* Edit Employee Modal */}
        <AddEmployeeModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          initialData={{
            fullName: name,
            email: name.toLowerCase().replace(" ", "") + "@almaster.com",
            phoneNumber: "1231 4567 589",
            countryCode: "+966",
            jobTitle: role,
            seniorityLevel: "Senior",
            department: "Programming",
            role: "Employee",
            permissions: {
              createUsers: true,
              editUsers: true,
              deleteUsers: false,
              manageRoles: true,
              viewReports: true,
              downloadReports: true,
              setTasks: true,
              viewTasks: true,
              systemSettings: true,
              manageDepartments: false,
              viewSalary: true,
              editSalary: false,
              chatsArchive: true,
              tasksArchive: true,
              manageDocuments: true,
            },
          }}
        />

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1 w-full py-0.5">
          <div className="size-[6px] bg-primary rounded-full" />
          <div className="size-[6px] bg-border rounded-full" />
        </div>

        {/* Action Pills Row */}
        <div className="flex items-center gap-[4px] w-full">
          {[
            { icon: Plus, active: false },
            { icon: List, active: false },
            { icon: MessageSquare, active: false },
            { icon: ImageIcon, active: true },
            { icon: Video, active: false },
            { icon: Activity, active: true },
          ].map((btn, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-9 flex items-center justify-center rounded-lg cursor-pointer transition-all active:scale-95",
                btn.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-secondary",
              )}>

              <btn.icon className="size-[14px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
