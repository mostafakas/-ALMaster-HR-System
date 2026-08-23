"use client";

import * as React from "react";
import {
  FileText,
  Briefcase,
  Megaphone,
  Palette,
  Sparkles,
  PenLine,
  Banknote,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DocumentCategory {
  id: string;
  name: string;
  count: number;
  icon: React.ElementType;
  theme: "primary" | "warning" | "success" | "ai" | "destructive" | "info";
  color: string
}


export const documentCategories: DocumentCategory[] = [
  {
    id: "my-documents",
    name: "My Documents",
    count: 5,
    icon: UserRound,
    color: "#0D6EFD",
    theme: "primary",
  },
  {
    id: "programming",
    name: "Programming",
    count: 128,
    icon: Briefcase,
    color: "#0D6EFD",
    theme: "primary",
  },
  {
    id: "marketing",
    name: "Marketing",
    count: 96,
    icon: Megaphone,
    color: "#0D6EFD",
    theme: "warning",
  },
  {
    id: "graphic-design",
    name: "Graphic Design",
    count: 49,
    icon: Palette,
    color: "#0D6EFD",
    theme: "success",
  },
  {
    id: "ai",
    name: "Artificial Intelligence",
    count: 37,
    icon: Sparkles,
    color: "#0D6EFD",
    theme: "ai",
  },
  {
    id: "content",
    name: "Content Writing",
    count: 12,
    icon: PenLine,
    color: "#0D6EFD",
    theme: "destructive",
  },
  {
    id: "finance",
    name: "Finance",
    count: 7,
    icon: Banknote,
    color: "#0D6EFD",
    theme: "info",
  },
];



interface DocumentPanelProps {
  activeCategoryId: string;
  onSelect: (id: string) => void;
}

export function DocumentPanel({ activeCategoryId, onSelect }: DocumentPanelProps) {
  const myDocs = documentCategories[0];
  const otherCats = documentCategories.slice(1);

  return (
    <div className="w-[356px] shrink-0 flex flex-col gap-5 px-4 py-8 border-r border-border overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex flex-col gap-5 w-full shrink-0">
        <div className="flex items-center gap-2 w-full">
          <div className="size-9 bg-secondary flex items-center justify-center rounded-lg shrink-0">
            <FileText className="size-4 text-muted-foreground" />
          </div>
          <p className="flex-1 font-bold text-2xl text-foreground leading-[20px] font-janna">
            Documents
          </p>

        </div>
        <div className="h-px bg-border w-full" />
      </div>


      {/* My Documents — top item */}
      <CategoryItem
        cat={myDocs}
        isActive={activeCategoryId === myDocs.id}
        onSelect={onSelect}
      />

      {/* Divider */}
      <div className="h-px bg-border w-full" />


      {/* Other categories */}
      <div className="flex flex-col gap-[8px]">
        {otherCats.map((cat) => (
          <CategoryItem
            key={cat.id}
            cat={cat}
            isActive={activeCategoryId === cat.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

const themeBgStyles: Record<string, string> = {
  primary: "bg-primary/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
  ai: "bg-ai/10",
  destructive: "bg-destructive/10",
  info: "bg-info/10",
};

const themeTextStyles: Record<string, string> = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  ai: "text-ai",
  destructive: "text-destructive",
  info: "text-info",
};

const themeBorderStyles: Record<string, string> = {
  primary: "border-primary",
  warning: "border-warning",
  success: "border-success",
  ai: "border-ai",
  destructive: "border-destructive",
  info: "border-info",
};

function CategoryItem({
  cat,
  isActive,
  onSelect,
}: {
  cat: DocumentCategory;
  isActive: boolean;
  onSelect: (id: string) => void;
}) {

  return (
    <button
      onClick={() => onSelect(cat.id)}
      className={cn(
        "w-full flex items-center gap-2.5 px-3 py-3.5 rounded-lg text-left transition-all duration-200 cursor-pointer border-l-[3px]",
        isActive ? "bg-muted" : "bg-secondary",
        isActive ? themeBorderStyles[cat.theme] : "border-l-transparent",
      )}>

      <cat.icon
        className={cn("size-[14px] shrink-0", themeTextStyles[cat.theme])}
      />
      <span
        className={cn("flex-1 text-[13px] font-bold leading-[16px] truncate", themeTextStyles[cat.theme])}>
        {cat.name}
      </span>
      <span
        className={cn(
          "text-sm font-bold leading-[14px] shrink-0 h-[18px] px-1 rounded-[4px] flex items-center justify-center",
          themeTextStyles[cat.theme],
          themeBgStyles[cat.theme]
        )}>
        {cat.count}
      </span>
    </button>

  );
}
