import { PMSidebar } from "@/components/project-management/sidebar";
import { PMHeader } from "@/components/project-management/header";

export default function PMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted antialiased text-foreground w-full">
      <PMSidebar />

      <div className="flex flex-1 flex-col min-w-0">
        <PMHeader />
        <div className="flex flex-1 min-w-0 bg-white">{children}</div>
      </div>
    </div>
  );
}
