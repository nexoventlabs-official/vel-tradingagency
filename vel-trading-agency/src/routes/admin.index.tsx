import { createFileRoute, redirect } from "@tanstack/react-router";
import { getAdminToken } from "@/lib/adminApi";

// /admin → redirect to dashboard if logged in, else login
export const Route = createFileRoute("/admin/")({
  beforeLoad: () => {
    if (getAdminToken()) {
      throw redirect({ to: "/admin/dashboard" });
    } else {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: () => null,
});
