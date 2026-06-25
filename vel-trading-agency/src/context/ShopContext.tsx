import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/lib/products";

export type Currency = "USD" | "INR" | "EUR";

// Rates relative to USD (Base)
const RATES: Record<Currency, { rate: number; symbol: string; locale: string; code: string }> = {
  USD: { rate: 1, symbol: "$", locale: "en-US", code: "USD" },
  INR: { rate: 83.2, symbol: "₹", locale: "en-IN", code: "INR" },
  EUR: { rate: 0.92, symbol: "€", locale: "de-DE", code: "EUR" },
};

export type CartItem = { product: Product; qty: number };

type ShopCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (priceUSD: number) => string;
  formatRange: (range: string) => string;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const Ctx = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("vel_currency") as Currency | null;
      if (c && RATES[c]) setCurrencyState(c);
      const raw = localStorage.getItem("vel_cart");
      if (raw) setCart(JSON.parse(raw));
    } catch { }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("vel_cart", JSON.stringify(cart)); } catch { }
  }, [cart]);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try { localStorage.setItem("vel_currency", c); } catch { }
  };

  const format = (priceUSD: number) => {
    const cfg = RATES[currency];
    const value = priceUSD * cfg.rate;
    return new Intl.NumberFormat(cfg.locale, {
      style: "currency",
      currency: cfg.code,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(value);
  };

  const formatRange = (range: string) => {
    const cfg = RATES[currency];
    const parts = range.split("-").map(p => parseFloat(p.trim()));
    if (parts.length !== 2 || parts.some(isNaN)) return format(parseFloat(range) || 0);

    const formattedParts = parts.map(v => {
      const value = v * cfg.rate;
      return new Intl.NumberFormat(cfg.locale, {
        style: "currency",
        currency: cfg.code,
        maximumFractionDigits: currency === "INR" ? 0 : 2,
      }).format(value);
    });

    return `${formattedParts[0]} - ${formattedParts[1]}`;
  };

  const addToCart = (p: Product, qty = 1) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === p.id);
      if (found) return prev.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { product: p, qty }];
    });
  };
  const removeFromCart = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));
  const updateQty = (id: string, qty: number) =>
    setCart((prev) => prev.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i));
  const clearCart = () => setCart([]);

  const value = useMemo<ShopCtx>(() => ({
    currency, setCurrency, format, formatRange,
    cart, addToCart, removeFromCart, updateQty, clearCart,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    cartTotal: cart.reduce((s, i) => s + i.product.priceUSD * i.qty, 0),
  }), [currency, cart]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useShop() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useShop must be used within ShopProvider");
  return v;
}
