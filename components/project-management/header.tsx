"use client";

import * as React from "react";
import { Clock, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LiveClock } from "@/components/hr-dashboard/shared/live-clock";
import { SystemSwitcher } from "@/components/shared/system-switcher";

export function PMHeader() {
  return (
    <header className="h-16 shrink-0 bg-background flex items-center justify-between sticky top-0 z-10 px-6 border-b border-border">

      {/* Clock Section */}
      <div className="bg-muted p-1.5 rounded-[12px] flex items-center shrink-0">
        <div className="bg-secondary h-10 flex items-center justify-center gap-2 rounded-[8px] px-3 overflow-clip">
          <Clock className="size-[14px] text-primary" />
          <LiveClock className="font-bold text-md text-primary leading-[21px] tabular-nums whitespace-nowrap" />
        </div>
      </div>


      {/* Right Controls */}
      <div className="flex items-center gap-[8px]">
        {/* System Switcher */}
        <SystemSwitcher />

        {/* Bell / Notification */}
        <div className="bg-muted p-1.5 rounded-[12px] flex items-center shrink-0">
          <div className="bg-secondary size-10 flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-slate-200 transition-all relative">
            <Bell className="size-[14px] text-slate-500" />
            <div className="absolute top-2 right-2 size-[6px] bg-destructive rounded-full border border-white" />
          </div>
        </div>


        {/* User Dropdown */}
        <div className="bg-muted p-1.5 rounded-[10px] flex items-center shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger className="bg-secondary h-10 flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-[8px] hover:bg-slate-200 transition-all outline-none">

              <div className="size-7 rounded-[15.719px] overflow-hidden border border-white shadow-sm">
                <Avatar className="size-full">
                  <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                  <AvatarFallback>DB</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col text-left justify-center gap-[2px]">
                <span className="font-bold text-sm leading-[12px] text-foreground whitespace-nowrap">
                  Daniel Brown
                </span>
                <span className="text-tiny font-bold text-muted-foreground leading-[12px] whitespace-nowrap uppercase tracking-tight">
                  Project Manager
                </span>
              </div>

              <ChevronDown className="size-[16px] text-slate-400 opacity-50" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-[200px] rounded-[16px] shadow-2xl border-slate-100 p-2 mt-2 bg-white">
              <DropdownMenuLabel className="font-extrabold text-sm px-3 py-2 text-slate-400 uppercase tracking-widest">
                Account
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="mx-2 opacity-50" />
              <DropdownMenuItem className="font-bold text-sm cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary rounded-xl px-3 py-2.5 transition-colors">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="font-bold text-sm cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary rounded-xl px-3 py-2.5 transition-colors">
                My Projects
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-2 opacity-50" />
              <DropdownMenuItem className="font-bold text-sm cursor-pointer text-destructive hover:bg-destructive/5 focus:bg-destructive/5 rounded-xl px-3 py-2.5 transition-colors">
                Sign Out
              </DropdownMenuItem>

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
