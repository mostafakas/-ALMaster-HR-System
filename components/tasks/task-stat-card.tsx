"use client";

import * as React from "react";
import { List as ListIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

export interface TaskStatCardProps {
  label: string;
  subtitle: string;
  value: number;
  /** Tailwind background utility for the card surface. */
  surfaceClass: string;
  /** Tailwind text utility for label/value/subtitle. */
  textClass: string;
  /** Subtitle/label colour when the value is the muted variant. */
  mutedTextClass?: string;
  onClick?: () => void;
  selected?: boolean;
}

/**
 * Single stat card on the AlMaster Tasks overview (Figma 2126:34498-34528).
 *
 * Each card is `flex-1 min-w-0` so six cards fit across the row regardless
 * of the parent width. Padding, gap and rounded corners mirror the design.
 */
export const TaskStatCard = React.memo(function TaskStatCard({
  label,
  subtitle,
  value,
  surfaceClass,
  textClass,
  mutedTextClass,
  onClick,
  selected,
}: TaskStatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex-1 min-w-0 rounded-[8px] p-4 flex flex-col gap-3 items-start text-left transition-all outline-none",
        "hover:translate-y-[-2px] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring/40",
        surfaceClass,
        selected && "ring-2 ring-offset-2 ring-offset-background ring-ring/60"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <Typography
          className={cn("text-[14px] leading-[20px]", mutedTextClass ?? textClass)}
        >
          {label}
        </Typography>
        <ListIcon
          className={cn("size-4 opacity-90", mutedTextClass ?? textClass)}
          strokeWidth={2.2}
        />
      </div>
      <Typography
        as="span"
        className={cn(
          "text-[24px] leading-[20px] tabular-nums w-full",
          textClass
        )}
      >
        {value}
      </Typography>
      <Typography
        as="span"
        className={cn(
          "text-[14px] leading-[20px] w-full",
          mutedTextClass ?? textClass
        )}
      >
        {subtitle}
      </Typography>
    </button>
  );
});
