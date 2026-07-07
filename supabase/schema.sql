-- Reference schema for UrbanFits.Store. Run this in the Supabase SQL editor
-- once you're ready to move off the localStorage mock layer (lib/storage.ts).
-- Table shapes mirror lib/types.ts so the swap is mostly a find-and-replace.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  category text not null,
  tags text[] default '{}',
  price integer not null,
  compare_at_price integer,
  colors jsonb default '[]',
  sizes text[] default '{}',
  variants jsonb default '[]',
  images jsonb default '[]',
  rating numeric default 0,
  review_count integer default 0,
  is_new boolean default false,
  is_flash_sale boolean default false,
  is_best_seller boolean default false,
  status text default 'draft',
  created_at timestamptz default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique not null,
  phone text,
  joined_at timestamptz default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  full_name text,
  line1 text,
  line2 text,
  city text,
  state text,
  pincode text,
  phone text,
  is_default boolean default false
);

create table if not exists orders (
  id text primary key,
  customer_id uuid references customers(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  address jsonb,
  items jsonb not null,
  subtotal integer not null,
  shipping integer default 0,
  tax integer default 0,
  discount integer default 0,
  total integer not null,
  coupon_code text,
  payment_method text default 'cod',
  payment_status text default 'pending',
  status text default 'placed',
  notes text,
  created_at timestamptz default now()
);

create table if not exists coupons (
  code text primary key,
  type text not null,
  value integer not null,
  min_purchase integer default 0,
  usage_limit integer default 0,
  used_count integer default 0,
  expires_at timestamptz,
  active boolean default true
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  author text,
  rating integer,
  comment text,
  approved boolean default false,
  created_at timestamptz default now()
);

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  cta_label text,
  cta_href text,
  gradient text,
  active boolean default true
);

-- Row Level Security: enable and add policies before going live.
-- Example (adjust to your auth model):
-- alter table orders enable row level security;
-- create policy "Customers can view own orders" on orders
--   for select using (auth.uid() = customer_id);
--
-- IMPORTANT — orders/customers are currently readable by anyone with the
-- anon key (i.e. by design right now, since there's no customer login to
-- scope by yet). /orders in the app lists every order in the store, not
-- just the current visitor's. Fine while testing; before real launch,
-- either add customer auth + RLS (uncomment above once wired in) or at
-- minimum don't publicize the /orders URL.

-- ---------------------------------------------------------------------
-- Admin login (Supabase Auth)
-- ---------------------------------------------------------------------
-- The admin panel now uses real Supabase Auth instead of a hardcoded
-- password. One-time setup:
--   1. Supabase Dashboard → Authentication → Users → Add user
--   2. Enter the email/password you want to log into /admin/login with
--   3. Add that same email to ADMIN_EMAILS in lib/admin-config.ts
-- Only emails in that allowlist can reach the admin panel, even if someone
-- else signs up on your Supabase project later.

-- ---------------------------------------------------------------------
-- Product photo storage bucket
-- ---------------------------------------------------------------------
-- Run this too (or create the bucket manually via Storage > New bucket
-- in the Supabase dashboard, named exactly "product-images", set Public).
-- If creating it here via SQL instead of the dashboard UI:
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Allow anyone to read images (needed so photos show on the public site).
create policy "Public read access for product images"
on storage.objects for select
using (bucket_id = 'product-images');

-- Allow uploads from the app (anon key). Fine for now since the admin
-- panel login is still a demo gate, not real auth — tighten this once
-- Supabase Auth is wired in for admin.
create policy "Anyone can upload product images"
on storage.objects for insert
with check (bucket_id = 'product-images');
