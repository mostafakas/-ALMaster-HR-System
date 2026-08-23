import { DashboardHeader } from "@/components/hr-dashboard/header";

export default function FinancesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted antialiased text-foreground w-full">
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader />
        <div className="flex flex-1 min-w-0 bg-background">{children}</div>
      </div>
    </div>
  );
}
