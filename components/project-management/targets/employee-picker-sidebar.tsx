"use client";

import * as React from "react";
import { Briefcase, ChevronUp, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmployeeTargetCard } from "./employee-target-card";
import {
  EMPLOYEE_TARGET_TEAMS,
  type EmployeeTeamGroup,
} from "@/lib/data/employees-target-mock";

interface EmployeePickerSidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

/**
 * Left rail of the Employees' Target page (Figma frame 2126:46100).
 *
 * Surface tokens from Figma:
 *   - Sidebar bg #F8FAFC (1st Shade of BG)
 *   - Heading "Employees' Target" — Bold 16/20 #343434, briefcase icon
 *   - Search input: h-40, bg-#EDF2F7, rounded-8, Bold 12 text
 *   - Group title — Bold 14/16 #343434 (with chevron 16×16 #707070)
 */
export function EmployeePickerSidebar({
  selectedId,
  onSelect,
}: EmployeePickerSidebarProps) {
  const [query, setQuery] = React.useState("");

  const filteredGroups = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EMPLOYEE_TARGET_TEAMS;
    return EMPLOYEE_TARGET_TEAMS.map<EmployeeTeamGroup>((g) => ({
      ...g,
      members: g.members.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q),
      ),
    })).filter((g) => g.members.length > 0);
  }, [query]);

  return (
    <aside className="w-[352px] shrink-0 h-full bg-[#F8FAFC] border-r border-[#EDF2F7] flex flex-col">
      {/* Heading */}
      <div className="px-4 pt-8 pb-3 flex items-center gap-2">
        <div className="size-9 flex items-center justify-center">
          <Briefcase className="size-3 text-[#343434]" strokeWidth={2.4} />
        </div>
        <h2 className="font-bold text-[16px] leading-[20px] text-[#343434]">
          Employees&rsquo; Target
        </h2>
      </div>
      <div className="mx-4 h-px bg-[#EDF2F7]" />

      {/* Search */}
      <div className="px-4 pt-3 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-[#707070]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Employee..."
            className="w-full h-10 bg-[#EDF2F7] rounded-[8px] pl-8 pr-3 font-bold text-[12px] leading-[14px] text-[#343434] placeholder:text-[#707070] outline-none"
          />
        </div>
      </div>

      {/* Scrollable group list */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6 flex flex-col gap-4">
        {filteredGroups.map((group, idx) => (
          <TeamGroup
            key={`${group.label}-${idx}`}
            group={group}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  );
}

interface TeamGroupProps {
  group: EmployeeTeamGroup;
  selectedId: string;
  onSelect: (id: string) => void;
}

function TeamGroup({ group, selectedId, onSelect }: TeamGroupProps) {
  const [open, setOpen] = React.useState(group.defaultOpen ?? true);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between font-bold text-[14px] leading-[16px] text-[#343434]"
      >
        <span>{group.label}</span>
        <ChevronUp
          className={cn(
            "size-4 text-[#707070] transition-transform",
            !open && "rotate-180",
          )}
        />
      </button>

      {open && group.members.length > 0 && (
        <div className="flex flex-col gap-2">
          {group.members.map((m) => (
            <EmployeeTargetCard
              key={m.id}
              employee={m}
              selected={m.id === selectedId}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
