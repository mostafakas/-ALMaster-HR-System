"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { Edit2 } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";


interface ProjectSubHeaderProps {
  projectId: string;
  title: string;
  description: string;
  status?: string;
}

const tabs = [
  { name: "Overview",  href: ""          },
  { name: "Tasks",     href: "/tasks"    },
  { name: "Activity",  href: "/activity" },
  { name: "Team",      href: "/team"     },
  { name: "Files",     href: "/files"    },
];

export function ProjectSubHeader({ projectId, title, description }: ProjectSubHeaderProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-[32px]">
      {/* Back + title + actions */}
      <div className="flex flex-col gap-[20px]">
        <Link
          href="/project-management/projects"
          className="flex items-center gap-[6px] text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ChevronLeft className="size-[16px] rotate-0" />
          <span className="text-md font-bold leading-[16px]">Back to Projects</span>
        </Link>


        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[12px]">
            <span className="text-[22px] font-bold text-foreground leading-[20px]">{title}</span>
            <span className="text-md font-bold text-muted-foreground leading-[16px]">{description}</span>
          </div>

          <div className="flex items-center gap-[6px]">
            <Button
              variant="ghost"
              size="icon"
              className="h-[36px] w-[36px] bg-destructive/10 hover:bg-destructive/20 rounded-[8px] text-destructive border-none"
            >
              <Trash2 className="size-[12px]" />
            </Button>
            <Button className="h-[40px] px-[20px] bg-primary hover:bg-primary/90 text-white rounded-[12px] gap-[8px] text-sm font-bold leading-[22.4px]">
              <Edit2 className="size-[12px]" />
              Edit Project
            </Button>

          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col gap-0">
        <div className="flex items-center gap-[40px] relative">
          {tabs.map((tab) => {
            const href = `/project-management/${projectId}${tab.href}`;
            const isActive =
              tab.href === ""
                ? pathname === `/project-management/${projectId}`
                : pathname.startsWith(href);

            return (
              <Link
                key={tab.name}
                href={href}
                className={cn(
                  "pb-[16px] text-lg font-bold leading-[16px] relative whitespace-nowrap transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {tab.name}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>

            );
          })}
        </div>
        <div className="h-px bg-secondary w-full" />
      </div>

    </div>
  );
}
