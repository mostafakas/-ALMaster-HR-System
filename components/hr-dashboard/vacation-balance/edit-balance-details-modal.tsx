"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import type { VacationBalanceItem } from "./vacation-card";

interface EditBalanceDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: VacationBalanceItem | null;
  onSave?: (updatedItem: VacationBalanceItem) => void;
}

export function EditBalanceDetailsModal({
  open,
  onOpenChange,
  employee,
  onSave,
}: EditBalanceDetailsModalProps) {
  const [annualTotal, setAnnualTotal] = React.useState<number>(21);
  const [casualDays, setCasualDays] = React.useState<number>(7);
  const [sickDays, setSickDays] = React.useState<number>(2);
  const [absentDays, setAbsentDays] = React.useState<number>(3);
  const [addedDays, setAddedDays] = React.useState<number>(1);
  const [deductedDays, setDeductedDays] = React.useState<number>(4);

  React.useEffect(() => {
    if (employee) {
      setAnnualTotal(employee.annualTotal);
      setCasualDays(employee.casualDays);
      setSickDays(employee.sickDays);
      setAbsentDays(employee.absentDays);
      setAddedDays(employee.addedDays);
      setDeductedDays(employee.deductedDays);
    }
  }, [employee, open]);

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        ...employee,
        annualTotal,
        casualDays,
        sickDays,
        absentDays,
        addedDays,
        deductedDays,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-6 rounded-2xl">
        <DialogHeader className="space-y-2 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar || "https://ui.shadcn.com/avatars/01.png"}
              alt={employee.name}
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Edit Vacation Balance
              </DialogTitle>
              <Typography variant="small" className="text-muted-foreground">
                {employee.name} • {employee.role}
              </Typography>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Annual Entitlement</Label>
              <Input
                type="number"
                min={0}
                value={annualTotal}
                onChange={(e) => setAnnualTotal(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Casual Leave</Label>
              <Input
                type="number"
                min={0}
                value={casualDays}
                onChange={(e) => setCasualDays(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Sick Leave</Label>
              <Input
                type="number"
                min={0}
                value={sickDays}
                onChange={(e) => setSickDays(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Absence</Label>
              <Input
                type="number"
                min={0}
                value={absentDays}
                onChange={(e) => setAbsentDays(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Added Days</Label>
              <Input
                type="number"
                min={0}
                value={addedDays}
                onChange={(e) => setAddedDays(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Deducted Days</Label>
              <Input
                type="number"
                min={0}
                value={deductedDays}
                onChange={(e) => setDeductedDays(Number(e.target.value))}
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-10 text-xs font-bold rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 text-xs font-bold rounded-xl px-5"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
