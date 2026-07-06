"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/storage";
import { Order } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { ORDER_STEPS, OrderStatusBadge } from "@/components/order-status-badge";

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(getOrders().find((o) => o.id === id) ?? null);
  }, [id]);

  if (order === undefined) return null;
  if (order === null) {
    return (
      <Container className="py-32 text-center">
        <p className="text-stone-500">We couldn't find that order.</p>
        <Link href="/orders">
          <Button className="mt-6">Back to Orders</Button>
        </Link>
      </Container>
    );
  }

  const currentIndex = order.status === "cancelled" ? -1 : ORDER_STEPS.indexOf(order.status);

  return (
    <Container className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-medium tracking-tightest">{order.id}</h1>
          <p className="mt-1 text-sm text-stone-500">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === "cancelled" ? (
        <div className="rounded-2xl border border-error/30 bg-error/5 p-6 text-error">
          This order was cancelled.
        </div>
      ) : (
        <div className="mb-12 flex items-center">
          {ORDER_STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: i <= currentIndex ? "#0A0A0A" : "#F2F2F2",
                    color: i <= currentIndex ? "#FFFFFF" : "#9B9B9B",
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold"
                >
                  {i < currentIndex ? <Check size={14} /> : i + 1}
                </motion.div>
                <span className="mt-2 text-[11px] capitalize text-stone-500">{step}</span>
              </div>
              {i < ORDER_STEPS.length - 1 && (
                <div className={cn("mx-2 h-0.5 flex-1", i < currentIndex ? "bg-ink" : "bg-stone-200")} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-2xl border border-stone-200 p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Items</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>
                  {item.name} × {item.quantity}
                  <span className="block text-xs text-stone-400">
                    {item.color} · {item.size}
                  </span>
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 text-sm font-semibold">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>
        <div className="rounded-2xl border border-stone-200 p-6">
          <h2 className="mb-4 font-display text-lg font-medium">Delivery Address</h2>
          <p className="text-sm text-stone-600">
            {order.address.fullName}
            <br />
            {order.address.line1}
            {order.address.line2 && <>, {order.address.line2}</>}
            <br />
            {order.address.city}, {order.address.state} — {order.address.pincode}
            <br />
            {order.address.phone}
          </p>
          <p className="mt-4 text-xs text-stone-400">Payment: Cash on Delivery ({order.paymentStatus})</p>
        </div>
      </div>
    </Container>
  );
}
