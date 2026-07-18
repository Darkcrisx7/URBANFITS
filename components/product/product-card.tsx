"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { Product } from "@/lib/types";
import { formatCurrency, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/contexts/toast-context";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const toast = useToast();
  const isWishlisted = wishlist.ids.includes(product.id);
  const ref = useRef<HTMLDivElement>(null);

  // Cheap CSS-transform tilt — no WebGL needed for cards, keeps grids of
  // 20+ products smooth even on mid-range phones.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const [hovering, setHovering] = useState(false);

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function resetTilt() {
    mx.set(0);
    my.set(0);
    setHovering(false);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={resetTilt}
      className="group [perspective:1000px]"
    >
      <Link href={`/product/${product.slug}`}>
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-graphite shadow-glass transition-shadow duration-500 group-hover:shadow-chrome"
        >
          <div className="relative aspect-[4/5] overflow-hidden">
            {product.images[0].url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0].url}
                alt={product.name}
                className="absolute inset-0 h-full w-full scale-105 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
              />
            ) : (
              <div
                className={cn(
                  "absolute inset-0 scale-105 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-[1.12]",
                  product.images[0].gradient
                )}
              />
            )}

            {/* Reflection sheen that tracks the cursor — the "dynamic reflections" ask */}
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: hovering
                  ? `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.22), transparent 45%)`
                  : undefined,
              }}
            />

            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
              <span className="font-display text-sm text-bone/90">{product.name}</span>
            </div>

            <div className="absolute left-3 top-3 flex flex-col gap-1.5">
              {product.isNew && <Badge tone="accent">New</Badge>}
              {product.isFlashSale && <Badge tone="error">Sale</Badge>}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                wishlist.toggle(product.id);
                toast.show(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-void/50 text-bone backdrop-blur-md transition-transform hover:scale-110"
              aria-label="Toggle wishlist"
            >
              <Heart size={16} className={isWishlisted ? "fill-ember text-ember" : ""} />
            </button>
          </div>

          <div className="p-4" style={{ transform: "translateZ(20px)" }}>
            <p className="truncate text-sm font-medium text-bone">{product.name}</p>
            <div className="mt-1 flex items-center justify-between">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-sm font-semibold text-bone">{formatCurrency(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-xs text-chrome line-through">
                    {formatCurrency(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <Rating value={product.rating} size={11} />
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
