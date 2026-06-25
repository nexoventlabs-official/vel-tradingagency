import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    merchantTxnId: { type: String, required: true },
    gid:           { type: String, required: true },
    status:        { type: String, required: true },
    amount:        { type: String, required: true },
    currency:      { type: String, required: true },
    paymentMethod: { type: String },
    cardType:      { type: String },
    cardBrand:     { type: String },
    country:       { type: String },
    rawPayload:    { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
