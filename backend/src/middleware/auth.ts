import type { Request, Response, NextFunction } from "express";
import { createHash } from "node:crypto";
import { UserModel } from "../models/User.js";
import { SessionModel } from "../models/Session.js";

export interface AuthedRequest extends Request {
  userId?: string;
}

const COOKIE_NAME = "session";
const PART_HEADER = "x-session-part";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const partA = req.cookies?.[COOKIE_NAME];
  const partB = req.headers[PART_HEADER];
  if (!partA || typeof partB !== "string") {
    res.status(401).json({ error: "No autorizado" });
    return;
  }

  const session = await SessionModel.findOne({
    tokenHash: hashToken(partA + partB),
    expiresAt: { $gt: new Date() },
  });
  if (!session) {
    res.status(401).json({ error: "Sesión inválida o expirada" });
    return;
  }

  req.userId = session.userId.toString();
  next();
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
