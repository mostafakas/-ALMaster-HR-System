"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Typography } from "@/components/ui/typography";
import type { VacationBalanceItem } from "./vacation-card";

interface SingleAdjustModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: VacationBalanceItem | null;
  initialMode?: "add" | "deduct";
  onSave?: (data: any) => void;
}

export function SingleAdjustModal({
  open,
  onOpenChange,
  employee,
  initialMode = "add",
  onSave,
}: SingleAdjustModalProps) {
  const [mode, setMode] = React.useState<"add" | "deduct">(initialMode);
  const [date, setDate] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [type, setType] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [days, setDays] = React.useState<number>(mode === "add" ? 1 : 2);

  React.useEffect(() => {
    setMode(initialMode);
    setDays(initialMode === "add" ? 1 : 2);
  }, [initialMode, open]);

  if (!employee) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        employeeId: employee.id,
        mode,
        date: mode === "add" ? date : undefined,
        fromDate: mode === "deduct" ? fromDate : undefined,
        toDate: mode === "deduct" ? toDate : undefined,
        type,
        reason,
        days,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 rounded-2xl">
        <DialogHeader className="space-y-3 pb-2 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src={employee.avatar || "https://ui.shadcn.com/avatars/01.png"}
              alt={employee.name}
              className="w-12 h-12 rounded-full object-cover border border-border"
            />
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {employee.name}
              </DialogTitle>
              <Typography variant="small" className="text-muted-foreground">
                {employee.role}
              </Typography>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 bg-secondary/80 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => {
                setMode("add");
                setDays(1);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "add"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("deduct");
                setDays(2);
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === "deduct"
                  ? "bg-destructive text-destructive-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Deduct
            </button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === "add" ? (
            <div className="space-y-2">
              <Label className="text-xs font-bold">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="dd/mm/yyyy"
                className="h-10 text-xs rounded-xl"
                required
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-xs font-bold">From</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold">To</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  placeholder="dd/mm/yyyy"
                  className="h-10 text-xs rounded-xl"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-xs font-bold">Type</Label>
            <Select value={type} onValueChange={(val) => setType(val ?? "")}>
              <SelectTrigger className="h-10 text-xs rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {mode === "add" ? (
                  <>
                    <SelectItem value="Award">Award</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
                    <SelectItem value="Overtime">Overtime</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                    <SelectItem value="Penalty">Penalty</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Reason</Label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={mode === "add" ? "e.g. Awarded for Achieving Target" : "e.g. Didn't work"}
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Number of Days</Label>
            <Input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="h-10 text-xs rounded-xl"
              required
            />
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
              variant={mode === "add" ? "default" : "destructive"}
              className="h-10 text-xs font-bold rounded-xl px-5"
            >
              {mode === "add" ? `Add ${days} Day${days > 1 ? "s" : ""}` : `Deduct ${days} day${days > 1 ? "s" : ""}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
