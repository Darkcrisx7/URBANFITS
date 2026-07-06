"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  Image as ImageIcon,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { setAdminAuth } from "@/lib/storage";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-stone-200 bg-paper p-5 md:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Image src="/logo.jpeg" alt="Urban Fits" width={32} height={32} className="rounded-full" />
        <span className="font-display text-sm font-semibold">Admin Panel</span>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-stone-600 hover:bg-stone-100"
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => {
          setAdminAuth(false);
          router.push("/admin/login");
        }}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-stone-500 hover:bg-stone-100"
      >
        <LogOut size={16} /> Log Out
      </button>
    </aside>
  );
}
