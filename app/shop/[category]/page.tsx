import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ShopBrowser } from "@/components/product/shop-browser";
import { Container } from "@/components/ui/container";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Category } from "@/lib/types";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.key === category);
  return { title: cat ? cat.label : "Shop" };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.key === category);
  if (!cat) notFound();

  return (
    <>
      <Container className="pt-10">
        <p className="text-xs font-semibold uppercase tracking-widest2 text-accent">Category</p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tightest md:text-5xl">
          {cat.label}
        </h1>
        <p className="mt-2 text-stone-500">{cat.blurb}</p>
      </Container>
      <Suspense>
        <ShopBrowser products={PRODUCTS} lockedCategory={cat.key as Category} />
      </Suspense>
    </>
  );
}
