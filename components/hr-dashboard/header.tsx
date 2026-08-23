"use client";

import * as React from "react";
import { Clock, Bell } from "lucide-react";
import { LiveClock } from "@/components/hr-dashboard/shared/live-clock";
import { SystemSwitcher } from "@/components/shared/system-switcher";

export function DashboardHeader() {
  return (
    <header className="h-16 shrink-0 bg-background flex items-center justify-between sticky top-0 z-10 px-6 border-b">
      {/* Clock Section */}
      <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
        <div className="bg-secondary h-10 flex items-center justify-center gap-2 rounded-lg px-3 overflow-clip">
          <Clock className="size-[14px] text-primary" />
          <LiveClock className="font-bold text-sm text-primary leading-[21px] tabular-nums whitespace-nowrap" />
        </div>
      </div>


      {/* Right Controls */}
      <div className="flex items-center gap-[8px]">
        {/* System Switcher */}
        <SystemSwitcher />

        {/* Bell / Notification */}
        <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
          <div className="bg-secondary size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-secondary/80 transition-all relative">
            <Bell className="size-[14px] text-muted-foreground" />
            <div className="absolute top-2 right-2 size-[6px] bg-destructive rounded-full border border-background" />
          </div>
        </div>
      </div>
    </header>
  );
}
