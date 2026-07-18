"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/container";
import { CATEGORIES } from "@/lib/mock-data";

const tileGradients = [
  "from-graphite2 to-graphite",
  "from-chrome-dim to-graphite",
  "from-graphite to-void",
  "from-graphite2 to-void",
  "from-void to-chrome-dim",
  "from-graphite to-graphite2",
  "from-graphite2 to-void",
];

export function Categories() {
  return (
    <section className="bg-void py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Shop by" title="Category" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <Link key={c.key} href={`/shop/${c.key}`}>
              <motion.div
                whileHover={{ y: -6, rotateX: 4, rotateY: -4 }}
                transition={{ duration: 0.3 }}
                style={{ transformPerspective: 800 }}
                className={`group relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br p-5 ${tileGradients[i % tileGradients.length]}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/[0.03] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex h-full flex-col justify-end text-bone">
                  <p className="font-display text-xl font-medium">{c.label}</p>
                  <p className="text-xs text-silver/60">{c.blurb}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
