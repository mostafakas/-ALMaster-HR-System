"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ProjectMember } from "@/lib/data/projects";

interface ProjectMemberStackProps {
  members: ProjectMember[];
  /** Maximum number of avatars to display before collapsing into +N. */
  max?: number;
  /** Tailwind size class (default: size-6). */
  sizeClass?: string;
  className?: string;
}

/** Overlapping avatar stack used on project cards and overview pages. */
export function ProjectMemberStack({
  members,
  max = 3,
  sizeClass = "size-6",
  className,
}: ProjectMemberStackProps) {
  const visible = members.slice(0, max);
  const remaining = members.length - visible.length;

  return (
    <div className={cn("flex -space-x-1.5", className)}>
      {visible.map((m) => (
        <Avatar
          key={m.id}
          className={cn(sizeClass, "border-2 border-white")}
        >
          <AvatarImage src={m.avatar} />
          <AvatarFallback>{m.name[0]}</AvatarFallback>
        </Avatar>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            sizeClass,
            "rounded-full bg-secondary border-2 border-white flex items-center justify-center"
          )}
        >
          <span className="text-[10px] font-bold text-muted-foreground">
            +{remaining}
          </span>
        </div>
      )}
    </div>
  );
}
