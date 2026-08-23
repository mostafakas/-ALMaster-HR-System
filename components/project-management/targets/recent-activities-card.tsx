"use client";

import * as React from "react";
import { ChevronDown, Clock } from "lucide-react";
import type { EmployeeTargetActivity } from "@/lib/data/employees-target-mock";

interface RecentActivitiesCardProps {
  activities: EmployeeTargetActivity[];
}

/**
 * Recent Activities card — Figma node 2126:46387.
 *
 * Exact specs:
 *   - Card: bg #F8FAFC, p-16, rounded-12, gap-16
 *   - Title row (justify-between):
 *     · "Recent Activities" — Bold 18/20, #343434
 *     · "All Activities ▾" pill — bg #EDF2F7, h-32, px-12 py-8,
 *       rounded-8, gap-4, text Bold 12/14 #707070
 *   - Activity row (gap-8 between):
 *     · bg #EDF2F7, p-12, rounded-8, gap-4
 *     · Body: Bold 14/20, default #343434, with
 *       muted (#707070) spans for "updated … status to"
 *       and warning (#F38328) for status name.
 *     · Time row: clock 12px + "10 minutes ago" Bold 12/20 #707070
 */
export function RecentActivitiesCard({ activities }: RecentActivitiesCardProps) {
  return (
    <div className="bg-[#F8FAFC] rounded-[12px] p-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[18px] leading-[20px] text-[#343434]">
          Recent Activities
        </h3>
        <button
          type="button"
          className="bg-[#EDF2F7] flex items-center gap-1 h-8 px-3 py-2 rounded-[8px] outline-none"
        >
          <span className="font-bold text-[12px] leading-[14px] text-[#707070]">
            All Activities
          </span>
          <ChevronDown className="size-3.5 text-[#707070]" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {activities.map((a) => (
          <ActivityRow key={a.id} activity={a} />
        ))}
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: EmployeeTargetActivity }) {
  return (
    <div className="bg-[#EDF2F7] rounded-[8px] p-3 flex flex-col gap-1">
      <p className="font-bold text-[14px] leading-[20px] text-[#343434]">
        <span>{activity.actor}</span>{" "}
        <span className="text-[#707070]">
          updated &ldquo;{activity.subject}&rdquo; status to
        </span>{" "}
        <span style={{ color: figmaToneFor(activity.statusTone) }}>
          {activity.status}
        </span>
      </p>
      <div className="flex items-center gap-1">
        <Clock className="size-3 text-[#707070]" />
        <span className="font-bold text-[12px] leading-[20px] text-[#707070]">
          {activity.ago}
        </span>
      </div>
    </div>
  );
}

/** Map our mock's tailwind tone class to its Figma hex. */
function figmaToneFor(tone: string): string {
  if (tone.includes("warning")) return "#F38328";
  if (tone.includes("success")) return "#00B927";
  if (tone.includes("destructive")) return "#F55050";
  if (tone.includes("primary")) return "#0047FF";
  if (tone.includes("purple")) return "#9359FF";
  return "#343434";
}
