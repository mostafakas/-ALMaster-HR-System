"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListTodo, Target, UserCheck } from "lucide-react";
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
  { icon: Icons.departments, label: "Projects", href: "/project-management/projects" },
  { icon: ListTodo, label: "Tasks", href: "/project-management", placeholder: true },
  { icon: Target, label: "Targets", href: "/project-management/targets" },
  { icon: UserCheck, label: "My Target", href: "/project-management/my-target" },
  { icon: Icons.settings, label: "Settings", href: "/project-management", placeholder: true },
];

export function PMSidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={0}>
      <div className="w-[72px] h-screen bg-muted border-r border-border flex flex-col items-center justify-between py-[32px] px-[16px] shrink-0 sticky top-0">

        <div className="flex flex-col items-center gap-[20px] w-full">
          {/* Logo Section */}
          <Link href="/project-management" className="flex flex-col gap-[16px] w-full items-center">
            <div className="size-[40px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden rounded-[8px] bg-secondary flex items-center justify-center">
               <Image src="/bluelogo.svg" alt="Almaster" width={40} height={40} />
            </div>
            <div className="h-px bg-secondary w-full" />
          </Link>


          {/* Main Navigation Items */}
          <div className="flex flex-col gap-[12px] items-center w-full">
            <div className="flex flex-col gap-[8px] items-center w-full">
              {navItems.map((item, i) => {
                const finalActive = !item.placeholder && (
                  pathname === item.href ||
                  (item.href !== "/project-management" && pathname.startsWith(item.href + "/"))
                );

                return (
                  <Tooltip key={i}>
                    <TooltipTrigger render={<Link href={item.href} />}>
                      <div
                        className={cn(
                          "size-[40px] flex items-center justify-center rounded-[8px] cursor-pointer transition-all outline-none",
                          finalActive
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-secondary text-slate-500 hover:bg-slate-200",
                        )}>

                        <item.icon className="size-[14px]" />
                      </div>
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
              <div className="h-px bg-secondary w-full" />

              <Tooltip>
                <TooltipTrigger render={<Link href="/project-management" />}>
                  <div
                    className={cn(
                      "size-[40px] flex items-center justify-center rounded-[8px] cursor-pointer transition-all outline-none",
                      pathname === "/project-management/tracking"
                        ? "bg-success text-white shadow-lg shadow-success/20"
                        : "bg-success/10 text-success hover:bg-success/20",
                    )}>

                    <Icons.activity className="size-[14px]" />
                  </div>
                </TooltipTrigger>

                <TooltipContent side="right" className="bg-slate-900 border-none font-bold">
                  Pulse / Activity
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Footer Area: Logout */}
        <div className="flex flex-col gap-[12px] w-full items-center">
          <div className="h-px bg-secondary w-full" />
          <div className="flex flex-col items-center w-full">

            <Tooltip>
              <TooltipTrigger>
                <div className="size-[40px] bg-destructive/10 flex items-center justify-center rounded-[8px] cursor-pointer hover:bg-destructive/20 transition-all outline-none group">
                  <Icons.logout className="size-[14px] text-destructive group-hover:-translate-x-0.5 transition-transform" />
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
