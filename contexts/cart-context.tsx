"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartLine, Product } from "@/lib/types";
import { getCartRaw, setCartRaw, getProducts } from "@/lib/storage";

interface CartContextValue {
  lines: CartLine[];
  products: Product[];
  add: (productId: string, size: string, color: string, quantity?: number) => void;
  remove: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(getCartRaw());
    setProducts(getProducts());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) setCartRaw(lines);
  }, [lines, hydrated]);

  function add(productId: string, size: string, color: string, quantity = 1) {
    setLines((prev) => {
      const existing = prev.find(
        (l) => l.productId === productId && l.size === size && l.color === color
      );
      if (existing) {
        return prev.map((l) =>
          l === existing ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      return [...prev, { productId, size, color, quantity }];
    });
  }

  function remove(productId: string, size: string, color: string) {
    setLines((prev) =>
      prev.filter((l) => !(l.productId === productId && l.size === size && l.color === color))
    );
  }

  function updateQuantity(productId: string, size: string, color: string, quantity: number) {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId && l.size === size && l.color === color
          ? { ...l, quantity: Math.max(1, quantity) }
          : l
      )
    );
  }

  function clear() {
    setLines([]);
  }

  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = useMemo(
    () =>
      lines.reduce((sum, l) => {
        const product = products.find((p) => p.id === l.productId);
        return sum + (product ? product.price * l.quantity : 0);
      }, 0),
    [lines, products]
  );

  return (
    <CartContext.Provider
      value={{ lines, products, add, remove, updateQuantity, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
