import { Suspense } from "react";
import { ShopBrowser } from "@/components/product/shop-browser";
import { Container } from "@/components/ui/container";
import { getProducts } from "@/lib/storage";

export const metadata = { title: "Shop All" };
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <Container className="pt-10">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-chrome-bright">Full Range</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tightest md:text-5xl">Shop All</h1>
      </Container>
      <Suspense>
        <ShopBrowser products={products} />
      </Suspense>
    </>
  );
}
