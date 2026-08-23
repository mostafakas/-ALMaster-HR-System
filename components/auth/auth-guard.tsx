"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    let hasToken = Boolean(token || isAuthenticated);
    if (!hasToken && typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("almaster_auth");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.token) {
            hasToken = true;
          }
        }
      } catch {
        // ignore
      }
    }

    if (!hasToken) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [isAuthenticated, token, router]);

  if (checking) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
