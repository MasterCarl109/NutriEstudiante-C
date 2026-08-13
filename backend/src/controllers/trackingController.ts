import type { Response } from "express";
import { WeightRecordModel } from "../models/WeightRecord.js";
import type { AuthedRequest } from "../middleware/auth.js";
import {
  startOfDay,
  upsertWeightRecord,
  syncCurrentWeight,
} from "../utils/weightRecord.js";

export async function createRecord(
  req: AuthedRequest,
  res: Response
): Promise<void> {
  const { weight, date } = req.body;

  if (!weight) {
    res.status(400).json({ error: "El peso es obligatorio" });
    return;
  }

  if (date && startOfDay(date) > startOfDay()) {
    res.status(400).json({ error: "La fecha no puede ser en el futuro" });
    return;
  }

  try {
    const record = await upsertWeightRecord(req.userId!, weight, date);
    await syncCurrentWeight(req.userId!);
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
