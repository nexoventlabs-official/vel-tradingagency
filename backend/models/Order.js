import mongoose, { Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    merchantTxnId: { type: String, required: true, unique: true },
    customer: {
      name:    { type: String, required: true },
      email:   { type: String, required: true },
      phone:   { type: String, required: true },
      address: { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name:      { type: String, required: true },
        qty:       { type: Number, required: true },
        priceUSD:  { type: Number, required: true },
      },
    ],
    totalAmount:   { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
      required: true,
    },
    gid: { type: String },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
