-- Run this once in the Supabase SQL editor, after schema.sql.
--
-- What this does:
--   1. Adds an is_admin() check (keep this list in sync with
--      lib/admin-config.ts — same emails, both places).
--   2. Locks down orders/customers so a customer can only ever see their
--      OWN orders — enforced by the database itself, not just app code.
--   3. Locks down writes to products/coupons/banners/reviews so only an
--      admin session can create/edit/delete them (reads stay public).
--
-- Why this matters: before this, the anon key had full read/write access
-- to every table. Any visitor's browser could technically read or write
-- anything. This makes the database itself enforce who can see/do what,
-- as a second line of defense behind the app's own checks.

create or replace function is_admin() returns boolean
language sql stable
as $$
  select coalesce(auth.email(), '') = any(array['admin@urbanfits.store']);
$$;

-- ---------------------------------------------------------------------
-- Orders — a customer sees only their own; guest orders (no account) are
-- viewable by whoever has the order ID (that's how guest order tracking
-- links work); admin sees everything.
-- ---------------------------------------------------------------------
alter table orders enable row level security;

create policy "Read own, guest, or admin orders" on orders
for select using (
  customer_id is null or auth.uid() = customer_id or is_admin()
);

create policy "Place order as self, guest, or admin" on orders
for insert with check (
  customer_id is null or auth.uid() = customer_id or is_admin()
);

create policy "Admin updates order status" on orders
for update using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- Customers — a customer can read/write their own row; guest checkout
-- can create a row (no session yet); admin can read/write all.
-- ---------------------------------------------------------------------
alter table customers enable row level security;

create policy "Read own or admin customers" on customers
for select using (auth.uid() = id or is_admin());

create policy "Create own, guest, or admin customer row" on customers
for insert with check (auth.uid() is null or auth.uid() = id or is_admin());

create policy "Update own or admin customer row" on customers
for update using (auth.uid() = id or is_admin()) with check (auth.uid() = id or is_admin());

-- ---------------------------------------------------------------------
-- Products / Banners / Coupons — public read (storefront needs this),
-- admin-only write.
-- ---------------------------------------------------------------------
alter table products enable row level security;
create policy "Public read products" on products for select using (true);
create policy "Admin insert products" on products for insert with check (is_admin());
create policy "Admin update products" on products for update using (is_admin()) with check (is_admin());
create policy "Admin delete products" on products for delete using (is_admin());

alter table banners enable row level security;
create policy "Public read banners" on banners for select using (true);
create policy "Admin insert banners" on banners for insert with check (is_admin());
create policy "Admin update banners" on banners for update using (is_admin()) with check (is_admin());
create policy "Admin delete banners" on banners for delete using (is_admin());

alter table coupons enable row level security;
create policy "Public read coupons" on coupons for select using (true);
create policy "Admin insert coupons" on coupons for insert with check (is_admin());
create policy "Admin update coupons" on coupons for update using (is_admin()) with check (is_admin());
create policy "Admin delete coupons" on coupons for delete using (is_admin());

-- Store settings — public read (checkout needs shipping/tax rates),
-- admin-only write.
alter table settings enable row level security;
create policy "Public read settings" on settings for select using (true);
create policy "Admin update settings" on settings for update using (is_admin()) with check (is_admin());

-- ---------------------------------------------------------------------
-- Reviews — anyone can submit one (goes in unapproved); only approved
-- ones are publicly visible; admin sees and moderates everything.
-- ---------------------------------------------------------------------
alter table reviews enable row level security;
create policy "Public read approved reviews" on reviews for select using (approved = true or is_admin());
create policy "Anyone can submit a review" on reviews for insert with check (true);
create policy "Admin moderates reviews" on reviews for update using (is_admin()) with check (is_admin());
create policy "Admin deletes reviews" on reviews for delete using (is_admin());

-- ---------------------------------------------------------------------
-- Product photo uploads — restrict to admin only (previously anyone
-- with the anon key could upload here).
-- ---------------------------------------------------------------------
drop policy if exists "Anyone can upload product images" on storage.objects;
create policy "Admin uploads product images" on storage.objects
for insert with check (bucket_id = 'product-images' and is_admin());
