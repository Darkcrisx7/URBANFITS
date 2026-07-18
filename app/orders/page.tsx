"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container, SectionHeading } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getMyOrders } from "@/lib/storage";
import { useAuth } from "@/contexts/auth-context";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/order-status-badge";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    getMyOrders(user.id).then(setOrders);
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <Container className="py-12">
      <SectionHeading eyebrow="Your history" title="Orders" />
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 py-24 text-center">
          <p className="font-display text-xl">No orders yet</p>
          <p className="mt-2 text-sm text-silver/70">Orders you place while logged in will show up here.</p>
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
              className="flex flex-col justify-between gap-3 rounded-2xl border border-white/10 p-5 transition-colors hover:border-bone sm:flex-row sm:items-center"
            >
              <div>
                <p className="text-sm font-semibold">{o.id}</p>
                <p className="text-xs text-silver/70">
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

