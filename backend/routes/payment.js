import express from "express";
import { createRequire } from "module";
import { config } from "../config/config.js";
import { connectToDatabase } from "../db/connect.js";
import { Order } from "../models/Order.js";
import { Transaction } from "../models/Transaction.js";

const require = createRequire(import.meta.url);
const { generateJWEAndJWS } = require("payglocal-js-client");

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/initiate
// Creates a pending order in MongoDB and returns a PayGlocal redirect URL
// ─────────────────────────────────────────────────────────────────────────────
router.post("/initiate", async (req, res) => {
  try {
    const { customer, items } = req.body;

    // Basic validation
    if (!customer || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: "customer and items are required" });
    }

    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    for (const field of requiredFields) {
      if (!customer[field]) {
        return res.status(400).json({ success: false, error: `customer.${field} is required` });
      }
    }

    await connectToDatabase();

    // Calculate total
    const totalAmount = items.reduce((sum, item) => sum + item.qty * item.priceUSD, 0);

    // Generate unique merchantTxnId
    const merchantTxnId = `VT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Save pending order to DB
    const order = await Order.create({
      merchantTxnId,
      customer,
      items,
      totalAmount,
      paymentStatus: "PENDING",
    });

    // Check credentials
    const { merchantId, publicKey, privateKey, publicKeyId, privateKeyId, baseUrl } = config.payglocal;
    if (!merchantId || !publicKey || !privateKey || !publicKeyId || !privateKeyId) {
      throw new Error("PayGlocal credentials are not fully configured in backend .env");
    }

    // Build PayGlocal payload
    const nameParts = customer.name.trim().split(/\s+/);
    const firstName = nameParts[0] || "Customer";
    const lastName  = nameParts.slice(1).join(" ") || "Trader";

    const payGlocalPayload = {
      merchantTxnId,
      paymentData: {
        totalAmount: totalAmount.toFixed(2),
        txnCurrency: "USD",
        billingData: {
          firstName,
          lastName,
          emailId:            customer.email,
          callingCode:        "+91",
          phoneNumber:        customer.phone.replace(/[^0-9]/g, "").slice(-10),
          addressStreet1:     customer.address,
          addressCity:        customer.city,
          addressState:       customer.state,
          addressPostalCode:  customer.pincode,
          addressCountry:     "IND",
        },
      },
      merchantCallbackURL: `${config.appUrl}/api/payment/callback`,
    };

    // Encrypt + sign
    console.log("🔐 Generating JWE and JWS tokens...");
    const { jweToken, jwsToken } = await generateJWEAndJWS({
      payload:      payGlocalPayload,
      publicKey,
      privateKey,
      merchantId,
      publicKeyId,
      privateKeyId,
    });

    // Call PayGlocal API
    const initiateUrl = `${baseUrl}/gl/v1/payments/initiate/paycollect`;
    console.log(`🌐 Calling PayGlocal API: ${initiateUrl}`);

    const pgResponse = await fetch(initiateUrl, {
      method: "POST",
      headers: {
        "Content-Type":       "text/plain",
        "x-gl-token-external": jwsToken,
        "x-gl-merchantid":    merchantId,
        "x-gl-kid":           privateKeyId,
      },
      body: jweToken,
    });

    const responseText = await pgResponse.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error(`Failed to parse PayGlocal response: ${responseText}`);
    }

    if (!pgResponse.ok || responseData.errors) {
      console.error("❌ PayGlocal initiation failed:", responseData);
      order.paymentStatus = "FAILED";
      await order.save();
      return res.status(400).json({
        success: false,
        error: responseData.message || responseData.reasonCode || "Payment initiation failed",
      });
    }

    console.log("✅ PayGlocal initiation success, GID:", responseData.gid);

    // Save GID to order
    order.gid = responseData.gid;
    await order.save();

    return res.json({
      success: true,
      redirectUrl: responseData.data.redirectUrl,
      merchantTxnId,
    });
  } catch (error) {
    console.error("Error in /api/payment/initiate:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/payment/callback
// PayGlocal posts here after payment. Updates order, redirects browser.
// ─────────────────────────────────────────────────────────────────────────────
router.post("/callback", express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const contentType = req.headers["content-type"] || "";
    let glToken = "";

    console.log(`📩 Received PayGlocal callback. Content-Type: ${contentType}`);

    if (contentType.includes("application/x-www-form-urlencoded")) {
      glToken = req.body["x-gl-token"] || "";
    } else if (contentType.includes("application/json")) {
      glToken = req.body["x-gl-token"] || "";
    } else {
      // fallback: try to parse raw body as form-encoded
      glToken = req.body["x-gl-token"] || "";
    }

    if (!glToken) {
      console.error("❌ Callback missing x-gl-token");
      return res.status(400).send("x-gl-token is missing");
    }

    // Decode JWT payload (header.payload.signature)
    const parts = glToken.split(".");
    if (parts.length !== 3) {
      return res.status(400).send("Invalid token format");
    }

    const base64Payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paymentData   = JSON.parse(Buffer.from(base64Payload, "base64").toString("utf-8"));

    console.log("📦 Decoded callback payload:", paymentData);

    const { status, merchantTxnId, amount, currency, gid, paymentMethod, cardType, cardBrand, country } = paymentData;

    if (!merchantTxnId || !gid) {
      return res.status(400).send("Missing merchantTxnId or gid in payload");
    }

    await connectToDatabase();

    // Save transaction log
    await Transaction.create({
      merchantTxnId,
      gid,
      status,
      amount:        amount   || "0.00",
      currency:      currency || "USD",
      paymentMethod,
      cardType,
      cardBrand,
      country,
      rawPayload: paymentData,
    });

    // Update order
    const order = await Order.findOne({ merchantTxnId });
    if (!order) {
      console.error(`❌ Order not found for merchantTxnId: ${merchantTxnId}`);
      return res.status(404).send(`Order not found: ${merchantTxnId}`);
    }

    const isSuccess = status === "SENT_FOR_CAPTURE";
    order.paymentStatus = isSuccess ? "PAID" : "FAILED";
    order.gid = gid;
    await order.save();

    console.log(`✅ Order ${merchantTxnId} → ${order.paymentStatus}`);

    // Redirect browser to frontend success/failure page
    const redirectUrl = isSuccess
      ? `${config.frontendUrl}/payment-success?txnId=${merchantTxnId}`
      : `${config.frontendUrl}/payment-failure?txnId=${merchantTxnId}`;

    return res.redirect(303, redirectUrl);
  } catch (error) {
    console.error("Error in /api/payment/callback:", error);
    return res.status(500).send(`Internal server error: ${error.message}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/payment/order/:merchantTxnId
// Returns order details for the success/failure pages
// ─────────────────────────────────────────────────────────────────────────────
router.get("/order/:merchantTxnId", async (req, res) => {
  try {
    await connectToDatabase();

    const order = await Order.findOne({ merchantTxnId: req.params.merchantTxnId });
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    return res.json({
      success: true,
      order: {
        merchantTxnId: order.merchantTxnId,
        customer:      order.customer,
        items:         order.items,
        totalAmount:   order.totalAmount,
        paymentStatus: order.paymentStatus,
        gid:           order.gid,
        createdAt:     order.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in /api/payment/order:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
