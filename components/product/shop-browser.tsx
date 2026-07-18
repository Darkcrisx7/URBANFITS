"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Product, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

export function ShopBrowser({
  products,
  lockedCategory,
}: {
  products: Product[];
  lockedCategory?: Category;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState<Category | "all">(lockedCategory ?? "all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [maxPrice, setMaxPrice] = useState(6000);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const tag = searchParams.get("tag");
    if (tag === "new") {
      // handled in filter below via query flag
    }
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const tag = searchParams.get("tag");

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.status === "published");
    if (lockedCategory) list = list.filter((p) => p.category === lockedCategory);
    else if (category !== "all") list = list.filter((p) => p.category === category);

    if (tag === "new") list = list.filter((p) => p.isNew);
    if (tag === "sale") list = list.filter((p) => p.isFlashSale);

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    list = list.filter((p) => p.price <= maxPrice);

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [products, category, lockedCategory, sort, maxPrice, query, tag]);

  function updateSearch(value: string) {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("q", value);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Container className="py-10">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder="Search products…"
          className="h-11 w-full rounded-full border border-white/15 px-5 text-sm outline-none focus:border-bone md:max-w-xs"
        />
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="h-11 rounded-full border border-white/15 bg-graphite px-4 text-sm outline-none focus:border-bone"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
          <Button variant="secondary" size="md" onClick={() => setFiltersOpen(true)} className="md:hidden">
            <SlidersHorizontal size={16} /> Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className={cn("hidden md:block")}>
          <FilterPanel
            lockedCategory={lockedCategory}
            category={category}
            setCategory={setCategory}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
          />
        </aside>

        {filtersOpen && (
          <div className="fixed inset-0 z-[90] bg-black/50 md:hidden" onClick={() => setFiltersOpen(false)}>
            <div
              className="absolute inset-y-0 left-0 w-80 overflow-y-auto bg-graphite p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg">Filters</span>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} />
                </button>
              </div>
              <FilterPanel
                lockedCategory={lockedCategory}
                category={category}
                setCategory={setCategory}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
              />
            </div>
          </div>
        )}

        <div>
          <p className="mb-4 text-sm text-silver/70">{filtered.length} products</p>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </Container>
  );
}

function FilterPanel({
  lockedCategory,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
}: {
  lockedCategory?: Category;
  category: Category | "all";
  setCategory: (c: Category | "all") => void;
  maxPrice: number;
  setMaxPrice: (n: number) => void;
}) {
  return (
    <div className="space-y-8">
      {!lockedCategory && (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wideish text-silver/70">Category</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setCategory("all")}
              className={cn("text-left text-sm", category === "all" ? "font-semibold text-bone" : "text-silver/70")}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={cn(
                  "text-left text-sm",
                  category === c.key ? "font-semibold text-bone" : "text-silver/70"
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wideish text-silver/70">
          Max Price: ₹{maxPrice}
        </p>
        <input
          type="range"
          min={500}
          max={6000}
          step={100}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-bone"
        />
      </div>
    </div>
  );
}
