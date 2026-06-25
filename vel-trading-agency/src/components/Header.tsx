import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ShoppingCart, Menu, X, Leaf } from "lucide-react";
import { useShop, type Currency } from "@/context/ShopContext";
import CartDrawer from "./CartDrawer";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/about", label: "About" },
  { to: "/enquiry", label: "Enquiry" },
  { to: "/contact", label: "Contact" },
] as const;

export default function Header() {
  const { currency, setCurrency, cartCount } = useShop();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/85 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="size-9 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-sm">
                <Leaf className="size-5" />
              </div>
              <div className="leading-tight">
                <div className="text-display text-lg font-semibold leading-none">Vel Trading Agency</div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-1">Madurai · India</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="text-foreground/75 hover:text-primary transition-colors"
                  activeProps={{ className: "text-primary" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center rounded-full border border-border bg-secondary/60 p-0.5 text-xs font-medium">
                {(["USD", "INR", "EUR"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 rounded-full transition-colors ${currency === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCartOpen(true)}
                className="relative inline-flex items-center justify-center size-10 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-accent text-accent-foreground text-[11px] font-semibold grid place-items-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="md:hidden inline-flex items-center justify-center size-10 rounded-full bg-secondary"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>

          {open && (
            <div className="md:hidden pb-4 space-y-1">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-primary" }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="flex items-center gap-1 px-3 pt-2">
                <span className="text-xs text-muted-foreground mr-2">Currency:</span>
                {(["USD", "INR", "EUR"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-2.5 py-1 rounded-full text-xs ${currency === c ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
