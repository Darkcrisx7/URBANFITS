"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container, SectionHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/storage";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  // NOTE: this currently lists every order in the store, not just this
  // visitor's — there's no real customer login yet to filter by. Fine for
  // now while the store is being tested, but should be scoped to the
  // logged-in customer once customer auth (phase 3) is wired in.
  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <Container className="py-12">
      <SectionHeading eyebrow="Your history" title="Orders" />
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 text-center">
          <p className="font-display text-xl">No orders yet</p>
          <p className="mt-2 text-sm text-stone-500">Orders placed on this browser will show up here.</p>
          <Link href="/shop">
            <Button className="mt-6">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-stone-200 p-5 transition-colors hover:border-ink sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold">{o.id}</p>
                <p className="text-xs text-stone-500">
                  {new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item(s)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{formatCurrency(o.total)}</span>
                <OrderStatusBadge status={o.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
