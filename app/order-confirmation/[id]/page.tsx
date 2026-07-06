"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Truck, Download } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/lib/storage";
import { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    const found = getOrders().find((o) => o.id === id);
    setOrder(found ?? null);
  }, [id]);

  if (order === undefined) return null;

  if (order === null) {
    return (
      <Container className="py-32 text-center">
        <p className="text-stone-500">We couldn't find that order.</p>
        <Link href="/shop">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="flex justify-center py-16">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex flex-col items-center text-center"
        >
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
            <CheckCircle2 size={32} className="text-success" />
          </div>
          <h1 className="font-display text-3xl font-medium tracking-tightest">Order Confirmed</h1>
          <p className="mt-2 text-stone-500">
            Order <span className="font-semibold text-ink">{order.id}</span> has been placed — pay
            {" "}{formatCurrency(order.total)} in cash on delivery.
          </p>
        </motion.div>

        <div className="mt-10 rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center gap-3 border-b border-stone-200 pb-4">
            <Truck size={18} className="text-stone-500" />
            <p className="text-sm text-stone-600">
              Delivering to {order.address.line1}, {order.address.city}, {order.address.state} —{" "}
              {order.address.pincode}
            </p>
          </div>
          <div className="space-y-3 py-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-stone-600">
                  {item.name} × {item.quantity}
                  <span className="block text-xs text-stone-400">
                    {item.color} · {item.size}
                  </span>
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold">
              <span>Total (Cash on Delivery)</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={`/orders/${order.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Track Order
            </Button>
          </Link>
          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
            <Download size={16} /> Download Invoice
          </Button>
        </div>
        <Link href="/shop">
          <Button variant="ghost" className="mt-3 w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </Container>
  );
}
