import type { Response } from "express";
import { WeightRecordModel } from "../models/WeightRecord.js";
import type { AuthedRequest } from "../middleware/auth.js";

export async function createRecord(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const { weight, date } = req.body;

  if (!weight) {
    res.status(400).json({ error: "El peso es obligatorio" });
    return;
  }

  try {
    const record = await WeightRecordModel.create({
      user: req.userId,
      weight,
      date: date ? new Date(date) : undefined,
    });
    res.status(201).json({ record });
  } catch (err) {
    if ((err as Error).name === "ValidationError") {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    throw err;
  }
}

export async function listRecords(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const records = await WeightRecordModel.find({ user: req.userId }).sort({
    date: -1,
  });
  res.json({ records });
}

export async function deleteRecord(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const { id } = req.params;

  const record = await WeightRecordModel.findOneAndDelete({
    _id: id,
    user: req.userId,
  });
  if (!record) {
    res.status(404).json({ error: "Registro no encontrado" });
    return;
  }

  res.json({ message: "Registro eliminado" });
}
