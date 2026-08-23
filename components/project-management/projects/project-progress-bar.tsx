"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ProjectProgressBarProps {
  value: number;
  /** Tailwind background-color class for the filled portion. Default: bg-primary */
  fillClassName?: string;
  /** Tailwind background-color class for the track. Default: bg-secondary */
  trackClassName?: string;
  className?: string;
  /** Direct CSS color for the filled portion — overrides fillClassName when set. */
  fillStyle?: string;
}

export function ProjectProgressBar({
  value,
  fillClassName = "bg-primary",
  trackClassName = "bg-secondary",
  className,
  fillStyle,
}: ProjectProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "w-full h-2 rounded-full overflow-hidden",
        trackClassName,
        className
      )}
    >
      <div
        className={cn("h-full rounded-full", fillStyle ? undefined : fillClassName)}
        style={{ width: `${pct}%`, backgroundColor: fillStyle }}
      />
    </div>
  );
}
