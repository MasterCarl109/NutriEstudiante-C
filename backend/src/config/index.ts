import "dotenv/config";

const PORT = Number(process.env.PORT) || 4000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nutriestudiante";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nutriestudiante.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export const config = {
  port: PORT,
  mongoUri: MONGODB_URI,
  adminEmail: ADMIN_EMAIL,
  adminPassword: ADMIN_PASSWORD,
};
