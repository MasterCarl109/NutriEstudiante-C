import type { Response } from "express";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import type { AuthedRequest } from "../middleware/auth.js";

export async function updateProfile(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const { name, age, weight, height, sex } = req.body;

  const updates: Record<string, unknown> = {};
  if (name !== undefined) updates.name = name;
  if (age !== undefined) updates.age = age;
  if (weight !== undefined) updates.weight = weight;
  if (height !== undefined) updates.height = height;
  if (sex !== undefined) updates.sex = sex;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No se enviaron datos para actualizar" });
    return;
  }

  try {
    const user = await UserModel.findByIdAndUpdate(req.userId, updates, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }
    res.json({ user });
  } catch (err) {
    if ((err as Error).name === "ValidationError") {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    throw err;
  }
}

export async function changePassword(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res
      .status(400)
      .json({ error: "Contraseña actual y nueva son obligatorias" });
    return;
  }
  if (newPassword.length < 6) {
    res
      .status(400)
      .json({ error: "La nueva contraseña debe tener al menos 6 caracteres" });
    return;
  }

  const user = await UserModel.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }

  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) {
    res.status(401).json({ error: "La contraseña actual es incorrecta" });
    return;
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: "Contraseña actualizada correctamente" });
}
