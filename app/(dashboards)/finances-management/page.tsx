import { Banknote } from "lucide-react";

export default function FinancesManagementPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Banknote className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Finances Management System
        </h1>
        <p className="text-md text-muted-foreground">
          Manage company finances. This module is coming soon.
        </p>
      </div>
    </div>
  );
}
