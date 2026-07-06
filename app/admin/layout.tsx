"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getAdminAuth } from "@/lib/storage";

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
    if (!getAdminAuth()) {
      router.replace("/admin/login");
    } else {
      setChecked(true);
    }
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
