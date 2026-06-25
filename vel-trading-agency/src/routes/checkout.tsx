import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useShop } from "@/context/ShopContext";
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck, Loader2, Save, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createPaymentSession } from "@/lib/api/payment.functions";

export const Route = createFileRoute("/checkout")({
    component: CheckoutPage,
});

type PaymentMethod = "debit" | "credit" | "upi";

const STORAGE_KEY = "vel_shipping_details";

const emptyForm = { name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "" };

function CheckoutPage() {
    const { cart, cartTotal, format } = useShop();
    const navigate = useNavigate();
    const [method, setMethod]   = useState<PaymentMethod>("credit");
    const [form, setForm]       = useState(emptyForm);
    const [saveDetails, setSaveDetails] = useState(false);
    const [savedBanner, setSavedBanner] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    // Load saved details on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setForm({ ...emptyForm, ...parsed });
                setSaveDetails(true); // checkbox pre-checked if they have saved data
            }
        } catch { /* ignore */ }
    }, []);

    if (cart.length === 0) {
        return (
            <div className="mx-auto max-w-lg px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="text-primary font-bold hover:underline">
                    Go back to products
                </Link>
            </div>
        );
    }

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Save or clear details based on checkbox
        try {
            if (saveDetails) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
                setSavedBanner(true);
                setTimeout(() => setSavedBanner(false), 3000);
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch { /* ignore */ }

        try {
            const result = await createPaymentSession({
                data: {
                    customer: form,
                    items: cart.map(item => ({
                        productId: item.product.id.toString(),
                        name:      item.product.name,
                        qty:       item.qty,
                        priceUSD:  item.product.priceUSD,
                    })),
                },
            });

            if (result.success && result.redirectUrl) {
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

    const field = (
        key: keyof typeof emptyForm,
        label: string,
        opts?: { type?: string; placeholder?: string; colSpan?: string; textarea?: boolean }
    ) => (
        <div className={`space-y-2 ${opts?.colSpan ?? "sm:col-span-3"}`}>
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {label} *
            </label>
            {opts?.textarea ? (
                <textarea
                    required
                    placeholder={opts.placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full h-24 bg-secondary/50 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
            ) : (
                <input
                    required
                    type={opts?.type ?? "text"}
                    placeholder={opts?.placeholder}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full h-12 bg-secondary/50 border border-border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
            )}
        </div>
    );

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 text-foreground">
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-display text-4xl font-semibold">Secure Checkout</h1>
                <Link
                    to="/products"
                    className="text-sm font-semibold text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft className="size-4" /> Cancel
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-8">

                    {/* ── Shipping form ── */}
                    <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                            Shipping Information
                        </h3>

                        <form id="checkout-form" className="grid sm:grid-cols-6 gap-6" onSubmit={handlePlaceOrder}>
                            {field("name",    "Full Name",    { colSpan: "sm:col-span-6", placeholder: "Enter your full name" })}
                            {field("email",   "Email",        { type: "email", placeholder: "your@email.com" })}
                            {field("phone",   "Phone",        { placeholder: "+91 XXXXX XXXXX" })}
                            {field("address", "Address",      { colSpan: "sm:col-span-6", placeholder: "House no., Street, Area", textarea: true })}
                            {field("city",    "City",         { colSpan: "sm:col-span-2" })}
                            {field("state",   "State",        { colSpan: "sm:col-span-2" })}
                            {field("pincode", "Pincode",      { colSpan: "sm:col-span-2" })}

                            {/* ── Save details checkbox ── */}
                            <div className="sm:col-span-6 flex items-center gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setSaveDetails(!saveDetails)}
                                    className={`size-5 rounded flex items-center justify-center border-2 transition-all shrink-0 ${
                                        saveDetails
                                            ? "bg-primary border-primary"
                                            : "border-border bg-secondary/50"
                                    }`}
                                    aria-checked={saveDetails}
                                    role="checkbox"
                                >
                                    {saveDetails && (
                                        <svg className="size-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </button>
                                <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                                    <Save className="size-3.5" />
                                    Save my shipping details for next time
                                </span>
                                {savedBanner && (
                                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium animate-pulse">
                                        <CheckCircle2 className="size-3.5" /> Saved!
                                    </span>
                                )}
                            </div>
                        </form>
                    </section>

                    {/* ── Payment method ── */}
                    <section className="bg-card border border-border rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <span className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                            Payment Method
                        </h3>
                        <div className="grid sm:grid-cols-3 gap-4">
                            <PaymentBtn active={method === "credit"} onClick={() => setMethod("credit")} icon={<CreditCard className="size-5" />} label="Credit Card" />
                            <PaymentBtn active={method === "debit"}  onClick={() => setMethod("debit")}  icon={<CreditCard className="size-5" />} label="Debit Card" />
                            <PaymentBtn active={method === "upi"}    onClick={() => setMethod("upi")}    icon={<Smartphone className="size-5" />} label="UPI / Apps" />
                        </div>
                        <div className="mt-6 p-4 bg-muted/50 rounded-2xl border border-border/50 text-xs text-muted-foreground flex items-center gap-3">
                            <ShieldCheck className="size-4 text-primary" />
                            Selected: <span className="font-bold text-foreground uppercase tracking-tight ml-1">{method}</span>
                        </div>
                    </section>
                </div>

                {/* ── Order summary sidebar ── */}
                <div className="lg:col-span-1">
                    <div className="bg-card border border-border rounded-3xl p-8 sticky top-24 shadow-xl">
                        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                        {/* Items list */}
                        <div className="space-y-2 mb-5">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex justify-between text-sm">
                                    <span className="text-muted-foreground truncate max-w-[60%]">
                                        {item.product.name} <span className="text-xs">×{item.qty}</span>
                                    </span>
                                    <span className="font-medium">{format(item.product.priceUSD * item.qty)}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 mb-6 border-t border-border pt-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-semibold">{format(cartTotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="font-semibold text-green-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t border-border pt-4">
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
                                    Redirecting to gateway...
                                </>
                            ) : (
                                `Place Order via ${method.toUpperCase()}`
                            )}
                        </button>
                        <p className="mt-4 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                            Secured by PayGlocal
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentBtn({ active, onClick, icon, label }: {
    active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${
                active ? "bg-primary/5 border-primary shadow-inner" : "bg-card border-border hover:bg-secondary"
            }`}
        >
            <div className={active ? "text-primary" : "text-muted-foreground"}>{icon}</div>
            <span className={`text-[11px] font-bold uppercase tracking-widest ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
            </span>
        </button>
    );
}
