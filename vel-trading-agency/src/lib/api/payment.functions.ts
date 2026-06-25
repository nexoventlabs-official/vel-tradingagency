import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Backend API base URL — reads from .env at request time (server-side only)
function getApiUrl() {
  return process.env.VITE_API_URL || "http://localhost:5000";
}

// ── Input schema ──────────────────────────────────────────────────────────────
const checkoutInputSchema = z.object({
  customer: z.object({
    name:    z.string().min(1, "Name is required"),
    email:   z.string().email("Invalid email address"),
    phone:   z.string().min(10, "Phone number must be at least 10 digits"),
    address: z.string().min(1, "Address is required"),
    city:    z.string().min(1, "City is required"),
    state:   z.string().min(1, "State is required"),
    pincode: z.string().min(5, "Pincode is required"),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name:      z.string(),
        qty:       z.number().min(1),
        priceUSD:  z.number().nonnegative(),
      })
    )
    .min(1, "Cart cannot be empty"),
});

// ── createPaymentSession ──────────────────────────────────────────────────────
// Calls POST /api/payment/initiate on the Express backend.
// Returns { success, redirectUrl, merchantTxnId } or { success: false, error }
export const createPaymentSession = createServerFn({ method: "POST" })
  .inputValidator(checkoutInputSchema)
  .handler(async ({ data }) => {
    try {
      const apiUrl = getApiUrl();
      console.log(`[frontend→backend] POST ${apiUrl}/api/payment/initiate`);

      const response = await fetch(`${apiUrl}/api/payment/initiate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || "Payment initiation failed",
        };
      }

      return {
        success: true,
        redirectUrl: result.redirectUrl,
        merchantTxnId: result.merchantTxnId,
      };
    } catch (error: any) {
      console.error("[createPaymentSession] Error:", error);
      return {
        success: false,
        error: error.message || "An unexpected error occurred",
      };
    }
  });

// ── getOrderDetails ───────────────────────────────────────────────────────────
// Calls GET /api/payment/order/:merchantTxnId on the Express backend.
// Returns { success, order } or { success: false, error }
export const getOrderDetails = createServerFn({ method: "GET" })
  .inputValidator(z.object({ merchantTxnId: z.string() }))
  .handler(async ({ data }) => {
    try {
      const apiUrl = getApiUrl();
      console.log(`[frontend→backend] GET ${apiUrl}/api/payment/order/${data.merchantTxnId}`);

      const response = await fetch(
        `${apiUrl}/api/payment/order/${encodeURIComponent(data.merchantTxnId)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          error: result.error || "Order not found",
        };
      }

      return {
        success: true,
        order: result.order,
      };
    } catch (error: any) {
      console.error("[getOrderDetails] Error:", error);
      return {
        success: false,
        error: error.message || "Failed to retrieve order details",
      };
    }
  });
