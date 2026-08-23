"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import {
  Home,
  User,
  Briefcase,
  Mail,
  Phone,
  ChevronDown,
  ArrowUpRight,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getEmployeeRoleColor } from "@/lib/utils";

type UserStatus = "Online" | "Meeting" | "Break" | "IDLE" | "Offline";

const statusConfig: Record<UserStatus, { color: string; bg: string }> = {
  Online: { color: "#00b927", bg: "bg-[#00b927]/10" },
  Meeting: { color: "#f38328", bg: "bg-[#f38328]/10" },
  Break: { color: "#707070", bg: "bg-[#707070]/10" },
  IDLE: { color: "#f55050", bg: "bg-[#f55050]/10" },
  Offline: { color: "#707070", bg: "bg-muted" },
};


export function UserPanel() {
  const [currentStatus, setCurrentStatus] =
    React.useState<UserStatus>("Online");
  const config = statusConfig[currentStatus];
  const roleStyle = getEmployeeRoleColor("Company Super Admin");

  return (
    <div className="w-[356px] bg-background border-r flex flex-col items-start overflow-y-auto no-scrollbar py-8 px-4 gap-5 relative">
      {/* 75:3569 - Home Overview Header Section */}
      <div className="w-full flex flex-col gap-5 shrink-0">
        <div className="flex items-center gap-2 w-full h-9">
          <div className="size-9 bg-secondary flex items-center justify-center rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
            <Home className="size-3 text-foreground" />
          </div>
          <Typography
            variant="display"
            as="span"
            className="text-foreground whitespace-nowrap">
            Home - Overview
          </Typography>
        </div>
        <div className="h-0 border-t border-border w-full" />
      </div>


      {/* 75:3570 - Cards Container */}
      <div className="w-full flex flex-col gap-3 shrink-0">
        {/* 75:2712 - Profile Card */}
        <div
          className="bg-background border-t-6 rounded-xl px-4 py-5 flex flex-col items-center gap-5 w-full shadow-sm transition-all duration-300"
          style={{ borderTopColor: roleStyle.color }}>
          {/* Avatar and Name */}
          <div className="flex flex-col items-center gap-3">
            <div className="size-[92px] rounded-full border-[6px] border-background shadow-lg overflow-hidden shrink-0">
              <Avatar className="size-full">
                <AvatarImage src="https://ui.shadcn.com/avatars/01.png" />
                <AvatarFallback className="bg-secondary text-muted-foreground font-bold">
                  DB
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-0.5">
                <Typography
                  variant="h1"
                  className="text-foreground whitespace-nowrap">
                  Daniel Brown
                </Typography>
                <Typography variant="bodyMuted" className="whitespace-nowrap">
                  Company Super Admin
                </Typography>
              </div>


              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "flex items-center justify-center gap-1 px-2 py-1 rounded-md h-6 cursor-pointer hover:opacity-80 transition-all outline-none",
                    config.bg,
                  )}>
                  <span
                    className="text-[12px] font-bold leading-[14px]"
                    style={{ color: config.color }}>
                    {currentStatus}
                  </span>
                  <ChevronDown
                    className="size-4"
                    style={{ color: config.color }}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  className="w-[140px] bg-background border-border rounded-lg p-1 shadow-lg">
                  {(Object.keys(statusConfig) as UserStatus[]).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => setCurrentStatus(s)}
                      className="flex items-center justify-between px-3 py-2 cursor-pointer focus:bg-secondary rounded-md">

                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: statusConfig[s].color }}
                        />
                        <span
                          className={cn(
                            "text-[12px] font-bold",
                            currentStatus === s
                              ? "text-primary"
                              : "text-muted-foreground",
                          )}>
                          {s}
                        </span>

                      </div>
                      {currentStatus === s && (
                        <Check className="size-3 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="h-0 border-t border-border w-full" />

          {/* Contact Details */}
          <div className="flex flex-col gap-4 w-full">
            {[
              { icon: User, label: "Content Manager" },
              { icon: Briefcase, label: "Graphic Design Department" },
              { icon: Mail, label: "Sarah.johnson@almaster.co," },
              { icon: Phone, label: "+20 1012345678" },
            ].map((contact, i) => (
              <div
                key={i}
                className="flex gap-2 items-center text-muted-foreground">

                <contact.icon className="size-3.5 shrink-0" />
                <span className="text-[14px] font-bold leading-[20px] whitespace-nowrap">
                  {contact.label}
                </span>
              </div>
            ))}
          </div>

          <div className="h-0 border-t border-border w-full" />

          {/* Activity Metrics */}
          <div className="flex flex-col gap-2 w-full">
            <p className="text-sm font-bold text-muted-foreground leading-[20px]">
              Today’s Activity
            </p>

            <div className="grid grid-cols-4 gap-1 w-full">
              {[
                {
                  label: "Working",
                  time: "03:20:28",
                  bg: "bg-success/10",
                  text: "text-success",
                },
                {
                  label: "Meeting",
                  time: "03:20:28",
                  bg: "bg-warning/10",
                  text: "text-warning",
                },
                {
                  label: "Break",
                  time: "00:10:21",
                  bg: "bg-destructive/10",
                  text: "text-destructive",
                },
                {
                  label: "IDLE",
                  time: "03:20:28",
                  bg: "bg-primary/10",
                  text: "text-primary",
                },

              ].map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center py-1 rounded-[4px] h-10",
                    item.bg,
                    item.text,
                  )}>
                  <Typography variant="xs" as="span" className="font-bold">
                    {item.label}
                  </Typography>
                  <Typography
                    variant="small"
                    as="span"
                    tabular
                    className="font-bold -mt-1">
                    {item.time}
                  </Typography>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Button */}
          <Button className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-all gap-1 px-5">
            View My Profile <ArrowUpRight className="size-[13px] rotate-45" />
          </Button>
        </div>

        {/* 75:2781 - Activity Logs Section */}
        <div className="bg-secondary rounded-xl p-4 flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full h-6">
            <p className="text-lg font-bold text-foreground leading-[20px]">
              Activity Logs
            </p>
            <div className="h-6 w-[28px] bg-background border border-border flex items-center justify-center rounded-lg cursor-pointer hover:bg-background/80 transition-colors">
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
