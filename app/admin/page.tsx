"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IndianRupee, ShoppingBag, Package, Users, AlertTriangle } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getOrders, getProducts, getCustomers } from "@/lib/storage";
import { Order, Product, Customer } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setOrders(getOrders());
    setProducts(getProducts());
    setCustomers(getCustomers());
  }, []);

  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock < 10));
  const outOfStock = products.filter((p) => p.variants.every((v) => v.stock === 0));

  const salesByDay = useMemo(() => {
    const days: Record<string, number> = {};
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      days[day] = (days[day] ?? 0) + o.total;
    });
    return Object.entries(days).map(([day, total]) => ({ day, total }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const counts: Record<string, { name: string; qty: number }> = {};
    orders.forEach((o) =>
      o.items.forEach((item) => {
        if (!counts[item.productId]) counts[item.productId] = { name: item.name, qty: 0 };
        counts[item.productId].qty += item.quantity;
      })
    );
    return Object.values(counts).sort((a, b) => b.qty - a.qty).slice(0, 5);
  }, [orders]);

  return (
    <div>
      <h1 className="font-display text-2xl font-medium tracking-tightest">Dashboard</h1>
      <p className="mt-1 text-sm text-stone-500">A snapshot of how the store is performing.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatCurrency(revenue)} icon={IndianRupee} />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingBag} />
        <StatCard label="Products" value={String(products.length)} icon={Package} />
        <StatCard label="Customers" value={String(customers.length)} icon={Users} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Sales Overview</h2>
          {salesByDay.length === 0 ? (
            <p className="py-16 text-center text-sm text-stone-400">No orders yet — sales will chart here.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-medium">
            <AlertTriangle size={16} className="text-accent" /> Stock Alerts
          </h2>
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="text-sm text-stone-400">All products are well stocked.</p>
          ) : (
            <div className="space-y-3">
              {outOfStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-error">Out of stock</span>
                </div>
              ))}
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-accent">Low stock</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Top Selling Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-sm text-stone-400">No sales recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{p.name}</span>
                  <span className="text-stone-500">{p.qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 bg-paper p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs text-accent">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-stone-400">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <span>{o.id}</span>
                  <span className="text-stone-500">{formatCurrency(o.total)}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
