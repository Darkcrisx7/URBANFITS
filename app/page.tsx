import { Hero } from "@/components/home/hero";
import { Categories } from "@/components/home/categories";
import { Trending } from "@/components/home/trending";
import { PromoBanner } from "@/components/home/promo-banner";
import { Testimonials } from "@/components/home/testimonials";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { ProductGrid } from "@/components/product/product-grid";
import { Container, SectionHeading } from "@/components/ui/container";
import { getProducts, getBanners } from "@/lib/storage";

// Re-fetch from Supabase on every request so admin edits show up
// immediately on the live site instead of waiting for a redeploy.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const PRODUCTS = await getProducts();
  const banners = await getBanners();
  const featured = PRODUCTS.filter((p) => p.status === "published").slice(0, 8);
  const trending = PRODUCTS.filter((p) => p.isNew || p.isFlashSale);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller);

  return (
    <>
      <Hero featuredA={PRODUCTS[0]} featuredB={PRODUCTS[2]} />

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="This season" title="Featured Collection" />
          <ProductGrid products={featured} />
        </Container>
      </section>

      <Trending products={trending} />

      <Categories />

      {banners.filter((b) => b.active).map((b) => (
        <PromoBanner key={b.id} banner={b} />
      ))}

      <section className="py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Fan favorites" title="Best Sellers" />
          <ProductGrid products={bestSellers} />
        </Container>
      </section>

      <Testimonials />

      <section className="py-20 md:py-28">
        <Container className="flex flex-col items-center text-center">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest2 text-accent">
            Stay in the loop
          </p>
          <h2 className="font-display text-3xl font-medium tracking-tightest md:text-4xl">
            Get first access to new drops
          </h2>
          <p className="mt-3 max-w-md text-stone-500">
            10% off your first order when you sign up. No spam, just drops and restocks.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </Container>
      </section>
    </>
  );
}
