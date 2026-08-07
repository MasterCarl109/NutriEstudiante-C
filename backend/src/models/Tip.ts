import { Schema, model, type Model, type InferSchemaType } from "mongoose";

const tipSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "El título es obligatorio"],
      trim: true,
      maxlength: [120, "El título no puede superar 120 caracteres"],
    },
    content: {
      type: String,
      required: [true, "El contenido es obligatorio"],
      trim: true,
      maxlength: [1200, "El contenido no puede superar 1200 caracteres"],
    },
  },
  { timestamps: true }
);

export type Tip = InferSchemaType<typeof tipSchema>;

export const TipModel: Model<Tip> = model<Tip>("Tip", tipSchema);
