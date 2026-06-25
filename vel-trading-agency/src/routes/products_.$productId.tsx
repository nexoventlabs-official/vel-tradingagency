import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";
import { useShop } from "@/context/ShopContext";
import { ArrowLeft, ShoppingCart, Zap, MessageSquare } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/products_/$productId")({
    component: ProductDetails,
});

function ProductDetails() {
    const { productId } = Route.useParams();
    const navigate = useNavigate();
    const { format, formatRange, addToCart } = useShop();
    const [qty, setQty] = useState(1);

    const product = PRODUCTS.find((p) => p.id === productId);

    if (!product) {
        return <div className="text-center py-20">Product not found.</div>;
    }

    const handleBuyNow = () => {
        addToCart(product, qty);
        navigate({ to: "/checkout" });
    };

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 mb-8 transition-colors">
                <ArrowLeft className="size-4" /> Back to Product Catalogue
            </Link>

            <div className="grid lg:grid-cols-2 gap-16 items-start mb-24">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-border/50 bg-secondary/20">
                    <img src={product.image} alt={product.name} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-700" />
                </div>

                <div className="pt-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                        <span className="size-1.5 rounded-full bg-primary animate-pulse" />
                        {product.category}
                    </div>
                    <h1 className="text-display text-4xl sm:text-6xl font-bold mb-6 leading-tight">{product.name}</h1>
                    <div className="flex items-baseline gap-3 mb-8">
                        <div className="text-4xl font-display font-bold text-primary">
                            {product.priceRange ? formatRange(product.priceRange) : format(product.priceUSD)}
                        </div>
                        <div className="text-muted-foreground font-semibold">/ Kilogram</div>
                    </div>

                    <div className="prose prose-sm text-muted-foreground mb-10 max-w-none">
                        <p className="text-lg leading-relaxed font-medium text-foreground/80 mb-4">{product.description}</p>
                        <p>Sourced and processed in Tamil Nadu, India. Our materials are verified for botanical purity and packaged in moisture-controlled environments to preserve therapeutic integrity during international transit.</p>
                    </div>

                    <div className="flex items-center gap-6 mb-10">
                        <div className="flex items-center border-2 border-border rounded-2xl p-1 bg-card shadow-sm">
                            <button
                                onClick={() => setQty(q => Math.max(1, q - 1))}
                                className="size-12 rounded-xl hover:bg-secondary flex items-center justify-center font-bold text-xl transition-colors"
                            >
                                -
                            </button>
                            <span className="w-16 text-center font-bold text-lg">{qty}</span>
                            <button
                                onClick={() => setQty(q => q + 1)}
                                className="size-12 rounded-xl hover:bg-secondary flex items-center justify-center font-bold text-xl transition-colors"
                            >
                                +
                            </button>
                        </div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">
                            Unit of Measure<br />
                            <span className="text-foreground text-sm">Kilograms (Kg)</span>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => addToCart(product, qty)}
                            className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-secondary border-2 border-border font-bold hover:bg-background transition-all hover:border-primary/30"
                        >
                            <ShoppingCart className="size-5" /> Add to Cart
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-95 shadow-2xl shadow-primary/30 transition-all hover:-translate-y-0.5"
                        >
                            <Zap className="size-5 fill-current" /> Buy Now
                        </button>
                        <Link
                            to="/enquiry"
                            search={{ product: product.name }}
                            className="sm:col-span-2 flex items-center justify-center gap-2 px-8 py-5 rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary font-bold hover:bg-primary/10 transition-all"
                        >
                            <MessageSquare className="size-5" /> Bulk Order Enquiry
                        </Link>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            <section className="border-t border-border pt-16">
                <h2 className="text-display text-3xl font-semibold mb-10">Recommended for You</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {PRODUCTS.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    );
}

import ProductCard from "@/components/ProductCard";
