"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Clock, Bell, LogOut, User as UserIcon } from "lucide-react";
import { LiveClock } from "@/components/hr-dashboard/shared/live-clock";
import { SystemSwitcher } from "@/components/shared/system-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { logout } from "@/lib/store/slices/auth-slice";

function initials(name?: string | null) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export function DashboardHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = React.useCallback(async () => {
    dispatch(logout());
    try {
      // Also clears the httpOnly cookie set at login time.
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Non-fatal — client-side session is already cleared above.
    }
    router.replace("/login");
  }, [dispatch, router]);

  return (
    <header className="h-16 shrink-0 bg-background flex items-center justify-between sticky top-0 z-10 px-6 border-b">
      {/* Clock Section */}
      <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
        <div className="bg-secondary h-10 flex items-center justify-center gap-2 rounded-lg px-3 overflow-clip">
          <Clock className="size-[14px] text-primary" />
          <LiveClock className="font-bold text-sm text-primary leading-[21px] tabular-nums whitespace-nowrap" />
        </div>
      </div>


      {/* Right Controls */}
      <div className="flex items-center gap-[8px]">
        {/* System Switcher */}
        <SystemSwitcher />

        {/* Bell / Notification */}
        <div className="bg-muted p-1.5 rounded-xl flex items-center shrink-0">
          <div className="bg-secondary size-10 flex items-center justify-center rounded-lg cursor-pointer hover:bg-secondary/80 transition-all relative">
            <Bell className="size-[14px] text-muted-foreground" />
            <div className="absolute top-2 right-2 size-[6px] bg-destructive rounded-full border border-background" />
          </div>
        </div>

        {/* Current user + logout — previously missing entirely from this
            header, so there was no visible way to tell who was signed in
            or to sign out from within the HR module. */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="bg-muted p-1.5 rounded-xl flex items-center gap-2 shrink-0 pr-3 cursor-pointer hover:bg-muted/80 transition-all outline-none"
          >
            <Avatar size="sm">
              <AvatarImage src={user?.avatar || undefined} alt={user?.name || "User"} />
              <AvatarFallback>{initials(user?.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold text-foreground max-w-[120px] truncate">
              {user?.name || "Account"}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled className="opacity-70">
              <UserIcon className="size-3.5" />
              {user?.email || "—"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="size-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
