"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye } from "lucide-react";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { formatCurrency, computeDiscountPercent, cn } from "@/lib/utils";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/contexts/toast-context";
import { QuickView } from "./quick-view";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const toast = useToast();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const discount = computeDiscountPercent(product.price, product.compareAtPrice);
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const wished = wishlist.has(product.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="group relative"
      >
        <Link href={`/product/${product.slug}`} className="block">
          <div
            className={cn(
              "relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-[1.03]",
              product.images[0].gradient
            )}
          >
            {product.images[0].url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/40 to-transparent p-4">
              <span className="font-display text-sm text-white/80">{product.name}</span>
            </div>
            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isNew && <Badge tone="accent">New</Badge>}
              {product.isFlashSale && <Badge tone="error">Flash Sale</Badge>}
              {discount > 0 && <Badge tone="ink">-{discount}%</Badge>}
              {totalStock === 0 && <Badge tone="neutral">Out of Stock</Badge>}
            </div>

            <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  wishlist.toggle(product.id);
                  toast.show(wished ? "Removed from wishlist" : "Added to wishlist");
                }}
                aria-label="Toggle wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
              >
                <Heart size={16} className={wished ? "fill-error text-error" : "text-ink"} />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuickViewOpen(true);
                }}
                aria-label="Quick view"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-transform hover:scale-110"
              >
                <Eye size={16} className="text-ink" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-medium text-ink">{product.name}</h3>
              <Rating value={product.rating} count={product.reviewCount} />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{formatCurrency(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-xs text-stone-400 line-through">
                  {formatCurrency(product.compareAtPrice)}
                </p>
              )}
            </div>
          </div>
        </Link>
      </motion.div>

      <QuickView product={product} open={quickViewOpen} onClose={() => setQuickViewOpen(false)} />
    </>
  );
}
