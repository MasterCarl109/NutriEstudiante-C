import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const weightRecordSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Usuario obligatorio"],
      index: true,
    },
    weight: {
      type: Number,
      required: [true, "El peso es obligatorio"],
      min: [1, "Peso inválido"],
      max: [500, "Peso inválido"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export type WeightRecord = InferSchemaType<typeof weightRecordSchema>;

export const WeightRecordModel: Model<WeightRecord> = model<WeightRecord>(
  "WeightRecord",
  weightRecordSchema
);
