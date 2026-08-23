"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type MonthViewTab = "all" | "todo";

interface MonthViewTabsProps {
  value: MonthViewTab;
  onChange: (next: MonthViewTab) => void;
}

/**
 * "All Tasks / To do list" sub-tab strip — Figma node 2217:11955.
 *
 * Exact specs:
 *   - Container: gap-40 items-center
 *   - Tab text: Janna LT Bold, 16/16
 *     · Inactive: #707070
 *     · Active:   #0047FF
 *   - Full-width hairline below (h-0, border-t #EDF2F7)
 *   - Active tab marker: 2px primary line under the active label
 */
export function MonthViewTabs({ value, onChange }: MonthViewTabsProps) {
  const tabs: { key: MonthViewTab; label: string }[] = [
    { key: "all", label: "All Tasks" },
    { key: "todo", label: "To do list" },
  ];
  return (
    <div className="flex flex-col gap-0 w-full">
      <div className="flex items-center gap-10 pb-2">
        {tabs.map((t) => {
          const active = t.key === value;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={cn(
                "relative font-bold text-[16px] leading-[16px] outline-none transition-colors",
                active ? "text-[#0047FF]" : "text-[#707070] hover:text-[#343434]",
              )}
            >
              {t.label}
              {active && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-[#0047FF] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      <div className="h-px bg-[#EDF2F7] w-full" />
    </div>
  );
}
