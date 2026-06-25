import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getAdminToken } from "@/lib/adminApi";

// Root layout route for all /admin/* pages
// Bypasses the shop Layout — renders its own sidebar layout
export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    // Only check auth client-side (localStorage unavailable in SSR)
    if (typeof window === "undefined") return;
    // Skip check on login page itself
    if (location.pathname === "/admin/login") return;
    if (!getAdminToken()) {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});

import {
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Leaf,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { clearAdminToken } from "@/lib/adminApi";

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = () => {
    clearAdminToken();
    navigate({ to: "/admin/login" });
  };

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/orders",    icon: ShoppingBag,      label: "Orders" },
  ];

  // Don't show sidebar on login page
  if (currentPath === "/admin/login") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* ── Sidebar ── */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 bg-green-900 text-white flex flex-col min-h-screen shrink-0`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-green-700">
          <div className="size-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
            <Leaf className="size-5 text-green-300" />
          </div>
          {sidebarOpen && (
            <div className="leading-tight overflow-hidden">
              <div className="text-sm font-bold truncate">Vel Trading</div>
              <div className="text-[10px] text-green-300 uppercase tracking-widest">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = currentPath.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-green-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="size-5 shrink-0" />
                {sidebarOpen && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-green-700 pt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-green-200 hover:bg-white/10 hover:text-white transition-all text-sm font-medium"
          >
            <LogOut className="size-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
          <h1 className="text-sm font-semibold text-gray-700 capitalize">
            {currentPath.replace("/admin/", "").replace("/", " › ") || "Admin"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="size-8 rounded-full bg-green-700 text-white flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
