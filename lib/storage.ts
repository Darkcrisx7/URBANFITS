"use client";

import { Product, Order, Coupon, Banner, Review, Customer } from "./types";
import { PRODUCTS, COUPONS, BANNERS, REVIEWS, CUSTOMERS } from "./mock-data";

/**
 * This module is a thin, swappable "database" wrapper around localStorage.
 * Every function here has a name and shape that maps 1:1 to what a real
 * Supabase query would look like (getProducts, saveOrder, updateProduct...).
 * When you're ready to go live:
 *   1. Create a Supabase project and run the schema in /supabase/schema.sql
 *   2. Replace the body of each function below with the matching
 *      `supabase.from(...)` call.
 *   3. Nothing calling these functions needs to change.
 */

const KEYS = {
  products: "uf_products",
  orders: "uf_orders",
  coupons: "uf_coupons",
  banners: "uf_banners",
  reviews: "uf_reviews",
  customers: "uf_customers",
  cart: "uf_cart",
  wishlist: "uf_wishlist",
  auth: "uf_auth",
  adminAuth: "uf_admin_auth",
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

function seedOnce() {
  if (typeof window === "undefined") return;
  if (!window.localStorage.getItem(KEYS.products)) write(KEYS.products, PRODUCTS);
  if (!window.localStorage.getItem(KEYS.coupons)) write(KEYS.coupons, COUPONS);
  if (!window.localStorage.getItem(KEYS.banners)) write(KEYS.banners, BANNERS);
  if (!window.localStorage.getItem(KEYS.reviews)) write(KEYS.reviews, REVIEWS);
  if (!window.localStorage.getItem(KEYS.customers)) write(KEYS.customers, CUSTOMERS);
  if (!window.localStorage.getItem(KEYS.orders)) write(KEYS.orders, []);
}

// ---------- Products ----------
export function getProducts(): Product[] {
  seedOnce();
  return read(KEYS.products, PRODUCTS);
}

export function saveProducts(products: Product[]) {
  write(KEYS.products, products);
}

export function upsertProduct(product: Product) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === product.id);
  if (idx >= 0) products[idx] = product;
  else products.unshift(product);
  saveProducts(products);
}

export function deleteProduct(id: string) {
  saveProducts(getProducts().filter((p) => p.id !== id));
}

// ---------- Orders ----------
export function getOrders(): Order[] {
  seedOnce();
  return read(KEYS.orders, []);
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  orders.unshift(order);
  write(KEYS.orders, orders);
}

export function updateOrder(order: Order) {
  const orders = getOrders().map((o) => (o.id === order.id ? order : o));
  write(KEYS.orders, orders);
}

// ---------- Coupons ----------
export function getCoupons(): Coupon[] {
  seedOnce();
  return read(KEYS.coupons, COUPONS);
}

export function saveCoupons(coupons: Coupon[]) {
  write(KEYS.coupons, coupons);
}

// ---------- Banners ----------
export function getBanners(): Banner[] {
  seedOnce();
  return read(KEYS.banners, BANNERS);
}

export function saveBanners(banners: Banner[]) {
  write(KEYS.banners, banners);
}

// ---------- Reviews ----------
export function getReviews(): Review[] {
  seedOnce();
  return read(KEYS.reviews, REVIEWS);
}

export function saveReviews(reviews: Review[]) {
  write(KEYS.reviews, reviews);
}

// ---------- Customers ----------
export function getCustomers(): Customer[] {
  seedOnce();
  return read(KEYS.customers, CUSTOMERS);
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

// ---------- Mock Auth ----------
// IMPORTANT: This is a placeholder for local development/demo purposes only.
// It stores a plain-text flag in localStorage and provides zero real
// security. Before launch, replace with real Supabase Auth (email/password
// + Google OAuth) as scaffolded in /lib/auth-supabase.example.ts.
export function getAuth() {
  return read<{ id: string; name: string; email: string } | null>(KEYS.auth, null);
}
export function setAuth(user: { id: string; name: string; email: string } | null) {
  write(KEYS.auth, user);
}
export function getAdminAuth() {
  return read<boolean>(KEYS.adminAuth, false);
}
export function setAdminAuth(value: boolean) {
  write(KEYS.adminAuth, value);
}

export function getAddresses() {
  return read(KEYS.addresses, [] as import("./types").Address[]);
}
export function setAddresses(addresses: import("./types").Address[]) {
  write(KEYS.addresses, addresses);
}
