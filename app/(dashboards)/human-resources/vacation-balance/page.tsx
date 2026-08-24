"use client";

import * as React from "react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Filter, Settings } from "lucide-react";
import { VacationCard, type VacationBalanceItem } from "@/components/hr-dashboard/vacation-balance/vacation-card";
import { SingleAdjustModal } from "@/components/hr-dashboard/vacation-balance/single-adjust-modal";
import { BulkAdjustModal } from "@/components/hr-dashboard/vacation-balance/bulk-adjust-modal";
import { FilterEmployeesModal } from "@/components/hr-dashboard/vacation-balance/filter-employees-modal";
import { VacationHistoryModal } from "@/components/hr-dashboard/vacation-balance/vacation-history-modal";
import { EditBalanceDetailsModal } from "@/components/hr-dashboard/vacation-balance/edit-balance-details-modal";

const INITIAL_VACATION_ITEMS: VacationBalanceItem[] = [];

export default function VacationBalancePage() {
  const [items, setItems] = React.useState<VacationBalanceItem[]>(INITIAL_VACATION_ITEMS);

  // Modal States
  const [filterModalOpen, setFilterModalOpen] = React.useState(false);
  const [bulkAdjustModalOpen, setBulkAdjustModalOpen] = React.useState(false);

  const [singleAdjustModalOpen, setSingleAdjustModalOpen] = React.useState(false);
  const [historyModalOpen, setHistoryModalOpen] = React.useState(false);
  const [editDetailsModalOpen, setEditDetailsModalOpen] = React.useState(false);

  const [selectedItem, setSelectedItem] = React.useState<VacationBalanceItem | null>(null);

  const handleOpenEditDetails = (item: VacationBalanceItem) => {
    setSelectedItem(item);
    setEditDetailsModalOpen(true);
  };

  const handleOpenAdjust = (item: VacationBalanceItem) => {
    setSelectedItem(item);
    setSingleAdjustModalOpen(true);
  };

  const handleOpenHistory = (item: VacationBalanceItem) => {
    setSelectedItem(item);
    setHistoryModalOpen(true);
  };

  const handleUpdateItem = (updated: VacationBalanceItem) => {
    setItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  };

  return (
    <div className="flex-1 p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <Typography variant="display" className="text-foreground font-bold">
            Vacation Balance
          </Typography>
          <Typography variant="small" className="text-muted-foreground mt-1">
            Manage employee leave entitlements, balances, and adjustments
          </Typography>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setFilterModalOpen(true)}
            className="h-10 text-xs font-bold gap-2 rounded-xl px-4"
          >
            <Filter className="w-4 h-4 text-muted-foreground" />
            Filters
          </Button>

          <Button
            onClick={() => setBulkAdjustModalOpen(true)}
            className="h-10 text-xs font-bold gap-2 rounded-xl px-4"
          >
            <Settings className="w-4 h-4" />
            Adjust Balance
          </Button>
        </div>
      </div>

      {/* Vacation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <VacationCard
            key={item.id}
            item={item}
            onEditDetails={handleOpenEditDetails}
            onAdjust={handleOpenAdjust}
            onHistory={handleOpenHistory}
          />
        ))}
      </div>

      {/* Modals */}
      <FilterEmployeesModal
        open={filterModalOpen}
        onOpenChange={setFilterModalOpen}
        onApply={(selectedDepts) => {
          console.log("Filtered departments:", selectedDepts);
        }}
      />

      <BulkAdjustModal
        open={bulkAdjustModalOpen}
        onOpenChange={setBulkAdjustModalOpen}
        employeesList={items.map((it) => ({
          id: it.id,
          name: it.name,
          role: it.role,
          avatar: it.avatar,
        }))}
        onSave={(data) => {
          console.log("Bulk adjust saved:", data);
        }}
      />

      <SingleAdjustModal
        open={singleAdjustModalOpen}
        onOpenChange={setSingleAdjustModalOpen}
        employee={selectedItem}
        onSave={(data) => {
          console.log("Single adjust saved:", data);
        }}
      />

      <VacationHistoryModal
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        employee={selectedItem}
      />

      <EditBalanceDetailsModal
        open={editDetailsModalOpen}
        onOpenChange={setEditDetailsModalOpen}
        employee={selectedItem}
        onSave={handleUpdateItem}
      />
    </div>
  );
}
