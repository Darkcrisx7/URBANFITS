import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/product/shop-browser";
import { Container } from "@/components/ui/container";
import { CATEGORIES } from "@/lib/mock-data";
import { getProducts } from "@/lib/storage";
import { Category } from "@/lib/types";

// Products change via the admin panel at runtime (Supabase), so these
// category pages render fresh on every request instead of being frozen
// at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.key === category);
  return { title: cat ? cat.label : "Shop" };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.key === category);
  if (!cat) notFound();
  const products = await getProducts();

  return (
    <>
      <Container className="pt-10">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-chrome-bright">Category</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tightest md:text-5xl">
          {cat.label}
        </h1>
        <p className="mt-2 text-silver/70">{cat.blurb}</p>
      </Container>
      <Suspense>
        <ShopBrowser products={products} lockedCategory={cat.key as Category} />
      </Suspense>
    </>
  );
}
