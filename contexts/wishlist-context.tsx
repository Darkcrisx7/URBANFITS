"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getWishlistRaw, setWishlistRaw } from "@/lib/storage";

interface WishlistContextValue {
  ids: string[];
  toggle: (productId: string) => void;
  has: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setIds(getWishlistRaw());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) setWishlistRaw(ids);
  }, [ids, hydrated]);

  function toggle(productId: string) {
    setIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }

  function has(productId: string) {
    return ids.includes(productId);
  }

  return (
    <WishlistContext.Provider value={{ ids, toggle, has }}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
