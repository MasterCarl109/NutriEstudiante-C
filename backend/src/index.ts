import express from "express";
import cors from "cors";
import helmet from "helmet";
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

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use("/uploads", express.static(`${import.meta.dirname}/../uploads`));

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

await connectDB();

app.listen(config.port, () => {
  console.log(`Servidor escuchando en http://localhost:${config.port}`);
});
