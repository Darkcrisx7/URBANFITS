"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthGate } from "@/components/layout/auth-gate";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  return (
    <main
      className={cn(
        "min-h-screen",
        !isAdmin && "storefront-theme bg-void pt-20 text-bone"
      )}
    >
      {isAdmin ? children : <AuthGate>{children}</AuthGate>}
    </main>
  );
}
