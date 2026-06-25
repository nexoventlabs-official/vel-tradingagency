import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useShop } from "@/context/ShopContext";
import {
  CheckCircle2, ArrowRight, ShieldCheck, ShoppingBag,
  Loader2, Download, MapPin, Phone, Mail,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { getOrderDetails } from "@/lib/api/payment.functions";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

export const Route = createFileRoute("/payment-success")({
  component: PaymentSuccessPage,
});

type SuccessSearch = { txnId?: string };

function PaymentSuccessPage() {
  const search = useSearch({ from: "/payment-success" }) as SuccessSearch;
  const txnId = search.txnId || "";
  const { clearCart, format } = useShop();

  const [loading, setLoading]   = useState(true);
  const [order, setOrder]       = useState<any>(null);
  const [error, setError]       = useState<string | null>(null);
  const [polling, setPolling]   = useState(false);
  const pollRef                  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartCleared              = useRef(false);

  const fetchOrder = async (isRetry = false) => {
    if (isRetry) setPolling(true);
    try {
      const result = await getOrderDetails({ data: { merchantTxnId: txnId } });
      if (result.success && result.order) {
        // If still PENDING, poll again after 2s (PayGlocal callback may lag)
        if (result.order.paymentStatus === "PENDING") {
          pollRef.current = setTimeout(() => fetchOrder(true), 2500);
          setOrder(result.order); // show pending state while waiting
        } else {
          if (pollRef.current) clearTimeout(pollRef.current);
          setOrder(result.order);
          setPolling(false);
          // Clear cart only once payment confirmed
          if (!cartCleared.current) {
            clearCart();
            cartCleared.current = true;
          }
        }
      } else {
        setError(result.error || "Could not retrieve order details.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading your order.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!txnId) { setError("No transaction ID provided."); setLoading(false); return; }
    fetchOrder();
    return () => { if (pollRef.current) clearTimeout(pollRef.current); };
  }, [txnId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="size-12 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse">Confirming your payment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="size-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="size-8" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">{error}</p>
        <Link to="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold">
          Go back to products
        </Link>
      </div>
    );
  }

  const isPaid    = order?.paymentStatus === "PAID";
  const isPending = order?.paymentStatus === "PENDING";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-foreground">

      {/* ── Header ── */}
      <div className="text-center mb-10">
        <div className={`size-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
          isPaid
            ? "bg-green-500/10 border border-green-500/30 text-green-500 animate-bounce"
            : "bg-yellow-500/10 border border-yellow-500/30 text-yellow-500"
        }`}>
          {isPaid
            ? <CheckCircle2 className="size-12" />
            : <Loader2 className="size-12 animate-spin" />
          }
        </div>

        {isPaid ? (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500">
              Payment Successful!
            </h1>
            <p className="mt-3 text-muted-foreground">
              Your order has been confirmed. Thank you for choosing Vel Trading Agency.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-yellow-500">Confirming Payment...</h1>
            <p className="mt-3 text-muted-foreground">
              We're waiting for payment confirmation from the gateway. This takes a few seconds.
              {polling && <span className="ml-1 inline-flex items-center gap-1"><Loader2 className="size-3 animate-spin" /> checking...</span>}
            </p>
          </>
        )}
      </div>

      {/* ── Order card ── */}
      <div className="bg-card/50 backdrop-blur-md border border-border/80 rounded-3xl p-8 shadow-2xl mb-10 relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-[5px] bg-gradient-to-r ${isPaid ? "from-green-400 to-teal-500" : "from-yellow-400 to-orange-400"}`} />

        {/* Order header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border/60 pb-5 mb-6 gap-3">
          <div>
            <h3 className="text-lg font-bold">Order Confirmation</h3>
            <p className="text-xs text-muted-foreground mt-1 font-mono">#{order.merchantTxnId}</p>
            {order.gid && (
              <p className="text-xs text-muted-foreground font-mono mt-0.5">GID: {order.gid}</p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isPaid
                ? "bg-green-500/10 text-green-500 border border-green-500/20"
                : "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20"
            }`}>
              <ShieldCheck className="size-3.5" />
              {order.paymentStatus}
            </span>
            {isPaid && (
              <button
                onClick={() => generateInvoicePDF(order)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Download className="size-3.5" /> Download Invoice
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Items Ordered</h4>
          {order.items.map((item: any, idx: number) => (
            <div key={idx} className="flex justify-between items-center text-sm bg-secondary/30 rounded-xl px-4 py-3">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Qty: {item.qty} × {format(item.priceUSD)}</div>
              </div>
              <span className="font-semibold">{format(item.priceUSD * item.qty)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-border/60 pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold">{format(order.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-semibold text-green-500">FREE</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t border-border/60 pt-3">
            <span>Total Paid</span>
            <span className="text-primary">{format(order.totalAmount)}</span>
          </div>
        </div>

        {/* Customer + Transaction */}
        <div className="mt-6 pt-5 border-t border-dashed border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
          <div>
            <div className="text-muted-foreground font-bold uppercase tracking-widest mb-2">Shipping To</div>
            <div className="font-semibold text-base mb-1">{order.customer.name}</div>
            <div className="flex items-start gap-1.5 text-muted-foreground mt-1">
              <MapPin className="size-3.5 mt-0.5 shrink-0" />
              <span>{order.customer.address}, {order.customer.city}, {order.customer.state} – {order.customer.pincode}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <Phone className="size-3.5 shrink-0" />
              <span>{order.customer.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
              <Mail className="size-3.5 shrink-0" />
              <span>{order.customer.email}</span>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-muted-foreground font-bold uppercase tracking-widest mb-2">Payment Info</div>
            <div className="text-muted-foreground mt-1">Gateway: <span className="text-foreground font-medium">PayGlocal</span></div>
            <div className="text-muted-foreground mt-1">Date: <span className="text-foreground font-medium">{new Date(order.createdAt).toLocaleString()}</span></div>
            {order.gid && (
              <div className="text-muted-foreground font-mono mt-1 text-[10px]">GID: {order.gid}</div>
            )}
          </div>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link to="/" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full font-bold shadow-md text-center transition-all">
          Return to Home
        </Link>
        <Link to="/products" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 flex items-center justify-center gap-2 transition-all group">
          Continue Shopping <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
