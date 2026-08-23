"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "@/components/shared/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { icon: Icons.home, label: "Home", href: "/human-resources" },
  { icon: Icons.users, label: "Employees", href: "/human-resources/employees" },
  { icon: Icons.messages, label: "Messages", href: "/human-resources/messages" },
  { icon: Icons.departments, label: "Departments", href: "/human-resources/departments" },
  { icon: Icons.documents, label: "Documents", href: "/human-resources/documents" },
  { icon: Icons.roles, label: "Roles & Permissions", href: "/human-resources/roles" },
  { icon: Icons.calendar, label: "Vacation Balance", href: "/human-resources/vacation-balance" },
  { icon: Icons.settings, label: "Settings", href: "/human-resources/settings" },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <div className="w-[72px] h-screen bg-muted border-r border-border flex flex-col items-center justify-between py-8 px-4 shrink-0 sticky top-0">

        <div className="flex flex-col items-center gap-[20px] w-full">
          {/* Logo Section */}
          <Link href="/human-resources" className="flex flex-col gap-[16px] w-full items-center">
            <div className="size-[40px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-xl bg-secondary flex items-center justify-center p-2">
              <Image src="/bluelogo.svg" alt="Almaster" width={24} height={24} />
            </div>
            <div className="h-px bg-border w-full" />
          </Link>

          {/* Main Navigation Items */}
          <div className="flex flex-col gap-[12px] items-center w-full">
            <div className="flex flex-col gap-[8px] items-center w-full">
              {navItems.map((item, i) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/human-resources" && pathname.startsWith(item.href + "/"));
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger>
                      <Link href={item.href}>
                        <div
                          className={cn(
                            "size-[40px] flex items-center justify-center rounded-xl cursor-pointer transition-all outline-none",
                            isActive
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                              : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground",
                          )}>
                          <item.icon className="size-[18px]" />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-slate-900 border-none font-bold">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Tracking Divider & Icon */}
            <div className="flex flex-col gap-[12px] w-full items-center">
              <div className="h-px bg-border w-full" />

              <Tooltip>
                <TooltipTrigger>
                  <Link href="/human-resources/tracking">
                    <div
                      className={cn(
                        "size-[40px] flex items-center justify-center rounded-xl cursor-pointer transition-all outline-none",
                        pathname === "/human-resources/tracking"
                          ? "bg-success text-success-foreground shadow-lg shadow-success/20"
                          : "bg-success/10 text-success hover:bg-success/20",
                      )}>
                      <Icons.activity className="size-[18px]" />
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-900 border-none font-bold">
                  Live Tracking
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Footer Area: Logout */}
        <div className="flex flex-col gap-[12px] w-full items-center">
          <div className="h-px bg-border w-full" />

          <div className="flex flex-col items-center w-full">
            <Tooltip>
              <TooltipTrigger>
                <div className="size-[40px] bg-destructive/10 flex items-center justify-center rounded-xl cursor-pointer hover:bg-destructive/20 transition-all outline-none group">
                  <Icons.logout className="size-[18px] text-destructive group-hover:-translate-x-0.5 transition-transform" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-900 border-none font-bold">
                Sign Out
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
