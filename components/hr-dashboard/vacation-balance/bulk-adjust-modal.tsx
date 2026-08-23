"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";
import { Search } from "lucide-react";

interface BulkAdjustModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employeesList?: { id: string; name: string; role: string; avatar: string }[];
  onSave?: (data: any) => void;
}

const DEFAULT_EMPLOYEES_LIST = [
  { id: "1", name: "Daniel Brown", role: "Head of Programming", avatar: "https://ui.shadcn.com/avatars/01.png" },
  { id: "2", name: "Matt Scott", role: "Content Creator", avatar: "https://ui.shadcn.com/avatars/02.png" },
  { id: "3", name: "Daniel Scott", role: "UI/UX Designer", avatar: "https://ui.shadcn.com/avatars/03.png" },
  { id: "4", name: "John Smith", role: "Company Super Admin", avatar: "https://ui.shadcn.com/avatars/04.png" },
];

export function BulkAdjustModal({
  open,
  onOpenChange,
  employeesList = DEFAULT_EMPLOYEES_LIST,
  onSave,
}: BulkAdjustModalProps) {
  const [mode, setMode] = React.useState<"add" | "deduct">("add");
  const [targetScope, setTargetScope] = React.useState<"all" | "department" | "employees">("employees");
  const [department, setDepartment] = React.useState("All Departments");
  const [search, setSearch] = React.useState("");
  const [selectedEmployees, setSelectedEmployees] = React.useState<string[]>(["2", "3"]);
  const [date, setDate] = React.useState("");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [type, setType] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [days, setDays] = React.useState<number>(1);

  const filteredEmployees = employeesList.filter(
    (emp) =>
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.role.toLowerCase().includes(search.toLowerCase())
  );

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave({
        mode,
        targetScope,
        department,
        selectedEmployees,
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
      <DialogContent className="sm:max-w-[560px] p-6 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-2 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            Adjust Balance
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Manually add, or deduct an employee’s balance
          </DialogDescription>

          {/* Add / Deduct Mode Switcher */}
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
          {/* Target Scope Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold">Target Scope</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTargetScope("all")}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  targetScope === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                All Employees
              </button>
              <button
                type="button"
                onClick={() => setTargetScope("department")}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  targetScope === "department"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Department
              </button>
              <button
                type="button"
                onClick={() => setTargetScope("employees")}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                  targetScope === "employees"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                Employee(s)
              </button>
            </div>
          </div>

          {/* Department Filter Selector */}
          {(targetScope === "department" || targetScope === "employees") && (
            <div className="space-y-2">
              <Label className="text-xs font-bold">Department</Label>
              <Select value={department} onValueChange={(val) => setDepartment(val ?? "")}>
                <SelectTrigger className="h-10 text-xs rounded-xl">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  <SelectItem value="Programming">Programming</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Employees List with Search */}
          {targetScope === "employees" && (
            <div className="space-y-2">
              <Label className="text-xs font-bold">Department Employee(s)</Label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or role..."
                  className="pl-9 h-10 text-xs rounded-xl"
                />
              </div>

              <div className="border border-border rounded-xl p-2 max-h-40 overflow-y-auto space-y-1 bg-background/50">
                {filteredEmployees.map((emp) => {
                  const isChecked = selectedEmployees.includes(emp.id);
                  return (
                    <div
                      key={emp.id}
                      onClick={() => toggleEmployee(emp.id)}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/60 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <Typography variant="small" className="font-bold text-foreground leading-tight">
                            {emp.name}
                          </Typography>
                          <p className="text-[10px] text-muted-foreground">{emp.role}</p>
                        </div>
                      </div>
                      <Checkbox checked={isChecked} onCheckedChange={() => toggleEmployee(emp.id)} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dates */}
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

          {/* Type */}
          <div className="space-y-2">
            <Label className="text-xs font-bold">Type</Label>
            <Select value={type} onValueChange={(val) => setType(val ?? "")}>
              <SelectTrigger className="h-10 text-xs rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {mode === "add" ? (
                  <>
                    <SelectItem value="Company Establishment Anniversary">
                      Company Establishment Anniversary
                    </SelectItem>
                    <SelectItem value="Award">Award</SelectItem>
                    <SelectItem value="Bonus">Bonus</SelectItem>
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

          {/* Reason */}
          <div className="space-y-2">
            <Label className="text-xs font-bold">Reason</Label>
            <Input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Company Establishment Anniversary"
              className="h-10 text-xs rounded-xl"
              required
            />
          </div>

          {/* Number of Days */}
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

          {/* Footer Actions */}
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
              {mode === "add"
                ? `Add ${days} Day${days > 1 ? "s" : ""}`
                : `Deduct ${days} Day${days > 1 ? "s" : ""}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
