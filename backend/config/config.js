import "dotenv/config";

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:8080",
  appUrl: process.env.APP_URL || "http://localhost:5000",
  admin: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin@123",
    jwtSecret: process.env.JWT_SECRET || "vel-trading-jwt-secret",
  },
  payglocal: {
    merchantId: process.env.PAYGLOCAL_MERCHANT_ID,
    publicKey: process.env.PAYGLOCAL_PUBLIC_KEY?.replace(/\\n/g, "\n"),
    privateKey: process.env.PAYGLOCAL_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    publicKeyId: process.env.PAYGLOCAL_PUBLIC_KEY_ID,
    privateKeyId: process.env.PAYGLOCAL_PRIVATE_KEY_ID,
    baseUrl: process.env.PAYGLOCAL_BASE_URL || "https://api.uat.payglocal.in",
  },
};
