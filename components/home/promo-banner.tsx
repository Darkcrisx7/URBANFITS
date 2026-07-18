"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Banner } from "@/lib/types";

export function PromoBanner({ banner }: { banner: Banner }) {
  return (
    <section className="px-5 py-4 md:px-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${banner.gradient} px-8 py-20 text-bone md:px-16 md:py-28`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,147,166,0.2),transparent_50%)]" />
        <div className="relative max-w-xl">
          <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest3 text-chrome-bright">Limited Drop</p>
          <h2 className="font-display text-4xl font-medium tracking-tightest md:text-6xl">
            {banner.title}
          </h2>
          <p className="mt-4 text-silver/70">{banner.subtitle}</p>
          <Link href={banner.ctaHref}>
            <Button size="lg" variant="primary" className="mt-8">
              {banner.ctaLabel} <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
