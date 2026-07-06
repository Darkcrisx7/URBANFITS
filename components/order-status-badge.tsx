import { OrderStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const toneMap: Record<OrderStatus, "neutral" | "accent" | "success" | "error" | "ink"> = {
  placed: "neutral",
  accepted: "accent",
  packed: "accent",
  shipped: "accent",
  delivered: "success",
  cancelled: "error",
};

const labelMap: Record<OrderStatus, string> = {
  placed: "Placed",
  accepted: "Accepted",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge tone={toneMap[status]}>{labelMap[status]}</Badge>;
}

export const ORDER_STEPS: OrderStatus[] = ["placed", "accepted", "packed", "shipped", "delivered"];
