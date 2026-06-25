import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getOrderDetails } from "@/lib/api/payment.functions";

export const Route = createFileRoute("/payment-failure")({
  component: PaymentFailurePage,
});

type FailureSearch = {
  txnId?: string;
};

function PaymentFailurePage() {
  const search = useSearch({ from: "/payment-failure" }) as FailureSearch;
  const txnId = search.txnId || "";
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!txnId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const result = await getOrderDetails({ data: { merchantTxnId: txnId } });
        if (result.success && result.order) {
          setOrder(result.order);
        }
      } catch (err) {
        console.error("Failed to load order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [txnId]);

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8 text-foreground text-center min-h-[70vh] flex flex-col justify-center">
      <div className="size-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
        <AlertCircle className="size-10" />
      </div>
      
      <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-amber-500 mb-4">
        Payment Failed
      </h1>
      
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We were unable to process your payment transaction. This can happen due to incorrect card details, insufficient funds, or a temporary gateway issue.
      </p>

      {order && (
        <div className="bg-card/40 border border-border rounded-2xl p-6 text-left mb-8 max-w-md mx-auto w-full text-sm">
          <div className="flex justify-between border-b border-border/60 pb-3 mb-3">
            <span className="text-muted-foreground">Order Reference:</span>
            <span className="font-mono font-semibold">{order.merchantTxnId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount:</span>
            <span className="font-bold text-foreground">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          to="/checkout"
          className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="size-4 animate-spin-reverse" /> Retry Payment
        </Link>
        
        <Link
          to="/"
          className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full font-bold shadow-md text-center transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="size-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
