"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/home/newsletter-form";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo.jpeg" alt="Urban Fits Streetwear" width={48} height={48} className="rounded-full" />
          <p className="mt-3 font-display text-xl font-semibold tracking-tightest">URBAN FITS</p>
          <p className="mt-4 max-w-xs text-sm text-stone-500">
            Engineered fits, made to last. Premium streetwear designed in-house, cut for movement.
          </p>
          <div className="mt-6 flex gap-4 text-stone-500">
            <Instagram size={18} className="cursor-pointer hover:text-ink" />
            <Twitter size={18} className="cursor-pointer hover:text-ink" />
            <Youtube size={18} className="cursor-pointer hover:text-ink" />
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wideish text-stone-400">Company</p>
          <ul className="space-y-3 text-sm text-stone-600">
            <li><Link href="/about" className="hover:text-ink">About</Link></li>
            <li><Link href="/contact" className="hover:text-ink">Contact</Link></li>
            <li><Link href="/shop" className="hover:text-ink">Shop</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wideish text-stone-400">Policies</p>
          <ul className="space-y-3 text-sm text-stone-600">
            <li><Link href="/policies/privacy" className="hover:text-ink">Privacy Policy</Link></li>
            <li><Link href="/policies/terms" className="hover:text-ink">Terms of Service</Link></li>
            <li><Link href="/policies/refund" className="hover:text-ink">Refund Policy</Link></li>
            <li><Link href="/policies/shipping" className="hover:text-ink">Shipping Policy</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wideish text-stone-400">Stay in the loop</p>
          <NewsletterForm compact />
        </div>
      </Container>
      <div className="border-t border-stone-200 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-stone-400 md:flex-row">
          <p>© {new Date().getFullYear()} UrbanFits.Store. All rights reserved.</p>
          <p>Cash on Delivery available across India.</p>
        </Container>
      </div>
    </footer>
  );
}
