"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Product } from "@/lib/types";
import { HeroScene } from "@/components/home/hero-scene";

export function Hero({ featuredA, featuredB }: { featuredA?: Product; featuredB?: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setLoaded(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={ref} className="relative -mt-20 h-[100svh] min-h-[640px] w-full overflow-hidden bg-void">
      {/* Signature scene — layered parallax glow + chrome grid, mouse-reactive */}
      <HeroScene />

      {/* Cinematic vignette + grain-like gradient for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(11,11,13,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-void to-transparent" />

      <motion.div style={{ opacity }} className="relative z-10 flex h-full items-center pt-20">
        <Container>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs font-medium uppercase tracking-widest3 text-chrome-bright"
          >
            Autumn / Winter 2026 — Drop 01
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-3xl font-display text-[13vw] font-medium leading-[0.92] tracking-tighter2 text-bone sm:text-7xl md:text-8xl"
          >
            Engineered
            <br />
            for movement.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-md text-base text-silver/70"
          >
            Heavyweight fabrics, deliberate cuts, zero compromise. UrbanFits is streetwear built
            like outerwear — designed in-house, made to outlast the season.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Link href="/shop">
              <Button size="lg">
                Shop Now <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/shop?tag=new">
              <Button size="lg" variant="secondary">
                New Collection
              </Button>
            </Link>
          </motion.div>
        </Container>

        {featuredA && (
          <motion.div
            style={{ y: y1 }}
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={loaded ? { opacity: 1, scale: 1, rotate: -6 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-[6%] top-16 hidden w-52 rounded-2xl border border-white/10 bg-graphite/80 p-3 shadow-glass backdrop-blur-xl lg:block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {featuredA.images[0].url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredA.images[0].url} alt={featuredA.name} className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${featuredA.images[0].gradient}`} />
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-bone">{featuredA.name}</p>
            <p className="font-mono text-xs font-semibold text-chrome-bright">{formatCurrency(featuredA.price)}</p>
          </motion.div>
        )}

        {featuredB && (
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={loaded ? { opacity: 1, scale: 1, rotate: 8 } : {}}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-24 right-[20%] hidden w-44 rounded-2xl border border-white/10 bg-graphite/80 p-3 shadow-glass backdrop-blur-xl xl:block"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
              {featuredB.images[0].url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredB.images[0].url} alt={featuredB.name} className="h-full w-full object-cover" />
              ) : (
                <div className={`h-full w-full bg-gradient-to-br ${featuredB.images[0].gradient}`} />
              )}
            </div>
            <p className="mt-2 text-xs font-medium text-bone">{featuredB.name}</p>
            <p className="font-mono text-xs font-semibold text-chrome-bright">{formatCurrency(featuredB.price)}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Marquee strip, spec-sheet mono style */}
      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/10 bg-void/60 py-3 backdrop-blur-sm">
        <div className="marquee-track animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0 items-center gap-10 pr-10 font-mono text-[11px] uppercase tracking-widest2 text-chrome">
              <span>Free shipping over ₹2000</span>
              <span>Cash on delivery available</span>
              <span>New drops every month</span>
              <span>Easy 7-day returns</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
