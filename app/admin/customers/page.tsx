"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getCustomers, getOrders } from "@/lib/storage";
import { Customer } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Merge seed customers with anyone who has placed a real order this session.
    const seed = getCustomers();
    const orders = getOrders();
    const fromOrders: Record<string, Customer> = {};
    orders.forEach((o) => {
      if (!fromOrders[o.customerEmail]) {
        fromOrders[o.customerEmail] = {
          id: o.customerEmail,
          name: o.customerName,
          email: o.customerEmail,
          phone: o.customerPhone,
          ordersCount: 0,
          totalSpent: 0,
          joinedAt: o.createdAt,
        };
      }
      fromOrders[o.customerEmail].ordersCount += 1;
      fromOrders[o.customerEmail].totalSpent += o.total;
    });
    setCustomers([...Object.values(fromOrders), ...seed]);
  }, []);

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-medium tracking-tightest">Customers</h1>
      <p className="mb-6 text-sm text-stone-500">{customers.length} customers on record</p>

      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers…"
          className="h-11 w-full rounded-full border border-stone-300 pl-10 pr-4 text-sm outline-none focus:border-ink"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-paper">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 text-left text-xs uppercase tracking-wideish text-stone-500">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Phone</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3">Total Spent</th>
              <th className="px-5 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-stone-100 last:border-0">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-stone-500">{c.email}</td>
                <td className="px-5 py-3 text-stone-500">{c.phone}</td>
                <td className="px-5 py-3">{c.ordersCount}</td>
                <td className="px-5 py-3">{formatCurrency(c.totalSpent)}</td>
                <td className="px-5 py-3 text-stone-500">{new Date(c.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
