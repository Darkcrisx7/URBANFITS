# Urban Fits Streetwear — Storefront Scaffold

A full Next.js 15 + TypeScript + Tailwind ecommerce scaffold for Urban Fits, checkout via **Cash on
Delivery only** (no Stripe/Razorpay wired in, per your request).

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Admin panel is at `/admin/login`:

```
email:    admin@urbanfits.store
password: urbanfits123
```

## What's real vs. what's a stand-in

**Fully functional right now (client-side, backed by localStorage):**
- Full storefront: home, shop with filters/sort/search, category pages, product detail, cart,
  wishlist, recently viewed, related products
- Checkout → places a real order object, shows in Admin → Orders, generates a trackable order ID
- Admin panel: dashboard with charts, full product CRUD, order status pipeline, coupons, banners,
  review moderation, customers, settings — all persisted to the browser's localStorage
- Coupons, tax, shipping calculation, stock/low-stock indicators
- SEO: metadata, Open Graph, sitemap.xml, robots.txt, product structured data (JSON-LD)

**Stand-ins you'll want to replace before a real launch:**
- **Product photography** — there are no real product photos yet, so each product uses an
  art-directed gradient block as a placeholder image (`lib/mock-data.ts` → `images`). Swap these
  for real Cloudinary URLs.
- **Auth** — login/signup/admin login are demo-only (`contexts/auth-context.tsx`,
  `app/admin/login/page.tsx`). No passwords are actually checked against a database. See
  `lib/auth-supabase.example.ts` for the drop-in replacement using Supabase Auth (email/password +
  Google).
- **Database** — everything lives in the browser's localStorage (`lib/storage.ts`), which means
  data doesn't sync across devices or persist if a customer clears their browser. `supabase/schema.sql`
  has a ready-to-run schema matching the app's data shapes; swapping `lib/storage.ts`'s functions for
  Supabase queries is the main integration step.
- **Email notifications** — order confirmation emails aren't sent; that needs a mail
  provider (e.g. Resend) wired into a serverless function once you have a backend.

## Payments

Only Cash on Delivery is implemented, as requested. If you ever want to add real online payment,
Stripe and Razorpay both have official Next.js integration guides — happy to wire those in as a
follow-up once you're ready.

## Deploying

This is a standard Next.js app — push to GitHub and import into Vercel, or run `vercel` from this
folder. No environment variables are required to run the current build.
