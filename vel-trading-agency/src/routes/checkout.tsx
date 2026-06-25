import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useShop } from "@/context/ShopContext";
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, CheckCircle2, Loader2 } from "lucide-react";
import { useState } from "react";
import { createPaymentSession } from "@/lib/api/payment.functions";

export const Route = createFileRoute("/checkout")({
    component: CheckoutPage,
});

type PaymentMethod = "debit" | "credit" | "upi";

function CheckoutPage() {
    const { cart, cartTotal, format, clearCart } = useShop();
    const navigate = useNavigate();
    const [method, setMethod] = useState<PaymentMethod>("credit");
    const [placed, setPlaced] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (cart.length === 0 && !placed) {
        return (
            <div className="mx-auto max-w-lg px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-primary font-bold hover:underline">Go back to products</Link>
            </div>
        );
    }

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await createPaymentSession({
                data: {
                    customer: form,
                    items: cart.map(item => ({
                        productId: item.product.id.toString(),
                        name: item.product.name,
                        qty: item.qty,
                        priceUSD: item.product.priceUSD
                    }))
                }
            });

            if (result.success && result.redirectUrl) {
                // Redirect user to PayGlocal Hosted Checkout
                window.location.href = result.redirectUrl;
            } else {
                setError(result.error || "Failed to initiate payment session.");
                setLoading(false);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setLoading(false);
        }
    };

    if (placed) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
                <div className="size-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="size-10" />
                </div>
                <h1 className="text-display text-4xl font-semibold mb-4">Order Placed Successfully!</h1>
                <p className="text-muted-foreground mb-10 max-w-md mx-auto">
                    Thank you for choosing Vel Trading Agency. Your order summary has been generated for your selected payment method: <span className="font-bold border-b border-primary text-foreground uppercase">{method}</span>.
                </p>

                <div className="bg-card border border-border rounded-3xl p-8 text-left shadow-xl mb-10">
                    <h3 className="text-xl font-semibold mb-6 border-b border-border pb-4">Order Summary</h3>
                    <div className="space-y-4 mb-8">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                <span>{item.product.name} (x{item.qty})</span>
                                <span className="font-semibold">{format(item.product.priceUSD * item.qty)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold border-t border-border pt-6">
                        <span>Total Amount</span>
                        <span className="text-primary">{format(cartTotal)}</span>
                    </div>
                    <div className="mt-8 pt-6 border-t border-dashed border-border flex items-center justify-between opacity-70">
                        <div className="text-xs">
                            <div className="font-bold">Customer</div>
                            <div>{form.name || "Global Trader"}</div>
                            <div className="mt-1 font-mono text-[10px]">{form.phone}</div>
                        </div>
                        <div className="text-xs text-right">
                            <div className="font-bold">Payment Status</div>
                            <div className="text-green-600">Authorized via {method.toUpperCase()}</div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => { clearCart(); navigate({ to: "/" }); }}
                    className="px-10 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg hover:opacity-90 transition-all"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-foreground">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-display text-4xl font-semibold">Secure Checkout</h1>
                <Link to="/products" className="text-sm font-semibold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors">
                    <ArrowLeft className="size-4" /> Cancel
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                            Shipping Information
                        </h3>
                        <form id="checkout-form" className="grid sm:grid-cols-6 gap-6" onSubmit={handlePlaceOrder}>
                            <div className="space-y-2 sm:col-span-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Full Name *</label>
                                <input required placeholder="Enter your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email *</label>
                                <input required type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-3">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Phone *</label>
                                <input required placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-6">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Address *</label>
                                <textarea required placeholder="House no., Street, Area" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full h-24 bg-secondary/50 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">City *</label>
                                <input required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">State *</label>
                                <input required value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pincode *</label>
                                <input required value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            </div>
                        </form>
                    </section>

                    <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <PaymentBtn
                                active={method === "credit"}
                                onClick={() => setMethod("credit")}
                                icon={<CreditCard className="size-5" />}
                                label="Credit Card"
                            />
                            <PaymentBtn
                                active={method === "debit"}
                                onClick={() => setMethod("debit")}
                                icon={<CreditCard className="size-5" />}
                                label="Debit Card"
                            />
                            <PaymentBtn
                                active={method === "upi"}
                                onClick={() => setMethod("upi")}
                                icon={<Smartphone className="size-5" />}
                                label="UPI / Apps"
                            />
                        </div>
                        <div className="mt-6 p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs text-muted-foreground flex items-center gap-3">
                            <ShieldCheck className="size-4 text-primary" />
                            Selected: <span className="font-bold text-foreground uppercase tracking-tight ml-1">{method}</span>
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-3xl p-8 sticky top-24 shadow-xl">
                        <h3 className="text-xl font-semibold mb-6">Order Total</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{format(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t border-border pt-4 mt-2">
                                <span>Total</span>
                                <span className="text-primary">{format(cartTotal)}</span>
                            </div>
                        </div>
                        {error && (
                            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-2xl text-left">
                                {error}
                            </div>
                        )}
                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Redirecting to secure gateway...
                                </>
                            ) : (
                                `Place Order via ${method.toUpperCase()}`
                            )}
                        </button>
                        <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                            Secured by Global Herbal Network
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${active ? "bg-primary/5 border-primary shadow-inner" : "bg-card border-border hover:bg-secondary"}`}
        >
            <div className={`${active ? "text-primary" : "text-muted-foreground"}`}>{icon}</div>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
        </button>
    )
}
