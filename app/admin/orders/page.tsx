"use client";

import { useEffect, useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { getOrders, updateOrder } from "@/lib/storage";
import { Order, OrderStatus } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/contexts/toast-context";

const STATUS_OPTIONS: OrderStatus[] = ["placed", "accepted", "packed", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  async function changeStatus(order: Order, status: OrderStatus) {
    const updated: Order = { ...order, status, paymentStatus: status === "delivered" ? "paid" : order.paymentStatus };
    await updateOrder(updated);
    setOrders(await getOrders());
    toast.show(`Order ${order.id} marked as ${status}`);
  }

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-medium tracking-tightest">Orders</h1>
      <p className="mb-6 text-sm text-stone-500">{orders.length} total orders</p>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-300 py-20 text-center text-stone-400">
          No orders placed yet. New Cash on Delivery orders will appear here instantly.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border border-stone-200 bg-paper p-5">
              <div
                className="flex cursor-pointer flex-wrap items-center justify-between gap-3"
                onClick={() => setExpanded(expanded === o.id ? null : o.id)}
              >
                <div>
                  <p className="text-sm font-semibold">{o.id}</p>
                  <p className="text-xs text-stone-500">
                    {o.customerName} · {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{formatCurrency(o.total)}</span>
                  <OrderStatusBadge status={o.status} />
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => changeStatus(o, e.target.value as OrderStatus)}
                    className="h-9 rounded-full border border-stone-300 px-3 text-xs outline-none"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {expanded === o.id && (
                <div className="mt-4 grid gap-6 border-t border-stone-100 pt-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wideish text-stone-500">Items</p>
                    <div className="space-y-2 text-sm">
                      {o.items.map((item, i) => (
                        <div key={i} className="flex justify-between">
                          <span>
                            {item.name} × {item.quantity}{" "}
                            <span className="text-xs text-stone-400">
                              ({item.color}, {item.size})
                            </span>
                          </span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wideish text-stone-500">
                      Delivery & Payment
                    </p>
                    <p className="text-sm text-stone-600">
                      {o.address.line1}, {o.address.city}, {o.address.state} — {o.address.pincode}
                      <br />
                      {o.customerPhone} · {o.customerEmail}
                      <br />
                      Cash on Delivery · Payment {o.paymentStatus}
                    </p>
                    {o.notes && <p className="mt-2 text-xs italic text-stone-400">Note: {o.notes}</p>}
                    <Button variant="secondary" size="sm" className="mt-3" onClick={() => window.print()}>
                      <Printer size={14} /> Print Invoice
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
