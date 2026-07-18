"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { ProductCard } from "@/components/product/product-card";
import { Product } from "@/lib/types";

export function Trending({ products }: { products: Product[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  }

  return (
    <section className="bg-graphite2 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Right now"
          title="Trending"
          action={
            <div className="hidden gap-2 md:flex">
              <button
                onClick={() => scroll(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone hover:border-bone"
                aria-label="Scroll left"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-bone hover:border-bone"
                aria-label="Scroll right"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          }
        />
      </Container>
      <div ref={scrollerRef} className="no-scrollbar flex gap-5 overflow-x-auto px-5 md:px-10">
        {products.map((p) => (
          <div key={p.id} className="w-[70vw] shrink-0 sm:w-64">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
