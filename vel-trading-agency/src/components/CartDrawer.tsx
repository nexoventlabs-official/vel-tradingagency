import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Link } from "@tanstack/react-router";

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQty, cartTotal, format, clearCart } = useShop();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-background shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="text-display text-lg font-semibold">Your Cart</h2>
          </div>
          <button onClick={onClose} className="size-9 rounded-full hover:bg-secondary grid place-items-center">
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <ShoppingBag className="size-10 mx-auto mb-3 opacity-40" />
              Your cart is empty.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-3 p-3 rounded-xl bg-secondary/50">
                <img src={item.product.image} alt={item.product.name} className="size-20 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{item.product.name}</div>
                  <div className="text-xs text-muted-foreground">{format(item.product.priceUSD)} / Kg</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateQty(item.product.id, item.qty - 1)} className="size-7 grid place-items-center rounded-md border border-border hover:bg-background">
                      <Minus className="size-3.5" />
                    </button>
                    <span className="text-sm w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.product.id, item.qty + 1)} className="size-7 grid place-items-center rounded-md border border-border hover:bg-background">
                      <Plus className="size-3.5" />
                    </button>
                    <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold whitespace-nowrap">
                  {format(item.product.priceUSD * item.qty)}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border p-5 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-lg font-semibold">{format(cartTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground leading-snug">Secure checkout available with Credit, Debit, and UPI options.</p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center p-4 rounded-2xl text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20 transition-all gap-2"
              >
                Checkout Now <ArrowRight className="size-4" />
              </Link>
              <button
                onClick={clearCart}
                className="w-full py-3 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
