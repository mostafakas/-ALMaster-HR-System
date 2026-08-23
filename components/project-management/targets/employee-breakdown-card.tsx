"use client";

import * as React from "react";
import type { EmployeeTargetRecord } from "@/lib/data/employees-target-mock";

interface EmployeeBreakdownCardProps {
  counts: EmployeeTargetRecord["counts"];
}

interface BreakdownRow {
  label: string;
  count: number;
  /** Status color (text, dot, bar fill). */
  color: string;
  /** Tinted bg for the count badge. */
  tint: string;
}

/**
 * Tasks Breakdown card.
 *
 * Exact specs pulled from Figma node 2126:46414:
 *   - Card: bg #F8FAFC, p-24, rounded-12, gap-24 between header and rows
 *   - Title: Janna LT Bold 18 / 20, #343434
 *   - "120" badge: bg purple/10, px-8/py-6, rounded-32, Bold 14 purple
 *   - Each row: gap-8 between row-header and bar; bar h-10 rounded-12,
 *     fill rounded-4 in status color
 *   - Row label: Bold 14, status color
 *   - Dot: 10×10 status color
 *   - Count pill: bg status/10, px-6/py-3, rounded-32, Bold 10 status color
 *   - Percent: Bold 14 status color
 */
export function EmployeeBreakdownCard({ counts }: EmployeeBreakdownCardProps) {
  const total = Math.max(
    1,
    counts.todo +
      counts.inProgress +
      counts.waitingReview +
      counts.completed +
      counts.overdue,
  );

  const rows: BreakdownRow[] = [
    {
      label: "To Do",
      count: counts.todo,
      color: "#9359FF",
      tint: "rgba(147,89,255,0.1)",
    },
    {
      label: "In Progress",
      count: counts.inProgress,
      color: "#0047FF",
      tint: "rgba(0,71,255,0.1)",
    },
    {
      label: "Waiting Review",
      count: counts.waitingReview,
      color: "#F38328",
      tint: "rgba(243,131,40,0.1)",
    },
    {
      label: "Done",
      count: counts.completed,
      color: "#00B927",
      tint: "rgba(0,185,39,0.1)",
    },
    {
      label: "Overdue",
      count: counts.overdue,
      color: "#F55050",
      tint: "rgba(245,80,80,0.1)",
    },
  ];

  return (
    <div className="bg-[#F8FAFC] rounded-[12px] p-6 flex flex-col gap-6 h-full">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-[18px] leading-[20px] text-[#343434]">
          Tasks Breakdown
        </h3>
        <div
          className="px-2 py-1.5 rounded-[32px] flex items-center justify-center"
          style={{ backgroundColor: "rgba(147,89,255,0.1)" }}
        >
          <span className="font-bold text-[14px] leading-[14px] text-[#9359FF]">
            {total}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between gap-2">
        {rows.map((row) => {
          const pct = Math.round((row.count / total) * 100);
          return (
            <div key={row.label} className="flex flex-col gap-2 w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: row.color }}
                  />
                  <div className="flex items-center gap-1.5">
                    <span
                      className="font-bold text-[14px] leading-[20px] whitespace-nowrap"
                      style={{ color: row.color }}
                    >
                      {row.label}
                    </span>
                    <div
                      className="px-1.5 py-[3px] rounded-[32px] flex items-center justify-center"
                      style={{ backgroundColor: row.tint }}
                    >
                      <span
                        className="font-bold text-[10px] leading-[14px] tabular-nums"
                        style={{ color: row.color }}
                      >
                        {row.count}
                      </span>
                    </div>
                  </div>
                </div>
                <span
                  className="font-bold text-[14px] leading-[20px] tabular-nums"
                  style={{ color: row.color }}
                >
                  {pct}%
                </span>
              </div>
              <div className="h-2.5 rounded-[12px] bg-[#EDF2F7] overflow-hidden w-full">
                <div
                  className="h-full rounded-[4px]"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: row.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
