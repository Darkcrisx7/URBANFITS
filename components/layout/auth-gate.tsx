"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

// Pages a visitor must be able to reach without being logged in — otherwise
// they could never actually log in, or would loop forever.
const ALLOWLIST = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAllowed = ALLOWLIST.some((p) => pathname?.startsWith(p));

  useEffect(() => {
    if (loading || isAllowed || user) return;
    router.replace(`/login?next=${encodeURIComponent(pathname || "/")}`);
  }, [loading, isAllowed, user, pathname, router]);

  // While the session is still loading, or once we know a redirect is
  // about to happen, render nothing rather than flash the real page.
  if (!isAllowed && (loading || !user)) return null;

  return <>{children}</>;
}
