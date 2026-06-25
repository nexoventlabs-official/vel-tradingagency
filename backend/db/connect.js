import mongoose from "mongoose";
import { config } from "../config/config.js";

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

export async function connectToDatabase() {
  if (!config.mongodbUri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(config.mongodbUri, { bufferCommands: false })
      .then((m) => {
        console.log("✅ Connected to MongoDB");
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
