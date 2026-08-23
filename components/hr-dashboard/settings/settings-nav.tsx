"use client";

import * as React from "react";
import { Settings, Lock, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsTab = "account" | "security";

interface SettingsNavProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
  const tabs = [
    {
      id: "account" as SettingsTab,
      label: "Account Settings",
      icon: User,
    },
    {
      id: "security" as SettingsTab,
      label: "Security Settings",
      icon: Lock,
    },
  ];

  return (
    <div className="flex flex-col flex-1 gap-5 px-4 py-8 min-w-0">
      {/* Header */}
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="size-9 bg-secondary flex items-center justify-center rounded-[8px] shrink-0">
            <Settings className="size-3 text-foreground" />
          </div>
          <p className="text-[22px] font-bold text-foreground leading-5">Settings</p>
        </div>
        <div className="h-px bg-border w-full" />
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-[8px] w-full text-left transition-colors",
                isActive
                  ? "bg-primary/10"
                  : "hover:bg-secondary/60"
              )}
            >
              <tab.icon
                className={cn(
                  "size-[14px] shrink-0",
                  isActive ? "text-primary" : "text-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[16px] font-bold leading-4 whitespace-nowrap",
                  isActive ? "text-primary" : "text-foreground"
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
