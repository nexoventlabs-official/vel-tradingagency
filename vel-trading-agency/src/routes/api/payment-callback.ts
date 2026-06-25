import { createFileRoute } from "@tanstack/react-router";

// Backend API URL — read at request time so it's always fresh
function getApiUrl() {
  return process.env.VITE_API_URL || "http://localhost:5000";
}

export const Route = createFileRoute("/api/payment-callback")({
  server: {
    handlers: {
      // PayGlocal POSTs here after payment completes.
      // We proxy the full request body to the Express backend,
      // then follow its redirect back to the frontend success/failure page.
      POST: async ({ request }) => {
        try {
          const apiUrl = getApiUrl();
          const backendUrl = `${apiUrl}/api/payment/callback`;

          console.log(`[callback proxy] Forwarding PayGlocal callback → ${backendUrl}`);

          // Read raw body and content-type so we forward exactly what PayGlocal sent
          const contentType = request.headers.get("content-type") || "application/x-www-form-urlencoded";
          const rawBody = await request.text();

          const backendResponse = await fetch(backendUrl, {
            method: "POST",
            headers: {
              "Content-Type": contentType,
            },
            body: rawBody,
            // Don't auto-follow redirects — we want to pass the redirect through to the browser
            redirect: "manual",
          });

          // Backend returns 303 redirect → pass it straight to the browser
          if (backendResponse.status === 303 || backendResponse.status === 301 || backendResponse.status === 302) {
            const location = backendResponse.headers.get("location") || "/";
            console.log(`[callback proxy] Redirecting browser → ${location}`);
            return new Response(null, {
              status: 303,
              headers: { Location: location },
            });
          }

          // Error from backend — return as-is
          const body = await backendResponse.text();
          console.error(`[callback proxy] Backend error ${backendResponse.status}:`, body);
          return new Response(body, { status: backendResponse.status });

        } catch (error: any) {
          console.error("[callback proxy] Unexpected error:", error);
          return new Response(`Proxy error: ${error.message}`, { status: 500 });
        }
      },
    },
  },
});
