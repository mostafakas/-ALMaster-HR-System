"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Typography } from "@/components/ui/typography";

interface FilterEmployeesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply?: (selectedDepartments: string[]) => void;
}

const DEPARTMENTS = [
  "Programming",
  "Design",
  "Marketing",
  "Finance",
  "Content Writing",
  "Artificial Intelligence",
];

export function FilterEmployeesModal({
  open,
  onOpenChange,
  onApply,
}: FilterEmployeesModalProps) {
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggleDept = (dept: string) => {
    setSelected((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const handleReset = () => {
    setSelected([]);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(selected);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-6 rounded-2xl">
        <DialogHeader className="pb-2 border-b border-border">
          <DialogTitle className="text-lg font-bold text-foreground">
            Filter Employees
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Typography variant="small" className="font-bold text-foreground">
              Departments
            </Typography>
            <div className="space-y-2 pt-1">
              {DEPARTMENTS.map((dept) => {
                const isChecked = selected.includes(dept);
                return (
                  <div
                    key={dept}
                    onClick={() => toggleDept(dept)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border/60 hover:border-primary/40 bg-secondary/30 hover:bg-secondary/60 cursor-pointer transition-all"
                  >
                    <Typography variant="small" className="font-medium text-foreground">
                      {dept}
                    </Typography>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleDept(dept)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              className="h-10 text-xs font-bold text-muted-foreground hover:text-foreground rounded-xl"
            >
              Reset
            </Button>
            <Button
              type="button"
              onClick={handleApply}
              className="h-10 text-xs font-bold rounded-xl px-5"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
