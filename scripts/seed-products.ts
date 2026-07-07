/**
 * One-time script: pushes the existing demo products (lib/mock-data.ts)
 * into your real Supabase `products` table, so you don't start from zero.
 *
 * Run once, after you've created your Supabase project and run
 * supabase/schema.sql AND supabase/rls.sql:
 *
 *   npx tsx scripts/seed-products.ts
 *
 * Safe to re-run — it upserts on `slug`, so it won't create duplicates.
 * After this, manage products through the admin panel, not this script.
 *
 * NOTE: once supabase/rls.sql is applied, product writes require an admin
 * session — the anon key alone can no longer insert products. This script
 * uses SUPABASE_SERVICE_ROLE_KEY if you add it to .env.local (Project
 * Settings → API → service_role key — keep this one secret, never expose
 * it with NEXT_PUBLIC_, never put it in the deployed app). Falls back to
 * the anon key, which only works before rls.sql has been run.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { PRODUCTS } from "../lib/mock-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const key = serviceKey ?? anonKey;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL and/or a key.\n" +
      "Add NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY (preferred) " +
      "or NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local first."
  );
  process.exit(1);
}
if (!serviceKey) {
  console.warn(
    "No SUPABASE_SERVICE_ROLE_KEY found — using the anon key instead. " +
      "This will fail with a permissions error if supabase/rls.sql has already been run."
  );
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
