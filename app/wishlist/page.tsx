"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/wishlist-context";
import { getProducts } from "@/lib/storage";
import { Product } from "@/lib/types";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const items = products.filter((p) => wishlist.ids.includes(p.id));

  return (
    <Container className="py-12">
      <SectionHeading eyebrow="Saved for later" title="Your Wishlist" />
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 py-24 text-center">
          <p className="font-display text-xl">Nothing saved yet</p>
          <p className="mt-2 text-sm text-stone-500">Tap the heart on any product to save it here.</p>
          <Link href="/shop">
            <Button className="mt-6">Browse the Shop</Button>
          </Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </Container>
  );
}
