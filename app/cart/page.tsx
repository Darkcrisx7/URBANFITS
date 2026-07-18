"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ArrowRight, Tag } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency, cn } from "@/lib/utils";
import { getCoupons } from "@/lib/storage";
import { useToast } from "@/contexts/toast-context";

export default function CartPage() {
  const cart = useCart();
  const toast = useToast();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  async function applyCoupon() {
    const coupons = await getCoupons();
    const match = coupons.find(
      (c) => c.code.toLowerCase() === couponInput.trim().toLowerCase() && c.active
    );
    if (!match) {
      toast.show("Invalid or expired coupon", "error");
      return;
    }
    if (cart.subtotal < match.minPurchase) {
      toast.show(`Minimum purchase of ${formatCurrency(match.minPurchase)} required`, "error");
      return;
    }
    const discount =
      match.type === "percentage" ? Math.round((cart.subtotal * match.value) / 100) : match.value;
    setAppliedCoupon({ code: match.code, discount });
    toast.show(`${match.code} applied`);
  }

  const shipping = cart.subtotal > 2000 || cart.subtotal === 0 ? 0 : 99;
  const tax = Math.round(cart.subtotal * 0.05);
  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(0, cart.subtotal + shipping + tax - discount);

  if (cart.lines.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-32 text-center">
        <h1 className="font-display text-3xl font-medium tracking-tightest">Your bag is empty</h1>
        <p className="mt-3 text-silver/70">Add something you'll actually wear.</p>
        <Link href="/shop">
          <Button size="lg" className="mt-8">
            Continue Shopping
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-3xl font-medium tracking-tightest md:text-4xl">Your Bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <AnimatePresence>
            {cart.lines.map((line) => {
              const product = cart.products.find((p) => p.id === line.productId);
              if (!product) return null;
              return (
                <motion.div
                  key={`${line.productId}-${line.size}-${line.color}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex gap-4 rounded-2xl border border-white/10 p-4"
                >
                  <div className={cn("h-28 w-24 shrink-0 rounded-xl bg-gradient-to-br", product.images[0].gradient)} />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/product/${product.slug}`} className="text-sm font-medium hover:text-chrome-bright">
                          {product.name}
                        </Link>
                        <p className="mt-1 text-xs text-silver/70">
                          {line.color} · Size {line.size}
                        </p>
                      </div>
                      <button
                        onClick={() => cart.remove(line.productId, line.size, line.color)}
                        aria-label="Remove item"
                        className="text-chrome hover:text-error"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-white/15">
                        <button
                          onClick={() =>
                            cart.updateQuantity(line.productId, line.size, line.color, line.quantity - 1)
                          }
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs">{line.quantity}</span>
                        <button
                          onClick={() =>
                            cart.updateQuantity(line.productId, line.size, line.color, line.quantity + 1)
                          }
                          className="flex h-8 w-8 items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(product.price * line.quantity)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="h-fit rounded-2xl border border-white/10 p-6">
          <h2 className="font-display text-xl font-medium">Order Summary</h2>

          <div className="mt-5 flex gap-2">
            <input
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="Coupon code"
              className="h-11 flex-1 rounded-full border border-white/15 px-4 text-sm outline-none focus:border-bone"
            />
            <Button variant="secondary" onClick={applyCoupon}>
              <Tag size={14} /> Apply
            </Button>
          </div>
          {appliedCoupon && (
            <p className="mt-2 text-xs text-success">
              {appliedCoupon.code} applied — {formatCurrency(appliedCoupon.discount)} off
            </p>
          )}

          <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between text-silver/70">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-silver/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-silver/70">
              <span>Tax (5%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <Link
            href={{
              pathname: "/checkout",
              query: appliedCoupon ? { coupon: appliedCoupon.code } : {},
            }}
          >
            <Button size="lg" className="mt-6 w-full">
              Checkout <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
