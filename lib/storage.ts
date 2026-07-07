import { Product, Order, Coupon, Banner, Review, Customer } from "./types";
import { supabase, PRODUCT_IMAGES_BUCKET } from "./supabase-client";

/**
 * This module is a thin "database" wrapper. Products, orders, coupons,
 * banners, reviews, and customers all read/write straight to Supabase now.
 * Cart, wishlist, and the logged-in "who am I" flag stay in localStorage —
 * that's fine, since those are meant to be per-device/session, not shared.
 * Admin auth is now real Supabase Auth (see app/admin/login/page.tsx).
 * Customer-facing signup/login is still a placeholder (phase 3).
 */

// ---------- Products (Supabase-backed) ----------

// Maps a Supabase `products` row (snake_case, per supabase/schema.sql) to
// the app's Product type (camelCase, per lib/types.ts).
function rowToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: row.category,
    tags: row.tags ?? [],
    price: row.price,
    compareAtPrice: row.compare_at_price ?? undefined,
    currency: "INR",
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    variants: row.variants ?? [],
    images: row.images && row.images.length > 0 ? row.images : [{ gradient: "from-stone-800 to-stone-950", label: "Product" }],
    rating: Number(row.rating ?? 0),
    reviewCount: row.review_count ?? 0,
    isNew: row.is_new ?? false,
    isFlashSale: row.is_flash_sale ?? false,
    isBestSeller: row.is_best_seller ?? false,
    status: row.status ?? "draft",
    createdAt: row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

// Maps a Product back to the shape the `products` table expects.
function productToRow(product: Product) {
  return {
    // Only include id if it looks like a real uuid already assigned by
    // Supabase; brand-new products created client-side use a temporary
    // `p_<timestamp>` id which we drop so Postgres generates a real uuid.
    ...(product.id && !product.id.startsWith("p_") ? { id: product.id } : {}),
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    tags: product.tags,
    price: product.price,
    compare_at_price: product.compareAtPrice ?? null,
    colors: product.colors,
    sizes: product.sizes,
    variants: product.variants,
    images: product.images,
    rating: product.rating,
    review_count: product.reviewCount,
    is_new: product.isNew,
    is_flash_sale: product.isFlashSale,
    is_best_seller: product.isBestSeller,
    status: product.status,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getProducts] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).maybeSingle();
  if (error || !data) return null;
  return rowToProduct(data);
}

export async function upsertProduct(product: Product): Promise<Product | null> {
  const row = productToRow(product);
  const { data, error } = await supabase.from("products").upsert(row).select().single();
  if (error) {
    console.error("[upsertProduct] Supabase error:", error.message);
    throw error;
  }
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) console.error("[deleteProduct] Supabase error:", error.message);
}

// Uploads a product photo to the `product-images` Supabase Storage bucket
// and returns its public URL. Throws on failure so the caller can show a
// toast — see the bucket setup instructions in supabase/schema.sql.
export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

const KEYS = {
  cart: "uf_cart",
  wishlist: "uf_wishlist",
  auth: "uf_auth",
  addresses: "uf_addresses",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Orders (Supabase-backed) ----------
function rowToOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id ?? undefined,
    customerName: row.customer_name ?? "",
    customerEmail: row.customer_email ?? "",
    customerPhone: row.customer_phone ?? "",
    items: row.items ?? [],
    address: row.address ?? ({} as any),
    subtotal: row.subtotal ?? 0,
    shipping: row.shipping ?? 0,
    tax: row.tax ?? 0,
    discount: row.discount ?? 0,
    total: row.total ?? 0,
    couponCode: row.coupon_code ?? undefined,
    paymentMethod: row.payment_method ?? "cod",
    paymentStatus: row.payment_status ?? "pending",
    status: row.status ?? "placed",
    notes: row.notes ?? undefined,
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function orderToRow(order: Order) {
  return {
    id: order.id,
    customer_id: order.customerId ?? null,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_phone: order.customerPhone,
    address: order.address,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    tax: order.tax,
    discount: order.discount,
    total: order.total,
    coupon_code: order.couponCode ?? null,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    status: order.status,
    notes: order.notes ?? null,
  };
}

// ADMIN ONLY — returns every order in the store. RLS (see supabase/rls.sql)
// enforces this at the database level too: only a signed-in admin session
// can actually read every row here, everyone else gets just their own.
export async function getOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[getOrders] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToOrder);
}

// Customer-facing — only the signed-in customer's own orders. Backed by
// the same RLS policy, so even if this filter were removed, the database
// itself would refuse to return anyone else's orders to a normal customer.
export async function getMyOrders(customerId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[getMyOrders] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToOrder);
}

export async function saveOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").insert(orderToRow(order));
  if (error) {
    console.error("[saveOrder] Supabase error:", error.message);
    throw new Error(error.message);
  }
}

export async function updateOrder(order: Order): Promise<void> {
  const { error } = await supabase.from("orders").update(orderToRow(order)).eq("id", order.id);
  if (error) {
    console.error("[updateOrder] Supabase error:", error.message);
    throw new Error(error.message);
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase.from("orders").select("*").eq("id", id).maybeSingle();
  if (error || !data) return null;
  return rowToOrder(data);
}

// ---------- Coupons (Supabase-backed) ----------
function rowToCoupon(row: any): Coupon {
  return {
    code: row.code,
    type: row.type,
    value: row.value,
    minPurchase: row.min_purchase ?? 0,
    usageLimit: row.usage_limit ?? 0,
    usedCount: row.used_count ?? 0,
    expiresAt: row.expires_at ?? "",
    active: row.active ?? true,
  };
}

function couponToRow(c: Coupon) {
  return {
    code: c.code,
    type: c.type,
    value: c.value,
    min_purchase: c.minPurchase,
    usage_limit: c.usageLimit,
    used_count: c.usedCount,
    expires_at: c.expiresAt || null,
    active: c.active,
  };
}

export async function getCoupons(): Promise<Coupon[]> {
  const { data, error } = await supabase.from("coupons").select("*");
  if (error) {
    console.error("[getCoupons] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToCoupon);
}

// Replaces the full coupon list: upserts everything passed in, and deletes
// any existing coupon whose code is no longer present (keeps the admin
// page's "edit the whole array" pattern working against a real table).
export async function saveCoupons(coupons: Coupon[]): Promise<void> {
  const existing = await getCoupons();
  const keepCodes = new Set(coupons.map((c) => c.code));
  const toDelete = existing.filter((c) => !keepCodes.has(c.code)).map((c) => c.code);
  if (toDelete.length) await supabase.from("coupons").delete().in("code", toDelete);
  if (coupons.length) {
    const { error } = await supabase.from("coupons").upsert(coupons.map(couponToRow));
    if (error) console.error("[saveCoupons] Supabase error:", error.message);
  }
}

// ---------- Banners (Supabase-backed) ----------
function rowToBanner(row: any): Banner {
  return {
    id: row.id,
    title: row.title ?? "",
    subtitle: row.subtitle ?? "",
    ctaLabel: row.cta_label ?? "",
    ctaHref: row.cta_href ?? "",
    gradient: row.gradient ?? "from-black via-stone-900 to-accent",
    active: row.active ?? true,
  };
}

function bannerToRow(b: Banner) {
  return {
    ...(b.id && !b.id.startsWith("b_") ? { id: b.id } : {}),
    title: b.title,
    subtitle: b.subtitle,
    cta_label: b.ctaLabel,
    cta_href: b.ctaHref,
    gradient: b.gradient,
    active: b.active,
  };
}

export async function getBanners(): Promise<Banner[]> {
  const { data, error } = await supabase.from("banners").select("*");
  if (error) {
    console.error("[getBanners] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToBanner);
}

export async function saveBanners(banners: Banner[]): Promise<void> {
  const existing = await getBanners();
  const keepIds = new Set(banners.filter((b) => !b.id.startsWith("b_")).map((b) => b.id));
  const toDelete = existing.filter((b) => !keepIds.has(b.id)).map((b) => b.id);
  if (toDelete.length) await supabase.from("banners").delete().in("id", toDelete);
  if (banners.length) {
    const { error } = await supabase.from("banners").upsert(banners.map(bannerToRow));
    if (error) console.error("[saveBanners] Supabase error:", error.message);
  }
}

// ---------- Reviews (Supabase-backed) ----------
function rowToReview(row: any): Review {
  return {
    id: row.id,
    productId: row.product_id,
    author: row.author ?? "Anonymous",
    rating: row.rating ?? 5,
    comment: row.comment ?? "",
    date: row.created_at ? String(row.created_at).slice(0, 10) : new Date().toISOString().slice(0, 10),
    approved: row.approved ?? false,
  };
}

function reviewToRow(r: Review) {
  return {
    ...(r.id && !r.id.startsWith("r_") ? { id: r.id } : {}),
    product_id: r.productId,
    author: r.author,
    rating: r.rating,
    comment: r.comment,
    approved: r.approved,
  };
}

export async function getReviews(): Promise<Review[]> {
  const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("[getReviews] Supabase error:", error.message);
    return [];
  }
  return (data ?? []).map(rowToReview);
}

export async function saveReviews(reviews: Review[]): Promise<void> {
  const existing = await getReviews();
  const keepIds = new Set(reviews.filter((r) => !r.id.startsWith("r_")).map((r) => r.id));
  const toDelete = existing.filter((r) => !keepIds.has(r.id)).map((r) => r.id);
  if (toDelete.length) await supabase.from("reviews").delete().in("id", toDelete);
  if (reviews.length) {
    const { error } = await supabase.from("reviews").upsert(reviews.map(reviewToRow));
    if (error) console.error("[saveReviews] Supabase error:", error.message);
  }
}

// The product's `rating` / `review_count` columns are a cached summary —
// they don't recalculate automatically when a review is approved, hidden,
// or deleted, so admin review actions call this afterward to keep the
// product page's star rating accurate.
export async function syncProductRatingFromReviews(productId: string): Promise<void> {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("approved", true);
  if (error) {
    console.error("[syncProductRatingFromReviews] Supabase error:", error.message);
    return;
  }
  const ratings = (data ?? []).map((r: any) => r.rating as number);
  const reviewCount = ratings.length;
  const rating = reviewCount ? Math.round((ratings.reduce((s, r) => s + r, 0) / reviewCount) * 10) / 10 : 0;
  await supabase.from("products").update({ rating, review_count: reviewCount }).eq("id", productId);
}

// ---------- Customers (Supabase-backed) ----------
// ordersCount / totalSpent aren't stored columns — they're computed from
// the orders table so they're always accurate without a separate sync step.
export async function getCustomers(): Promise<Customer[]> {
  const [{ data: customerRows, error }, orders] = await Promise.all([
    supabase.from("customers").select("*"),
    getOrders(),
  ]);
  if (error) {
    console.error("[getCustomers] Supabase error:", error.message);
    return [];
  }
  return (customerRows ?? []).map((row: any) => {
    const theirOrders = orders.filter((o) => o.customerEmail === row.email);
    return {
      id: row.id,
      name: row.name ?? "",
      email: row.email,
      phone: row.phone ?? "",
      ordersCount: theirOrders.length,
      totalSpent: theirOrders.reduce((s, o) => s + o.total, 0),
      joinedAt: row.joined_at ? String(row.joined_at).slice(0, 10) : "",
    };
  });
}

// Ensures a customers row exists for this email (called at checkout) —
// upserts on email so repeat customers don't create duplicates.
// For guest checkout — no logged-in customer id, so upsert on email instead.
export async function upsertCustomerByEmail(name: string, email: string, phone: string): Promise<void> {
  const { error } = await supabase.from("customers").upsert({ name, email, phone }, { onConflict: "email" });
  if (error) {
    console.error("[upsertCustomerByEmail] Supabase error:", error.message);
    throw new Error(error.message);
  }
}

// For a logged-in customer — id must be their Supabase auth user id, so
// that RLS policies (auth.uid() = id) and order scoping line up correctly.
// phone is optional so callers that don't have it yet (e.g. right after
// signup) don't accidentally overwrite a phone number saved at checkout.
export async function upsertCustomerRecord(id: string, name: string, email: string, phone?: string): Promise<void> {
  const payload: Record<string, string> = { id, name, email };
  if (phone) payload.phone = phone;
  const { error } = await supabase.from("customers").upsert(payload, { onConflict: "id" });
  if (error) {
    console.error("[upsertCustomerRecord] Supabase error:", error.message);
    throw new Error(error.message);
  }
}

// ---------- Cart / Wishlist (client-only, per browser) ----------
export function getCartRaw() {
  return read(KEYS.cart, [] as { productId: string; size: string; color: string; quantity: number }[]);
}
export function setCartRaw(cart: { productId: string; size: string; color: string; quantity: number }[]) {
  write(KEYS.cart, cart);
}
export function getWishlistRaw() {
  return read(KEYS.wishlist, [] as string[]);
}
export function setWishlistRaw(ids: string[]) {
  write(KEYS.wishlist, ids);
}

// ---------- Mock Customer Auth ----------
// IMPORTANT: This is still a placeholder for local development/demo purposes
// only — no password check, no verification email, no server session.
// Admin login now uses real Supabase Auth (see app/admin/login/page.tsx);
// customer-facing signup/login is next (phase 3).
export function getAuth() {
  return read<{ id: string; name: string; email: string } | null>(KEYS.auth, null);
}
export function setAuth(user: { id: string; name: string; email: string } | null) {
  write(KEYS.auth, user);
}

export function getAddresses() {
  return read(KEYS.addresses, [] as import("./types").Address[]);
}
export function setAddresses(addresses: import("./types").Address[]) {
  write(KEYS.addresses, addresses);
}
