"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import type { VacationBalanceItem } from "./vacation-card";

interface HistoryRecord {
  id: string;
  type: "Added" | "Deducted";
  leaveType: string;
  days: number;
  date: string;
  reason: string;
}

interface VacationHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: VacationBalanceItem | null;
}

const DEFAULT_HISTORY: HistoryRecord[] = [
  {
    id: "1",
    type: "Added",
    leaveType: "Vacation",
    days: 1,
    date: "14 Mar, 2026",
    reason: "Added (Reason: Awarded for Achieving Target)",
  },
  {
    id: "2",
    type: "Deducted",
    leaveType: "Absent",
    days: 3,
    date: "12 Mar, 2026",
    reason: "Deducted (Reason: Didn’t work)",
  },
  {
    id: "3",
    type: "Added",
    leaveType: "Sick Leave",
    days: 2,
    date: "05 Mar, 2026",
    reason: "Added (Reason: Doctor Note Approved)",
  },
];

export function VacationHistoryModal({
  open,
  onOpenChange,
  employee,
}: VacationHistoryModalProps) {
  const [tab, setTab] = React.useState<"All" | "Added" | "Deducted">("All");

  if (!employee) return null;

  const filteredHistory = DEFAULT_HISTORY.filter((item) => {
    if (tab === "All") return true;
    return item.type === tab;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
        <DialogHeader className="space-y-3 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar || "https://ui.shadcn.com/avatars/01.png"}
              alt={employee.name}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Vacations History
              </DialogTitle>
              <Typography variant="small" className="text-muted-foreground">
                {employee.name} • {employee.role}
              </Typography>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="grid grid-cols-3 p-1 bg-secondary/80 rounded-xl gap-1">
            {(["All", "Added", "Deducted"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  tab === t
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2 max-h-72 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              No history found for this filter.
            </p>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border border-border bg-secondary/30 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        item.type === "Added"
                          ? "bg-[#00B927]/10 text-[#00B927]"
                          : "bg-[#F55050]/10 text-[#F55050]"
                      }`}
                    >
                      {item.leaveType}
                    </span>
                    <Typography variant="small" className="font-bold text-foreground">
                      {item.days} Day{item.days > 1 ? "s" : ""}
                    </Typography>
                  </div>
                  <Typography variant="xs" className="text-muted-foreground">
                    {item.date}
                  </Typography>
                </div>
                <p className="text-xs text-muted-foreground">{item.reason}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-end pt-3 border-t border-border">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 text-xs font-bold rounded-xl px-6"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
