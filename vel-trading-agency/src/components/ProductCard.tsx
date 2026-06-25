import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";
import { useShop } from "@/context/ShopContext";
import { Link } from "@tanstack/react-router";

export default function ProductCard({ product }: { product: Product }) {
  const { format, formatRange, addToCart } = useShop();
  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-0.5">
      <Link to="/products/$productId" params={{ productId: product.id }} className="block">
        <div className="aspect-square overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category}</div>
        <Link to="/products/$productId" params={{ productId: product.id }}>
          <h3 className="text-display text-lg font-semibold mt-0.5 leading-tight hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-base font-semibold text-primary">
              {product.priceRange ? formatRange(product.priceRange) : format(product.priceUSD)}
            </div>
            <div className="text-[10px] text-muted-foreground">per Kg</div>
          </div>
          <Link
            to="/products/$productId"
            params={{ productId: product.id }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}
