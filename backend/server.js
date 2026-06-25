import "dotenv/config";
import express from "express";
import cors from "cors";
import { config } from "./config/config.js";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    config.frontendUrl,
    "https://vel-tradingagency.vercel.app",
    "https://veltradingagency.shop",
    "http://localhost:8080",
    "http://localhost:5173",
  ],
  credentials: true,
}));

// Parse JSON bodies (for API calls from frontend)
app.use(express.json());

// Parse URL-encoded bodies (for PayGlocal callback POST)
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(config.port, () => {
  console.log("─────────────────────────────────────────────");
  console.log(`  Vel Trading Backend running on port ${config.port}`);
  console.log(`  Health:   http://localhost:${config.port}/health`);
  console.log(`  Initiate: POST /api/payment/initiate`);
  console.log(`  Callback: POST /api/payment/callback`);
  console.log(`  Order:    GET  /api/payment/order/:txnId`);
  console.log("─────────────────────────────────────────────");
});
