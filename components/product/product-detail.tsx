"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Share2, Minus, Plus, ChevronRight, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Product } from "@/lib/types";
import { ImageGallery } from "./image-gallery";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, computeDiscountPercent, cn } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { useToast } from "@/contexts/toast-context";
import { ReviewsSection } from "./reviews-section";
import { ProductGrid } from "./product-grid";

const RECENT_KEY = "uf_recently_viewed";

export function ProductDetail({
  product,
  allProducts,
  freeShippingThreshold = 2000,
}: {
  product: Product;
  allProducts: Product[];
  freeShippingThreshold?: number;
}) {
  const [size, setSize] = useState(product.sizes[0]);
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const cart = useCart();
  const wishlist = useWishlist();
  const toast = useToast();

  const discount = computeDiscountPercent(product.price, product.compareAtPrice);
  const variant = product.variants.find((v) => v.size === size && v.color === color);
  const stock = variant?.stock ?? 0;
  const wished = wishlist.has(product.id);

  useEffect(() => {
    const raw = window.localStorage.getItem(RECENT_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    setRecentIds(ids.filter((id) => id !== product.id).slice(0, 4));
    const updated = [product.id, ...ids.filter((id) => id !== product.id)].slice(0, 8);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }, [product.id]);

  function addToCart() {
    if (stock === 0) {
      toast.show("This variant is out of stock", "error");
      return;
    }
    cart.add(product.id, size, color, quantity);
    toast.show(`${product.name} added to bag`);
  }

  function share() {
    if (navigator.share) {
      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.show("Link copied to clipboard");
    }
  }

  const related = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);
  const recentlyViewed = allProducts.filter((p) => recentIds.includes(p.id));

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-[1400px] px-5 pt-6 md:px-10">
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-silver/70">
          <Link href="/" className="hover:text-bone">Home</Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-bone">Shop</Link>
          <ChevronRight size={12} />
          <Link href={`/shop/${product.category}`} className="capitalize hover:text-bone">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-bone">{product.name}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <ImageGallery images={product.images} />

          <div>
            <div className="mb-2 flex gap-1.5">
              {product.isNew && <Badge tone="accent">New</Badge>}
              {product.isFlashSale && <Badge tone="error">Flash Sale</Badge>}
              {discount > 0 && <Badge tone="ink">-{discount}%</Badge>}
            </div>
            <h1 className="font-display text-3xl font-medium tracking-tightest md:text-4xl">
              {product.name}
            </h1>
            <div className="mt-3">
              <Rating value={product.rating} count={product.reviewCount} />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-semibold">{formatCurrency(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-chrome line-through">
                  {formatCurrency(product.compareAtPrice)}
                </span>
              )}
            </div>
            <p className="mt-5 text-sm leading-relaxed text-silver/80">{product.description}</p>

            <div className="mt-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wideish text-silver/70">
                Color — {color}
              </p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-transform hover:scale-110",
                      color === c.name ? "border-bone" : "border-transparent"
                    )}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wideish text-silver/70">Size</p>
                <button className="text-xs text-chrome-bright underline">Size guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "rounded-lg border px-4 py-2.5 text-sm transition-colors",
                      size === s ? "border-bone bg-bone text-void" : "border-white/15 hover:border-bone"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-white/15">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-11 w-11 items-center justify-center"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <p className={cn("text-sm", stock === 0 ? "text-error" : stock < 10 ? "text-chrome-bright" : "text-silver/70")}>
                {stock === 0 ? "Out of stock" : stock < 10 ? `Only ${stock} left` : "In stock"}
              </p>
            </div>

            <div className="mt-7 flex gap-3">
              <Button size="lg" className="flex-1" onClick={addToCart} disabled={stock === 0}>
                Add to Bag
              </Button>
              <Button size="lg" variant="secondary" onClick={() => wishlist.toggle(product.id)} aria-label="Wishlist">
                <Heart size={18} className={wished ? "fill-error text-error" : ""} />
              </Button>
              <Button size="lg" variant="secondary" onClick={share} aria-label="Share">
                <Share2 size={18} />
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center">
              <div>
                <Truck size={18} className="mx-auto mb-1.5 text-silver/70" />
                <p className="text-xs text-silver/70">Free shipping over {formatCurrency(freeShippingThreshold)}</p>
              </div>
              <div>
                <RotateCcw size={18} className="mx-auto mb-1.5 text-silver/70" />
                <p className="text-xs text-silver/70">7-day easy returns</p>
              </div>
              <div>
                <ShieldCheck size={18} className="mx-auto mb-1.5 text-silver/70" />
                <p className="text-xs text-silver/70">Cash on Delivery</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-xs text-chrome">
              SKU: {variant?.sku ?? "—"} {product.tags.length > 0 && <>· Tags: {product.tags.join(", ")}</>}
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-16">
          <ReviewsSection productId={product.id} />
        </div>

        {related.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <h3 className="mb-6 font-display text-2xl font-medium tracking-tightest">You may also like</h3>
            <ProductGrid products={related} />
          </div>
        )}

        {recentlyViewed.length > 0 && (
          <div className="mt-20 border-t border-white/10 pt-16">
            <h3 className="mb-6 font-display text-2xl font-medium tracking-tightest">Recently viewed</h3>
            <ProductGrid products={recentlyViewed} />
          </div>
        )}
      </div>
    </div>
  );
}
