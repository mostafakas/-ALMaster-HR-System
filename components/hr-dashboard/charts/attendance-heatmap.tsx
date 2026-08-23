"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type AttendanceLevel = "absent" | "low" | "partial" | "full" | "none";

export interface AttendanceCell {
  /** Absolute date this cell represents. */
  date: Date;
  level: AttendanceLevel;
  /** Optional precise label, e.g. "8h 12m". */
  label?: string;
}

interface AttendanceHeatmapProps {
  /**
   * Cells laid out as weeks (rows) × days (columns).
   * The component does NOT bucket the data — caller controls the layout
   * so date alignment stays exact.
   */
  weeks: AttendanceCell[][];
  /** Day-column labels. Defaults to Sun-Sat starting Sunday. */
  dayLabels?: string[];
}

const LEVEL_COLOR: Record<AttendanceLevel, string> = {
  absent: "#F55050",
  low: "#A8C0FF",
  partial: "#4D7DFF",
  full: "#0047FF",
  none: "#EDF2F7",
};

const DEFAULT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Compact attendance heat-map (weeks × days). Each cell color encodes the
 * attendance level for that day; absent days render in the destructive red.
 * Tooltips on hover show the exact date + label.
 */
export function AttendanceHeatmap({
  weeks,
  dayLabels = DEFAULT_DAYS,
}: AttendanceHeatmapProps) {
  // Validate columns; if a row is short we pad with `none` cells so the grid
  // always lines up under day labels.
  const normalized = React.useMemo(
    () =>
      weeks.map((row) => {
        if (row.length >= dayLabels.length) return row.slice(0, dayLabels.length);
        const pad: AttendanceCell[] = Array.from(
          { length: dayLabels.length - row.length },
          () => ({ date: new Date(0), level: "none" }),
        );
        return [...row, ...pad];
      }),
    [weeks, dayLabels.length],
  );

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex flex-col gap-1.5">
        {normalized.map((week, rowIdx) => (
          <div
            key={rowIdx}
            className="grid items-center gap-1"
            style={{
              gridTemplateColumns: `auto repeat(${dayLabels.length}, minmax(0, 1fr))`,
            }}
          >
            <span className="text-[10px] font-bold text-[#707070] leading-[14px] pr-1 tabular-nums">
              Week {normalized.length - rowIdx}
            </span>
            {week.map((cell, colIdx) => (
              <div
                key={colIdx}
                title={
                  cell.level === "none"
                    ? ""
                    : `${cell.date.toLocaleDateString()} — ${cell.level}${
                        cell.label ? ` · ${cell.label}` : ""
                      }`
                }
                aria-label={
                  cell.level === "none"
                    ? "no data"
                    : `${cell.date.toLocaleDateString()} ${cell.level}`
                }
                className={cn(
                  "h-[22px] rounded-[4px] transition-transform hover:scale-110",
                )}
                style={{ backgroundColor: LEVEL_COLOR[cell.level] }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Day-of-week labels — aligned under cells via the same grid template. */}
      <div
        className="grid gap-1 mt-1"
        style={{
          gridTemplateColumns: `auto repeat(${dayLabels.length}, minmax(0, 1fr))`,
        }}
      >
        <span />
        {dayLabels.map((d) => (
          <span
            key={d}
            className="text-[10px] font-bold text-[#707070] leading-[14px] text-center"
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
