import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CATEGORIES, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Vel Trading Agency" },
      { name: "description", content: "Browse our catalogue of authentic Tamil Nadu herbs, seeds, roots, dried flowers and spices." },
      { property: "og:title", content: "Products — Vel Trading Agency" },
      { property: "og:description", content: "Browse our catalogue of authentic Tamil Nadu herbs, seeds, roots and dried flowers." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");

  const filtered = PRODUCTS.filter((p) =>
    (cat === "All" || p.category === cat) &&
    (q === "" || p.name.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-8">
        <h1 className="text-display text-4xl sm:text-5xl font-semibold">Our Catalogue</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          Every item is sourced and hand-graded in Tamil Nadu. Prices are indicative per kilogram — bulk discounts available on enquiry.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 h-10 rounded-full bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 h-10 rounded-full text-sm font-medium border transition-colors ${cat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border hover:bg-secondary"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mr-auto bg-secondary/50 px-3 py-1 rounded-full border border-border/50">
          {filtered.length} {filtered.length === 1 ? "Product" : "Products"} Found
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
 
