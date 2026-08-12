import path from "node:path";
import { existsSync } from "node:fs";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import { config } from "./config/index.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import bmiRoutes from "./routes/bmiRoutes.js";
import trackingRoutes from "./routes/trackingRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import tipRoutes from "./routes/tipRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const DIST_DIR = path.resolve(import.meta.dirname, "../../frontend/dist");
const HAS_FRONTEND = existsSync(path.join(DIST_DIR, "index.html"));

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(`${import.meta.dirname}/../uploads`));

if (HAS_FRONTEND) {
  app.use(express.static(DIST_DIR));
}

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "API NutriEstudiante funcionando" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/bmi", bmiRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/tips", tipRoutes);
app.use("/api/admin", adminRoutes);

if (HAS_FRONTEND) {
  app.use((req, res, next) => {
    if (
      req.method !== "GET" ||
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads")
    ) {
      next();
      return;
    }
    res.sendFile(path.join(DIST_DIR, "index.html"));
  });
}

await connectDB();

app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
