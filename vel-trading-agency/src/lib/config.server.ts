import process from "node:process";

// Server-only config. The .server.ts suffix prevents Vite from bundling
// this file into the client — values here never reach the browser.
//
// On Cloudflare Workers, env binds at REQUEST time. Module-scope reads
// (e.g. `const x = process.env.X`) resolve to undefined — always read
// process.env INSIDE a function or handler.
//
// When to use which env-access pattern:
//   - .server.ts module (this file): server-only helpers reused across
//     handlers. Wrap reads in a function so they run per-request.
//   - inline process.env inside a createServerFn handler: one-off reads
//     not reused elsewhere.
//   - import.meta.env.VITE_FOO: PUBLIC config readable from both client
//     and server (analytics IDs, public URLs). Define in .env with the
//     VITE_ prefix. Never put secrets here — they ship to the browser.

export function getServerConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    mongodbUri: process.env.MONGODB_URI,
    payglocalMerchantId: process.env.PAYGLOCAL_MERCHANT_ID,
    payglocalPublicKey: process.env.PAYGLOCAL_PUBLIC_KEY?.replace(/\\n/g, "\n"),
    payglocalPrivateKey: process.env.PAYGLOCAL_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    payglocalPublicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID,
    payglocalPrivateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
    payglocalBaseUrl: process.env.PAYGLOCAL_BASE_URL ?? "https://api.uat.payglocal.in",
    appUrl: process.env.APP_URL ?? "http://localhost:8080",
  };
}
