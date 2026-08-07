import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { UserModel } from "../models/User.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Sesión inválida o expirada" });
  }
}

export async function getProfile(req: AuthedRequest, res: Response): Promise<void> {
  const user = await UserModel.findById(req.userId);
  if (!user) {
    res.status(404).json({ error: "Usuario no encontrado" });
    return;
  }
  res.json({ user });
}

export async function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const user = await UserModel.findById(req.userId);
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "No tienes permisos de administrador" });
    return;
  }
  next();
}
