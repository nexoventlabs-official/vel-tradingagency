import { createFileRoute } from "@tanstack/react-router";

// PayGlocal posts the callback directly to the backend in production:
//   https://vel-tradingagency.onrender.com/api/payment/callback
//
// This route exists only as a fallback proxy for local dev where
// ngrok tunnels to localhost:8080 (the frontend).
// In production the backend handles the callback directly.

function getApiUrl() {
  return process.env.VITE_API_URL || "http://localhost:5000";
}

export const Route = createFileRoute("/api/payment-callback")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiUrl = getApiUrl();
          const backendUrl = `${apiUrl}/api/payment/callback`;

          console.log(`[callback proxy] Forwarding → ${backendUrl}`);

          const contentType = request.headers.get("content-type") || "application/x-www-form-urlencoded";
          const rawBody = await request.text();

          const backendResponse = await fetch(backendUrl, {
            method: "POST",
            headers: { "Content-Type": contentType },
            body: rawBody,
            redirect: "manual",
          });

          // Backend returns 303 redirect → pass through to browser
          if ([301, 302, 303].includes(backendResponse.status)) {
            const location = backendResponse.headers.get("location") || "/";
            console.log(`[callback proxy] Redirecting → ${location}`);
            return new Response(null, {
              status: 303,
              headers: { Location: location },
            });
          }

          const body = await backendResponse.text();
          return new Response(body, { status: backendResponse.status });

        } catch (error: any) {
          console.error("[callback proxy] Error:", error);
          return new Response(`Proxy error: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});
