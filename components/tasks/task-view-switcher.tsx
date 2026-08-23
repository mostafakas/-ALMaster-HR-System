"use client";

import * as React from "react";
import { LayoutGrid, List, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskViewMode } from "@/lib/types/task";

export interface TaskViewSwitcherProps {
  value: TaskViewMode;
  onChange: (value: TaskViewMode) => void;
}

/**
 * Board / List / Calendar segmented toggle (Figma 2126:32903).
 *
 *  Container: bg-secondary, h-[40px], rounded-[8px], px-[4px], gap-[6px]
 *  Inner btn: h-[32px], px-[12px], py-[8px], rounded-[8px]
 *  Active   : bg-primary, white icon
 *  Inactive : transparent, muted-foreground icon
 */
export function TaskViewSwitcher({ value, onChange }: TaskViewSwitcherProps) {
  const segments: { key: TaskViewMode; icon: React.ElementType }[] = [
    { key: "board", icon: LayoutGrid },
    { key: "list", icon: List },
    { key: "calendar", icon: CalendarIcon },
  ];

  return (
    <div className="bg-secondary flex items-center gap-1.5 px-1 h-10 rounded-[8px]">
      {segments.map(({ key, icon: Icon }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={cn(
              "h-8 px-3 py-2 rounded-[8px] flex items-center justify-center transition-colors outline-none",
              active
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:bg-muted"
            )}
          >
            <Icon className="size-3" strokeWidth={2.4} />
          </button>
        );
      })}
    </div>
  );
}
