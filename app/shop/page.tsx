import { Suspense } from "react";
import { ShopBrowser } from "@/components/product/shop-browser";
import { Container } from "@/components/ui/container";
import { PRODUCTS } from "@/lib/mock-data";

export const metadata = { title: "Shop All" };

export default function ShopPage() {
  return (
    <>
      <Container className="pt-10">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-accent">Full Range</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tightest md:text-5xl">Shop All</h1>
      </Container>
      <Suspense>
        <ShopBrowser products={PRODUCTS} />
      </Suspense>
    </>
  );
}
