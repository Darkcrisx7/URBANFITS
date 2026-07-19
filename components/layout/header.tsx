"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, ShoppingBag, User, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/contexts/cart-context";
import { useWishlist } from "@/contexts/wishlist-context";
import { CATEGORIES } from "@/lib/mock-data";

// Rendered outside the header via a portal — the header has backdrop-blur,
// and CSS backdrop-filter secretly creates a new "containing block" for any
// `position: fixed` descendant. That meant this drawer was being fixed
// relative to the ~80px header bar instead of the actual viewport, which is
// what caused it to collapse and overlap with the page content behind it.
// Portaling straight to <body> sidesteps that entirely.
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-y-0 left-0 z-[80] w-80 max-w-[85vw] border-r border-white/10 bg-graphite p-6 shadow-glass lg:hidden"
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-bone">URBANFITS</span>
              <button onClick={onClose} aria-label="Close menu" className="text-bone">
                <X size={20} />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.key}
                  href={`/shop/${c.key}`}
                  onClick={onClose}
                  className="text-lg font-medium text-silver"
                >
                  {c.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  if (pathname?.startsWith("/admin")) return null;

  const cart = useCart();
  const wishlist = useWishlist();

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-void/70 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            className="text-bone lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.jpeg" alt="Urban Fits Streetwear" width={40} height={40} className="rounded-full ring-1 ring-white/15" />
            <span className="hidden font-display text-lg font-semibold tracking-tightest text-bone sm:block">
              URBAN FITS
            </span>
          </Link>
          <nav className="hidden items-center gap-7 lg:flex">
            {CATEGORIES.slice(0, 5).map((c) => (
              <Link
                key={c.key}
                href={`/shop/${c.key}`}
                className="text-sm font-medium text-silver/80 transition-colors hover:text-bone"
              >
                {c.label}
              </Link>
            ))}
            <Link href="/shop?tag=new" className="text-sm font-medium text-chrome-bright">
              New
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-bone">
          <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)}>
            <Search size={20} />
          </button>
          <Link href="/wishlist" className="relative" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.ids.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-ember text-[10px] text-white">
                {wishlist.ids.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-bone text-[10px] text-void">
                {cart.count}
              </span>
            )}
          </Link>
          <Link href="/profile" aria-label="Account">
            <User size={20} />
          </Link>
        </div>
      </Container>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 bg-void/95"
          >
            <Container className="py-4">
              <form onSubmit={submitSearch} className="flex items-center gap-3">
                <Search size={18} className="text-chrome" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products…"
                  className="w-full bg-transparent text-lg text-bone outline-none placeholder:text-chrome"
                />
              </form>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
