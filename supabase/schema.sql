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
