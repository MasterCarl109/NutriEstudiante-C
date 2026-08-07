import type { Response } from "express";
import { UserModel } from "../models/User.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { calculateBMI, classifyBMI } from "../utils/bmi.js";

export async function getBmi(req: AuthedRequest, res: Response): Promise<void> {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  if (!user.weight || !user.height) {
    res.status(409).json({
      error: "Debes registrar tu peso y estatura para calcular tu IMC",
    });
    return;
  }

  const bmi = Number(calculateBMI(user.weight, user.height).toFixed(1));
  res.json({ bmi, classification: classifyBMI(bmi) });
}
