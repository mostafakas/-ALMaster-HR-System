"use client";

import * as React from "react";
import { SettingsNav, SettingsTab } from "@/components/hr-dashboard/settings/settings-nav";
import { AccountSettings } from "@/components/hr-dashboard/settings/account-settings";
import { SecuritySettings } from "@/components/hr-dashboard/settings/security-settings";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>("account");

  return (
    <div className="flex w-full h-full overflow-hidden">
      {/* Settings Left Panel */}
      <div className="w-[335px] shrink-0 border-r border-border bg-muted flex flex-col h-full overflow-y-auto">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-white">
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "account" && <AccountSettings />}
          {activeTab === "security" && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}
