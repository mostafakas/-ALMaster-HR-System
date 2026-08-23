"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface OverviewStatCardProps {
  label: string;
  icon: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

/**
 * Square stat card used in the 4-up grid at the top of the Project
 * Overview page. Children are the body slot — typically a big number
 * plus a sub-line (progress bar, avatar stack, secondary text, etc.).
 */
export function OverviewStatCard({
  label,
  icon: Icon,
  className,
  children,
}: OverviewStatCardProps) {
  return (
    <div
      className={cn(
        "bg-muted p-4 rounded-lg flex flex-col gap-3 h-[116px]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">{label}</span>
        <Icon className="size-4 text-foreground" />
      </div>
      <div className="flex flex-col gap-1 mt-auto">{children}</div>
    </div>
  );
}
