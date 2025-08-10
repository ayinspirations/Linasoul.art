"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;          // artwork id
  title: string;
  price_cents: number; // IMMER number
  currency: string;    // z.B. "eur"
  image?: string | null;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
  totalCents: number;
};

const CartCtx = createContext<CartContextType | null>(null);

// Hilfsfunktion: alles auf korrekte Typen bringen
function normalizeItem(i: any): CartItem {
  return {
    id: String(i?.id ?? ""),
    title: String(i?.title ?? "Untitled"),
    price_cents: Number(i?.price_cents ?? 0),
    currency: String(i?.currency ?? "EUR"),
    image:
      i?.image == null
        ? null
        : typeof i.image === "string"
        ? i.image
        : String(i.image),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Laden aus localStorage (nur Client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // beim Laden direkt normalisieren & deduplizieren
        const safe = parsed.map(normalizeItem).filter((x) => x.id);
        const uniq = Array.from(new Map(safe.map((x) => [x.id, x])).values());
        setItems(uniq);
      }
    } catch {
      // ignorieren
    }
  }, []);

  // Speichern in localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(items));
    } catch {
      // ignorieren
    }
  }, [items]);

  const add = (raw: CartItem) => {
    const item = normalizeItem(raw);
    if (!item.id) return;
    setItems((prev) => {
      // Jedes Werk ist einzigartig → nicht doppelt hinzufügen
      if (prev.some((p) => p.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const clear = () => setItems([]);

  const count = items.length;

  const totalCents = useMemo(
    () => items.reduce((sum, it) => sum + Number(it.price_cents || 0), 0),
    [items]
  );

  return (
    <CartCtx.Provider
      value={{ items, add, remove, clear, count, totalCents }}
    >
      {children}
    </CartCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
