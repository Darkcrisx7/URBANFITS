# Urban Fits Streetwear — Storefront

A Next.js 15 + TypeScript + Tailwind ecommerce site for Urban Fits, checkout via **Cash on
Delivery only** (no Stripe/Razorpay wired in, per your request).

## Run it locally

```bash
npm install
npm run dev
```

You'll need a Supabase project — see `.env.local` setup below. Admin panel is at `/admin/login`;
log in with the email/password you create for yourself in Supabase Auth (see
`supabase/schema.sql` for the one-time setup steps).

## What's real vs. what's a stand-in

**Fully functional right now, backed by a real Supabase database:**
- Full storefront: home, shop with filters/sort/search, category pages, product detail, cart,
  wishlist, recently viewed, related products
- Products, orders, coupons, banners, and reviews all read/write to Supabase — admin edits show up
  on the live site immediately, for every visitor, not just your own browser
- Product photo upload (admin → Products → Photos) — stored in Supabase Storage
- Checkout → places a real order in the database, shows in Admin → Orders, generates an
  unguessable trackable order ID, and upserts a customer record
- Admin panel: dashboard with charts, full product CRUD, order status pipeline, coupons, banners,
  review moderation, customers, settings
- Admin login uses real Supabase Auth (email/password) — see `lib/admin-config.ts` for the allowlist
- **Customer accounts** — real signup/login via Supabase Auth (`contexts/auth-context.tsx`).
  Logged-in customers only ever see their own orders at `/orders`, enforced both in the app and by
  Postgres Row Level Security (`supabase/rls.sql`) — even a compromised anon key couldn't read
  another customer's orders. Guest checkout is still allowed (no account required to buy); those
  orders are viewable only via their own tracking link, not listed anywhere.
- Coupons, tax, shipping calculation, stock/low-stock indicators
- SEO: metadata, Open Graph, sitemap.xml, robots.txt, product structured data (JSON-LD)

**Stand-ins you'll want to replace before a real launch:**
- **Email notifications** — order confirmation emails aren't sent; that needs a mail
  provider (e.g. Resend) wired into a serverless function.
- **Payments** — Cash on Delivery only (see below).
- **Password reset** — there's no "forgot password" flow yet for customer accounts.

## Setup

After `supabase/schema.sql`, also run `supabase/rls.sql` once — it locks down who can read/write
what (customers only see their own orders, only an admin session can write products/coupons/etc).
Do this before you seed products or go live; see the seed script's notes for how it uses the
service role key once RLS is active.

## Payments

Only Cash on Delivery is implemented, as requested. If you ever want to add real online payment,
Stripe and Razorpay both have official Next.js integration guides — happy to wire those in as a
follow-up once you're ready.

## Deploying

This is a standard Next.js app — push to GitHub and import into Vercel, or run `vercel` from this
folder. No environment variables are required to run the current build.
