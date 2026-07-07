"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { supabase } from "@/lib/supabase-client";
import { ADMIN_EMAILS } from "@/lib/admin-config";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    async function check() {
      const { data } = await supabase.auth.getSession();
      const email = data.session?.user.email ?? "";
      if (!data.session || !ADMIN_EMAILS.includes(email)) {
        router.replace("/admin/login");
      } else {
        setChecked(true);
      }
    }
    check();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session || !ADMIN_EMAILS.includes(session.user.email ?? "")) {
        router.replace("/admin/login");
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (!checked) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <AdminSidebar />
      <div className="md:pl-64">
        <div className="mx-auto max-w-6xl p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
