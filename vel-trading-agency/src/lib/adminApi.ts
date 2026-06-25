// Admin API utility — all calls go to the Express backend

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAdminToken(): string | null {
  // Guard: localStorage is not available during SSR
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("vel_admin_token");
  if (!token) return null;
  // Check expiry stored alongside token
  const expiry = localStorage.getItem("vel_admin_token_expiry");
  if (expiry && Date.now() > parseInt(expiry)) {
    localStorage.removeItem("vel_admin_token");
    localStorage.removeItem("vel_admin_token_expiry");
    return null;
  }
  return token;
}

export function setAdminToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vel_admin_token", token);
  // JWT is set to 8h in backend — store expiry so we can check client-side
  localStorage.setItem("vel_admin_token_expiry", String(Date.now() + 8 * 60 * 60 * 1000));
}

export function clearAdminToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("vel_admin_token");
  localStorage.removeItem("vel_admin_token_expiry");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAdminToken()}`,
  };
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function fetchDashboard() {
  const res = await fetch(`${API_URL}/api/admin/dashboard`, {
    headers: authHeaders(),
  });
  return res.json();
}

export async function fetchOrders(status?: string) {
  const url = status
    ? `${API_URL}/api/admin/orders?status=${status}`
    : `${API_URL}/api/admin/orders`;
  const res = await fetch(url, { headers: authHeaders() });
  return res.json();
}

export async function fetchOrderById(merchantTxnId: string) {
  const res = await fetch(`${API_URL}/api/admin/orders/${encodeURIComponent(merchantTxnId)}`, {
    headers: authHeaders(),
  });
  return res.json();
}
