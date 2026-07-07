import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function computeDiscountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function generateOrderId() {
  // Includes a random component (not just a timestamp) so order IDs can't
  // be guessed — this matters because guest checkout orders are viewable
  // by anyone who has the ID (no login required), by design, like most
  // guest-checkout order tracking.
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `UF${Date.now().toString(36).toUpperCase()}${random}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
