"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Instagram, Twitter, Youtube, Phone, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NewsletterForm } from "@/components/home/newsletter-form";
import { CONTACT, whatsappLink } from "@/lib/contact";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <Container className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
        <div>
          <Image src="/logo.jpeg" alt="Urban Fits Streetwear" width={48} height={48} className="rounded-full" />
          <p className="mt-3 font-display text-xl font-semibold tracking-tightest">URBAN FITS</p>
          <p className="mt-4 max-w-xs text-sm text-stone-500">
            Engineered fits, made to last. Premium streetwear designed in-house, cut for movement.
          </p>
          <p className="mt-2 max-w-xs text-xs text-stone-400">
            Independently run by a small team in India — real humans behind every order.
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
          <p className="mb-4 text-xs font-semibold uppercase tracking-wideish text-stone-400">Contact</p>
          <ul className="space-y-3 text-sm text-stone-600">
            <li>
              <a href={`tel:${CONTACT.phone1.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-ink">
                <Phone size={14} /> {CONTACT.phone1}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT.phone2.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-ink">
                <Phone size={14} /> {CONTACT.phone2}
              </a>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 hover:text-ink">
                <Mail size={14} /> {CONTACT.email}
              </a>
            </li>
          </ul>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-medium text-white hover:bg-[#1ebc59]"
          >
            Chat on WhatsApp
          </a>
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
