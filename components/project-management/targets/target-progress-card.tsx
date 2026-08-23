"use client";

import * as React from "react";
import { List as ListIcon } from "lucide-react";

interface TargetProgressCardProps {
  percent: number;
}

/**
 * Target Progress card — Figma node 2126:46379.
 *
 * Exact specs:
 *   - Card: bg #F8FAFC, p-16, rounded-12, gap-12
 *   - Title row (justify-between):
 *     · "Target Progress" — Bold 14/20, #343434
 *     · fi-rr-list icon — size-16
 *   - "78%" — Bold 24/20, #343434, w-full
 *   - Bar row (h-20, items-center):
 *     · Track bg-white, h-8, rounded-4, flex-1
 *     · Fill bg #0047FF, h-8, rounded-4
 */
export function TargetProgressCard({ percent }: TargetProgressCardProps) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div className="bg-[#F8FAFC] rounded-[12px] p-4 flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[14px] leading-[20px] text-[#343434]">
          Target Progress
        </h3>
        <ListIcon className="size-4 text-[#343434]" strokeWidth={2.2} />
      </div>
      <p className="font-bold text-[24px] leading-[20px] text-[#343434] tabular-nums w-full">
        {safe}%
      </p>
      <div className="h-5 flex items-center w-full">
        <div className="flex-1 h-2 rounded-[4px] bg-white overflow-hidden">
          <div
            className="h-full rounded-[4px] bg-[#0047FF]"
            style={{ width: `${safe}%` }}
          />
        </div>
      </div>
    </div>
  );
}
