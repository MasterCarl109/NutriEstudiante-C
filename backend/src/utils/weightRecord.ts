import { WeightRecordModel, type WeightRecord } from "../models/WeightRecord.js";
import { UserModel } from "../models/User.js";

export function startOfDay(date?: string | Date): Date {
  if (date === undefined) {
    return new Date(new Date().toISOString().slice(0, 10));
  }
  const iso = typeof date === "string" ? date : date.toISOString();
  return new Date(iso.slice(0, 10));
}

export async function upsertWeightRecord(
  userId: string,
  weight: number,
  date?: string | Date
): Promise<WeightRecord> {
  const day = startOfDay(date);
  const record = await WeightRecordModel.findOneAndUpdate(
    { user: userId, date: day },
    { $set: { weight, date: day } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return record;
}

export async function syncCurrentWeight(userId: string): Promise<void> {
  const latest = await WeightRecordModel.findOne({ user: userId }).sort({
    date: -1,
  });
  if (latest) {
    await UserModel.updateOne({ _id: userId }, { weight: latest.weight });
  }
}
