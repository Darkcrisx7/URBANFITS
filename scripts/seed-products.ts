/**
 * One-time script: pushes the existing demo products (lib/mock-data.ts)
 * into your real Supabase `products` table, so you don't start from zero.
 *
 * Run once, after you've created your Supabase project and run
 * supabase/schema.sql:
 *
 *   npx tsx scripts/seed-products.ts
 *
 * Safe to re-run — it upserts on `slug`, so it won't create duplicates.
 * After this, manage products through the admin panel, not this script.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../lib/mock-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.\n" +
      "Add them to a .env.local file in the project root first."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

function toRow(p: (typeof PRODUCTS)[number]) {
  return {
    slug: p.slug,
    name: p.name,
    description: p.description,
    category: p.category,
    tags: p.tags,
    price: p.price,
    compare_at_price: p.compareAtPrice ?? null,
    colors: p.colors,
    sizes: p.sizes,
    variants: p.variants,
    images: p.images,
    rating: p.rating,
    review_count: p.reviewCount,
    is_new: p.isNew,
    is_flash_sale: p.isFlashSale,
    is_best_seller: p.isBestSeller,
    status: p.status,
  };
}

async function main() {
  const rows = PRODUCTS.map(toRow);
  const { data, error } = await supabase.from("products").upsert(rows, { onConflict: "slug" }).select();
  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
  console.log(`Seeded ${data?.length ?? 0} products into Supabase.`);
}

main();
