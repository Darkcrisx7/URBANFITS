import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { Trending } from "@/components/home/trending";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductGrid } from "@/components/product/product-grid";
import { Container, SectionHeading } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { getProducts, getBanners, getSettings } from "@/lib/storage";

// Re-fetch from Supabase on every request so admin edits show up
// immediately on the live site instead of waiting for a redeploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const PRODUCTS = await getProducts();
  const banners = await getBanners();
  const settings = await getSettings();
  const featured = PRODUCTS.filter((p) => p.status === "published").slice(0, 8);
  const trending = PRODUCTS.filter((p) => p.isNew || p.isFlashSale);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <>
      <Hero featuredA={PRODUCTS[0]} featuredB={PRODUCTS[2]} freeShippingThreshold={settings.freeShippingThreshold} />

      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="This season" title="Featured Collection" />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductGrid products={featured} />
          </Reveal>
        </Container>
      </section>

      <Reveal>
        <Trending products={trending} />
      </Reveal>

      <Reveal>
        <Categories />
      </Reveal>

      {banners.filter((b) => b.active).map((b) => (
        <Reveal key={b.id}>
          <PromoBanner banner={b} />
        </Reveal>
      ))}

      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Fan favorites" title="Best Sellers" />
          </Reveal>
          <Reveal delay={0.1}>
            <ProductGrid products={bestSellers} />
          </Reveal>
        </Container>
      </section>

      <Reveal>
        <Testimonials />
      </Reveal>

      <section className="py-20 md:py-28">
        <Container className="flex flex-col items-center text-center">
          <Reveal className="flex flex-col items-center">
            <p className="mb-2 font-mono text-xs font-medium uppercase tracking-widest3 text-chrome">
              Stay in the loop
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tightest text-bone md:text-4xl">
              Get first access to new drops
            </h2>
            <p className="mt-3 max-w-md text-silver/60">
              10% off your first order when you sign up. No spam, just drops and restocks.
            </p>
            <div className="mt-6">
              <NewsletterForm />
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
