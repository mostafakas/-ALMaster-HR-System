import { AuthGuard } from "@/components/auth/auth-guard";

// SECURITY FIX: AuthGuard was previously only applied inside
// client-relations-management/layout.tsx, so /human-resources/*,
// /project-management/* and /finances-management/* rendered with zero
// client-side auth check. Moving it here means every current AND future
// module under app/(dashboards)/ is protected automatically, without
// relying on each module remembering to wrap itself individually.
//
// This is a client-side (Redux/localStorage) check that runs after the
// page loads, complementing (not replacing) the middleware.ts redirect and
// the server-side checks in every API route.
export default function DashboardsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
