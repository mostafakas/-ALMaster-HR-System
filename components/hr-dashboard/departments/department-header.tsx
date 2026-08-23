"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DepartmentHeaderProps {
  name: string;
  icon: React.ElementType;
  employeesCount: number;
  onlineCount: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function DepartmentHeader({
  name,
  icon: Icon,
  employeesCount,
  onlineCount,
  isExpanded = false,
  onToggle,
  className,
}: DepartmentHeaderProps) {
  return (
    <div
      className={cn(
        "content-stretch flex items-center justify-between relative size-full w-full",
        className
      )}
    >
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          <div className="bg-[#edf2f7] content-stretch flex items-center justify-center relative rounded-[8px] shrink-0 size-[36px]">
            <Icon className="size-[16px] text-[#343434]" />
          </div>
          <p className="[word-break:break-word] font-bold leading-[20px] not-italic relative shrink-0 text-[#343434] text-[20px] whitespace-nowrap">
            {name}
          </p>
        </div>
        <div className="content-stretch flex gap-[6px] items-center relative shrink-0">
          <div className="bg-[rgba(0,71,255,0.08)] content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0">
            <div className="[word-break:break-word] flex flex-col font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#0047ff] text-[12px] whitespace-nowrap">
              <p className="leading-[14px]" dir="auto">
                {employeesCount} Employees
              </p>
            </div>
          </div>
          <div className="bg-[rgba(0,185,39,0.1)] content-stretch flex items-center justify-center px-[8px] py-[4px] relative rounded-[6px] shrink-0">
            <div className="[word-break:break-word] flex flex-col font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#00b927] text-[12px] whitespace-nowrap">
              <p className="leading-[14px]" dir="auto">
                {onlineCount} Online
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="bg-[#edf2f7] content-stretch flex h-[28px] items-center justify-center relative rounded-[8px] shrink-0 w-[36px] hover:bg-[#edf2f7]/80 transition-colors cursor-pointer"
        aria-label={isExpanded ? "Collapse section" : "Expand section"}
      >
        <div className="flex items-center justify-center relative shrink-0">
          <ChevronDown
            className={cn(
              "size-[16px] text-[#343434] transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>
    </div>
  );
}
