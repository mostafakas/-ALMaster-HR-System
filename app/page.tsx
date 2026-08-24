"use client";

import { SystemSelector } from "@/components/shared/system-selector";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useAppSelector } from "@/lib/store/hooks";

// Previously this page hardcoded userName="AL Master CEO" for every visitor
// regardless of who (or whether anyone) was signed in, and — unlike the
// dashboard modules — wasn't wrapped in <AuthGuard> at all, so it rendered
// the full system-selector menu for logged-out visitors too. It now shows
// the actual signed-in user's name and requires a session like every other
// screen in the app.
function HomeContent() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="min-h-screen w-full bg-[#0000FF] flex items-center justify-center p-6">
      <SystemSelector userName={user?.name || "there"} />
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
