"use client";

import * as React from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Settings, History, Calendar } from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { cn } from "@/lib/utils";

export interface VacationBalanceItem {
  id: string;
  name: string;
  role: string;
  roleType: "Head of Department" | "Team Leader" | "Freelancer" | "Default";
  avatar: string;
  availableDays: number;
  annualUsed: number;
  annualTotal: number;
  casualDays: number;
  sickDays: number;
  absentDays: number;
  addedDays: number;
  deductedDays: number;
  upcomingVacation?: string;
}

interface VacationCardProps {
  item: VacationBalanceItem;
  onEditDetails: (item: VacationBalanceItem) => void;
  onAdjust: (item: VacationBalanceItem) => void;
  onHistory: (item: VacationBalanceItem) => void;
}

export function VacationCard({
  item,
  onEditDetails,
  onAdjust,
  onHistory,
}: VacationCardProps) {
  const getRoleBorderColor = (roleType: string) => {
    switch (roleType) {
      case "Head of Department":
        return "border-blue-600";
      case "Team Leader":
        return "border-orange-500";
      case "Freelancer":
        return "border-[#00B927]";
      default:
        return "border-blue-600";
    }
  };

  const percentage = Math.min(
    100,
    Math.round((item.annualUsed / Math.max(1, item.annualTotal)) * 100)
  );

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="w-full bg-secondary/40 dark:bg-slate-900/50 border border-border rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors shadow-sm">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full border-2 p-0.5 flex items-center justify-center overflow-hidden shrink-0",
              getRoleBorderColor(item.roleType)
            )}
          >
            <img
              src={item.avatar || "https://ui.shadcn.com/avatars/01.png"}
              alt={item.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <Typography variant="body" className="font-bold text-foreground">
                {item.name}
              </Typography>
              <button
                type="button"
                onClick={() => onEditDetails(item)}
                className="text-muted-foreground hover:text-primary transition-colors p-0.5"
                title="Edit Balance Details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <Typography variant="small" className="text-muted-foreground font-normal">
              {item.role}
            </Typography>
          </div>
        </div>

        <div
          className={cn(
            "px-2.5 py-1 rounded-md text-xs font-semibold shrink-0",
            item.availableDays > 0
              ? "bg-[#00B927]/10 text-[#00B927]"
              : "bg-[#F55050]/10 text-[#F55050]"
          )}
        >
          {item.availableDays} Days Available
        </div>
      </div>

      {/* Main Stats: Radial Gauge + Breakdown */}
      <div className="bg-background/60 rounded-xl p-3 flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
          <svg className="w-14 h-14 transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              className="text-muted/40"
              fill="transparent"
            />
            <circle
              cx="28"
              cy="28"
              r={radius}
              stroke="currentColor"
              strokeWidth="5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-primary transition-all duration-500"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] font-bold text-foreground">
            {item.annualUsed}/{item.annualTotal}d
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-foreground">Annual</span>
            <span className="text-muted-foreground font-medium">
              {item.annualUsed}/{item.annualTotal}d
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
            <div>
              <span>Casual: </span>
              <span className="font-semibold text-foreground">{item.casualDays}d</span>
            </div>
            <div>
              <span>Sick: </span>
              <span className="font-semibold text-foreground">{item.sickDays}d</span>
            </div>
            <div>
              <span>Absent: </span>
              <span className="font-semibold text-foreground">{item.absentDays}d</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground pt-0.5 border-t border-border/50">
            <div>
              <span>Added: </span>
              <span className="font-semibold text-[#00B927]">{item.addedDays}d</span>
            </div>
            <div>
              <span>Deducted: </span>
              <span className="font-semibold text-[#F55050]">{item.deductedDays}d</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Vacation Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-secondary/50 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="font-medium">Upcoming Vacation</span>
        </div>
        <span className="font-bold text-foreground">
          {item.upcomingVacation || "None"}
        </span>
      </div>

      {/* Footer Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjust(item)}
          className="w-full gap-1.5 text-xs font-semibold h-9 rounded-lg"
        >
          <Settings className="w-3.5 h-3.5" />
          Adjust
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onHistory(item)}
          className="w-full gap-1.5 text-xs font-semibold h-9 rounded-lg"
        >
          <History className="w-3.5 h-3.5" />
          History
        </Button>
      </div>
    </div>
  );
}
