import mongoose, { Schema, Document } from "mongoose";

// Order Interface
export interface IOrder extends Document {
  merchantTxnId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: Array<{
    productId: string;
    name: string;
    qty: number;
    priceUSD: number;
  }>;
  totalAmount: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  gid?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Transaction Interface (for callback audit logs)
export interface ITransaction extends Document {
  merchantTxnId: string;
  gid: string;
  status: string;
  amount: string;
  currency: string;
  paymentMethod?: string;
  cardType?: string;
  cardBrand?: string;
  country?: string;
  rawPayload: Record<string, any>;
  createdAt: Date;
}

// Order Schema
const OrderSchema = new Schema<IOrder>(
  {
    merchantTxnId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        priceUSD: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
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

// Transaction Schema
const TransactionSchema = new Schema<ITransaction>(
  {
    merchantTxnId: { type: String, required: true },
    gid: { type: String, required: true },
    status: { type: String, required: true },
    amount: { type: String, required: true },
    currency: { type: String, required: true },
    paymentMethod: { type: String },
    cardType: { type: String },
    cardBrand: { type: String },
    country: { type: String },
    rawPayload: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Models
// Mongoose caches models. This check prevents re-defining during hot-reload.
export const Order = mongoose.models.Order 
  ? (mongoose.models.Order as mongoose.Model<IOrder>)
  : mongoose.model<IOrder>("Order", OrderSchema);

export const Transaction = mongoose.models.Transaction
  ? (mongoose.models.Transaction as mongoose.Model<ITransaction>)
  : mongoose.model<ITransaction>("Transaction", TransactionSchema);
