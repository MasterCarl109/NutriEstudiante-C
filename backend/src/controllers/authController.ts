import type { Request, Response } from "express";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/User.js";
import { SessionModel } from "../models/Session.js";

const COOKIE_NAME = "session";
const PART_HEADER = "x-session-part";
const SESSION_DAYS = 7;
const SPLIT_INDEX = 32;

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function splitToken(token: string): { partA: string; partB: string } {
  return {
    partA: token.slice(0, SPLIT_INDEX),
    partB: token.slice(SPLIT_INDEX),
  };
}

function setAuthCookie(res: Response, partA: string): void {
  res.cookie(COOKIE_NAME, partA, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

async function createSession(userId: string): Promise<{ partA: string; partB: string }> {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(
    Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000
  );
  await SessionModel.create({ tokenHash: hashToken(token), userId, expiresAt });
  return splitToken(token);
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
    return;
  }

  const exists = await UserModel.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(409).json({ error: "Ya existe una cuenta con este correo" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({ name, email, password: hashedPassword });

  const { partA, partB } = await createSession(user.id);
  setAuthCookie(res, partA);
  res.status(201).json({ user, sessionPart: partB });
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    return;
  }

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  if (!user) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Credenciales inválidas" });
    return;
  }

  const { partA, partB } = await createSession(user.id);
  setAuthCookie(res, partA);
  res.json({ user, sessionPart: partB });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const partA = req.cookies?.[COOKIE_NAME];
  const partB = req.headers[PART_HEADER];
  if (partA && typeof partB === "string") {
    await SessionModel.deleteOne({ tokenHash: hashToken(partA + partB) });
  }
  clearAuthCookie(res);
  res.json({ message: "Sesión cerrada" });
}
