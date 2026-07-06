"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PRODUCTS } from "@/lib/mock-data";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const floatA = PRODUCTS[0];
  const floatB = PRODUCTS[2];

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink pb-24 pt-16 text-paper md:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.25),transparent_45%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.12),transparent_40%)]" />

      <Container className="relative">
        <motion.div style={{ opacity }} className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 text-xs font-semibold uppercase tracking-widest2 text-accent"
          >
            Autumn / Winter 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl font-medium leading-[0.95] tracking-tightest sm:text-7xl md:text-8xl"
          >
            Engineered
            <br />
            for movement.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-md text-base text-stone-300"
          >
            Heavyweight fabrics, deliberate cuts, zero compromise. UrbanFits is streetwear built like
            outerwear — designed in-house, made to outlast the season.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link href="/shop">
              <Button size="lg" variant="accent">
                Shop Now <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/shop?tag=new">
              <Button size="lg" variant="secondary" className="bg-transparent text-paper border-stone-600 hover:border-paper">
                New Collection
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: y1 }}
          initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: -6 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute right-[6%] top-16 hidden w-52 rounded-2xl bg-paper p-3 shadow-lift lg:block"
        >
          <div className={`aspect-[4/5] rounded-xl bg-gradient-to-br ${floatA.images[0].gradient}`} />
          <p className="mt-2 text-xs font-medium text-ink">{floatA.name}</p>
          <p className="text-xs font-semibold text-ink">{formatCurrency(floatA.price)}</p>
        </motion.div>

        <motion.div
          style={{ y: y2 }}
          initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 8 }}
          transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-4 right-[20%] hidden w-44 rounded-2xl bg-paper p-3 shadow-lift xl:block"
        >
          <div className={`aspect-[4/5] rounded-xl bg-gradient-to-br ${floatB.images[0].gradient}`} />
          <p className="mt-2 text-xs font-medium text-ink">{floatB.name}</p>
          <p className="text-xs font-semibold text-ink">{formatCurrency(floatB.price)}</p>
        </motion.div>
      </Container>

      <div className="mt-16 overflow-hidden border-t border-white/10 py-4">
        <div className="marquee-track animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10 text-stone-500">
              {["Free shipping over ₹2000", "Cash on Delivery available", "New drops every month", "Easy 7-day returns"].map(
                (t) => (
                  <span key={t} className="whitespace-nowrap text-sm uppercase tracking-wideish">
                    {t}
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
