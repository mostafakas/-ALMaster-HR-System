"use client";

import * as React from "react";
import {
  Briefcase,
  Search,
  Plus,
  Megaphone,
  Palette,
  Sparkles,
  PenLine,
  Banknote,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";
import { DepartmentModal } from "./department-modal";

export interface Department {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  headLabel: "Head" | "Manager";
  headName: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  theme: "primary" | "warning" | "success" | "ai" | "destructive" | "info";
}




interface DepartmentPanelProps {
  activeDepartmentId: string;
  onSelect: (id: string) => void;
}

const themeStyles: Record<Department["theme"], string> = {
  primary: "text-primary bg-primary/10 border-primary",
  warning: "text-warning bg-warning/10 border-warning",
  success: "text-success bg-success/10 border-success",
  ai: "text-ai bg-ai/10 border-ai",
  destructive: "text-destructive bg-destructive/10 border-destructive",
  info: "text-info bg-info/10 border-info",
};

const themeBgStyles: Record<Department["theme"], string> = {
  primary: "bg-primary/10",
  warning: "bg-warning/10",
  success: "bg-success/10",
  ai: "bg-ai/10",
  destructive: "bg-destructive/10",
  info: "bg-info/10",
};

const themeTextStyles: Record<Department["theme"], string> = {
  primary: "text-primary",
  warning: "text-warning",
  success: "text-success",
  ai: "text-ai",
  destructive: "text-destructive",
  info: "text-info",
};

const themeBorderStyles: Record<Department["theme"], string> = {
  primary: "border-primary",
  warning: "border-warning",
  success: "border-success",
  ai: "border-ai",
  destructive: "border-destructive",
  info: "border-info",
};

import { useGetDepartmentsQuery } from "@/lib/store/services/departmentApi";

export function DepartmentPanel({
  activeDepartmentId,
  onSelect,
}: DepartmentPanelProps) {

  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  const { data: apiData, isLoading } = useGetDepartmentsQuery();
  const apiDepartments = React.useMemo(() => {
    if (!apiData?.items) return [];
    return apiData.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || "",
      memberCount: item._count?.employees || 0,
      headLabel: "Head" as const,
      headName: "Mustafa Mahmoud",
      icon: Briefcase,
      color: "#0047FF",
      iconBg: "rgba(0,71,255,0.1)",
      theme: "primary" as const,
    }));
  }, [apiData]);

  const filtered = apiDepartments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-[356px] shrink-0 flex flex-col gap-[20px] px-[16px] py-[32px] border-r border-border overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex flex-col gap-[20px] w-full shrink-0">
        <div className="flex items-center gap-[8px] w-full">
          <div className="size-[36px] bg-secondary flex items-center justify-center rounded-[8px] shrink-0">
            <Briefcase className="size-[16px] text-muted-foreground" />
          </div>
          <Typography as="p" className="flex-1 font-bold text-[22px] text-foreground leading-[20px]">
            Departments
          </Typography>
          <button
            onClick={() => setModalOpen(true)}
            className="h-[36px] bg-primary flex items-center gap-[8px] px-[12px] rounded-[8px] shrink-0 hover:bg-primary/90 transition-colors">
            <Plus className="size-[10px] text-primary-foreground" />
            <span className="text-[12px] font-bold text-primary-foreground whitespace-nowrap">
              New Department
            </span>
          </button>
        </div>
        <div className="h-px bg-border w-full" />
      </div>


      {/* Search + List */}
      <div className="flex flex-col gap-[12px] w-full">
        {/* Search */}
        <div className="bg-secondary h-[40px] flex items-center gap-[8px] px-[12px] py-[8px] rounded-[8px] w-full">
          <Search className="size-[12px] text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Departments..."
            className="flex-1 bg-transparent text-[12px] font-bold text-foreground placeholder:text-muted-foreground outline-none leading-[14px]"
          />
        </div>


        {/* Department list */}
        <div className="flex flex-col gap-[8px]">
          {isLoading ? (
            <Typography as="p" className="text-xs text-muted-foreground font-bold text-center py-4">Loading...</Typography>
          ) : filtered.length === 0 ? (
            <Typography as="p" className="text-xs text-muted-foreground font-bold text-center py-4">No departments found</Typography>
          ) : (
            filtered.map((dept) => {
              const isActive = dept.id === activeDepartmentId;
              const Icon = dept.icon || Briefcase;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => onSelect(dept.id)}
                  className={cn(
                    "w-full flex items-start gap-[12px] px-[12px] py-[11px] rounded-[8px] text-left transition-all duration-200 cursor-pointer border-l-4",
                    isActive
                      ? "bg-[rgba(0,71,255,0.1)] border-[#0047ff]"
                      : "bg-[#edf2f7] border-l-transparent hover:bg-[#edf2f7]/80",
                  )}>

                  {/* Icon */}
                  <div
                    className={cn(
                      "size-[40px] flex items-center justify-center rounded-[8.89px] shrink-0",
                      themeBgStyles[dept.theme] || themeBgStyles.primary
                    )}>
                    <Icon
                      className={cn("size-[14px]", themeTextStyles[dept.theme] || themeTextStyles.primary)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-[6px] flex-1 min-w-0">
                    <div className="flex flex-col gap-[4px]">
                      <p
                        className={cn(
                          "text-[14px] font-bold leading-[16px] whitespace-nowrap truncate",
                          themeTextStyles[dept.theme] || themeTextStyles.primary
                        )}>
                        {dept.name}
                      </p>

                      <p className="text-[12px] font-bold text-[#707070] leading-[16px] line-clamp-2">
                        {dept.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-[4px]">
                        <Users className="size-[12px] text-[#707070] shrink-0" />
                        <span className="text-[12px] font-bold text-[#707070] leading-[16px] whitespace-nowrap">
                          {dept.memberCount} members
                        </span>
                      </div>
                      <div className="flex items-center gap-[4px]">
                        <span className="text-[12px] font-bold text-[#707070] leading-[16px]">
                          {dept.headLabel}:
                        </span>
                        <span className="text-[12px] font-bold text-[#0047ff] leading-[16px] whitespace-nowrap">
                          {dept.headName}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      <DepartmentModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
