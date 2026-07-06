"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/container";
import { CATEGORIES } from "@/lib/mock-data";

const tileGradients = [
  "from-stone-900 to-stone-700",
  "from-accent to-stone-900",
  "from-stone-800 to-black",
  "from-stone-700 to-stone-500",
  "from-black to-accent",
  "from-stone-900 to-stone-600",
  "from-stone-800 to-stone-950",
];

export function Categories() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Shop by" title="Category" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link key={c.key} href={`/shop/${c.key}`}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br p-5 ${tileGradients[i % tileGradients.length]}`}
              >
                <div className="flex h-full flex-col justify-end text-paper">
                  <p className="font-display text-xl font-medium">{c.label}</p>
                  <p className="text-xs text-white/70">{c.blurb}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
