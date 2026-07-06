"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/container";
import { Rating } from "@/components/ui/rating";
import { TESTIMONIALS } from "@/lib/mock-data";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const t = TESTIMONIALS[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
      <Container className="relative">
        <SectionHeading eyebrow="Word on the street" title="What people say" />
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <Quote className="mx-auto mb-4 text-accent" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-lg font-medium">"{t.quote}"</p>
              <div className="mt-4 flex justify-center">
                <Rating value={t.rating} />
              </div>
              <p className="mt-3 text-sm text-stone-400">{t.author}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex justify-center gap-3">
            <button
              onClick={() => go(-1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/60"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => go(1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:border-white/60"
              aria-label="Next testimonial"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
