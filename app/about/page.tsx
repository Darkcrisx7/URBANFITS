import { Container } from "@/components/ui/container";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <Container className="max-w-3xl py-16">
      <p className="text-xs font-semibold uppercase tracking-widest2 text-accent">Our Story</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tightest md:text-5xl">
        Built for people who move.
      </h1>
      <div className="mt-8 space-y-5 text-stone-600">
        <p>
          UrbanFits.Store started as a small drop of oversized tees between friends who were tired of
          streetwear that looked heavy but felt cheap. Every piece we make now goes through the same
          test: does it hold up to daily wear, and does it still look intentional after the twentieth
          wash.
        </p>
        <p>
          We work with a small number of mills for our fleece and jersey, keep our color palette
          disciplined, and release in small, considered drops rather than chasing every trend. Less
          noise, better fabric, fits that actually last.
        </p>
        <p>
          Every order ships with Cash on Delivery available across India, backed by a straightforward
          7-day return window — no fine print.
        </p>
      </div>
    </Container>
  );
}
