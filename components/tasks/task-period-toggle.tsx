"use client";

import * as React from "react";
import { CalendarDays, CalendarRange, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import type { TaskCalendarRange } from "@/lib/types/task";

export interface TaskPeriodToggleProps {
  value: TaskCalendarRange;
  onChange: (value: TaskCalendarRange) => void;
}

/**
 * Month / Week / Day pill toggle (Figma 2126:34466).
 *
 * Active segment uses the muted-foreground surface with white text;
 * inactive segments use the muted text colour and transparent background.
 * Container: bg-secondary, 4px padding, 6px gap, 8px radius, 40px height.
 */
export function TaskPeriodToggle({ value, onChange }: TaskPeriodToggleProps) {
  const segments: {
    key: TaskCalendarRange;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: "month", label: "Month", icon: CalendarDays },
    { key: "week", label: "Week", icon: CalendarRange },
    { key: "day", label: "Day", icon: CalendarClock },
  ];

  return (
    <div className="bg-secondary flex items-center gap-1.5 px-1 h-10 rounded-[8px]">
      {segments.map(({ key, label, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={cn(
              "h-8 px-3 rounded-[8px] flex items-center gap-2 transition-colors outline-none",
              active
                ? "bg-muted-foreground text-white"
                : "bg-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-3" strokeWidth={2.2} />
            <Typography
              as="span"
              className="text-[12px] leading-[14px] font-bold"
            >
              {label}
            </Typography>
          </button>
        );
      })}
    </div>
  );
}
