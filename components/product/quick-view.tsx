"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { formatCurrency, cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/contexts/toast-context";

export function QuickView({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const cart = useCart();
  const toast = useToast();

  function addToCart() {
    cart.add(product.id, size, color, 1);
    toast.show(`${product.name} added to bag`);
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className={cn("relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br", product.images[0].gradient)}>
          {product.images[0].url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0].url} alt={product.name} className="absolute inset-0 h-full w-full object-cover" />
          )}
        </div>
        <div>
          <h3 className="font-display text-2xl font-medium tracking-tightest">{product.name}</h3>
          <div className="mt-2">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <p className="mt-3 text-xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="mt-4 text-sm text-stone-500">{product.description}</p>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wideish text-stone-500">Color</p>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c.name)}
                  className={cn(
                    "h-8 w-8 rounded-full border-2 transition-transform hover:scale-110",
                    color === c.name ? "border-ink" : "border-transparent"
                  )}
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wideish text-stone-500">Size</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "rounded-lg border px-3.5 py-2 text-sm transition-colors",
                    size === s ? "border-ink bg-ink text-paper" : "border-stone-300 hover:border-ink"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" onClick={addToCart}>
              Add to Bag
            </Button>
            <Link href={`/product/${product.slug}`} onClick={onClose}>
              <Button size="lg" variant="secondary" className="w-full">
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
