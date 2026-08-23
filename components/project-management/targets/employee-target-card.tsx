"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { EmployeeTargetRecord } from "@/lib/data/employees-target-mock";

interface EmployeeTargetCardProps {
  employee: EmployeeTargetRecord;
  selected?: boolean;
  onSelect: (id: string) => void;
}

/**
 * Picker card in the Employees' Target sidebar.
 *
 * Exact specs from Figma node 2126:46152:
 *   - Card: bg #EDF2F7, p-12, rounded-8, gap-8 between header and progress
 *   - Header (justify-between, items-start):
 *     · Left group (gap-8 items-center):
 *       - Avatar 40×40, rounded-20, with 6.67px online dot bottom-right
 *       - Name+role stacked (gap-4):
 *         · "Daniel Brown" — Bold 14/16, #343434
 *         · "Company Super Admin" — Bold 12/16, #707070
 *     · "Online" pill — bg success/10, px-6 py-3, rounded-6,
 *       text Bold 10/14 #00B927
 *   - Progress block (gap-4):
 *     · Bar row (gap-8 items-center):
 *       - Track bg #F8FAFC, h-8, rounded-4, flex-1
 *       - Fill bg #0047FF (or #00B927 over-100%), h-8, rounded-4
 *       - "65%" — Bold 14/20, #0047FF (or #00B927)
 *     · Bottom row (justify-between, both Bold 12/16):
 *       - "32 / 40 Tasks" — #707070
 *       - "2 Overdue Tasks" — #F55050  (or "10 Bonus Tasks" — #00B927)
 */
export function EmployeeTargetCard({
  employee,
  selected,
  onSelect,
}: EmployeeTargetCardProps) {
  const isOver = employee.progress >= 100;
  const progressColor = isOver ? "#00B927" : "#0047FF";

  return (
    <button
      type="button"
      onClick={() => onSelect(employee.id)}
      className={cn(
        "w-full flex flex-col gap-2 p-3 rounded-[8px] text-left transition-colors outline-none",
        selected ? "bg-primary/10" : "bg-[#EDF2F7] hover:bg-[#E3E9F1]",
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="relative shrink-0 size-10 rounded-full overflow-hidden">
            <Image
              src={employee.avatar}
              alt={employee.name}
              width={40}
              height={40}
              className="size-10 object-cover"
            />
            {employee.status === "online" && (
              <span
                className="absolute rounded-full"
                style={{
                  width: "6.67px",
                  height: "6.67px",
                  bottom: "1.67px",
                  right: "1.67px",
                  backgroundColor: "#00B927",
                  boxShadow: "0 0 0 1.5px #EDF2F7",
                }}
              />
            )}
          </div>

          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-bold text-[14px] leading-[16px] text-[#343434] truncate">
              {employee.name}
            </span>
            <span className="font-bold text-[12px] leading-[16px] text-[#707070] truncate">
              {employee.role}
            </span>
          </div>
        </div>

        {employee.status === "online" && (
          <span
            className="shrink-0 font-bold text-[10px] leading-[14px] px-1.5 py-[3px] rounded-[6px]"
            style={{ backgroundColor: "rgba(0,185,39,0.1)", color: "#00B927" }}
          >
            Online
          </span>
        )}
      </div>

      {/* Progress block */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-1 h-2 rounded-[4px] bg-[#F8FAFC] overflow-hidden">
            <div
              className="h-full rounded-[4px]"
              style={{
                width: `${Math.min(100, employee.progress)}%`,
                backgroundColor: progressColor,
              }}
            />
          </div>
          <span
            className="font-bold text-[14px] leading-[20px] tabular-nums shrink-0"
            style={{ color: progressColor }}
          >
            {employee.progress}%
          </span>
        </div>

        <div className="flex items-start justify-between font-bold text-[12px] leading-[16px] w-full">
          <span className="text-[#707070]">
            {employee.tasksCompleted} / {employee.tasksTotal} Tasks
          </span>
          {employee.overdueTasks > 0 && (
            <span className="text-[#F55050]">
              {employee.overdueTasks} Overdue Tasks
            </span>
          )}
          {employee.bonusTasks && employee.bonusTasks > 0 && (
            <span className="text-[#00B927]">
              {employee.bonusTasks} Bonus Tasks
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
