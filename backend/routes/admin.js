import express from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import { connectToDatabase } from "../db/connect.js";
import { Order } from "../models/Order.js";

const router = express.Router();

// ── JWT auth middleware ───────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const payload = jwt.verify(auth.slice(7), config.admin.jwtSecret);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/login
// ─────────────────────────────────────────────────────────────────────────────
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username !== config.admin.username ||
    password !== config.admin.password
  ) {
    return res.status(401).json({ success: false, error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { username, role: "admin" },
    config.admin.jwtSecret,
    { expiresIn: "8h" }
  );
  return res.json({ success: true, token });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/dashboard
// Returns summary stats: total orders, paid, failed, pending, revenue
// ─────────────────────────────────────────────────────────────────────────────
router.get("/dashboard", requireAuth, async (req, res) => {
  try {
    await connectToDatabase();

    const [total, paid, failed, pending, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "PAID" }),
      Order.countDocuments({ paymentStatus: "FAILED" }),
      Order.countDocuments({ paymentStatus: "PENDING" }),
      Order.aggregate([
        { $match: { paymentStatus: "PAID" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    // Recent 5 paid orders
    const recentOrders = await Order.find({ paymentStatus: "PAID" })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    return res.json({
      success: true,
      stats: {
        totalOrders: total,
        paidOrders: paid,
        failedOrders: failed,
        pendingOrders: pending,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (error) {
    console.error("Error in /api/admin/dashboard:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/orders
// Returns all orders, with optional ?status=PAID|FAILED|PENDING filter
// ─────────────────────────────────────────────────────────────────────────────
router.get("/orders", requireAuth, async (req, res) => {
  try {
    await connectToDatabase();

    const filter = {};
    if (req.query.status) filter.paymentStatus = req.query.status;

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders });
  } catch (error) {
    console.error("Error in /api/admin/orders:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/admin/orders/:merchantTxnId
// Returns single order details for invoice
// ─────────────────────────────────────────────────────────────────────────────
router.get("/orders/:merchantTxnId", requireAuth, async (req, res) => {
  try {
    await connectToDatabase();
    const order = await Order.findOne({ merchantTxnId: req.params.merchantTxnId }).lean();
    if (!order) return res.status(404).json({ success: false, error: "Order not found" });
    return res.json({ success: true, order });
  } catch (error) {
    console.error("Error in /api/admin/orders/:id:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
