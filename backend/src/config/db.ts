import mongoose from "mongoose";
import { config } from "./index.js";

export async function connectDB(): Promise<void> {
  mongoose.connection.on("error", (err) => {
    console.error("Error de conexión con MongoDB:", err.message);
  });

  await mongoose.connect(config.mongoUri);
  console.log("MongoDB conectado");
}
