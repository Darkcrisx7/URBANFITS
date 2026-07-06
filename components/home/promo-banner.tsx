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
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${banner.gradient} px-8 py-20 text-paper md:px-16 md:py-28`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.25),transparent_50%)]" />
        <div className="relative max-w-xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest2 text-accent">Limited Drop</p>
          <h2 className="font-display text-4xl font-medium tracking-tightest md:text-6xl">
            {banner.title}
          </h2>
          <p className="mt-4 text-stone-300">{banner.subtitle}</p>
          <Link href={banner.ctaHref}>
            <Button size="lg" variant="accent" className="mt-8">
              {banner.ctaLabel} <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
