"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addDays,
  addMonths,
  addWeeks,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { Typography } from "@/components/ui/typography";
import type { TaskCalendarRange } from "@/lib/types/task";

export interface TaskPeriodNavigatorProps {
  value: Date;
  onChange: (next: Date) => void;
  range: TaskCalendarRange;
  formatter?: (value: Date, range: TaskCalendarRange) => string;
}

const defaultFormatter = (value: Date, range: TaskCalendarRange): string => {
  if (range === "month") return format(value, "MMMM yyyy");
  if (range === "week") {
    const start = startOfWeek(value, { weekStartsOn: 6 });
    const end = endOfWeek(value, { weekStartsOn: 6 });
    return `${format(start, "MMMM d")} - ${format(end, "MMMM d")}`;
  }
  return `${format(value, "EEE, d MMM")} (Today)`;
};

/**
 * "March 2026 / Week / Day" period navigator (Figma 2126:32895).
 *
 * Container is a flex row with gap-[24px] between elements.
 *  • Chevron buttons: bg-secondary, h-[32px] w-[36px], rounded-[8px]
 *  • Label: 22px bold, leading-[20px], text-foreground
 */
export function TaskPeriodNavigator({
  value,
  onChange,
  range,
  formatter = defaultFormatter,
}: TaskPeriodNavigatorProps) {
  const step = (direction: -1 | 1) => {
    if (range === "month") onChange(addMonths(value, direction));
    else if (range === "week") onChange(addWeeks(value, direction));
    else onChange(addDays(value, direction));
  };

  return (
    <div className="flex items-center gap-6">
      <button
        type="button"
        onClick={() => step(-1)}
        className="h-8 w-9 rounded-[8px] bg-secondary flex items-center justify-center transition-colors hover:bg-muted outline-none"
        aria-label="Previous period"
      >
        <ChevronLeft className="size-4 text-muted-foreground" strokeWidth={2.5} />
      </button>

      <Typography className="text-[22px] leading-[20px] text-foreground whitespace-nowrap">
        {formatter(value, range)}
      </Typography>

      <button
        type="button"
        onClick={() => step(1)}
        className="h-8 w-9 rounded-[8px] bg-secondary flex items-center justify-center transition-colors hover:bg-muted outline-none"
        aria-label="Next period"
      >
        <ChevronRight className="size-4 text-muted-foreground" strokeWidth={2.5} />
      </button>
    </div>
  );
}
