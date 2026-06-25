import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Download, RefreshCw, Search, Filter,
  CheckCircle2, XCircle, Clock, Eye,
} from "lucide-react";
import { fetchOrders, clearAdminToken } from "@/lib/adminApi";
import { generateInvoicePDF } from "@/lib/invoiceGenerator";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrdersPage,
});

interface OrderItem { productId: string; name: string; qty: number; priceUSD: number; }
interface Customer { name: string; email: string; phone: string; address: string; city: string; state: string; pincode: string; }
interface Order {
  merchantTxnId: string; customer: Customer; items: OrderItem[];
  totalAmount: number; paymentStatus: string; gid?: string; createdAt: string;
}

const INR = 83.2;
const fmt = (usd: number) => `₹${(usd * INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const STATUS_STYLES: Record<string, string> = {
  PAID:    "bg-emerald-100 text-emerald-700",
  FAILED:  "bg-red-100 text-red-600",
  PENDING: "bg-yellow-100 text-yellow-700",
};
const STATUS_ICONS: Record<string, any> = {
  PAID: CheckCircle2, FAILED: XCircle, PENDING: Clock,
};

// Order detail modal
function OrderModal({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Order Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            <div><div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Transaction ID</div><div className="font-mono text-xs text-gray-700">{order.merchantTxnId}</div></div>
            <div><div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Status</div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[order.paymentStatus]}`}>{order.paymentStatus}</span>
            </div>
            <div><div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Date</div><div className="text-gray-700">{new Date(order.createdAt).toLocaleString("en-IN")}</div></div>
            <div><div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total</div><div className="font-bold text-green-700">{fmt(order.totalAmount)}</div></div>
            {order.gid && <div className="col-span-2"><div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Gateway GID</div><div className="font-mono text-xs text-gray-600">{order.gid}</div></div>}
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Customer</div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1">
              <div className="font-semibold text-gray-800">{order.customer.name}</div>
              <div className="text-gray-500">{order.customer.email}</div>
              <div className="text-gray-500">{order.customer.phone}</div>
              <div className="text-gray-500">{order.customer.address}, {order.customer.city}, {order.customer.state} – {order.customer.pincode}</div>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4">
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Items</div>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2">
                  <div><div className="font-medium text-gray-700 text-xs">{item.name}</div><div className="text-gray-400 text-xs">Qty: {item.qty} × ${item.priceUSD.toFixed(2)}</div></div>
                  <div className="font-semibold text-gray-800 text-xs">{fmt(item.priceUSD * item.qty)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <button onClick={() => generateInvoicePDF(order)}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl transition-colors">
              <Download className="size-4" /> Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const load = async () => {
    setLoading(true); setError(null);
    try {
      const result = await fetchOrders();
      if (!result.success) {
        if (result.error?.includes("Unauthorized") || result.error?.includes("Invalid")) {
          clearAdminToken(); navigate({ to: "/admin/login" }); return;
        }
        setError(result.error);
      } else { setOrders(result.orders); }
    } catch { setError("Could not reach backend server"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "ALL" || o.paymentStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.merchantTxnId.toLowerCase().includes(q) ||
      o.customer.name.toLowerCase().includes(q) || o.customer.email.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors self-start sm:self-auto">
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name or email..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-9 pr-8 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none cursor-pointer">
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48"><RefreshCw className="size-7 text-green-600 animate-spin" /></div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={load} className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3 text-left font-semibold">Transaction ID</th>
                  <th className="px-5 py-3 text-left font-semibold">Customer</th>
                  <th className="px-5 py-3 text-left font-semibold">Items</th>
                  <th className="px-5 py-3 text-left font-semibold">Amount</th>
                  <th className="px-5 py-3 text-left font-semibold">Date</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                  <th className="px-5 py-3 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No orders found</td></tr>
                ) : filtered.map((order) => {
                  const StatusIcon = STATUS_ICONS[order.paymentStatus] || Clock;
                  return (
                    <tr key={order.merchantTxnId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-gray-600 whitespace-nowrap">{order.merchantTxnId}</td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800">{order.customer.name}</div>
                        <div className="text-xs text-gray-400">{order.customer.email}</div>
                        <div className="text-xs text-gray-400">{order.customer.phone}</div>
                      </td>
                      <td className="px-5 py-4 text-gray-600 text-xs max-w-[160px]">
                        {order.items.map((it, i) => <div key={i} className="truncate">{it.name} ×{it.qty}</div>)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-800 whitespace-nowrap">{fmt(order.totalAmount)}</td>
                      <td className="px-5 py-4 text-gray-500 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.paymentStatus]}`}>
                          <StatusIcon className="size-3" />{order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors" title="View details">
                            <Eye className="size-4" />
                          </button>
                          {order.paymentStatus === "PAID" && (
                            <button onClick={() => generateInvoicePDF(order)}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 hover:text-green-700 transition-colors" title="Download Invoice">
                              <Download className="size-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}
