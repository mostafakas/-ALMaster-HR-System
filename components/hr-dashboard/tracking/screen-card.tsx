"use client";

import * as React from "react";
import {
  MessageSquare,
  Clock,
  MonitorOff,
  MonitorIcon,
  MonitorPlay,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  StatusDropdown,
  type EmployeeStatus,
} from "@/components/ui/status-dropdown";

export type { EmployeeStatus as TrackingStatus };

interface ScreenCardProps {
  name: string;
  role: string;
  status: EmployeeStatus;
  avatar?: string;
  screenshotUrl?: string;
  screenSharingOff?: boolean;
  time?: string;
}

export function ScreenCard({
  name,
  role,
  status: initialStatus,
  avatar,
  screenshotUrl,
  screenSharingOff = false,
  time = "12:08:56 PM",
}: ScreenCardProps) {
  const [status, setStatus] = React.useState<EmployeeStatus>(initialStatus);

  if (screenSharingOff) {
    return (
      <div className="relative rounded-[12px] bg-secondary border border-secondary overflow-hidden flex flex-col items-center justify-center gap-[12px] aspect-video min-h-[200px]">
        <div className="size-[40px] bg-muted rounded-[10px] flex items-center justify-center">
          <MonitorOff className="size-[16px] text-muted-foreground" />
        </div>
        <p className="text-[12px] font-bold text-muted-foreground text-center px-[24px] leading-[18px]">
          {name}&apos;s screen sharing is off
        </p>

        <button className="flex items-center gap-[6px] bg-primary text-primary-foreground rounded-[12px] px-[14px] py-[8px] text-[12px] font-bold hover:bg-primary/90 transition-colors cursor-pointer">
          <MonitorOff className="size-[12px]" />
          Ask to share
        </button>

      </div>
    );
  }

  return (
    <div className="content-stretch flex flex-col h-[235px] items-start p-[16px] relative rounded-[8px] overflow-hidden group">
      {/* Background Image / Overlay */}
      {screenshotUrl ? (
        <img
          src={screenshotUrl}
          alt={`${name}'s screen`}
          className="absolute inset-0 w-full h-full object-cover rounded-[8px]"
        />
      ) : (
        <div className="absolute inset-0 bg-[#1a1a2e] rounded-[8px]" />
      )}
      <div className="absolute bg-gradient-to-b from-[rgba(0,0,0,0.8)] inset-0 rounded-[8px] to-[rgba(0,0,0,0.8)] via-[49.519%] via-[rgba(0,0,0,0)] pointer-events-none" />

      {/* Content Container */}
      <div className="content-stretch flex flex-col h-full items-start justify-between relative shrink-0 w-full z-10">
        {/* Top Overlay Bar */}
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[40px] rounded-[20px]">
              <Avatar className="size-full rounded-[20px]">
                <AvatarImage src={avatar} />
                <AvatarFallback className="text-[10px] font-bold bg-[#0047ff] text-white">
                  {name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-[1.67px] right-[1.67px] size-[6.67px] bg-[#00b927] rounded-full ring-1 ring-black/40" />
            </div>
            <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0">
              <p className="font-bold leading-[16px] text-[14px] text-white whitespace-nowrap">
                {name}
              </p>
              <p className="font-bold leading-[16px] text-[#edf2f7] text-[12px] whitespace-nowrap">
                {role}
              </p>
            </div>
          </div>

          <StatusDropdown
            status={status}
            onStatusChange={setStatus}
            theme="dark"
          />
        </div>

        {/* Bottom Overlay Bar */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <button
            type="button"
            className="bg-[#0047ff] content-stretch flex h-[36px] items-center justify-center px-[12px] py-[16px] relative rounded-[8px] shrink-0 w-[40px] hover:bg-[#0047ff]/90 transition-colors cursor-pointer"
            aria-label="Live view stream"
          >
            <MonitorPlay className="size-[12px] text-white shrink-0" />
          </button>
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
            <Clock className="size-[10px] text-[#edf2f7]" />
            <p className="font-bold leading-[1.5] text-[#edf2f7] text-[10px] text-center whitespace-nowrap">
              {time}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

