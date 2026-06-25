import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShoppingBag, TrendingUp, CheckCircle2, XCircle, Clock,
  RefreshCw, IndianRupee,
} from "lucide-react";
import { fetchDashboard, clearAdminToken, getAdminToken } from "@/lib/adminApi";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboardPage,
});

interface Stats {
  totalOrders: number;
  paidOrders: number;
  failedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
}

interface RecentOrder {
  merchantTxnId: string;
  customer: { name: string; email: string };
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

const INR = 83.2;
const fmt = (usd: number) => `₹${(usd * INR).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

function StatCard({
  label, value, icon: Icon, color, sub,
}: {
  label: string; value: string | number; icon: any; color: string; sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
      <div className={`size-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="size-6" />
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side auth guard
  useEffect(() => {
    if (!getAdminToken()) { navigate({ to: "/admin/login" }); }
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchDashboard();
      if (!result.success) {
        if (result.error === "Unauthorized" || result.error === "Invalid or expired token") {
          clearAdminToken();
          navigate({ to: "/admin/login" });
          return;
        }
        setError(result.error);
      } else {
        setStats(result.stats);
        setRecentOrders(result.recentOrders);
      }
    } catch {
      setError("Could not reach backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="size-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={load} className="px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Live overview of all orders and revenue</p>
        </div>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors"
        >
          <RefreshCw className="size-4" /> Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={fmt(stats!.totalRevenue)}
          icon={IndianRupee}
          color="bg-green-100 text-green-700"
          sub={`$${stats!.totalRevenue.toFixed(2)} USD`}
        />
        <StatCard
          label="Total Orders"
          value={stats!.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-100 text-blue-700"
        />
        <StatCard
          label="Paid Orders"
          value={stats!.paidOrders}
          icon={CheckCircle2}
          color="bg-emerald-100 text-emerald-700"
        />
        <StatCard
          label="Pending Orders"
          value={stats!.pendingOrders}
          icon={Clock}
          color="bg-yellow-100 text-yellow-700"
        />
        <StatCard
          label="Failed Orders"
          value={stats!.failedOrders}
          icon={XCircle}
          color="bg-red-100 text-red-700"
        />
        <StatCard
          label="Avg Order Value"
          value={stats!.paidOrders > 0 ? fmt(stats!.totalRevenue / stats!.paidOrders) : "₹0"}
          icon={TrendingUp}
          color="bg-purple-100 text-purple-700"
          sub="per paid order"
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Paid Orders</h3>
          <button
            onClick={() => navigate({ to: "/admin/orders" })}
            className="text-sm text-green-700 font-medium hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-semibold">Transaction ID</th>
                <th className="px-6 py-3 text-left font-semibold">Customer</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                    No paid orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o.merchantTxnId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{o.merchantTxnId}</td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{o.customer.name}</div>
                      <div className="text-xs text-gray-400">{o.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{fmt(o.totalAmount)}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(o.createdAt).toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        {o.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
