"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Truck, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useCart } from "@/contexts/cart-context";
import { formatCurrency, generateOrderId } from "@/lib/utils";
import { getCoupons, saveOrder, upsertCustomerByEmail } from "@/lib/storage";
import { Order, OrderItem, Coupon } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  line1: z.string().min(4, "Enter your address"),
  line2: z.string().optional(),
  city: z.string().min(2, "Enter your city"),
  state: z.string().min(2, "Enter your state"),
  pincode: z.string().min(4, "Enter a valid pincode"),
  notes: z.string().optional(),
});
type CheckoutForm = z.infer<typeof checkoutSchema>;

function CheckoutInner() {
  const cart = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const couponCode = searchParams.get("coupon");
  const [placing, setPlacing] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    if (couponCode) getCoupons().then(setCoupons);
  }, [couponCode]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({ resolver: zodResolver(checkoutSchema) });

  const shipping = cart.subtotal > 2000 || cart.subtotal === 0 ? 0 : 99;
  const tax = Math.round(cart.subtotal * 0.05);

  let discount = 0;
  if (couponCode) {
    const coupon = coupons.find((c) => c.code === couponCode && c.active);
    if (coupon && cart.subtotal >= coupon.minPurchase) {
      discount = coupon.type === "percentage" ? Math.round((cart.subtotal * coupon.value) / 100) : coupon.value;
    }
  }
  const total = Math.max(0, cart.subtotal + shipping + tax - discount);

  function onSubmit(data: CheckoutForm) {
    if (cart.lines.length === 0) return;
    setPlacing(true);

    const items: OrderItem[] = cart.lines.map((l) => {
      const product = cart.products.find((p) => p.id === l.productId)!;
      return {
        productId: l.productId,
        name: product.name,
        size: l.size,
        color: l.color,
        quantity: l.quantity,
        price: product.price,
      };
    });

    const order: Order = {
      id: generateOrderId(),
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      items,
      address: {
        id: `addr_${Date.now()}`,
        fullName: data.fullName,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        isDefault: true,
      },
      subtotal: cart.subtotal,
      shipping,
      tax,
      discount,
      total,
      couponCode: couponCode ?? undefined,
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "placed",
      notes: data.notes,
      createdAt: new Date().toISOString(),
    };

    // Simulated network delay so the placing-order state is visible.
    setTimeout(async () => {
      await Promise.all([saveOrder(order), upsertCustomerByEmail(data.fullName, data.email, data.phone)]);
      cart.clear();
      toast.show("Order placed successfully");
      router.push(`/order-confirmation/${order.id}`);
    }, 700);
  }

  if (cart.lines.length === 0) {
    return (
      <Container className="py-32 text-center">
        <p className="text-stone-500">Your bag is empty. Add items before checking out.</p>
        <Button className="mt-6" onClick={() => router.push("/shop")}>
          Go to Shop
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-12">
      <div className="mb-10 flex items-center gap-3 text-xs font-semibold uppercase tracking-wideish text-stone-400">
        <span className="text-ink">1. Bag</span>
        <div className="h-px w-8 bg-stone-300" />
        <span className="text-ink">2. Delivery</span>
        <div className="h-px w-8 bg-stone-300" />
        <span>3. Confirmation</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <h1 className="font-display text-2xl font-medium tracking-tightest">Delivery Details</h1>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Full Name</Label>
              <Input {...register("fullName")} placeholder="Jordan Rao" />
              {errors.fullName && <p className="mt-1 text-xs text-error">{errors.fullName.message}</p>}
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...register("phone")} placeholder="+91 90000 00000" />
              {errors.phone && <p className="mt-1 text-xs text-error">{errors.phone.message}</p>}
            </div>
          </div>

          <div>
            <Label>Email</Label>
            <Input {...register("email")} placeholder="you@example.com" type="email" />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>

          <div>
            <Label>Address Line 1</Label>
            <Input {...register("line1")} placeholder="House no., Street" />
            {errors.line1 && <p className="mt-1 text-xs text-error">{errors.line1.message}</p>}
          </div>

          <div>
            <Label>Address Line 2 (optional)</Label>
            <Input {...register("line2")} placeholder="Landmark, apartment" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label>City</Label>
              <Input {...register("city")} placeholder="Bengaluru" />
              {errors.city && <p className="mt-1 text-xs text-error">{errors.city.message}</p>}
            </div>
            <div>
              <Label>State</Label>
              <Input {...register("state")} placeholder="Karnataka" />
              {errors.state && <p className="mt-1 text-xs text-error">{errors.state.message}</p>}
            </div>
            <div>
              <Label>Pincode</Label>
              <Input {...register("pincode")} placeholder="560001" />
              {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode.message}</p>}
            </div>
          </div>

          <div>
            <Label>Delivery Notes (optional)</Label>
            <Textarea {...register("notes")} rows={3} placeholder="Leave at the front desk, call before delivery…" />
          </div>

          <div className="rounded-2xl border border-stone-200 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wideish text-stone-500">Payment Method</p>
            <div className="flex items-center gap-3 rounded-xl border-2 border-ink bg-stone-50 p-4">
              <Truck size={20} />
              <div>
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-stone-500">Pay in cash when your order arrives.</p>
              </div>
              <CheckCircle2 size={18} className="ml-auto text-success" />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={placing}>
            {placing ? "Placing order…" : `Place Order · ${formatCurrency(total)}`}
          </Button>
        </form>

        <motion.div layout className="h-fit rounded-2xl border border-stone-200 p-6">
          <h2 className="font-display text-xl font-medium">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {cart.lines.map((line) => {
              const product = cart.products.find((p) => p.id === line.productId);
              if (!product) return null;
              return (
                <div key={`${line.productId}-${line.size}-${line.color}`} className="flex justify-between text-sm">
                  <span className="text-stone-600">
                    {product.name} × {line.quantity}
                    <span className="block text-xs text-stone-400">
                      {line.color} · {line.size}
                    </span>
                  </span>
                  <span>{formatCurrency(product.price * line.quantity)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 space-y-2 border-t border-stone-200 pt-5 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount ({couponCode})</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Container>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutInner />
    </Suspense>
  );
}
