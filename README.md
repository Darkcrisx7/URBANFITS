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
- Checkout → places a real order in the database, shows in Admin → Orders, generates a trackable
  order ID, and upserts a customer record
- Admin panel: dashboard with charts, full product CRUD, order status pipeline, coupons, banners,
  review moderation, customers, settings
- Admin login uses real Supabase Auth (email/password) — see `lib/admin-config.ts` for the allowlist
- Coupons, tax, shipping calculation, stock/low-stock indicators
- SEO: metadata, Open Graph, sitemap.xml, robots.txt, product structured data (JSON-LD)

**Stand-ins you'll want to replace before a real launch:**
- **Customer accounts** — customer-facing login/signup (`contexts/auth-context.tsx`) is still
  demo-only: any name/email "logs in" with no password check. See
  `lib/auth-supabase.example.ts` for the drop-in replacement using Supabase Auth. Cart and wishlist
  stay in localStorage regardless (that's fine — they're meant to be per-device).
- **Orders privacy** — `/orders` currently lists every order in the store, not just the logged-in
  customer's, since there's no real customer auth to scope by yet. Fine while testing; tighten this
  once customer accounts are wired in (see the note in `supabase/schema.sql`).
- **Email notifications** — order confirmation emails aren't sent; that needs a mail
  provider (e.g. Resend) wired into a serverless function.

## Payments

Only Cash on Delivery is implemented, as requested. If you ever want to add real online payment,
Stripe and Razorpay both have official Next.js integration guides — happy to wire those in as a
follow-up once you're ready.

## Deploying

This is a standard Next.js app — push to GitHub and import into Vercel, or run `vercel` from this
folder. No environment variables are required to run the current build.
