import { SidebarNav } from "@/components/hr-dashboard/sidebar-nav";
import { DashboardHeader } from "@/components/hr-dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted antialiased text-foreground">

      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <DashboardHeader />
        <div className="flex flex-1">{children}</div>
      </div>
    </div>
  );
}
