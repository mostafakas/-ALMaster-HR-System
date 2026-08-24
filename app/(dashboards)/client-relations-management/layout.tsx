import { ClientRelationsHeader } from "@/components/client-relations-management/shared/header";

// AuthGuard now lives one level up in app/(dashboards)/layout.tsx and
// covers this module automatically — no need to wrap again here.
export default function ClientRelationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background antialiased text-foreground w-full">
      <div className="flex flex-1 flex-col min-w-0">
        <ClientRelationsHeader />
        <div className="flex flex-1 min-w-0 bg-background">{children}</div>
      </div>
    </div>
  );
}
